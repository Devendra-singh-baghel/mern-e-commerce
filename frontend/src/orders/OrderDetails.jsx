import React, { useEffect } from 'react'
import "./OrderDetails.css"
import PageTitle from '../components/page_title/PageTitle'
import Navbar from '../components/navbar/Navbar'
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderDetails, removeErrors } from '../features/order/orderSlice';
import Loader from '../components/loader/Loader';
import { toast } from 'react-toastify';

function OrderDetails() {
    const { id } = useParams();
    const { loading, error, order } = useSelector((state) => state.order);
    const dispatch = useDispatch();

    useEffect(() => {
        if (id) {
            dispatch(getOrderDetails(id));
        }
        if (error) {
            toast.error(error, {
                position: "top-center",
                autoClose: 3000
            });
            dispatch(removeErrors());
        }
    }, [dispatch, id, error]);

    const {
        shippingInfo = {},
        orderItems = [],
        paymentInfo = {},
        orderStatus,
        totalPrice = 0,
        taxPrice = 0,
        shippingPrice = 0,
        itemsPrice = 0,
        paidAt,
    } = order || {};

    const paymentStatus = paymentInfo?.status === 'completed' ? 'Paid' : 'Not Paid';
    const finalOrderStatus = paymentStatus === 'Not Paid' ? 'Cancelled' : orderStatus;

    const orderStatusClass = finalOrderStatus === 'Delivered' ? 'status_tag delivered' : `status_tag ${finalOrderStatus?.toLowerCase() || ''}`;
    const paymentStatusClass = `pay_tag ${paymentStatus === 'Paid' ? 'paid' : 'not_paid'}`;
    
    if (loading) return <Loader />;

    return (
        <>
            <PageTitle title="Order Details" />
            <Navbar />

            <div className="order_box">
                {/* Order Items table  */}
                <div className="table_block">
                    <h2 className="table_title">Order Items</h2>
                    <table className="table_main">
                        <thead>
                            <tr className="table_head">
                                <th className="head_cell">Image</th>
                                <th className="head_cell">Name</th>
                                <th className="head_cell">Quantity</th>
                                <th className="head_cell">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Order items will be populated here */}
                            {orderItems.map((item) => (
                                <tr className="table_row" key={item.product}>
                                    <td className="table_cell">
                                        <img src={item.image} alt={item.name} className="item_img" />
                                    </td>
                                    <td className="table_cell">{item.name}</td>
                                    <td className="table_cell">{item.quantity}</td>
                                    <td className="table_cell">₹{item.price}/-</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Shipping Info */}
                <div className="table_block">
                    <h2 className="table_title">Shipping Info</h2>
                    <table className="table_main">
                        <tbody>
                            <tr className="table_row">
                                <th className="table_cell">Address:</th>
                                <td className="table_cell">
                                    {shippingInfo.address}, {shippingInfo.city}, {shippingInfo.state}, {shippingInfo.country}, {shippingInfo.pinCode}
                                </td>
                            </tr>
                            <tr className="table_row">
                                <th className="table_cell">Phone:</th>
                                <td className="table_cell">{shippingInfo.phoneNumber}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Order Summary */}
                <div className="table_block">
                    <h2 className="table_title">Order Summary</h2>
                    <table className="table_main">
                        <tbody>
                            <tr className="table_row">
                                <th className="table_cell">Order Status:</th>
                                <td className="table_cell">
                                    <span className={orderStatusClass}>{finalOrderStatus}</span>
                                </td>
                            </tr>
                            <tr className="table_row">
                                <th className="table_cell">Payment Status:</th>
                                <td className="table_cell">
                                    <span className={paymentStatusClass}>{paymentStatus}</span>
                                </td>
                            </tr>
                            {paidAt && (<tr className="table_row">
                                <th className="table_cell">Paid At:</th>
                                <td className="table_cell">{paidAt}</td>
                            </tr>)}
                            <tr className="table_row">
                                <th className="table_cell">Item Price:</th>
                                <td className="table_cell">₹{itemsPrice}/-</td>
                            </tr>
                            <tr className="table_row">
                                <th className="table_cell">Tax Price:</th>
                                <td className="table_cell">₹{taxPrice}/-</td>
                            </tr>
                            <tr className="table_row">
                                <th className="table_cell">Shipping Price:</th>
                                <td className="table_cell">₹{shippingPrice}/-</td>
                            </tr>
                            <tr className="table_row">
                                <th className="table_cell">Total Price:</th>
                                <td className="table_cell">₹{totalPrice}/-</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default OrderDetails
