const prisma = require('../prismaClient');

const criarPedido = async (req, res) => {
    try {
        const { userId } = req.session;
        const { addressId } = req.body;

        if (!userId) return res.status(401).json({ error: 'Não autenticado' });

        const cart = await prisma.cart.findUnique({
            where: { clientId: userId },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ error: 'Carrinho vazio' });
        }

        const endereco = await prisma.address.findUnique({
            where: { id: addressId, clientId: userId }
        });

        if (!endereco) {
            return res.status(400).json({ error: 'Endereço inválido' });
        }

        const itensPedido = cart.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
        }));

        const total = cart.totalPrice; // Já calculado no carrinho

        const resultado = await prisma.$transaction([
            prisma.order.create({
                data: {
                    clientId: userId,
                    addressId,
                    total: parseFloat(total.toFixed(2)),
                    items: { create: itensPedido }
                },
                include: { items: true }
            }),
            // Atualiza estoques
            ...cart.items.map(item => {
                return prisma.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } }
                });
            }),
            // Limpa o carrinho
            prisma.cartItem.deleteMany({
                where: { cartId: cart.id }
            }),
            prisma.cart.update({
                where: { id: cart.id },
                data: { totalPrice: 0 }
            })
        ]);

        res.status(201).json(resultado[0]);
    } catch (error) {
        console.error('Erro ao criar pedido:', error);
        res.status(500).json({ 
            error: 'Erro ao criar pedido',
            details: error.message
        });
    }
};

const listarPedidos = async (req, res) => {
    try {
        const pedidos = await prisma.order.findMany({
            include: {
                items: { include: { product: true } },
                client: { select: { name: true, email: true } },
                address: true
            }
        });
        res.json(pedidos);
    } catch (error) {
        console.error('Erro ao listar pedidos:', error);
        res.status(500).json({ error: 'Erro ao buscar pedidos' });
    }
};

const buscarPedido = async (req, res) => {
    try {
        const pedido = await prisma.order.findUnique({
            where: { id: parseInt(req.params.id) },
            include: {
                items: { include: { product: true } },
                address: true
            }
        });
        if (!pedido) return res.status(404).json({ error: 'Pedido não encontrado' });
        res.json(pedido);
    } catch (error) {
        console.error('Erro ao buscar pedido:', error);
        res.status(500).json({ error: 'Erro ao buscar pedido' });
    }
};

module.exports = {
    criarPedido,
    listarPedidos,
    buscarPedido
};