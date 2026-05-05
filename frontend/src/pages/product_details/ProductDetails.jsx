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
import { addItemsToCart, removeMessage, removeSuccess } from '../../features/cart/cartSlice'

function ProductDetails() {
    const [userRating, setUserRating] = useState(0);
    const [quantity, setQuantity] = useState(1);

    const handleRatingChange = (newRating) => {
        setUserRating(newRating);
    }

    const { loading, error, product } = useSelector((state) => state.product);
    const { loading: cartLoading, error: cartError, success, message, cartItems } = useSelector((state) => state.cart);

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
            toast.error(error.message, {
                position: "top-center",
                autoClose: 3000
            });
            dispatch(removeErrors());
        }

        if (cartError) {
            toast.error(cartError.message, {
                position: "top-center",
                autoClose: 3000
            });
        }
    }, [dispatch, error, cartError])

    useEffect(() => {
        if (success) {
            toast.success(message, {
                position: "top-center",
                autoClose: 3000
            });
            dispatch(removeSuccess());
            dispatch(removeMessage());
        }
    }, [dispatch, success, message]);

    const decreaseQuantity = () => {
        if (quantity <= 1) {
            toast.error("Quantity can not be less than 1 !", { position: "top-center", autoClose: 3000 });
            dispatch(removeErrors());
            return;
        }
        setQuantity((qty) => qty - 1)
    }

    const increaseQuantity = () => {
        if (product.stock <= quantity) {
            toast.error("Cannot exceed available stock!", { position: "top-center", autoClose: 3000 });
            dispatch(removeErrors());
            return;
        }
        setQuantity((qty) => qty + 1)
    }

    const addToCartHandler = () => {
        dispatch(addItemsToCart({ id, quantity }))
    }

    if (loading) return <Loader />;

    if (!product) return null;

    return (
        <>
            <PageTitle title={`${product.name} - Details`} />
            <Navbar />
            <div className="product_details_container">
                <div className="product_detail_container">
                    <div className="product_image_container">
                        <img
                            src={product?.image?.[0]?.url}
                            alt={product?.name}
                            className="product_detail_image"
                        />
                    </div>

                    <div className="product_info">
                        <h2>{product.name}</h2>
                        <p className="product_description">{product.description}</p>
                        <p className="product_price">Price: {product.price}/-</p>

                        <div className="product_rating">
                            <Rating
                                value={product.avgRatings}
                                disabled={true}
                            />

                            <span className="product_card_span">
                                (
                                {product.numOfReviews} {product.numOfReviews === 1 ? "Review" : "Reviews"}
                                )
                            </span>
                        </div>

                        <div className="stock_status">
                            <span className={product.stock > 0 ? "in_stock" : "out_of_stock"}>
                                {product.stock > 0 ? `In Stock (${product.stock} available)` : `Out of Stock`}
                            </span>
                        </div>

                        {product.stock > 0 &&
                            (
                                <>
                                    <div className="quantity_controls">
                                        <span className="quantity_label">Quantity: </span>
                                        <button className="quantity_button" onClick={decreaseQuantity}>-</button>
                                        <input
                                            type="text"
                                            value={quantity}
                                            className="quantity_value"
                                            readOnly
                                        />
                                        <button className="quantity_button" onClick={increaseQuantity}>+</button>
                                    </div>

                                    <button
                                        className="add_to_cart_btn"
                                        onClick={addToCartHandler}
                                        disabled={cartLoading}
                                    >{cartLoading ? "Adding...." : "Add to Cart"}</button>

                                </>
                            )}
                        <form className="review_form">
                            <h3>Write a Review</h3>
                            <Rating
                                value={0}
                                disabled={false}
                                onRatingChange={handleRatingChange}
                            />

                            <textarea placeholder="Write your review here.." className="review_input"></textarea>
                            <button className="submit_review_btn">Submit Review</button>
                        </form>
                    </div>
                </div>

                <div className="reviews_container">
                    <h3>Customer Reviews</h3>
                    {
                        product.reviews && product.reviews.length > 0 ?
                            (
                                <div className="reviews_section">
                                    {product.reviews.map((review) => (
                                        <div key={review._id} className="review_item">
                                            <div className="reviews_header">
                                                <Rating
                                                    value={review.rating}
                                                    disabled={true}
                                                />

                                                <p className="review_comment">{review.comment}</p>
                                                <p className="reviewer_name">By : {review.name}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) :
                            (
                                <p className="no_reviews">No reviews yet. Be the first to review this product!</p>
                            )
                    }
                </div>
            </div>
            <Footer />
        </>
    )
}

export default ProductDetails
