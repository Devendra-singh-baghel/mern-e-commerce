import React, { useEffect, useState } from 'react'
import "./UpdateOrder.css"
import Navbar from '../components/navbar/Navbar'
import PageTitle from '../components/page_title/PageTitle'
import Footer from '../components/footer/Footer'
import { Link, useParams } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { getOrderDetails, removeErrors } from '../features/order/orderSlice'
import { removeError, removeOrderUpdated, updateOrderStatus } from '../features/admin/adminSlice'
import Loader from '../components/loader/Loader'
import { toast } from 'react-toastify'

function UpdateOrder() {
    const { id } = useParams();
    const dispatch = useDispatch();

    const { order, loading: orderLoading, error: orderError } = useSelector((state) => state.order);
    const { loading: adminLoading, error: adminError, orderUpdated } = useSelector((state) => state.admin);

    const [status, setStatus] = useState("");

    useEffect(() => {
        if (id) {
            dispatch(getOrderDetails(id));
        }
    }, [dispatch, id]);

    const updateOrderSubmitHandler = (e) => {
        e.preventDefault();

        if (!status) {
            toast.error("Please choose a status");
            return;
        }

        dispatch(updateOrderStatus({ id, status }));
    };

    useEffect(() => {
        if (orderError) {
            toast.error(orderError);
            dispatch(removeErrors());
        }

        if (adminError) {
            toast.error(adminError);
            dispatch(removeError());
        }

        if (orderUpdated) {
            toast.success("Order Status Updated Successfully");
            dispatch(removeOrderUpdated());
            dispatch(getOrderDetails(id));
        }
    }, [dispatch, id, orderError, adminError, orderUpdated]);

    const loading = orderLoading || adminLoading;

    if (loading && !order?._id) return <Loader />;

    const {
        shippingInfo = {},
        orderItems = [],
        paymentInfo = {},
        user = {},
        totalPrice = 0,
        orderStatus,
    } = order || {};

    const address = `${shippingInfo.address || ""}, ${shippingInfo.city || ""}, ${shippingInfo.state || ""}, ${shippingInfo.pinCode || ""}, ${shippingInfo.country || ""}`;
    const isPaid = paymentInfo?.status === "completed";

    return (
        <>
            <PageTitle title="Process Order - Admin" />
            <Navbar />

            <div className="order_container">
                <h1 className="order_title">Process Order</h1>

                {/* Shipping Details */}
                <div className="order_details">
                    <h2>Shipping Details</h2>
                    <p><strong>Order ID:</strong> {order._id}</p>
                    <p><strong>Name:</strong> {user?.name || "N/A"}</p>
                    <p><strong>Phone:</strong> {shippingInfo?.phoneNumber || "N/A"}</p>
                    <p><strong>Shipping Address:</strong> {address}</p>
                    <p><strong>Total Amount:</strong> ₹{totalPrice}</p>
                    <p><strong>Order Status:</strong> {orderStatus}</p>
                    <p>
                        <strong>Payment Status:</strong>{" "}
                        <span style={{ color: isPaid ? "green" : "red", fontWeight: "600" }}>
                            {isPaid ? "PAID" : "NOT PAID"}
                        </span>
                    </p>
                </div>

                {/* Order Items */}
                <div className="order_items">
                    <h2>Order Items</h2>
                    <table className="order_table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderItems && orderItems.map((item) => (
                                <tr key={item.product_id || item._id}>
                                    <td>
                                        <img src={item.image} alt={item.name} className="order_item_image" />
                                    </td>
                                    {/* <td>
                                        <Link to={`/product/${item.product_id || item._id}`}>
                                            {item.name}
                                        </Link>
                                    </td> */}
                                    <td>{item.name}</td>
                                    <td>₹{item.price}</td>
                                    <td>{item.quantity}</td>
                                    <td>₹{item.price * item.quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Order Status & Process Form */}
                <div className="order_status">
                    <h2>Order Status</h2>
                    <p>
                        <strong>Current Status:</strong>{" "}
                        <span style={{ color: orderStatus === "Delivered" ? "green" : "red", fontWeight: "600" }}>
                            {orderStatus}
                        </span>
                    </p>

                    {orderStatus !== "Delivered" ? (
                        <form className="update_order_form" onSubmit={updateOrderSubmitHandler}>
                            <select
                                className="status_select"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="">Choose Status</option>
                                {orderStatus === "Processing" && (
                                    <option value="Shipped">Shipped</option>
                                )}
                                {orderStatus === "Shipped" && (
                                    <option value="Delivered">Delivered</option>
                                )}
                            </select>

                            <button
                                type="submit"
                                className="update_button"
                                disabled={loading || !status}
                            >
                                Process Status
                            </button>
                        </form>
                    ) : (
                        <p style={{ color: "green", fontWeight: "bold", marginTop: "10px" }}>
                            This order has already been delivered.
                        </p>
                    )}
                </div>
            </div>

            <Footer />
        </>
    );
}

export default UpdateOrder;
