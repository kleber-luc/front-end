const prisma = require('../prismaClient');
const bcrypt = require('bcryptjs');

const cadastrar = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        
        if (!name || !email || !password || !phone) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }

        // Validação de email existente
        const existe = await prisma.client.findUnique({ where: { email } });
        if (existe) {
            return res.status(400).json({ error: 'Email já cadastrado' });
        }

        // Validação do formato do telefone
        if (!/^\d{9}$/.test(phone)) {
            return res.status(400).json({ error: 'Telefone deve conter 9 dígitos' });
        }

        const usuario = await prisma.client.create({
            data: {
                name,           
                email,
                password: await bcrypt.hash(password, 10),
                phone
            }
        });


        res.status(201).json({ 
            message: 'Cadastro realizado com sucesso',
            id: usuario.id 
        });

    } catch (error) {
        console.error('Erro no cadastro:', error);
        res.status(500).json({ error: 'Erro ao cadastrar' });
    }
};

const listarUsuarios = async (req, res) => {
    try {
        const usuarios = await prisma.client.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                createdAt: true,
                // Excluindo o password por segurança
            }
        });

        res.status(200).json(usuarios);
    } catch (error) {
        console.error('Erro ao listar usuários:', error);
        res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
};

const buscarUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        const usuario = await prisma.client.findUnique({
            where: { id: Number(id) },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                createdAt: true,
                addresses: true,
                orders: true
                // Excluindo o password por segurança
            }
        });

        if (!usuario) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        res.status(200).json(usuario);
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
};

module.exports = { 
    cadastrar, 
    listarUsuarios,
    buscarUsuario 
};