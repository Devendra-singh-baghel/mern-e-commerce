import React, { useEffect, useState } from 'react'
import "./CreateProduct.css"
import Navbar from '../components/navbar/Navbar'
import PageTitle from '../components/page_title/PageTitle'
import Footer from '../components/footer/Footer'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import { createProduct, removeError, removeSuccess } from '../features/admin/adminSlice'

function CreateProduct() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error, success } = useSelector((state) => state.admin);

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [stock, setStock] = useState("");
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);

    const categories = [
        "Electronic",
        "Furniture",
        "Stationery",
        "Fruits",
        "Home"
    ];

    // Handle image selection and previews
    const createProductImagesChange = (e) => {
        const files = Array.from(e.target.files);

        setImages(files);
        setImagesPreview([]);

        files.forEach((file) => {
            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagesPreview((old) => [...old, reader.result]);
                }
            };

            reader.readAsDataURL(file);
        });
    };

    // Submit handler
    const createProductSubmitHandler = (e) => {
        e.preventDefault();

        if (!category) {
            toast.error("Please choose a category");
            return;
        }

        if (images.length === 0) {
            toast.error("Please upload at least one image");
            return;
        }

        const myForm = new FormData();
        myForm.set("name", name);
        myForm.set("price", price);
        myForm.set("description", description);
        myForm.set("category", category);
        myForm.set("stock", stock);

        images.forEach((image) => {
            myForm.append("image", image);
        });

        dispatch(createProduct(myForm));
    };

    // Error and Success handling
    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(removeError());
        }

        if (success) {
            toast.success("Product Created Successfully");
            dispatch(removeSuccess());

            setName("");
            setPrice("");
            setDescription("");
            setCategory("");
            setStock("");
            setImages([]);
            setImagesPreview([]);

            navigate("/admin/products");
        }
    }, [dispatch, error, success, navigate]);


    return (
        <>
            <PageTitle title="Create Product" />
            <Navbar />

            <div className="create_product_container">
                <h1 className="form_title">Create Product</h1>

                <form
                    className="product_form"
                    onSubmit={createProductSubmitHandler}
                    encType="multipart/form-data"
                >
                    <input
                        type="text"
                        placeholder="Product Name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="form_input"
                    />

                    <input
                        type="number"
                        placeholder="Product Price"
                        required
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="form_input"
                    />

                    <textarea
                        placeholder="Product Description"
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        cols="30"
                        rows="2"
                        className="form_input"
                    ></textarea>

                    <select
                        className="form_select"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                        <option value="">Choose Category</option>
                        {categories.map((cate) => (
                            <option key={cate} value={cate}>
                                {cate}
                            </option>
                        ))}
                    </select>

                    <input
                        type="number"
                        placeholder="Product Stock"
                        required
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        className="form_input"
                    />

                    <div className="file_input_container">
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={createProductImagesChange}
                            multiple
                            className="form_input_file"
                            required
                        />
                    </div>

                    <div className="image_preview_container">
                        {imagesPreview.map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt="Product Preview"
                                className="image_preview"
                            />
                        ))}
                    </div>

                    <button
                        type="submit"
                        className="submit_btn"
                        disabled={loading ? true : false}
                    >
                        {loading ? "Creating..." : "Create Product"}
                    </button>
                </form>
            </div>

            <Footer />
        </>
    );
}

export default CreateProduct;
