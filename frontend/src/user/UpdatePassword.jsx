import React, { useEffect, useState } from 'react'
import "./Form.css";
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';
import PageTitle from '../components/page_title/PageTitle';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { removeErrors, removeSuccess, updatePassword } from '../features/user/userSlice';
import Loader from '../components/loader/Loader';
import { toast } from 'react-toastify';

function UpdatePassword() {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const { error, success, message, loading } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const updatePasswordSubmit = (e) => {
        e.preventDefault();
        const myForm = new FormData();
        myForm.set("oldPassword", oldPassword);
        myForm.set("newPassword", newPassword);
        myForm.set("confirmPassword", confirmPassword);

        dispatch(updatePassword(myForm));
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
            navigate("/profile");
        }
    }, [dispatch, success]);

    if (loading) return <Loader />;

    return (
        <>
            <Navbar />
            <PageTitle title="Password Update" />
            <div className="container update_container">
                <div className="form_content">
                    <form
                        className="form"
                        onSubmit={updatePasswordSubmit}
                    >
                        <h2>Update Password</h2>

                        <div className="input_group">
                            <input
                                type="password"
                                name="oldPassword"
                                placeholder="Old Password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                            />
                        </div>
                        <div className="input_group">
                            <input
                                type="password"
                                name="newPassword"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
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

                        <button className="auth_btn">Update Password</button>
                    </form>
                </div>
            </div>

            <Footer />
        </>
    )
}

export default UpdatePassword
