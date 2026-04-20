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
      </Routes>
      {isAuthenticated && <UserDashboard user={user} />}
    </Router>
  )
}

export default App
