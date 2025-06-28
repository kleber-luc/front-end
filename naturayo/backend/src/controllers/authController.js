const prisma = require('../prismaClient');
const bcrypt = require('bcryptjs');

const login = async (req, res) => {
    const { email, password } = req.body;
    console.log('Tentativa de login:', email);
    if (!email || !password) {
        console.log('Email ou senha não fornecidos');
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }
    try {
        // Tenta autenticar como cliente
        let usuario = await prisma.client.findUnique({ where: { email } });
        let isAdmin = false;
        console.log('Resultado busca cliente:', usuario ? 'Encontrado' : 'Não encontrado');

        // Se não for cliente, tenta como admin
        if (!usuario) {
            usuario = await prisma.admin.findUnique({ where: { email } });
            console.log('Resultado busca admin:', usuario ? 'Encontrado' : 'Não encontrado');
            if (!usuario) {
                console.log('Usuário não encontrado (nem cliente, nem admin)');
                return res.status(401).json({ error: 'Credenciais inválidas' });
            }
            isAdmin = true;
        }

        console.log('Senha recebida:', password);
        console.log('Hash no banco:', usuario.password);
        
        const senhaValida = await bcrypt.compare(password, usuario.password);
        console.log('Resultado comparação senha:', senhaValida ? 'Válida' : 'Inválida');

        if (!senhaValida) {
            console.log('Senha incorreta para:', email);
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        // Remove senha do retorno e salva na sessão
        const { password: _, ...usuarioSemSenha } = usuario;
        req.session.userId = usuario.id;
        req.session.isAdmin = isAdmin;
        console.log('Login bem-sucedido. Sessão:', req.session);

        res.json({
            message: 'Login realizado com sucesso',
            usuario: usuarioSemSenha,
            isAdmin,
        });

    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ error: 'Erro durante o login' });
    }
};

const logout = async (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                console.error('Erro ao destruir a sessão:', err);
                return res.status(500).json({ error: 'Erro ao fazer logout' });
            }
            
            res.clearCookie('connect.sid');
            res.json({ message: 'Logout realizado com sucesso' });
        });
    } catch (error) {
        console.error('Erro no processo de logout:', error);
        res.status(500).json({ error: 'Erro durante o logout' });
    }
};

const verificarSessao = async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ error: 'Não autenticado' });
        }

        const usuario = await prisma.client.findUnique({
            where: { id: req.session.userId },
            select: {
                id: true,
                name: true,
                email: true
            }
        });

        if (!usuario) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        res.json({
            message: 'Sessão válida',
            usuario
        });

    } catch (error) {
        console.error('Erro ao verificar sessão:', error);
        res.status(500).json({ error: 'Erro ao verificar autenticação' });
    }
};

module.exports = {
    login,
    logout,
    verificarSessao
};