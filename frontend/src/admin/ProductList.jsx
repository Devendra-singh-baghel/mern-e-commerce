import React, { useEffect } from 'react'
import "./ProductList.css"
import Navbar from '../components/navbar/Navbar'
import PageTitle from '../components/page_title/PageTitle'
import Footer from '../components/footer/Footer'
import { Link } from 'react-router'
import { Delete, Edit } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAdminProducts, removeError } from '../features/admin/adminSlice'
import Loader from '../components/loader/Loader'
import NoProducts from '../components/no_products/NoProducts'
import { toast } from 'react-toastify'

function ProductList() {
    const { products, loading, error } = useSelector(state => state.admin);
    const dispatch = useDispatch();

    // Fetch admin products on component mount
    useEffect(() => {
        dispatch(fetchAdminProducts());
    }, [dispatch]);

    // Handle error notifications
    useEffect(() => {
        if (error) {
            toast.error(error, {
                position: "top-right",
                autoClose: 3000,
            });
            dispatch(removeError());
        }
    }, [dispatch, error]);

    if (loading) return <Loader />;

    return (
        <>
            <PageTitle title="Product List" />
            <Navbar />

            <div className="product_list_container">
                <h1 className="product_list_title">All Products</h1>
                {products && products.length > 0 ? (
                    <table className="product_table">
                        <thead>
                            <tr>
                                <th>Sl No.</th>
                                <th>Product Image</th>
                                <th>Product Name</th>
                                <th>Price</th>
                                <th>Rating</th>
                                <th>Category</th>
                                <th>Stock</th>
                                <th>Created At</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product, index) => (
                                <tr key={product._id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <img src={product.image?.[0]?.url || ""} alt={product.name} className="admin_product_image" />
                                    </td>
                                    <td>{product.name}</td>
                                    <td>{product.price}</td>
                                    <td>{product.rating}</td>
                                    <td>{product.category}</td>
                                    <td>{product.stock}</td>
                                    <td>{product.createdAt}</td>
                                    <td>
                                        <Link
                                            to={`/admin/product/${product._id}`}
                                            className="action_icon edit_icon"
                                        > <Edit />Edit
                                        </Link>
                                        <Link
                                            to={`/admin/product/${product._id}`}
                                            className="action_icon delete_icon"
                                        > <Delete />Delete
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <NoProducts />
                )}
            </div>

            <Footer />
        </>
    )
}

export default ProductList
