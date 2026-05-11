import React from 'react'
import "./CheckoutPath.css";
import { AccountBalance, LibraryAddCheck, LocalShipping } from '@mui/icons-material';

function CheckoutPath({ activePath }) {
    const path = [
        {
            label: "Shipping Details",
            icon: <LocalShipping />
        },
        {
            label: "Confirm Order",
            icon: <LibraryAddCheck />
        },
        {
            label: "Payment",
            icon: <AccountBalance />
        }
    ]
    return (
        <div className="checkout_path">
            {path.map((step, index) => (
                <div
                    key={index}
                    className="checkout_step"
                    active={activePath === index ? 'true' : 'false'}
                    completed={activePath >= index ? 'true' : 'false'}
                >
                    <p className="checkout_path_icon">{step.icon}</p>
                    <p className="checkout_path_label">{step.label}</p>
                </div>
            ))}
        </div>
    )
}

export default CheckoutPath
