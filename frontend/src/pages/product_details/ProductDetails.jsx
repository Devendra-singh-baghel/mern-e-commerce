import React, { useEffect, useState } from 'react'
import "./ProductDetails.css"
import PageTitle from '../../components/page_title/PageTitle'
import Navbar from '../../components/navbar/Navbar'
import Footer from '../../components/footer/Footer'
import Rating from '../../components/rating/Rating'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { getProductDetails, removeErrors } from '../../features/products/productSlice'
import { toast } from 'react-toastify'
import Loader from '../../components/loader/Loader'

function ProductDetails() {
    const [userRating, setUserRating] = useState(0);

    const handleRatingChange = (newRating) => {
        setUserRating(newRating);
    }

    const { loading, error, product } = useSelector((state) => state.product);

    const dispatch = useDispatch();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            dispatch(getProductDetails(id));
        }

        return () => {
            dispatch(removeErrors());
        }
    }, [dispatch, id])

    useEffect(() => {
        if (error) {
            toast.error(error.message,
                {
                    position: "top-center",
                    autoClose: 3000
                });
            dispatch(removeErrors());
        }
    }, [dispatch, error])

    if (loading) return <Loader />;

    if (!product) return null;

    return (
        <>
            <PageTitle title={`${product.name} - Details`} />
            <Navbar />
            <div className="product-details-container">
                <div className="product-detail-container">
                    <div className="product-image-container">
                        <img
                            src={product?.image?.[0]?.url}
                            alt={product?.name}
                            className="product-detail-image"
                        />
                    </div>

                    <div className="product-info">
                        <h2>{product.name}</h2>
                        <p className="product-description">{product.description}</p>
                        <p className="product-price">Price: {product.price}/-</p>

                        <div className="product-rating">
                            <Rating
                                value={product.avgRatings}
                                disabled={true}
                            />

                            <span className="product-card-span">
                                (
                                {product.numOfReviews} {product.numOfReviews === 1 ? "Review" : "Reviews"}
                                )
                            </span>
                        </div>

                        <div className="stock-status">
                            <span className={product.stock > 0 ? "in-stock" : "out-of-stock"}>
                                {product.stock > 0 ? `In Stock (${product.stock} available)` : `Out of Stock`}
                            </span>
                        </div>

                        {product.stock > 0 &&
                            (
                                <>
                                    <div className="quantity-controls">
                                        <span className="quantity-label">Quantity: </span>
                                        <button className="qantity-button">-</button>
                                        <input
                                            type="text"
                                            value={1}
                                            className="quantity-value"
                                            readOnly
                                        />
                                        <button className="qantity-button">+</button>
                                    </div>

                                    <button className="add-to-cart-btn">Add to Cart</button>

                                </>
                            )}
                        <form className="review-form">
                            <h3>Write a Review</h3>
                            <Rating
                                value={0}
                                disabled={false}
                                onRatingChange={handleRatingChange}
                            />

                            <textarea placeholder="Write your review here.." className="review-input"></textarea>
                            <button className="submit-review-btn">Submit Review</button>
                        </form>
                    </div>
                </div>

                <div className="reviews-container">
                    <h3>Customer Reviews</h3>
                    {
                        product.reviews && product.reviews.length > 0 ?
                            (
                                <div className="reviews-section">
                                    {product.reviews.map((review) => (
                                        <div key={review._id} className="review-item">
                                            <div className="reviews-header">
                                                <Rating
                                                    value={review.rating}
                                                    disabled={true}
                                                />

                                                <p className="review-comment">{review.comment}</p>
                                                <p className="reviewer-name">By : {review.name}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) :
                            (
                                <p className="no-reviews">No reviews yet. Be the first to review this product!</p>
                            )
                    }
                </div>
            </div>
            <Footer />
        </>
    )
}

export default ProductDetails
