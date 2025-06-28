const prisma = require('../prismaClient');

const updateCartTotal = async (cartId) => {
    const items = await prisma.cartItem.findMany({
        where: { cartId },
        select: { price: true, quantity: true }
    });

    const totalPrice = items.reduce(
        (total, item) => total + (item.price * item.quantity),
        0
    );

    await prisma.cart.update({
        where: { id: cartId },
        data: { totalPrice }
    });
};

const getCart = async (req, res) => {
    try {
        const { userId } = req.session;

        if (!userId) {
            return res.status(401).json({ error: 'Não autenticado' });
        }

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

        if (!cart) {
            const newCart = await prisma.cart.create({
                data: {
                    clientId: userId,
                    totalPrice: 0
                },
                include: {
                    items: true
                }
            });
            return res.status(200).json(newCart);
        }

        res.status(200).json(cart);
    } catch (error) {
        console.error('Erro ao buscar carrinho:', error);
        res.status(500).json({ error: 'Erro ao buscar carrinho' });
    }
};

const addItemToCart = async (req, res) => {
    try {
        const { userId } = req.session;
        const { productId, quantity } = req.body;

        if (!userId) return res.status(401).json({ error: 'Não autenticado' });
        if (!productId || !quantity || quantity <= 0) {
            return res.status(400).json({ error: 'Dados inválidos' });
        }

        const product = await prisma.product.findUnique({
            where: { id: Number(productId) }
        });
        if (!product) return res.status(404).json({ error: 'Produto não encontrado' });
        if (product.stock < quantity) {
            return res.status(400).json({
                error: 'Estoque insuficiente',
                availableStock: product.stock
            });
        }

        let cart = await prisma.cart.findUnique({
            where: { clientId: userId }
        });
        if (!cart) {
            cart = await prisma.cart.create({
                data: { clientId: userId, totalPrice: 0 }
            });
        }

        const existingItem = await prisma.cartItem.findFirst({
            where: { cartId: cart.id, productId: Number(productId) }
        });

        let updatedItem;
        if (existingItem) {
            updatedItem = await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + quantity },
                include: { product: true }
            });
        } else {
            updatedItem = await prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId: Number(productId),
                    quantity,
                    price: product.price
                },
                include: { product: true }
            });
        }

        await updateCartTotal(cart.id);
        res.status(200).json(updatedItem);
    } catch (error) {
        console.error('Erro ao adicionar item:', error);
        res.status(500).json({ error: 'Erro ao adicionar item' });
    }
};

const updateCartItem = async (req, res) => {
    try {
        const { userId } = req.session;
        const { itemId } = req.params;
        const { quantity } = req.body;

        if (!userId) return res.status(401).json({ error: 'Não autenticado' });
        if (!quantity || quantity <= 0) {
            return res.status(400).json({ error: 'Quantidade inválida' });
        }

        const cartItem = await prisma.cartItem.findFirst({
            where: {
                AND: [
                    { id: Number(itemId) },
                    { cart: { clientId: userId } }
                ]
            },
            include: {
                product: true,
                cart: true
            }
        });

        if (!cartItem) {
            return res.status(404).json({ error: 'Item não encontrado no seu carrinho' });
        }

        if (cartItem.product.stock < quantity) {
            return res.status(400).json({
                error: 'Estoque insuficiente',
                availableStock: cartItem.product.stock
            });
        }

        const updatedItem = await prisma.cartItem.update({
            where: { id: Number(itemId) },
            data: { quantity },
            include: { product: true }
        });

        await updateCartTotal(cartItem.cart.id);
        res.status(200).json(updatedItem);
    } catch (error) {
        console.error('Erro ao atualizar item:', error);
        res.status(500).json({ error: 'Erro ao atualizar item' });
    }
};

const removeItemFromCart = async (req, res) => {
    try {
        const { userId } = req.session;
        const { itemId } = req.params;

        if (!userId) return res.status(401).json({ error: 'Não autenticado' });

        const cartItem = await prisma.cartItem.findFirst({
            where: {
                AND: [
                    { id: Number(itemId) },
                    { cart: { clientId: userId } }
                ]
            },
            include: {
                cart: true
            }
        });

        if (!cartItem) {
            return res.status(404).json({ error: 'Item não encontrado no seu carrinho' });
        }

        await prisma.cartItem.delete({
            where: { id: Number(itemId) }
        });

        await updateCartTotal(cartItem.cart.id);
        res.status(200).json({ message: 'Item removido com sucesso' });
    } catch (error) {
        console.error('Erro ao remover item:', error);
        res.status(500).json({ error: 'Erro ao remover item' });
    }
};

const clearCart = async (req, res) => {
    try {
        const { userId } = req.session;

        if (!userId) {
            return res.status(401).json({ error: 'Não autenticado' });
        }

        const cart = await prisma.cart.findUnique({
            where: { clientId: userId }
        });

        if (!cart) {
            return res.status(404).json({ error: 'Carrinho não encontrado' });
        }

        await prisma.$transaction([
            prisma.cartItem.deleteMany({
                where: { cartId: cart.id }
            }),
            prisma.cart.update({
                where: { id: cart.id },
                data: { totalPrice: 0 }
            })
        ]);

        res.status(200).json({ message: 'Carrinho esvaziado com sucesso' });
    } catch (error) {
        console.error('Erro ao esvaziar carrinho:', error);
        res.status(500).json({ error: 'Erro ao esvaziar carrinho' });
    }
};

module.exports = {
    getCart,
    addItemToCart,
    updateCartItem,
    removeItemFromCart,
    clearCart
};