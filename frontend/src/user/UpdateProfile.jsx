import React, { useEffect, useState } from 'react'
import "./Form.css"
import Navbar from '../components/navbar/Navbar'
import Footer from '../components/footer/Footer'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { removeErrors, removeSuccess, updateProfile } from '../features/user/userSlice';

function UpdateProfile() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState("/images/profile.png");

    const { user, error, success, message, loading } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const profileImageUpdate = (e) => {
        try {
            const file = e.target.files[0];
            if (!file) return;

            if (!file.type.startsWith("image/")) {
                toast.error("Only image files are allowed");
                return;
            }

            if (file.size > 2 * 1024 * 1024) {
                toast.error("Image must be less than 2MB");
                return;
            }

            setAvatar(file);
            setAvatarPreview(URL.createObjectURL(file));

        } catch (err) {
            toast.error("Error processing image");
        }
    };

    useEffect(() => {
        return () => {
            if (avatarPreview && avatarPreview.startsWith("blob:")) {
                URL.revokeObjectURL(avatarPreview);
            }
        };
    }, [avatarPreview]);

    const updateSubmit = (e) => {
        e.preventDefault();
        const myForm = new FormData();
        myForm.set("name", name);
        myForm.set("email", email);
        myForm.set("avatar", avatar);

        dispatch(updateProfile(myForm));
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

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setAvatarPreview(user.avatar.url || "./images/profile.png");
        }
    }, [user])

    if (loading) return <Loader />;

    return (
        <>
            <Navbar />

            <div className="container update_container">
                <div className="form_content">
                    <form className="form" onSubmit={updateSubmit} encType="multipart/form-data">
                        <h2>Update Profile</h2>
                        <div className="input_group avatar_group">
                            <input
                                type="file"
                                name="avatar"
                                accept="image/"
                                className="file_input"
                                onChange={profileImageUpdate}
                            />

                            <img
                                src={avatarPreview}
                                alt="User Profile"
                                className="avatar"
                            />

                        </div>

                        <div className="input_group">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="input_group">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <button className="auth_btn">Update</button>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default UpdateProfile
