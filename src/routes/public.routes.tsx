import { Route } from 'react-router-dom';
import Home from '../pages/Home';
import Feed from '../pages/Feed';
import { ProductDetails } from '../pages/ProductDetails';
import Login from '../modules/auth/pages/Login';
import { Register } from '../modules/auth/pages/Register';

export const publicRoutes = (
  <>
    <Route path="/" element={<Home />} />
    <Route path="/feed" element={<Feed />} />
    <Route path="/product/:id" element={<ProductDetails />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
  </>
);
