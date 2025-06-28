import styles from './Footer.module.css'
import certificacao from "../../assets/img/certificado.png";
import { FaInstagram, FaFacebookF, FaYoutube, FaLinkedinIn } from "react-icons/fa";

function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.section}>
                <img src="/logo.png" alt="Logo Naturayo" className={styles.logo} />
                <p>
                    A Naturayo é uma empresa cearense comprometida com o desenvolvimento e comercialização de plantas ornamentais.
                </p>
            </div>
            <div className={`${styles.section} ${styles.certificado}`}>
                <div className={styles.certificadoContent}>
                    <p className={styles.certTitle}>Empresa Certificada</p>
                    <img src={certificacao} alt="Certificado" className={styles.certImg} />
                </div>
            </div>

            <div className={`${styles.section} ${styles.enderecoSection}`}>
                <h3 className={styles.enderecoTitle}>Onde estamos</h3>
                <p className={styles.endereco}>
                    Rua Rocha Lima, 371, CEP 60135-000<br />
                    Fortaleza, Ceará – Brasil
                </p>
                <p className={styles.sigaNos}>Siga-nos</p>
                <div className={styles.socialIcons}>
                    <a href="#" aria-label="Instagram"><FaInstagram /></a>
                    <a href="#" aria-label="Facebook"><FaFacebookF /></a>
                    <a href="#" aria-label="YouTube"><FaYoutube /></a>
                    <a href="#" aria-label="LinkedIn"><FaLinkedinIn /></a>
                </div>
            </div>
        </footer>
    )
}

export default Footer