import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './SecaoProdutos.module.css';
import { FaRegHeart } from 'react-icons/fa';

const SecaoProdutos = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/products', { withCredentials: true });
        setProducts(Array.isArray(response.data) ? response.data : []);
        setError('');
      } catch (err) {
        setError('Erro ao carregar produtos');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = async (productId) => {
    try {
      const response = await axios.post(
        `/api/products/${productId}/validate-stock`,
        { requestedQuantity: 1 },
        { withCredentials: true }
      );

      if (!response.data.available) {
        setMessage(`Estoque insuficiente. Disponível: ${response.data.availableStock}`);
        return;
      }

      await axios.post(
        '/api/cart/items',
        { productId, quantity: 1 },
        { withCredentials: true }
      );

      setMessage('Produto adicionado ao carrinho!');
      // Recarrega a página para atualizar o contador no header
      window.location.reload();
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setMessage(err.response?.data?.error || 'Erro ao adicionar ao carrinho');
      }
    }
  };

  if (loading) return <div className={styles.secaoprodutosContainer}>Carregando...</div>;
  if (error) return <div className={styles.secaoprodutosContainer}>{error}</div>;

  return (
    <div className={styles.secaoprodutosContainer}>
      <h2 className={styles.secaoprodutosTitulo}>Produtos</h2>
      <div className={styles.secaoprodutosLinha}></div>
      {message && <div className={message.includes('Erro') ? styles.error : styles.success}>{message}</div>}
      <div className={styles.gridProdutos}>
        {products.length > 0 ? (
          products.map((produto) => (
            <div key={produto.id} className={styles.produto}>
              <img
                src={produto.imageUrl || 'https://via.placeholder.com/150'}
                alt={produto.name}
                className={styles.produtoImagem}
                onClick={() => navigate(`/produto/${produto.id}`)}
              />
              <p className={styles.produtoNome}>{produto.name}</p>
              <p className={styles.produtoPreco}>R$ {produto.price.toFixed(2)}</p>
              <button className={styles.favoritoBtn}>
                <FaRegHeart className={styles.favoritoIcon} /> Favoritos
              </button>
              <button 
                className={styles.addToCartBtn}
                onClick={() => handleAddToCart(produto.id)}
              >
                Adicionar ao Carrinho
              </button>
            </div>
          ))
        ) : (
          <div className={styles.secaoprodutosContainer}>Nenhum produto disponível</div>
        )}
      </div>
    </div>
  );
};

export default SecaoProdutos;