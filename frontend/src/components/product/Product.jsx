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
        <Link to={`/product/${product._id}`} className="product-id">
            <div className="product-card">
                <img src={product.image[0].url} alt={product.name} className="product-image-cart" />
                <div className="product-details">
                    <h3 className="product-title">{product.name}</h3>
                    <p className="product-price"><strong>Price: </strong>{product.price}/-</p>
                    <div className="rating-container">
                        <Rating
                            value={product.avgRatings}
                            onRatingChange={handleRatingChange}
                            disabled={true}
                        />
                    </div>

                    <span className="product-card-span">
                        ({product.numOfReviews} {product.numOfReviews === 1 ? "Review" : "Reviews"})
                    </span>

                    <button className="add-to-cart">View Details</button>
                </div>
            </div>
        </Link>
    )
}

export default Product
