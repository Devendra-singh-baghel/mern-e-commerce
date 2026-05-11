import React, { useState } from "react";
import "./Shipping.css";

import PageTitle from "../components/page_title/PageTitle";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import CheckoutPath from "./CheckoutPath";

import { useDispatch, useSelector } from "react-redux";
import { Country, State, City } from "country-state-city";
import { toast } from "react-toastify";
import { saveShippingInfo } from "../features/cart/cartSlice";
import { useNavigate } from "react-router";

function Shipping() {
    const { shippingInfo } = useSelector((state) => state.cart);

    const [shippingAddress, setShippingAddress] = useState({
        address: shippingInfo?.address || "",
        pinCode: shippingInfo?.pinCode || "",
        phoneNumber: shippingInfo?.phoneNumber || "",
        country: shippingInfo?.country || "",
        state: shippingInfo?.state || "",
        city: shippingInfo?.city || "",
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Input handler
    const handleChange = (e) => {
        const { name, value } = e.target;

        setShippingAddress((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Country change handler
    const handleCountryChange = (e) => {
        const value = e.target.value;

        setShippingAddress((prev) => ({
            ...prev,
            country: value,
            state: "",
            city: "",
        }));
    };

    // State change handler
    const handleStateChange = (e) => {
        const value = e.target.value;

        setShippingAddress((prev) => ({
            ...prev,
            state: value,
            city: "",
        }));
    };

    // Form submit handler
    const shippingInfoSubmit = (e) => {
        e.preventDefault();

        const {
            address,
            pinCode,
            phoneNumber,
            country,
            state,
            city,
        } = shippingAddress;

        // Phone validation
        if (phoneNumber.length !== 10) {
            toast.error(
                "Invalid phone number! It should contain exactly 10 digits.",
                {
                    position: "top-center",
                    autoClose: 3000,
                }
            );
            return;
        }

        // PinCode validation
        if (pinCode.length < 5 || pinCode.length > 10) {
            toast.error("Invalid PinCode!", {
                position: "top-center",
                autoClose: 3000,
            });
            return;
        }

        // Empty field validation
        if (
            !address ||
            !pinCode ||
            !phoneNumber ||
            !country ||
            !state ||
            !city
        ) {
            toast.error("Please fill all shipping details.", {
                position: "top-center",
                autoClose: 3000,
            });
            return;
        }

        dispatch(saveShippingInfo(shippingAddress));

        navigate("/order/confirm");
    };

    return (
        <>
            <PageTitle title="Shipping Info" />

            <Navbar />

            <CheckoutPath activePath={0} />

            <div className="shipping_form_container">
                <h1 className="shipping_form_header">
                    Shipping Details
                </h1>

                <form
                    className="shipping_form"
                    onSubmit={shippingInfoSubmit}
                >
                    {/* First Section */}
                    <div className="shipping_section">

                        {/* Address */}
                        <div className="shipping_form_group">
                            <label htmlFor="address">Address</label>

                            <input
                                type="text"
                                name="address"
                                id="address"
                                className="address"
                                placeholder="Enter your address"
                                value={shippingAddress.address}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* PinCode */}
                        <div className="shipping_form_group">
                            <label htmlFor="pinCode">PinCode</label>

                            <input
                                type="text"
                                name="pinCode"
                                id="pinCode"
                                className="pinCode"
                                placeholder="Enter your pinCode"
                                value={shippingAddress.pinCode}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Phone Number */}
                        <div className="shipping_form_group">
                            <label htmlFor="phoneNumber">Phone Number</label>

                            <input
                                type="tel"
                                name="phoneNumber"
                                id="phoneNumber"
                                className="phoneNumber"
                                placeholder="Enter your phone number"
                                value={shippingAddress.phoneNumber}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Second Section */}
                    <div className="shipping_section">

                        {/* Country */}
                        <div className="shipping_form_group">
                            <label htmlFor="country">Country</label>

                            <select
                                name="country"
                                id="country"
                                value={shippingAddress.country}
                                onChange={handleCountryChange}
                                required
                            >
                                <option value="">Select a country</option>

                                {Country.getAllCountries().map((item) => (
                                    <option
                                        key={item.isoCode}
                                        value={item.isoCode}
                                    >
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* State */}
                        {shippingAddress.country && (
                            <div className="shipping_form_group">
                                <label htmlFor="state">State</label>

                                <select
                                    name="state"
                                    id="state"
                                    value={shippingAddress.state}
                                    onChange={handleStateChange}
                                    required
                                >
                                    <option value="">Select a state</option>

                                    {State.getStatesOfCountry(
                                        shippingAddress.country
                                    ).map((item) => (
                                        <option
                                            key={item.isoCode}
                                            value={item.isoCode}
                                        >
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* City */}
                        {shippingAddress.state && (
                            <div className="shipping_form_group">
                                <label htmlFor="city">City</label>

                                <select
                                    name="city"
                                    id="city"
                                    value={shippingAddress.city}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select a city</option>

                                    {City.getCitiesOfState(
                                        shippingAddress.country,
                                        shippingAddress.state
                                    ).map((item) => (
                                        <option
                                            key={item.name}
                                            value={item.name}
                                        >
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    <button
                        className="shipping_submit_btn"
                    >
                        Continue
                    </button>
                </form>
            </div>

            <Footer />
        </>
    );
}

export default Shipping;