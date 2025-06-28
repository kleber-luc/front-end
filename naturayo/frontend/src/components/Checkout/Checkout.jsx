import React from 'react';
import '../styles/Checkout.css';

const Checkout = () => {
  return (
    <div className="checkout-container">
      <div className="form-section">
        <div className="form-block">
          <h2>1 - Dados Cadastrais</h2>
          <label>Nome completo</label>
          <input type="text" />

          <label>Email</label>
          <input type="email" />

          <div className="inline-group">
            <div>
              <label>Celular com DDD</label>
              <input type="text" />
            </div>
            <div>
              <label>CPF/CNPJ</label>
              <input type="text" />
            </div>
          </div>
        </div>

        <div className="divider" />

        <div className="form-block">
          <h2>2 - Selecionar pagamento</h2>
          <label>Número do cartão</label>
          <input type="text" />

          <label>Seu nome impresso no cartão</label>
          <input type="text" />

          <div className="inline-group">
            <div>
              <label>Validade</label>
              <div className="validade">
                <input type="text" placeholder="Mês" />
                <input type="text" placeholder="Ano" />
              </div>
            </div>
            <div>
              <label>
                <small>Digite o CVV/código de segurança</small>
              </label>
              <input type="text" />
            </div>
          </div>

          <button className="btn-comprar">Comprar Agora</button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
