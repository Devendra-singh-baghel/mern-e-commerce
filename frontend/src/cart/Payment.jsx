import React from 'react'
import "./Payment.css";

function Payment() {
    return (
        <>
            <PageTitle title="Shipping Info" />

            <Navbar />

            <CheckoutPath activePath={1} />
        </>
    )
}


export default Payment
