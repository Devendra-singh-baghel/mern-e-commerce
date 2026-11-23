import React from 'react';
import "./Payment.css";
import PageTitle from '../components/page_title/PageTitle';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';
import CheckoutPath from './CheckoutPath';
import { Link, useNavigate } from 'react-router';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

function Payment() {
    const orderItem = JSON.parse(sessionStorage.getItem("orderItem"));
    const { user } = useSelector(state => state.user);
    const { shippingInfo } = useSelector(state => state.cart);
    const navigate = useNavigate();

    const completePayment = async (amount) => {
        try {
            const { data: { key } } = await axios.get('/api/v1/getKey');
            const { data: { order } } = await axios.post('/api/v1/payment/process', { amount });

            // Open Razorpay Checkout
            const options = {
                key,
                amount,
                currency: 'INR',
                name: 'NexCart',
                description: 'E-commerce Website Payment Transaction',
                order_id: order.id,
                handler: async function (response) {
                    try {
                        const { data } = await axios.post('/api/v1/paymentVerification', {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature
                        });

                        if (data.success) {
                            navigate(`/paymentSuccess?reference=${data.reference}`);
                        } else {
                            toast.error('Payment Verification Failed');
                        }
                    } catch (err) {
                        toast.error(err.response?.data?.message || 'Payment Verification Error');
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                    contact: shippingInfo.phoneNumber
                },
                theme: {
                    color: '#F37254'
                },
            };

            const rzp = new Razorpay(options);
            rzp.open();
        } catch (error) {
            toast.error(error.message);
        }
    }

    return (
        <>
            <PageTitle title="Payment" />

            <Navbar />

            <CheckoutPath activePath={2} />

            <div className="payment-container">
                <Link to="/order/confirm" className="payment-go-back">
                    Go Back
                </Link>
                <button
                    className="payment-btn"
                    onClick={() => completePayment(orderItem.total)}
                >
                    Pay - ₹{orderItem && orderItem.total}
                </button>
            </div>

            <Footer />
        </>
    );
}

export default Payment;
