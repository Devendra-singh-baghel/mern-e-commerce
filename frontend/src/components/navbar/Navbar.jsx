import React, { useState } from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from 'react-redux'
import { Search, ShoppingCart, PersonAdd, Close, Menu } from "@mui/icons-material"

function Navbar() {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const toggleSearch = () => setIsSearchOpen(!isSearchOpen);
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const { isAuthenticated } = useSelector((state) => state.user);
    const { cartItems } = useSelector((state) => state.cart);

    const navigate = useNavigate();

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?keyword=${encodeURIComponent(searchQuery.trim())}`)
        } else {
            navigate(`/products`)
        }

        setSearchQuery("");
    }

    return (
        <nav className="navbar">
            <div className="navbar_container">
                <div className="navbar_logo">
                    <Link to="/" onClick={() => setIsMenuOpen(false)}>NexCart</Link>
                </div>

                <div className={`navbar_links ${isMenuOpen ? "active" : ""}`}>
                    <ul>
                        <li onClick={() => setIsMenuOpen(false)}>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/products">Products</Link>
                        </li>
                        <li>
                            <Link to="/about">About Us</Link>
                        </li>
                        <li>
                            <Link to="/contact">Contact Us</Link>
                        </li>
                    </ul>
                </div>

                <div className="navbar_icons">
                    <div className="search_container">
                        <form
                            className={`search_form ${isSearchOpen ? "active" : ""}`}
                            onSubmit={handleSearchSubmit}
                        >
                            <input
                                type="text"
                                className="search_input"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />

                            <button
                                type="button"
                                className="search_icon"
                                onClick={toggleSearch}
                            >
                                <Search focusable="false" />
                            </button>
                        </form>
                    </div>

                    <div className="cart_container">
                        <Link to="/cart">
                            <ShoppingCart className="icon" />
                            <span className="cart_badge">{cartItems.length}</span>
                        </Link>
                    </div>

                    {!isAuthenticated && <Link to="/register" className="register_link">
                        <PersonAdd className="icon" />
                    </Link>}

                    <div
                        className="navbar_hamburger"
                        onClick={toggleMenu}
                    >
                        {isMenuOpen ? <Close className="icon" /> : <Menu className="icon" />}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;
