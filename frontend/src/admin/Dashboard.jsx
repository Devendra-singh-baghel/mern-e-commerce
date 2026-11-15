import React from 'react'
import "./Dashboard.css"
import Navbar from '../components/navbar/Navbar'
import PageTitle from '../components/page_title/PageTitle'
import Footer from '../components/footer/Footer'
import { AddBox, AttachMoney, CheckCircle, Dashboard as DashboardIcon, Error, Instagram, Inventory, LinkedIn, People, ShoppingCart, Star, YouTube } from '@mui/icons-material';
import { Link } from 'react-router'

function Dashboard() {

    return (
        <>
            <PageTitle title="Admin Dashboard" />
            <Navbar />

            <div className="dashboard_container">
                <div className="sidebar">
                    <div className="logo">
                        <DashboardIcon className="logo_icon" />
                        Admin Dashboard
                    </div>

                    <nav className="nav_menu">
                        <div className="nav_section">
                            <h3>Products</h3>
                            <Link to="/admin/products">
                                <Inventory className="nav_icon" /> All Products
                            </Link>

                            <Link to="/admin/products/create">
                                <AddBox className="nav_icon" /> Create Product
                            </Link>
                        </div>

                        <div className="nav_section">
                            <h3>Users</h3>
                            <Link to="/admin/users">
                                <People className="nav_icon" /> All Users
                            </Link>
                        </div>

                        <div className="nav_section">
                            <h3>Orders</h3>
                            <Link to="/admin/orders">
                                <ShoppingCart className="nav_icon" /> All Orders
                            </Link>
                        </div>

                        <div className="nav_section">
                            <h3>Reviews</h3>
                            <Link to="/admin/reviews">
                                <Star className="nav_icon" /> All Reviews
                            </Link>
                        </div>
                    </nav>

                </div>

                {/* Main content area */}
                <div className="main_content">
                    <div className="stats_grid">
                        <div className="stat_box">
                            <Inventory className="icon" />
                            <h3>Total Products</h3>
                            <p>4</p>
                        </div>

                        <div className="stat_box">
                            <People className="icon" />
                            <h3>Total Users</h3>
                            <p>10</p>
                        </div>

                        <div className="stat_box">
                            <ShoppingCart className="icon" />
                            <h3>Total Orders</h3>
                            <p>5</p>
                        </div>

                        <div className="stat_box">
                            <Star className="icon" />
                            <h3>Total Reviews</h3>
                            <p>20</p>
                        </div>

                        <div className="stat_box">
                            <AttachMoney className="icon" />
                            <h3>Total Revenue</h3>
                            <p>$1,000</p>
                        </div>

                        <div className="stat_box">
                            <Error className="icon" />
                            <h3>Out Of Stock</h3>
                            <p>2</p>
                        </div>

                        <div className="stat_box">
                            <CheckCircle className="icon" />
                            <h3>In Stock</h3>
                            <p>2</p>
                        </div>
                    </div>

                    <div className="social_stats">
                        <div className="social_box instagram">
                            <Instagram />
                            <h3>Instagram</h3>
                            <p>123K Followers</p>
                            <p>12 Posts</p>
                        </div>
                        <div className="social_box linkedin">
                            <LinkedIn />
                            <h3>LinkedIn</h3>
                            <p>123K Connections</p>
                            <p>12 Posts</p>
                        </div>
                        <div className="social_box youtube">
                            <YouTube />
                            <h3>YouTube</h3>
                            <p>123K Subscribers</p>
                            <p>12 Videos</p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    )
}

export default Dashboard
