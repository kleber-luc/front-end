const prisma = require('../prismaClient');

const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({ error: "Nome da categoria é obrigatório" });
        }

        const existingCategory = await prisma.category.findUnique({
            where: { name }
        });

        if (existingCategory) {
            return res.status(400).json({ error: "Categoria já existe" });
        }

        const category = await prisma.category.create({
            data: {
                name,
                description
            }
        });

        res.status(201).json(category);
    } catch (error) {
        console.error("Erro ao criar categoria:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

const getCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
            include: {
                products: true
            }
        });
        res.status(200).json(categories);
    } catch (error) {
        console.error("Erro ao listar categorias:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const category = await prisma.category.findUnique({
            where: { id: Number(id) },
            include: {
                products: true
            }
        });

        if (!category) {
            return res.status(404).json({ error: "Categoria não encontrada" });
        }

        res.status(200).json(category);
    } catch (error) {
        console.error("Erro ao buscar categoria:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        const category = await prisma.category.findUnique({
            where: { id: Number(id) }
        });

        if (!category) {
            return res.status(404).json({ error: "Categoria não encontrada" });
        }

        const updatedCategory = await prisma.category.update({
            where: { id: Number(id) },
            data: {
                name,
                description
            }
        });

        res.status(200).json(updatedCategory);
    } catch (error) {
        console.error("Erro ao atualizar categoria:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await prisma.category.findUnique({
            where: { id: Number(id) },
            include: {
                products: true
            }
        });

        if (!category) {
            return res.status(404).json({ error: "Categoria não encontrada" });
        }

        if (category.products.length > 0) {
            return res.status(400).json({ 
                error: "Não é possível excluir categoria com produtos vinculados" 
            });
        }

        await prisma.category.delete({
            where: { id: Number(id) }
        });

        res.status(200).json({ message: "Categoria excluída com sucesso" });
    } catch (error) {
        console.error("Erro ao excluir categoria:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

module.exports = {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};