import React from 'react'
import "./PaymentSuccess.css";
import { Link, useSearchParams } from 'react-router';

function PaymentSuccess() {
    const [searchParams] = useSearchParams();
    const reference = searchParams.get('reference');
    return (
        <div className="payment_success_container">
            <div className="success_icon">
                <div className="check_mark"></div>
            </div>
            <div className="success_content">
                <h1>Order Confirmed!</h1>
                <p>Your payment was successful. Reference ID <strong>{reference}</strong></p>
            </div>

            <Link className="explore_btn" to="/">Explore More Products</Link>
        </div>
    )
}

export default PaymentSuccess
