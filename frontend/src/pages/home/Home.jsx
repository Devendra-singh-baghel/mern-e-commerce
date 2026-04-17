import React, { useEffect } from 'react'
import "./Home.css"
import Footer from '../../components/footer/Footer'
import Navbar from '../../components/navbar/Navbar'
import ImageSlider from '../../components/image_slider/ImageSlider'
import Product from '../../components/product/Product'
import PageTitle from '../../components/page_title/PageTitle'
import Loader from '../../components/loader/Loader'
import { useDispatch, useSelector } from 'react-redux'
import { getProduct, removeErrors } from "../../features/products/productSlice"
import { toast } from 'react-toastify'



function Home() {
    const { loading, error, products, productCount } = useSelector((state) => state.product);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getProduct({ keyword: "" }));
    }, [dispatch])

    useEffect(() => {
        if (error) {
            toast.error(error.message, {
                position: "top-center",
                autoClose: 3000
            });
            dispatch(removeErrors());
        }
    }, [dispatch, error]);

    if (loading) return <Loader />;

    if (!products) return null;

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
