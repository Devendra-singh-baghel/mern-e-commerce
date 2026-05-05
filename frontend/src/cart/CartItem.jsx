import React, { useEffect, useState } from 'react'
import "./Cart.css";
import { toast } from 'react-toastify';
import { addItemsToCart, removeErrors, removeItemFromCart, removeMessage, removeSuccess } from '../features/cart/cartSlice';
import { useDispatch, useSelector } from 'react-redux';

function CartItem({ item }) {
    const [quantity, setQuantity] = useState(item.quantity);
    const { success, loading, error, message, cartItems } = useSelector((state) => state.cart);

    const dispatch = useDispatch();

    const decreaseQuantity = () => {
        if (quantity <= 1) {
            toast.error("Quantity can not be less than 1 !", { position: "top-center", autoClose: 3000 });
            dispatch(removeErrors());
            return;
        }
        setQuantity((qty) => qty - 1)
    }

    const increaseQuantity = () => {
        if (item.stock <= quantity) {
            toast.error("Cannot exceed available stock!", { position: "top-center", autoClose: 3000 });
            dispatch(removeErrors());
            return;
        }
        setQuantity((qty) => qty + 1)
    }


    useEffect(() => {
        if (quantity !== item.quantity) {
            const timeout = setTimeout(() => {
                dispatch(addItemsToCart({
                    id: item.product_id,
                    quantity
                }));
            }, 500); // debounce

            return () => clearTimeout(timeout);
        }
    }, [quantity]);

    const handleRemove = () => {
        if (loading) return;

        dispatch(removeItemFromCart(item.product_id));

        toast.success("Item removed successfully!", {
            position: "top-center",
            autoClose: 3000
        });
    }

    useEffect(() => {
        if (error) {
            toast.error(error.message, {
                position: "top-center",
                autoClose: 3000
            });
            dispatch(removeErrors());
        }
    }, [dispatch, error])


    return (
        <div className="cart_item">
            <div className="item_info">
                <img src={item.image} alt={item.name} className="item_image" />

                <div className="item_details">
                    <h3 className="item_name">{item.name}</h3>
                    <p className="item_price"><strong>Price: </strong> {item.price.toFixed(2)}/-</p>
                    <p className="item_quantity"><strong>Quantity: </strong>{item.quantity}</p>
                </div>
            </div>

            <div className="quantity_controls">
                <button
                    className="quantity_button decrease_btn"
                    onClick={decreaseQuantity}
                    disabled={loading}
                >-</button>

                <input
                    type="number"
                    value={quantity}
                    className="quantity_input"
                    readOnly
                    min="1"
                />

                <button
                    className="quantity_button increase_btn"
                    onClick={increaseQuantity}
                    disabled={loading}
                >+</button>
            </div>

            <div className="item_total">
                <span className="item_total_price">{(item.price * item.quantity).toFixed(2)}/-</span>
            </div>

            <div className="item_actions">
                <button
                    className="remove_item_btn"
                    disabled={loading}
                    onClick={handleRemove}
                >Remove</button>
            </div>
        </div>
    )
}

export default CartItem
