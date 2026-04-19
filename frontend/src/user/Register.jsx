import React, { useState } from 'react'
import "./Register.css"
import { Link } from 'react-router'
import { toast } from 'react-toastify';

function Register() {

    const [user, setUser] = useState({
        name: "",
        email: "",
        password: ""
    })

    const [avatar, setAvatar] = useState("");
    // const [avatarPreview, setAvatarPreview] = useState("./images/profile.png");

    const registerDataChange = (e) => {
        if (e.target.name === "avatar") {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    // setAvatarPreview(reader.result)
                    setAvatar(reader.result)
                }
            }
            reader.readAsDataURL(e.target.files[0]);
        } else {
            setUser({ ...user, [e.target.name]: e.target.value });
        }
    }

    const registerSubmit = (e) => {
        e.preventDefault();

        if (!name || !email || !password) {
            toast.error("All fields are required",
                { position: "top-center", autoClose: 3000 }
            );
            return;
        }

        const myForm = new FormData();
        myForm.set("name", name);
        myForm.set("email", email);
        myForm.set("password", password);
        myForm.set("avatar", avatar);

        console.log(myForm.entries());

    }

    return (
        <div className="form_container container">
            <div className="form_content">
                <form className="form" onSubmit={registerSubmit}>
                    <h2>Sign Up</h2>

                    <div className="input_group">
                        <input
                            type="text"
                            placeholder="Username"
                            name="name"
                            value={user.name}
                            onChange={registerDataChange}
                        />
                    </div>

                    <div className="input_group">
                        <input
                            type="email"
                            placeholder="Email"
                            name="email"
                            value={user.email}
                            onChange={registerDataChange}
                        />
                    </div>

                    <div className="input_group">
                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            value={user.password}
                            onChange={registerDataChange}
                        />
                    </div>

                    <div className="input_group avatar_group">
                        <input
                            type="file"
                            name="avatar"
                            className="file_input"
                            accept="image/"
                            onChange={registerDataChange}
                        />

                        <img
                            src={`${avatar ? avatar : "./images/profile.png"}`}
                            alt="Avatar Preview"
                            className="avatar"
                        />
                    </div>

                    <button className="auth_btn">Sign Up</button>
                    <p className="form_links">
                        Already have an account?
                        <Link to="/login"> Sign in here</Link>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default Register
