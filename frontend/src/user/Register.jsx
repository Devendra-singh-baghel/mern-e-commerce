import React, { useEffect, useState } from 'react'
import "./Form.css"
import { Link, useNavigate } from 'react-router'
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { register, removeErrors, removeSuccess } from '../features/user/userSlice';
import Loader from '../components/loader/Loader';

function Register() {

    const [user, setUser] = useState({
        name: "",
        email: "",
        password: ""
    })

    const [avatar, setAvatar] = useState("");
    const [avatarPreview, setAvatarPreview] = useState("./images/profile.png");

    const { success, loading, error } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const registerDataChange = (e) => {
        if (e.target.name === "avatar") {
            const file = e.target.files[0];

            if (!file) return;

            setAvatar(file);
            setAvatarPreview(URL.createObjectURL(file)); // ⚡ faster
        } else {
            setUser({ ...user, [e.target.name]: e.target.value });
        }
    };

    const registerSubmit = (e) => {
        e.preventDefault();

        if (!user.name || !user.email || !user.password) {
            toast.error("All fields are required in frontend",
                { position: "top-center", autoClose: 3000 }
            );
            return;
        }

        const myForm = new FormData();
        myForm.set("name", user.name);
        myForm.set("email", user.email);
        myForm.set("password", user.password);
        myForm.set("avatar", avatar);

        console.log(myForm.entries());
        dispatch(register(myForm));
    }

    useEffect(() => {
        if (error) {
            toast.error(error, {
                position: "top-center",
                autoClose: 3000
            });
            dispatch(removeErrors());
        }
    }, [dispatch, error]);

    useEffect(() => {
        if (success) {
            toast.success("Registration Successful", {
                position: "top-center",
                autoClose: 3000
            });
            dispatch(removeSuccess());
            navigate("/login"); //in future i will be change it
        }
    }, [dispatch, success]);

    // Show loader while fetching data
    if (loading) return <Loader />;

    return (
        <div className="form_container container">
            <div className="form_content">
                <form className="form" onSubmit={registerSubmit} encType="multipart/form-data" >
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
                            src={avatarPreview}
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
