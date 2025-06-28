
const prisma = require('../prismaClient');

const verifyAdmin = async (req, res, next) => {
    if (!req.session.userId || !req.session.isAdmin) {
        return res.status(403).json({ error: 'Acesso negado: faça login como admin' });
    }

    const admin = await prisma.admin.findUnique({
        where: { id: req.session.userId }
    });

    if (!admin) {
        return res.status(403).json({ error: 'Admin não encontrado' });
    }

    next();
};
module.exports = verifyAdmin;