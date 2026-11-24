import React, { useEffect } from 'react'
import "./OrdersList.css"
import Navbar from '../components/navbar/Navbar'
import PageTitle from '../components/page_title/PageTitle'
import Footer from '../components/footer/Footer'
import { Link } from 'react-router'
import { Delete, Edit } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { deleteOrder, getAllOrders, removeError, removeOrderDeleted } from '../features/admin/adminSlice'
import Loader from '../components/loader/Loader'
import { toast } from 'react-toastify'

function OrdersList() {
    const { orders, loading, error, orderDeleted, deletingOrderId } = useSelector(state => state.admin);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllOrders());
    }, [dispatch]);

    const deleteOrderHandler = (id) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this order?");
        if (isConfirmed) {
            dispatch(deleteOrder(id));
        }
    };

    useEffect(() => {
        if (orderDeleted) {
            toast.success("Order Deleted Successfully");
            dispatch(removeOrderDeleted());
        }
    }, [dispatch, orderDeleted]);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(removeError());
        }
    }, [dispatch, error]);

    if (loading) return <Loader />;

    return (
        <>
            <PageTitle title="All Orders - Admin" />
            <Navbar />

            <div className="orders_list_container">
                <h1 className="orders_list_title">All Orders</h1>
                <div className="orders_list_table_container">
                    {orders && orders.length > 0 ? (
                        <table className="orders_list_table">
                            <thead>
                                <tr>
                                    <th>Sl No.</th>
                                    <th>Order ID</th>
                                    <th>Status</th>
                                    <th>Items Qty</th>
                                    <th>Amount</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order, index) => (
                                    <tr key={order._id}>
                                        <td>{index + 1}</td>
                                        <td>{order._id}</td>
                                        <td>
                                            <span className={`order_status ${order.orderStatus?.toLowerCase()}`}>
                                                {order.orderStatus}
                                            </span>
                                        </td>
                                        <td>{order.orderItems?.length || 0}</td>
                                        <td>₹{order.totalPrice}</td>
                                        <td>
                                            <Link
                                                to={`/admin/order/${order._id}`}
                                                className="action_icon edit_icon"
                                            >
                                                <Edit />
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => deleteOrderHandler(order._id)}
                                                className="action_icon delete_icon"
                                                disabled={deletingOrderId === order._id}
                                            >
                                                <Delete />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="loading_message">No orders found.</p>
                    )}
                </div>
            </div>

            <Footer />
        </>
    )
}

export default OrdersList
