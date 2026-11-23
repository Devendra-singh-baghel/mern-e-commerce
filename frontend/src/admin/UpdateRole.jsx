import React, { useEffect, useState } from 'react'
import "./UpdateRole.css"
import Navbar from '../components/navbar/Navbar'
import PageTitle from '../components/page_title/PageTitle'
import Footer from '../components/footer/Footer'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'react-toastify'
import { getSingleUser, removeError, removeUserUpdated, updateUserRole } from '../features/admin/adminSlice'

function UpdateRole() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { singleUser, loading, error, userUpdated } = useSelector((state) => state.admin);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: ""
    });

    const { name, email, role } = formData;

    // Fetch single user details if not already present in store
    useEffect(() => {
        if (!singleUser || singleUser._id !== id) {
            dispatch(getSingleUser(id));
        } else {
            setFormData({
                name: singleUser.name || "",
                email: singleUser.email || "",
                role: singleUser.role || ""
            });
        }
    }, [dispatch, id, singleUser]);

    // Handle form input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle user role update submission
    const updateUserRoleHandler = (e) => {
        e.preventDefault();

        if (!role) {
            toast.error("Please select a role");
            return;
        }

        dispatch(updateUserRole({ id, role }));
    };

    // Handle error notifications and redirect on successful update
    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(removeError());
        }

        if (userUpdated) {
            toast.success("User Role Updated Successfully");
            dispatch(removeUserUpdated());
            navigate("/admin/users");
        }
    }, [dispatch, error, userUpdated, navigate]);


    return (
        <>
            <PageTitle title="Update User Role - Admin" />
            <Navbar />

            <div className="page_wrapper">
                <div className="update_user_role_container">
                    <h2 className="update_user_role_title">Update User Role</h2>

                    <form className="update_user_role_form" onSubmit={updateUserRoleHandler}>
                        <div className="form_group">
                            <label>Name</label>
                            <input
                                type="text"
                                name="name"
                                value={name}
                                readOnly
                                placeholder="User Name"
                            />
                        </div>

                        <div className="form_group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={email}
                                readOnly
                                placeholder="User Email"
                            />
                        </div>

                        <div className="form_group">
                            <label>Role</label>
                            <select
                                name="role"
                                value={role}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Choose Role</option>
                                <option value="admin">admin</option>
                                <option value="user">user</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="btn"
                            disabled={loading || !role}
                        >
                            {loading ? "Updating..." : "Update Role"}
                        </button>
                    </form>
                </div>
            </div>

            <Footer />
        </>
    );
}

export default UpdateRole;
