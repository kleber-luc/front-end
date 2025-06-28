import './App.css'
import BannerRotativo from './components/Banner/BannerRotativo'
import Footer from './components/Footer'
import Header from './components/Header'
import SecaoProdutos from './components/SecaoProdutos/SecaoProdutos'
import Carrinho from './components/Carrinho/Carrinho'
import LoginPage from './components/Login/Loginpage';
import ProductPage from './components/ProductPage/ProductPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <BannerRotativo />
              <SecaoProdutos />
              <Footer />
            </>
          }
        />
        <Route path="/carrinho" element={<Carrinho />} />
        <Route path="/produto/:id" element={<ProductPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  )
}

export default App
