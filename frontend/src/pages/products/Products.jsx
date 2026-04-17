import React, { useEffect } from 'react'
import "./Products.css"
import PageTitle from '../../components/page_title/PageTitle'
import Navbar from '../../components/navbar/Navbar'
import Footer from '../../components/footer/Footer'
import { useDispatch, useSelector } from 'react-redux'
import Product from '../../components/product/Product'
import Loader from '../../components/loader/Loader'
import { getProduct, removeErrors } from '../../features/products/productSlice'
import { useLocation } from 'react-router'
import { toast } from 'react-toastify'
import NoProducts from '../../components/no_products/NoProducts'

function Products() {

    const { loading, error, products, productCount, resultsPerPage, totalPages } = useSelector((state) => state.product);

    const dispatch = useDispatch();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const keyword = searchParams.get("keyword");
    console.log(keyword)

    useEffect(() => {
        dispatch(getProduct({ keyword }));
    }, [dispatch, keyword])

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
            <PageTitle title={"All Products"} />
            <Navbar />
            <div className="products-layout">
                <div className="filter-section">
                    <h3 className="filter-heading">CATEGORIES</h3>
                    {/* Render Categories  */}
                </div>

                <div className="products-section">
                    {products.length > 0 ?
                        (
                            <div className="products-product-container">
                                {products.map((product) => (
                                    <Product product={product} key={product._id} />
                                ))}
                            </div>
                        ) : (<NoProducts keyword={keyword} />)
                    }
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Products
