import React from 'react';
import '../styles/Perfil.css';

function Perfil() {
  return (
    <div className="perfil-wrapper">
      <div className="perfil-container">
        <h1>Meu Perfil</h1>
        <p className="perfil-link">Gerenciar e proteger sua conta</p>
        <hr />

        <div className="perfil-content">
          <div className="perfil-left">
            <div className="form-group">
              <label>Nome de usuário</label>
              <input type="text" />
            </div>
            <div className="form-group">
              <label>Nome</label>
              <input type="text" />
            </div>
            <div className="form-group with-button">
              <div>
                <label>Email</label>
                <input type="email" />
              </div>
              <button className="trocar-btn">Trocar</button>
            </div>
            <div className="form-group with-button">
              <div>
                <label>Número de telefone</label>
                <input type="text" />
              </div>
              <button className="trocar-btn">Trocar</button>
            </div>

            <button className="salvar-btn">Salvar</button>
          </div>

          <div className="perfil-right">
            <div className="avatar-placeholder"></div>
            <button className="selecionar-btn">Selecionar imagem</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Perfil;
""
