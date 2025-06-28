import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProductPage.css';

function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/products/${id}`, { withCredentials: true });
        setProduct(response.data);
      } catch (err) {
        setMessage('Erro ao carregar produto');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      const response = await axios.post(
        `/api/products/${id}/validate-stock`,
        { requestedQuantity: quantity },
        { withCredentials: true }
      );

      if (!response.data.available) {
        setMessage('Estoque insuficiente');
        return;
      }

      await axios.post(
        '/api/cart/items',
        { productId: Number(id), quantity },
        { withCredentials: true }
      );

      setMessage('Adicionado ao carrinho!');
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

  if (loading) return <div className="product-container">Carregando...</div>;
  if (!product) return <div className="product-container">Produto não encontrado</div>;

  return (
    <div className="product-container">
      {message && <div className={`message ${message.includes('Erro') ? 'error' : 'success'}`}>{message}</div>}
      <div className="left-column">
        <img
          src={product.imageUrl || 'https://via.placeholder.com/300'}
          alt={product.name}
          className="product-image"
        />
      </div>
      <div className="right-column">
        <h1>{product.name}</h1>
        <p className="product-price">R$ {product.price.toFixed(2)}</p>
        <div className="product-description">
          <h3>Descrição</h3>
          <p>{product.description}</p>
        </div>
        <div className="product-actions">
          <label htmlFor="quantity">Quantidade</label>
          <input
            type="number"
            id="quantity"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
          />
          <button onClick={handleAddToCart}>Adicionar ao Carrinho</button>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;