import React, { useEffect, useState } from 'react';
import './ReviewList.css';
import Navbar from '../components/navbar/Navbar';
import PageTitle from '../components/page_title/PageTitle';
import Footer from '../components/footer/Footer';
import { Delete, Star } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { clearReviews, deleteReview, fetchAdminProducts, getAllReviews, removeError, removeReviewDeleted } from '../features/admin/adminSlice';
import Loader from '../components/loader/Loader';
import { toast } from 'react-toastify';

function ReviewList() {
    const { products, reviews, loading, error, isReviewDeleted, deletingReviewId } = useSelector((state) => state.admin);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const dispatch = useDispatch();

    // Fetch all admin products on component mount
    useEffect(() => {
        dispatch(fetchAdminProducts());
    }, [dispatch]);

    // Handle view reviews for selected product
    const handleViewReviews = (productId) => {
        setSelectedProduct(productId);
        dispatch(getAllReviews(productId));
    };

    // Handle review deletion confirmation and dispatch
    const deleteReviewHandler = (reviewId) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this review?");
        if (isConfirmed) {
            dispatch(deleteReview({ productId: selectedProduct, reviewId }));
        }
    };

    // Handle error notifications and refresh data on successful review deletion
    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(removeError());
        }

        if (isReviewDeleted) {
            toast.success("Review Deleted Successfully");
            dispatch(removeReviewDeleted());
            dispatch(fetchAdminProducts());
            if (selectedProduct) {
                dispatch(getAllReviews(selectedProduct));
            }
        }
    }, [dispatch, error, isReviewDeleted, selectedProduct]);

    // Reset selected product when reviews list becomes empty
    useEffect(() => {
        if (selectedProduct && reviews && reviews.length === 0) {
            setSelectedProduct(null);
        }
    }, [selectedProduct, reviews]);

    // Clear reviews from store on component unmount
    useEffect(() => {
        return () => {
            dispatch(clearReviews());
        };
    }, [dispatch]);

    if (loading) return <Loader />;

    return (
        <>
            <PageTitle title="All Reviews - Admin" />
            <Navbar />

            {products && products.length > 0 ? (
                <div className="product_reviews_container">
                    <h1 className="product_reviews_title">All Reviews</h1>

                    <div className="product_reviews_table_container">
                        <table className="product_reviews_table">
                            <thead>
                                <tr>
                                    <th>Sl No.</th>
                                    <th>Product Name</th>
                                    <th>Product Image</th>
                                    <th>Number of Reviews</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product, index) => (
                                    <tr key={product._id}>
                                        <td>{index + 1}</td>
                                        <td>{product.name}</td>
                                        <td>
                                            <img
                                                src={product.image?.[0]?.url || ""}
                                                alt={product.name}
                                                className="product_image"
                                            />
                                        </td>
                                        <td>{product.numOfReviews}</td>
                                        <td>
                                            <button
                                                type="button"
                                                onClick={() => handleViewReviews(product._id)}
                                                className="action_icon view_icon"
                                                disabled={product.numOfReviews === 0}
                                            >
                                                {product.numOfReviews > 0 ? "View Review" : "No Reviews"}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {selectedProduct && reviews && reviews.length > 0 && (
                            <div className="product_reviews_table_container">
                                <h1 className="product_reviews_title">Reviews For Product</h1>
                                <table className="product_reviews_table">
                                    <thead>
                                        <tr>
                                            <th>Sl No.</th>
                                            <th>User</th>
                                            <th>Comment</th>
                                            <th>Rating</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reviews.map((review, index) => (
                                            <tr key={review._id}>
                                                <td>{index + 1}</td>
                                                <td>{review.name}</td>
                                                <td>{review.comment}</td>
                                                <td>
                                                    <span className={review.rating >= 3 ? "review_rating_good" : "review_rating_bad"}>
                                                        {review.rating}/5
                                                    </span>
                                                </td>
                                                <td>
                                                    <button
                                                        type="button"
                                                        onClick={() => deleteReviewHandler(review._id)}
                                                        className="action_icon delete_icon"
                                                        disabled={deletingReviewId === review._id}
                                                    >
                                                        <Delete />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="product_reviews_container">
                    <h1 className="product_reviews_title">All Reviews</h1>
                    <p className="loading_message">No products found.</p>
                </div>
            )}

            <Footer />
        </>
    );
}

export default ReviewList;
