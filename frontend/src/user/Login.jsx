import React, { useEffect, useState } from 'react'
import "./Form.css"
import { Link, useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux';
import { login, removeErrors, removeSuccess } from '../features/user/userSlice';
import Loader from '../components/loader/Loader';
import { toast } from 'react-toastify';

function Login() {

    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    const { success, loading, error, isAuthenticated } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const loginSubmit = (e) => {
        e.preventDefault();

        if (!loginEmail || !loginPassword) {
            toast.error("All fields are required",
                { position: "top-center", autoClose: 3000 }
            );
            return;
        }

        dispatch(login({ email: loginEmail, password: loginPassword }))
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
        if (isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (success) {
            toast.success("Login Successful", {
                position: "top-center",
                autoClose: 3000
            });
            dispatch(removeSuccess());
        }
    }, [dispatch, success]);


    // Show loader while fetching data
    if (loading) return <Loader />;

    return (
        <div className="form_container container">
            <div className="form_content">
                <form className="form" onSubmit={loginSubmit} >
                    <h2>Sign Up</h2>

                    <div className="input_group">
                        <input
                            type="email"
                            placeholder="Email"
                            name="email"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                        />
                    </div>

                    <div className="input_group">
                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                        />
                    </div>

                    <button className="auth_btn">Sign In</button>

                    <p className="form_links">
                        Forgot your password?
                        <Link to="/password/forgot"> Reset here</Link>
                    </p>

                    <p className="form_links">
                        Don't have an account?
                        <Link to="/register"> Sign up here</Link>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default Login
