const express = require('express');
const router = express.Router();
const { login, logout, verificarSessao } = require('../controllers/authController');
const { cadastrar } = require('../controllers/cadastroController');
const {
    criarPedido,
    listarPedidos,
    buscarPedido,
    atualizarStatus
} = require('../controllers/orderController');

const {
    createProduct,
    getProducts,
    getProductById,
    updateStock,
    deleteProduct,
    checkStock,
    validateStockForSale,
    subtractStock,
} = require('../controllers/productController');
const {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} = require('../controllers/categoriaController');

const { listarUsuarios, buscarUsuario } = require('../controllers/cadastroController');

const {
    createAddress,
    getAddressesByClient,
    updateAddress,
    deleteAddress
} = require('../controllers/addressController');

const { 
    getCart, 
    addItemToCart, 
    updateCartItem, 
    removeItemFromCart, 
    clearCart 
} = require('../controllers/cartController');

const verifyAdmin = require('../middlewares/AdminMiddleware');

//produto
router.get('/products', getProducts);
router.get('/products/:id', getProductById);
router.get('/products/:id/stock', checkStock);
router.post('/products/:id/validate-stock', validateStockForSale);
//produtos (apenas admin)
router.post('/products', verifyAdmin, createProduct);
router.delete('/products/:id', verifyAdmin, deleteProduct);
router.patch('/products/:id/stock', verifyAdmin, updateStock);


//autenticação
router.post('/cadastro', cadastrar);
router.post('/login', login);
router.post('/logout', logout);
router.get('/check-auth', verificarSessao);


//usuários (apenas admin)
router.get('/usuarios', verifyAdmin, listarUsuarios);
router.get('/usuarios/:id', verifyAdmin, buscarUsuario);


//pedidos
router.post('/pedidos', criarPedido);
router.get('/pedidos/:id', buscarPedido);
//pedidos (apenas admin)
router.get('/pedidos', verifyAdmin, listarPedidos);

//categoria
router.get('/categories', getCategories);
router.get('/categories/:id', getCategoryById);
//categorias (apenas admin)
router.post('/categories', verifyAdmin, createCategory);
router.put('/categories/:id', verifyAdmin, updateCategory);
router.delete('/categories/:id', verifyAdmin, deleteCategory);



//endereços
router.post('/addresses', createAddress);
router.get('/clients/:clientId/addresses', getAddressesByClient);
router.put('/addresses/:id', updateAddress);
router.delete('/addresses/:id', deleteAddress);


// carrinho
router.get('/cart', getCart);
router.post('/cart/items', addItemToCart);
router.patch('/cart/items/:itemId', updateCartItem);
router.delete('/cart/items/:itemId', removeItemFromCart);
router.delete('/cart', clearCart);

module.exports = router;