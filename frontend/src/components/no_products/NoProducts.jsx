import React from 'react'
import "./NoProducts.css"

function NoProducts({ keyword }) {
    return (
        <div className="no_products_content">
            <div className="no_products_icon">⚠️</div>
            <h3 className="no_products_title">No Products Found</h3>
            <p className="no_products_message">
                {keyword ? `We couldn't find any products matching "${keyword}". Try using different keywords or browse our complete catalog.` : `No products are available. Please check back later`}
            </p>
        </div>
    )
}

export default NoProducts
