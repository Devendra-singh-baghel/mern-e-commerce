import React from 'react';
import "./Payment.css";
import PageTitle from '../components/page_title/PageTitle';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';
import CheckoutPath from './CheckoutPath';
import { Link } from 'react-router';

function Payment() {
    const orderItem = JSON.parse(sessionStorage.getItem("orderItem"));

    return (
        <>
            <PageTitle title="Payment" />

            <Navbar />

            <CheckoutPath activePath={2} />

            <div className="payment-container">
                <Link to="/order/confirm" className="payment-go-back">
                    Go Back
                </Link>
                <button className="payment-btn">
                    Pay - ₹{orderItem && orderItem.total}
                </button>
            </div>

            <Footer />
        </>
    );
}

export default Payment;
