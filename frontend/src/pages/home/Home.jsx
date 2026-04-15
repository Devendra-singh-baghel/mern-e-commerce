import React, { useEffect } from 'react'
import "./Home.css"
import Footer from '../../components/footer/Footer'
import Navbar from '../../components/navbar/Navbar'
import ImageSlider from '../../components/image_slider/ImageSlider'
import Product from '../../components/product/Product'
import PageTitle from '../../components/page_title/PageTitle'
import { useDispatch, useSelector } from 'react-redux'
import { getProduct } from "../../features/products/productSlice"



function Home() {
    const { loading, error, products, productCount } = useSelector((state) => state.product);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getProduct());
    }, [dispatch])

    return (
        <>
            <PageTitle title="Home-My Website" />
            <Navbar />
            <ImageSlider />
            <div className="home-container">
                <h2 className='home-heading'>Tranding Now</h2>
                <div className="home-product-container">
                    {products.map((product) => (
                        <Product product={product} key={product._id} />
                    ))}
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Home
