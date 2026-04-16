import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router"
import Home from './pages/home/Home'
import ProductDetails from './pages/product_details/ProductDetails'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/product/:id' element={<ProductDetails />} />
      </Routes>
    </Router>
  )
}

export default App
