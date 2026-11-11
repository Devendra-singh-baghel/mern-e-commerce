import { useEffect } from 'react'
import "./MyOrders.css";
import PageTitle from '../components/page_title/PageTitle'
import Navbar from '../components/navbar/Navbar'
import { LaunchOutlined } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux';
import { getAllMyOrders, removeErrors } from '../features/order/orderSlice';
import Loader from '../components/loader/Loader';
import { Link } from 'react-router';
import { toast } from 'react-toastify';

function MyOrders() {
    const { loading, error, orders } = useSelector((state) => state.order);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllMyOrders());
        if (error) {
            toast.error(error.message, {
                position: "top-center",
                autoClose: 3000
            });
            dispatch(removeErrors());
        }
    }, [dispatch]);

    if (loading) return <Loader />;

    return (
        <>
            <PageTitle title="My Orders" />
            <Navbar />

            {orders && orders.length > 0 ? (<div className="my_orders_container">
                <h1>My Orders</h1>
                <div className="table_responsive">
                    <table className="orders_table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Items Count</th>
                                <th>Status</th>
                                <th>Total Price</th>
                                <th>View Order</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders && orders.map((order) => (
                                <tr key={order._id}>
                                    <td>{order._id}</td>
                                    <td>{order.orderItems.length}</td>
                                    <td>{order.orderStatus}</td>
                                    <td>${order.totalPrice.toFixed(2)}</td>
                                    <td>
                                        <Link to={`/orders/${order._id}`}>
                                            <LaunchOutlined />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>) : (
                <div className="no_orders">
                    <p className="no_order_message">No orders found</p>
                </div>
            )}
        </>
    )
}

export default MyOrders
