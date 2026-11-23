import React, { useState } from 'react'
import "./Product.css"
import { Link } from 'react-router'
import Rating from '../rating/Rating'

function Product({ product }) {

    const [rating, setRating] = useState(0);
    const handleRatingChange = (newRating) => {
        setRating(newRating);
    }

    return (
        <Link to={`/product/${product._id}`} className="product_id">
            <div className="product_card">
                <img src={product.image[0].url} alt={product.name} className="product_image_card" />
                <div className="product_details">
                    <h3 className="product_title">{product.name}</h3>
                    <p className="product_price"><strong>Price: </strong>{product.price}/-</p>
                    <div className="rating_container">
                        <Rating
                            value={product.avgRatings}
                            onRatingChange={handleRatingChange}
                            disabled={true}
                        />
                    </div>

                    <span className="product_card_span">
                        ({product.numOfReviews} {product.numOfReviews === 1 ? "Review" : "Reviews"})
                    </span>

                    <button className="add_to_cart">View Details</button>
                </div>
            </div>
        </Link>
    )
}

export default Product
