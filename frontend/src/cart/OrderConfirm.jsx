import React from 'react'
import "./OrderConfirm.css";
import PageTitle from '../components/page_title/PageTitle'
import Navbar from '../components/navbar/Navbar'
import CheckoutPath from './CheckoutPath'
import Footer from '../components/footer/Footer'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'

function OrderConfirm() {

    const { shippingInfo, cartItems } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.user);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const subTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)
    const tax = subTotal * 0.18;
    const shippingCharges = subTotal > 500 ? 0 : 50;
    const total = subTotal + tax + shippingCharges;

    const proceedToPayment = () => {
        const data = {
            subTotal,
            tax,
            shippingCharges,
            total
        }

        sessionStorage.setItem("orderItem", JSON.stringify(data));
        navigate("/process/payment");
    }

    return (
        <>
            <PageTitle title="Shipping Info" />

            <Navbar />

            <CheckoutPath activePath={1} />

            <div className="confirm_container">
                <h1 className="confirm_header">Order Confirmation</h1>

                <div className="confirm_table_container">
                    {/* hipping Details */}
                    <table className="confirm_table">
                        <caption>Shipping Details</caption>

                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Address</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td>{user.name}</td>
                                <td>{shippingInfo.phoneNumber}</td>
                                <td>
                                    {shippingInfo.address}, {shippingInfo.city}, {shippingInfo.state}, {shippingInfo.country}-{shippingInfo.pinCode}
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Cart Items */}
                    <table className="confirm_table cart_table">
                        <caption>Cart Items</caption>

                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Product Name</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Total Price</th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                cartItems.map((item) => (
                                    <tr key={item.product_id}>
                                        <td>
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="product_image"
                                            />
                                        </td>
                                        <td>{item.name}</td>
                                        <td>{item.price}/-</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.quantity * item.price}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>

                    {/* Order Summary */}
                    <table className="confirm_table">
                        <caption>Order Summary</caption>

                        <thead>
                            <tr>
                                <th>Subtotal</th>
                                <th>Shipping Charges</th>
                                <th>GST</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{subTotal}</td>
                                <td>{shippingCharges}</td>
                                <td>{tax.toFixed(2)}</td>
                                <td>{total.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <button
                    className="proceed_btn"
                    onClick={proceedToPayment}
                >Proceed to Payment</button>
            </div>

            <Footer />
        </>
    )
}

export default OrderConfirm
