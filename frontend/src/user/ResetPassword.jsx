import React, { useEffect, useState } from 'react'
import "./Form.css"
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import { removeErrors, removeSuccess, resetPassword } from '../features/user/userSlice';
import Loader from '../components/loader/Loader';
import PageTitle from '../components/page_title/PageTitle';

function ResetPassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const { error, success, message, loading } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token } = useParams();

    const resetPasswordSubmit = (e) => {
        e.preventDefault();
        const myForm = new FormData();
        myForm.set("password", password);
        myForm.set("confirmPassword", confirmPassword);

        dispatch(resetPassword({ token, formData: myForm }));
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
            navigate("/login");
        }
    }, [dispatch, success]);

    if (loading) return <Loader />;

    return (
        <>
            <PageTitle title="Reset Password" />
            
            <div className="container form_container">
                <div className="form_content">
                    <form
                        className="form"
                        onSubmit={resetPasswordSubmit}
                    >
                        <h2>Reset Password</h2>

                        <div className="input_group">
                            <input
                                type="password"
                                name="password"
                                placeholder="New Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="input_group">
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        <button className="auth_btn">Reset Password</button>
                    </form>
                </div>
            </div>

        </>
    )
}

export default ResetPassword
