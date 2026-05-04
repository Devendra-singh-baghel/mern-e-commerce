import React, { useEffect, useState } from 'react'
import "./Form.css"
import Footer from '../components/footer/Footer';
import PageTitle from '../components/page_title/PageTitle';
import Navbar from '../components/navbar/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword, removeErrors, removeSuccess } from '../features/user/userSlice';
import Loader from '../components/loader/Loader';
import { toast } from 'react-toastify';

function ForgotPassword() {
    const [email, setEmail] = useState("");

    const { loading, error, success, message } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const forgotPasswordEmail = (e) => {
        e.preventDefault();

        const myForm = new FormData();
        myForm.set("email", email);
        dispatch(forgotPassword(myForm))
        setEmail("");
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
            toast.success(message, {
                position: "top-center",
                autoClose: 3000
            });
            dispatch(removeSuccess());
        }
    }, [dispatch, success]);

    if (loading) return <Loader />;

    return (
        <>
            <PageTitle title="Forgot Password" />
            <Navbar />
            <div className="container forgot_container">
                <div className="form_content email_group">
                    <form
                        className="form"
                        onSubmit={forgotPasswordEmail}
                    >
                        <h2>Forgot Password</h2>

                        <div className="input_group">
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your registered email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <button className="auth_btn">Send</button>
                    </form>
                </div>
            </div>

            <Footer />
        </>
    )
}

export default ForgotPassword
