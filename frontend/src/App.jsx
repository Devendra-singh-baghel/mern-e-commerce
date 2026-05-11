import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router"
import Home from './pages/home/Home'
import ProductDetails from './pages/product_details/ProductDetails'
import Products from './pages/products/Products'
import Register from './user/Register'
import Login from './user/Login'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { loadUser } from './features/user/userSlice'
import UserDashboard from './user/UserDashboard'
import Profile from './user/Profile'
import ProtectedRoute from './routes/ProtectedRoute'
import UpdateProfile from './user/UpdateProfile'
import UpdatePassword from './user/UpdatePassword'
import ForgotPassword from './user/ForgotPassword'
import ResetPassword from './user/ResetPassword'
import Cart from './cart/Cart'
import Shipping from './cart/Shipping'
import OrderConfirm from './cart/OrderConfirm'
import Payment from './cart/Payment'

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(loadUser);
    }
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/product/:id' element={<ProductDetails />} />
        <Route path='/products' element={<Products />} />
        <Route path='/products/:keyword' element={<Products />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/password/forgot' element={<ForgotPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />
        <Route path="/cart" element={<Cart />} />

        <Route path='/profile' element={<ProtectedRoute children={<Profile />} />} />
        <Route path='/profile/update' element={<ProtectedRoute children={<UpdateProfile />} />} />
        <Route path='/password/update' element={<ProtectedRoute children={<UpdatePassword />} />} />
        <Route path='/shipping' element={<ProtectedRoute children={<Shipping />} />} />
        <Route path='/order/confirm' element={<ProtectedRoute children={<OrderConfirm />} />} />
        <Route path='/process/payment' element={<ProtectedRoute children={<Payment />} />} />
      </Routes>
      {isAuthenticated && <UserDashboard user={user} />}
    </Router>
  )
}

export default App
