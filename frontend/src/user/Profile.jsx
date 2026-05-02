import React, { useEffect } from 'react'
import "./Profile.css"
import { Link, useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import Loader from '../components/loader/Loader'
import PageTitle from '../components/page_title/PageTitle'


function Profile() {

    const { loading, isAuthenticated, user } = useSelector((state) => state.user)

    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated === false) {
            navigate("/login");
        }
    }, [isAuthenticated])

    
    if (loading) return <Loader />;

    return (
        <div className="profile_container">
            <PageTitle title={`${user.name} Profile`} />
            <div className="profile_image">
                <h1 className="profile_heading">My Profile</h1>

                <img src={user.avatar.url ? user.avatar.url : "./images/profile.png"} alt="user profile" className="profile_image" />

                <Link to="/profile/update">Edit Profile</Link>
            </div>

            <div className="profile_details">
                <div className="profile_detail">
                    <h2>Username:</h2>
                    <p>{user.name}</p>
                </div>
                <div className="profile_detail">
                    <h2>Email:</h2>
                    <p>{user.email}</p>
                </div>
                <div className="profile_detail">
                    <h2>Joined On:</h2>
                    <p>{String(user.createdAt).substring(0, 10)}</p>
                </div>
            </div>

            <div className="profile_buttons">
                <Link to="/orders/me">My Orders</Link>
                <Link to="/password/update">Change Password</Link>
            </div>
        </div>
    )
}

export default Profile
