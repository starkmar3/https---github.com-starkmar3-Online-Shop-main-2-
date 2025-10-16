import React, { useState, useEffect, useContext, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { FaArrowUp } from 'react-icons/fa';
import ProductCard from '../components/ProductCard';
import { productAPI } from '../api';
import { CartContext } from '../context/CartContext';
import toast from 'react-hot-toast';

const PageContainer = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
`;

const HeroSection = styled.section`
  background-color: #D9D9D9;
  border-radius: 4rem;
  padding: 7rem 0rem;
  text-align: center;
  margin: 1rem 0;
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 768px) {
    width: 90%;
    padding: 3rem 1rem;
    border-radius: 2rem;
  }
`;

const HeroTitle = styled.h1`
  font-family: 'Soledago', "EB Garamond", serif;
  font-size: 6rem;
  line-height: 1.2;
  font-weight: 500;
  color: white;
  margin-bottom: 1.5rem;
  text-transform: uppercase;

  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.5rem;
  color: white;
  line-height: 1;
  text-align: left;
  width: 65%;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    font-size: 1rem;
    width: 90%;
    text-align: center;
  }
`;

const ShopButton = styled.button`
  background-color: #ffffff;
  color: #D9D9D9;
  padding: 1.2rem 8.5rem;
  border-radius: 50rem;
  text-decoration: none;
  font-weight: 600;
  display: inline-block;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  font-size: 1.3rem;
  margin-top: 2rem;
  cursor: pointer;

  &:hover {
    background-color: #f9f9f9;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.07);
  }

  @media (max-width: 768px) {
    padding: 1rem 4rem;
    font-size: 1rem;
  }
`;

const CatalogTitle = styled.h2`
  margin-top: 4rem;
  margin-bottom: 2rem;
  font-size: 6rem;
  color: #1a1a1a;
  text-align: center;
  font-family: 'Soledago', "EB Garamond", serif;
  font-weight: 500;
  text-transform: uppercase;

  @media (max-width: 768px) {
    font-size: 3rem;
    margin-top: 2rem;
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  margin-top: 2rem;
  padding-bottom: 4rem;
  width: 80%;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    width: 90%;
    gap: 1rem;
    grid-template-columns: repeat(1, 1fr);
  }
`;

const Message = styled.div`
  padding: 1rem;
  background-color: ${props => props.error ? '#f8d7da' : '#D9D9D9'};
  color: ${props => props.error ? '#721c24' : 'white'};
  border-radius: 3rem;
  margin: 1rem 0;
  text-align: center;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  margin: 5rem 0;
  
  &:after {
    content: " ";
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 6px solid #343a40;
    border-color: #343a40 transparent #343a40 transparent;
    animation: spin 1.2s linear infinite;
  }
  
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const ScrollToTopButton = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1000;
  opacity: ${props => props.show ? 1 : 0};
  visibility: ${props => props.show ? 'visible' : 'hidden'};
  transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;

  &:hover {
    background-color: #555;
  }
`;

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showScroll, setShowScroll] = useState(false);
  const { cartItems, addToCart, updateQuantity } = useContext(CartContext);
  const catalogRef = useRef(null);

  const checkScrollTop = useCallback(() => {
    if (!showScroll && window.pageYOffset > 400){
      setShowScroll(true);
    } else if (showScroll && window.pageYOffset <= 400){
      setShowScroll(false);
    }
  }, [showScroll]);

  const scrollTop = () => {
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  const handleScrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    window.addEventListener('scroll', checkScrollTop);
    return () => {
      window.removeEventListener('scroll', checkScrollTop);
    };
  }, [checkScrollTop]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productAPI.getProducts();
        setProducts(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Ошибка при загрузке товаров');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    toast.success(`${product.name} добавлен в корзину!`);
  };

  return (
    <PageContainer>
      <HeroSection>
        <HeroTitle>Искусство в <br /> каждом изделии</HeroTitle>
        <HeroSubtitle>
          Мы создаем ювелирные изделия, которые воплощают вашу уникальность и стиль. 
          Каждое украшение - это результат труда квалифицированных мастеров, заботливо 
          отобранных материалов и внимания к деталям.
        </HeroSubtitle>
        <ShopButton onClick={handleScrollToCatalog}>к товарам</ShopButton>
      </HeroSection>
      
      <CatalogTitle ref={catalogRef}>Каталог</CatalogTitle>
      
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <Message error>{error}</Message>
      ) : products.length === 0 ? (
        <Message>Товары не найдены</Message>
      ) : (
        <ProductsGrid>
          {products.map((product) => {
            const cartItem = cartItems.find(item => item.product === product._id);
            const isAdded = !!cartItem;
            return (
              <ProductCard 
                key={product._id} 
                product={product} 
                onAddToCart={handleAddToCart}
                isAdded={isAdded}
                cartItem={cartItem}
                updateQuantity={updateQuantity}
              />
            )
          })}
        </ProductsGrid>
      )}
      <ScrollToTopButton onClick={scrollTop} show={showScroll}>
        <FaArrowUp />
      </ScrollToTopButton>
    </PageContainer>
  );
};

export default HomePage; 