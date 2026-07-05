import { useEffect, type ReactElement } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Nav from './components/Nav';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import NewsletterModal from './components/NewsletterModal';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Learn from './pages/Learn';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import ProductDetail from './pages/ProductDetail';
import ContentPage from './pages/ContentPage';
import LegacyPage from './pages/LegacyPage';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Login from './pages/Login';
import Register from './pages/Register';
import Account from './pages/Account';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);
  return null;
}

// Canonical (English) route table. Every entry is also served under `/ja/…`
// so each page has a real, indexable Japanese URL.
const routes: { path: string; element: ReactElement }[] = [
  { path: '/', element: <Home /> },
  { path: '/shop', element: <Shop /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/account', element: <Account /> },
  { path: '/checkout', element: <Checkout /> },
  { path: '/order-confirmation', element: <OrderConfirmation /> },
  { path: '/products/:handle', element: <ProductDetail /> },
  { path: '/product-page/:legacySlug', element: <ProductDetail /> },
  { path: '/learn', element: <Learn /> },
  { path: '/faq', element: <FAQ /> },
  { path: '/contact', element: <Contact /> },
  { path: '/shipping-returns', element: <ContentPage slug="shipping-returns" /> },
  { path: '/terms-conditions', element: <ContentPage slug="terms-conditions" /> },
  { path: '/new-arrivals', element: <LegacyPage slug="new-arrivals" /> },
  { path: '/wood-shaft', element: <LegacyPage slug="wood-shaft" /> },
  { path: '/darkness-fw-shaft', element: <LegacyPage slug="darkness-fw-shaft" /> },
  { path: '/backpacks', element: <LegacyPage slug="backpacks" /> },
  { path: '/copy-of-fairway-wood-series', element: <LegacyPage slug="fairway-wood-series" /> },
];

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Nav />
      <CartDrawer />
      <NewsletterModal />
      <main>
        <Routes>
          {['', '/ja'].flatMap((prefix) =>
            routes.map((r) => (
              <Route
                key={`${prefix}${r.path}`}
                path={r.path === '/' ? prefix || '/' : `${prefix}${r.path}`}
                element={r.element}
              />
            )),
          )}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
