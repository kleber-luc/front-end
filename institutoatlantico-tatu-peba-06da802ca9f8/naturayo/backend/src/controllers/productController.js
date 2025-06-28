const prisma = require("../prismaClient");

const createProduct = async (req, res) => {
    try {
        const { name, description, price, imageUrl, stock = 0, categoryId } = req.body;

        if (!name || !description || !price || !categoryId) {
            return res.status(400).json({ error: "Campos obrigatórios faltando" });
        }

        const newProduct = await prisma.product.create({
            data: {
                name,
                description,
                price,
                imageUrl,
                stock: stock,
                category: {
                    connect: { id: req.body.categoryId },
                },
            },
        });

        res.status(201).json(newProduct);
    } catch (error) {
        console.error("Erro ao criar produto:", error);
        res.status(500).json({ error: "Erro no servidor interno" });
    }
};
const getProducts = async (req, res) => {
    try {
        const products = await prisma.product.findMany();
        res.status(200).json(products);
    } catch (error) {
        console.error("Erro ao listar produtos:", error);
        res.status(500).json({ error: "Erro no servidor interno" });
    }
};
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await prisma.product.findUnique({
            where: { id: Number(id) },
        });

        if (!product) {
            return res.status(404).json({ error: "Produto não encontrado" });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error("Erro ao buscar produto:", error);
        res.status(500).json({ error: "Erro no servidor interno" });
    }
};

const updateStock = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        const product = await prisma.product.findUnique({
            where: { id: Number(id) },
        });

        if (!product) {
            return res.status(404).json({ error: "Produto não encontrado" });
        }

        const updatedProduct = await prisma.product.update({
            where: { id: Number(id) },
            data: {
                stock: quantity,
            },
        });

        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error("Erro ao atualizar estoque:", error);
        res.status(500).json({ error: "Erro no servidor interno" });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await prisma.product.findUnique({
            where: { id: Number(id) },
        });

        if (!product) {
            return res.status(404).json({ error: "Produto não encontrado" });
        }

        await prisma.product.delete({
            where: { id: Number(id) },
        });

        res.status(200).json({ message: "Produto excluído com sucesso" });
    } catch (error) {
        console.error("Erro ao excluir produto:", error);
        res.status(500).json({ error: "Erro no servidor interno" });
    }
};

const checkStock = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await prisma.product.findUnique({
            where: { id: Number(id) },
        });

        if (!product) {
            return res.status(404).json({ error: "Produto não encontrado" });
        }

        res.status(200).json({
            productId: product.id,
            name: product.name,
            Estoque: product.stock,
        });
    } catch (error) {
        console.error("Erro ao verificar estoque:", error);
        res.status(500).json({ error: "Erro no servidor interno" });
    }
};

const validateStockForSale = async (req, res) => {
    try {
        const { id } = req.params;
        const { requestedQuantity } = req.body;

        const product = await prisma.product.findUnique({
            where: { id: Number(id) },
        });

        if (!product) {
            return res.status(404).json({ error: "Produto não encontrado" });
        }

        const hasStock = product.stock >= requestedQuantity;

        res.status(200).json({
            productId: product.id,
            name: product.name,
            requestedQuantity,
            currentStock: product.stock,
            available: hasStock,
            message: hasStock ? "Estoque disponível" : "Estoque insuficiente",
        });
    } catch (error) {
        console.error("Erro ao validar estoque:", error);
        res.status(500).json({ error: "Erro no servidor interno" });
    }
};

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateStock,
    deleteProduct,
    checkStock,
    validateStockForSale,
};
