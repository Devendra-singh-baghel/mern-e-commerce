import React, { useEffect, useState } from 'react'
import "./ProductDetails.css"
import PageTitle from '../../components/page_title/PageTitle'
import Navbar from '../../components/navbar/Navbar'
import Footer from '../../components/footer/Footer'
import Rating from '../../components/rating/Rating'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { getProductDetails, removeErrors, removeReviewSuccess, submitReview } from '../../features/products/productSlice'
import { toast } from 'react-toastify'
import Loader from '../../components/loader/Loader'
import { addItemsToCart, removeMessage, removeSuccess } from '../../features/cart/cartSlice'

function ProductDetails() {
    const [userRating, setUserRating] = useState(0);
    const [userReview, setUserReview] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState("");

    // Handle rating change when user selects star rating
    const handleRatingChange = (newRating) => {
        setUserRating(newRating);
    }

    const { loading, error, product, reviewSuccess, reviewLoading } = useSelector((state) => state.product);
    const { loading: cartLoading, error: cartError, success, message, cartItems } = useSelector((state) => state.cart);

    const dispatch = useDispatch();
    const { id } = useParams();

    // Fetch product details on component mount or when product ID changes
    useEffect(() => {
        if (id) {
            dispatch(getProductDetails(id));
        }

        return () => {
            dispatch(removeErrors());
        }
    }, [dispatch, id])

    // Handle and display error toast notifications for product and cart operations
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

    // Display success notification when item is added to cart and clear messages
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

    // Decrease item quantity ensuring it cannot be less than 1
    const decreaseQuantity = () => {
        if (quantity <= 1) {
            toast.error("Quantity can not be less than 1 !", { position: "top-center", autoClose: 3000 });
            dispatch(removeErrors());
            return;
        }
        setQuantity((qty) => qty - 1)
    }

    // Increase item quantity ensuring it does not exceed available stock
    const increaseQuantity = () => {
        if (product.stock <= quantity) {
            toast.error("Cannot exceed available stock!", { position: "top-center", autoClose: 3000 });
            dispatch(removeErrors());
            return;
        }
        setQuantity((qty) => qty + 1)
    }

    // Dispatch action to add selected product and quantity to cart
    const addToCartHandler = () => {
        dispatch(addItemsToCart({ id, quantity }))
    }

    // Validate and submit product review and rating
    const handleSubmitReview = (e) => {
        e.preventDefault();
        if (!userRating || !userReview.trim()) {
            toast.error("Please provide both rating and review!", { position: "top-center", autoClose: 3000 });
            return;
        }
        dispatch(submitReview({ rating: userRating, productId: id, comment: userReview }));

    };

    // Reset review form and refresh product details after review is successfully submitted
    useEffect(() => {
        if (reviewSuccess) {
            toast.success("Review submitted successfully!", { position: "top-center", autoClose: 3000 });
            setUserRating(0);
            setUserReview("");
            dispatch(removeReviewSuccess());
            dispatch(getProductDetails(id)); // Refresh product details to show the new review
        }
    }, [dispatch, id, reviewSuccess]);

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
                            src={selectedImage || product?.image?.[0]?.url}
                            alt={product?.name}
                            className="product_detail_image"
                        />

                        {product?.image?.length > 1 && (<div className="product_thumbnails">
                            {product?.image?.map((img, index) => (
                                <img
                                    key={index}
                                    src={img.url}
                                    alt={product?.name}
                                    className={`thumbnail_image ${selectedImage === img.url ? "selected" : ""}`}
                                    onClick={() => setSelectedImage(img.url)}
                                />
                            ))}
                        </div>)}
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
                        <form className="review_form" onSubmit={handleSubmitReview}>
                            <h3>Write a Review</h3>
                            <Rating
                                value={0}
                                disabled={false}
                                onRatingChange={handleRatingChange}
                            />

                            <textarea
                                placeholder="Write your review here.."
                                className="review_input"
                                value={userReview}
                                onChange={(e) => setUserReview(e.target.value)}
                            ></textarea>
                            <button
                                className="submit_review_btn"
                                type="submit"
                                disabled={reviewLoading}
                            >
                                {reviewLoading ? "Submitting...." : "Submit Review"}
                            </button>
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
