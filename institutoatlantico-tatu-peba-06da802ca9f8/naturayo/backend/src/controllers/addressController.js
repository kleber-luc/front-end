const prisma = require('../prismaClient');

const createAddress = async (req, res) => {
    try {
        const { street, number, city, state, CEP, clientId } = req.body;

        if (!street || !number || !city || !state || !CEP || !clientId) {
            return res.status(400).json({ error: "Todos os campos são obrigatórios" });
        }

        // Validação do formato do CEP
        if (!/^\d{8}$/.test(CEP)) {
            return res.status(400).json({ error: "CEP deve conter 8 dígitos" });
        }

        const address = await prisma.address.create({
            data: {
                street,
                number,
                city,
                state,
                CEP,
                clientId: parseInt(clientId)
            }
        });

        res.status(201).json(address);
    } catch (error) {
        console.error("Erro ao criar endereço:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

const getAddressesByClient = async (req, res) => {
    try {
        const { clientId } = req.params;

        const addresses = await prisma.address.findMany({
            where: {
                clientId: parseInt(clientId)
            }
        });

        res.status(200).json(addresses);
    } catch (error) {
        console.error("Erro ao buscar endereços:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

const updateAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const { street, number, city, state, CEP } = req.body;

        if (CEP && !/^\d{8}$/.test(CEP)) {
            return res.status(400).json({ error: "CEP deve conter 8 dígitos" });
        }

        const address = await prisma.address.update({
            where: { id: parseInt(id) },
            data: {
                street,
                number,
                city,
                state,
                CEP
            }
        });

        res.status(200).json(address);
    } catch (error) {
        console.error("Erro ao atualizar endereço:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

const deleteAddress = async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.address.delete({
            where: { id: parseInt(id) }
        });

        res.status(200).json({ message: "Endereço excluído com sucesso" });
    } catch (error) {
        console.error("Erro ao excluir endereço:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

module.exports = {
    createAddress,
    getAddressesByClient,
    updateAddress,
    deleteAddress
};