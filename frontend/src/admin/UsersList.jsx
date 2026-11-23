import React, { useEffect } from 'react'
import "./UsersList.css"
import Navbar from '../components/navbar/Navbar'
import PageTitle from '../components/page_title/PageTitle'
import Footer from '../components/footer/Footer'
import { Link } from 'react-router'
import { Delete, Edit } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { deleteUser, getAllUsers, removeError, removeUserDeleted } from '../features/admin/adminSlice'
import { toast } from 'react-toastify'

function UsersList() {
    const { users, loading, error, userDeleted, deletingUserId } = useSelector(state => state.admin);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllUsers());
    }, [dispatch]);

    const deleteUserHandler = (id) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this user?");
        if (isConfirmed) {
            dispatch(deleteUser(id));
        }
    };

    useEffect(() => {
        if (userDeleted) {
            toast.success("User Deleted Successfully");
            dispatch(removeUserDeleted());
        }
    }, [dispatch, userDeleted]);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(removeError());
        }
    }, [dispatch, error]);


    return (
        <>
            <PageTitle title="All Users - Admin" />
            <Navbar />

            <div className="users_list_container">
                <h1 className="users_list_title">All Users</h1>
                <div className="users_list_table_container">
                    {users && users.length > 0 ? (
                        <table className="users_list_table">
                            <thead>
                                <tr>
                                    <th>Sl No.</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Actions</th>
                                    <th>Created At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, index) => (
                                    <tr key={user._id}>
                                        <td>{index + 1}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <span className={user.role === "admin" ? "role_admin" : "role_user"}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td>{user.createdAt}</td>
                                        <td>
                                            <Link
                                                to={`/admin/user/${user._id}`}
                                                className="action_icon edit_icon"
                                            >
                                                <Edit />
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => deleteUserHandler(user._id)}
                                                className="action_icon delete_icon"
                                                disabled={deletingUserId === user._id}
                                            >
                                                <Delete />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="loading_message">No users found.</p>
                    )}
                </div>
            </div>

            <Footer />
        </>
    )
}

export default UsersList
