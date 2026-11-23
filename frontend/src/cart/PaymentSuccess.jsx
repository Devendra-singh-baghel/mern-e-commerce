import React, { useEffect } from 'react'
import "./PaymentSuccess.css";
import { Link, useSearchParams } from 'react-router';
import PageTitle from '../components/page_title/PageTitle';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { createOrder, removeErrors, removeSuccess } from '../features/order/orderSlice';
import { clearCart } from '../features/cart/cartSlice';
import Loader from '../components/loader/Loader';

function PaymentSuccess() {
    const [searchParams] = useSearchParams();
    const reference = searchParams.get('reference');

    const { cartItems, shippingInfo } = useSelector(state => state.cart);
    const { success, error, loading } = useSelector(state => state.order);
    const dispatch = useDispatch();

    useEffect(() => {
        const createOrderData = async () => {
            try {
                const orderItem = JSON.parse(sessionStorage.getItem("orderItem"));

                if (!orderItem) return;

                const orderData = {
                    shippingInfo: {
                        address: shippingInfo.address,
                        city: shippingInfo.city,
                        state: shippingInfo.state,
                        country: shippingInfo.country,
                        pinCode: shippingInfo.pinCode,
                        phoneNumber: shippingInfo.phoneNumber
                    },
                    orderItems: cartItems.map((item) => ({
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        image: item.image,
                        product: item.product_id
                    })),
                    paymentInfo: {
                        id: reference,
                        status: "completed"
                    },
                    paymentMethod: "Online",
                    itemsPrice: orderItem.subTotal,
                    taxPrice: orderItem.tax,
                    shippingPrice: orderItem.shippingCharges,
                    totalPrice: orderItem.total
                }

                dispatch(createOrder(orderData));
            } catch (error) {
                console.log("Order Creation Error", error.message);
                toast.error(error.message || 'Order Creation Error');
            }
        }

        createOrderData();
    }, [])

    useEffect(() => {
        if (success) {
            toast.success('Order Created Successfully');
            dispatch(clearCart());
            sessionStorage.removeItem("orderItem");
            dispatch(removeSuccess());
        }
    }, [dispatch, success])

    useEffect(() => {
        if (error) {
            toast.error(error || 'Order Creation Failed');
            dispatch(removeErrors());
        }
    }, [dispatch, error])

    if (loading) return <Loader />;

    return (
        <>
            <PageTitle title="Payment Status" />

            <Navbar />

            <div className="payment_success_container">
                <div className="success_content">
                    <div className="success_icon">
                        <div className="check_mark"></div>
                    </div>
                    <h1>Order Confirmed!</h1>
                    <p className="success_para">Your payment was successful. Reference ID <strong>{reference}</strong></p>
                    <Link className="explore_btn" to="/orders/user">View Orders</Link>
                </div>
            </div>

            <Footer />
        </>
    )
}

export default PaymentSuccess
