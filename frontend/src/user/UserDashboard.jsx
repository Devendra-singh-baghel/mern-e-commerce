import React from 'react'
import "./UserDashboard.css"
import { useNavigate } from 'react-router'

function UserDashboard({ user }) {

    const navigate = useNavigate();

    const options = [
        { name: "Orders", funcName: orders },
        { name: "Account", funcName: profile },
        { name: "Logout", funcName: logout },
    ]

    if (user.role === "admin") {
        options.unshift({
            name: "Admin Dashboard", funcName: dashboard
        })
    }

    function orders() {
        navigate("/orders/user");
    };

    function profile() {
        navigate("/profile");
    };

    function logout() {
        console.log(logout);
    }

    function dashboard() {
        navigate("/admin/dashboard");
    }

    return (
        <div className="dashboard_container">
            <div className="profile_header">
                <img
                    src={user.avatar.url ? user.avatar.url : "./images/profile.png"}
                    alt="Profile Picture"
                    className="profile_avatar"
                />

                <span className="profile_name">{user.name || "User"}</span>
            </div>

            <div className="menu_options">
                {options.map((item) => (
                    <button
                        className="menu_option_btn"
                        key={item.name}
                        onClick={item.funcName}
                    >{item.name}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default UserDashboard
