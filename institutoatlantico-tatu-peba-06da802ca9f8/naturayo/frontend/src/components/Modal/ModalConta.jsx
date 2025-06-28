import React from 'react';
import styles from './ModalConta.module.css';

const ModalConta = ({ onClose }) => {
  return (
    <div className={styles["modal-overlay"]} onClick={onClose}>
      <div className={styles["modal-container"]} onClick={(e) => e.stopPropagation()}>
        <h2>Seja bem-vindo!</h2>
        <p>Faça login ou cadastre-se para acessar sua conta</p>
        <div className={styles.botoes}>
          <button className={styles["btn-cadastrar"]}>Cadastrar-se</button>
          <button className={styles["btn-login"]}>Login</button>
        </div>
      </div>
    </div>
  );
};

export default ModalConta;