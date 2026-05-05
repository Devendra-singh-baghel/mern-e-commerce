import React from 'react'
import "./Cart.css";
import PageTitle from '../components/page_title/PageTitle';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';
import CartItem from './CartItem';
import { useSelector } from 'react-redux';
import { Link } from 'react-router';

function Cart() {
    const { cartItems } = useSelector((state) => state.cart);

    const subTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)
    const tax = subTotal * 0.18;
    const shipping = subTotal > 500 ? 0 : 50;
    const total = subTotal + tax + shipping;

    return (
        <>
            <PageTitle title="Your Cart" />

            <Navbar />

            {
                cartItems.length === 0 ?
                    (
                        <div className="empty_cart_container">
                            <p className="empty_cart_message">Your cart is empty</p>
                            <Link to="/products" className="view_products" >View Products</Link>
                        </div>
                    )
                    :
                    (
                        <div className="cart_page">
                            <div className="cart_items">
                                <div className="cart_items_heading">Your Cart</div>
                                <div className="cart_table">
                                    <div className="cart_table_header">
                                        <div className="header_product">Product</div>
                                        <div className="header_product">Quantity</div>
                                        <div className="header_product">Item Total</div>
                                        <div className="header_product">Actions</div>
                                    </div>

                                    {/* Cart Items  */}
                                    {cartItems && cartItems.map((item) => (
                                        <CartItem item={item} key={item.product_id} />
                                    ))}

                                </div>
                            </div>

                            {/* Price Summary  */}
                            <div className="price_summary">
                                <h3 className="price_summary_heading">price Summary</h3>
                                <div className="summary_item">
                                    <p className="summary_label">Subtotal : </p>
                                    <p className="summary_value">{subTotal}/-</p>
                                </div>

                                <div className="summary_item">
                                    <p className="summary_label">Tax (18%) : </p>
                                    <p className="summary_value">{tax.toFixed(2)}/-</p>
                                </div>

                                <div className="summary_item">
                                    <p className="summary_label">Shipping : </p>
                                    <p className="summary_value">{shipping}/-</p>
                                </div>

                                <div className="summary_total">
                                    <p className="total_label">Total : </p>
                                    <p className="total_value">{total.toFixed(2)}/-</p>
                                </div>

                                <button className="checkout_btn">Proceed to Checkout</button>
                            </div>
                        </div>
                    )
            }

            <Footer />
        </>
    )
}

export default Cart
