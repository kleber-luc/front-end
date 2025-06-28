import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Carrinho.css';

const Carrinho = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/cart', { withCredentials: true });
      setCart(response.data);
      setError('');
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError('Erro ao carregar carrinho');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await axios.get('/api/check-auth', { withCredentials: true });
      const userId = response.data.usuario.id;
      const addressesResponse = await axios.get(`/api/clients/${userId}/addresses`, { 
        withCredentials: true 
      });
      setAddresses(addressesResponse.data);
    } catch (err) {
      setMessage('Erro ao carregar endereços');
    }
  };

  useEffect(() => {
    fetchCart();
    fetchAddresses();
  }, []);

  const handleAddQuantity = async (itemId, currentQuantity) => {
    try {
      await axios.patch(`/api/cart/items/${itemId}`, { quantity: currentQuantity + 1 }, { withCredentials: true });
      fetchCart();
    } catch (err) {
      setMessage('Erro ao atualizar quantidade');
    }
  };

  const handleSubtractQuantity = async (itemId, currentQuantity) => {
    if (currentQuantity <= 1) return;
    try {
      await axios.patch(`/api/cart/items/${itemId}`, { quantity: currentQuantity - 1 }, { withCredentials: true });
      fetchCart();
    } catch (err) {
      setMessage('Erro ao atualizar quantidade');
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await axios.delete(`/api/cart/items/${itemId}`, { withCredentials: true });
      fetchCart();
    } catch (err) {
      setMessage('Erro ao remover item');
    }
  };

  const handleClearCart = async () => {
    try {
      await axios.delete('/api/cart', { withCredentials: true });
      fetchCart();
    } catch (err) {
      setMessage('Erro ao limpar carrinho');
    }
  };

  const handleCheckout = async () => {
    if (!selectedAddress) {
      setMessage('Selecione um endereço');
      return;
    }
    try {
      await axios.post('/api/pedidos', { 
        addressId: Number(selectedAddress),
        items: cart.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        }))
      }, { withCredentials: true });
      
      setMessage('Pedido criado com sucesso!');
      await handleClearCart();
      navigate('/pedidos');
    } catch (err) {
      setMessage(err.response?.data?.error || 'Erro ao finalizar compra');
    }
  };

  if (loading) return <div className="carrinhoContainer">Carregando...</div>;
  if (error) return <div className="carrinhoContainer">{error}</div>;
  if (!cart || !cart.items || cart.items.length === 0) {
    return <div className="carrinhoContainer">Carrinho vazio</div>;
  }

  return (
    <div className="carrinhoContainer">
      <h1>Meu carrinho</h1>
      {message && <div className={`message ${message.includes('Erro') ? 'error' : 'success'}`}>{message}</div>}
      <div className="carrinhoBox">
        {cart.items.map((item) => (
          <div key={item.id} className="carrinhoItem">
            <img
              src={item.product.imageUrl || 'https://via.placeholder.com/100'}
              alt={item.product.name}
              className="produtoImagem"
            />
            <div className="produtoInfo">
              <h2>{item.product.name}</h2>
              <p>{item.product.description}</p>
              <p>R$ {item.price.toFixed(2)}</p>
            </div>
            <div className="quantidadeSecao">
              <span>Quantidade</span>
              <div className="controlesQuantidade">
                <button onClick={() => handleSubtractQuantity(item.id, item.quantity)}>-</button>
                <input type="number" min="1" value={item.quantity} readOnly />
                <button onClick={() => handleAddQuantity(item.id, item.quantity)}>+</button>
              </div>
              <button className="botaoRemover" onClick={() => handleRemoveItem(item.id)}>
                🗑️
              </button>
            </div>
          </div>
        ))}
        <div className="resumoCarrinho">
          <h3>Resumo</h3>
          <p>Total: R$ {(cart?.totalPrice || 0).toFixed(2)}</p>
          <label htmlFor="endereco">Endereço</label>
          <select
            id="endereco"
            value={selectedAddress}
            onChange={(e) => setSelectedAddress(e.target.value)}
          >
            <option value="">Escolha um endereço</option>
            {addresses.map((addr) => (
              <option key={addr.id} value={addr.id}>
                {`${addr.street}, ${addr.number}, ${addr.city}, ${addr.state}`}
              </option>
            ))}
          </select>
          <button className="botaoFinalizar" onClick={handleCheckout}>
            Finalizar compra
          </button>
          <button className="botaoLimpar" onClick={handleClearCart}>
            Limpar carrinho
          </button>
        </div>
      </div>
    </div>
  );
};

export default Carrinho;