import React, { useEffect, useState } from 'react'
import "./UpdateProduct.css"
import Navbar from '../components/navbar/Navbar'
import PageTitle from '../components/page_title/PageTitle'
import Footer from '../components/footer/Footer'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'react-toastify'
import { getProductDetails, removeErrors } from '../features/products/productSlice'
import { removeError, removeUpdated, updateProduct } from '../features/admin/adminSlice'

function UpdateProduct() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { product, error: productError } = useSelector((state) => state.product);
    const { loading, error: adminError, isUpdated } = useSelector((state) => state.admin);

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [stock, setStock] = useState("");
    const [images, setImages] = useState([]);
    const [oldImages, setOldImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);

    const categories = [
        "Electronic",
        "Furniture",
        "Stationery",
        "Fruits",
        "Home"
    ];

    // Load product details into state
    useEffect(() => {
        if (!product || product._id !== id) {
            dispatch(getProductDetails(id));
        } else {
            setName(product.name || "");
            setPrice(product.price || "");
            setDescription(product.description || "");
            setCategory(product.category || "");
            setStock(product.stock || "");
            setOldImages(product.image || []);
        }
    }, [dispatch, id, product]);

    // Handle new images selection
    const updateProductImagesChange = (e) => {
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
    const updateProductSubmitHandler = (e) => {
        e.preventDefault();

        const myForm = new FormData();
        myForm.set("name", name);
        myForm.set("price", price);
        myForm.set("description", description);
        myForm.set("category", category);
        myForm.set("stock", stock);

        images.forEach((image) => {
            myForm.append("image", image);
        });

        dispatch(updateProduct({ id, productData: myForm }));
    };

    // Error and success handling
    useEffect(() => {
        if (productError) {
            toast.error(productError?.message || productError);
            dispatch(removeErrors());
        }

        if (adminError) {
            toast.error(adminError);
            dispatch(removeError());
        }

        if (isUpdated) {
            toast.success("Product Updated Successfully");
            dispatch(removeUpdated());
            navigate("/admin/products");
        }
    }, [dispatch, productError, adminError, isUpdated, navigate]);

    return (
        <>
            <PageTitle title="Update Product" />
            <Navbar />

            <div className="update_product_wrapper">
                <h1 className="update_product_title">Update Product</h1>

                <form
                    className="update_product_form"
                    onSubmit={updateProductSubmitHandler}
                    encType="multipart/form-data"
                >
                    <div>
                        <label>Product Name</label>
                        <input
                            type="text"
                            placeholder="Product Name"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="update_product_input"
                        />
                    </div>

                    <div>
                        <label>Product Price</label>
                        <input
                            type="number"
                            placeholder="Price"
                            required
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="update_product_input"
                        />
                    </div>

                    <div>
                        <label>Product Description</label>
                        <textarea
                            placeholder="Product Description"
                            required
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            cols="30"
                            rows="2"
                            className="update_product_textarea"
                        ></textarea>
                    </div>

                    <div>
                        <label>Category</label>
                        <select
                            className="update_product_select"
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
                    </div>

                    <div>
                        <label>Product Stock</label>
                        <input
                            type="number"
                            placeholder="Stock"
                            required
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                            className="update_product_input"
                        />
                    </div>

                    <div className="update_product_file_wrapper">
                        <label>Product Images</label>
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={updateProductImagesChange}
                            multiple
                            className="update_product_file_input"
                        />
                    </div>

                    {oldImages && oldImages.length > 0 && (
                        <div>
                            <label>Old Images</label>
                            <div className="update_product_old_images_wrapper">
                                {oldImages.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image.url}
                                        alt="Old Product"
                                        className="update_product_old_image"
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {imagesPreview && imagesPreview.length > 0 && (
                        <div>
                            <label>New Images Preview</label>
                            <div className="update_product_preview_wrapper">
                                {imagesPreview.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image}
                                        alt="Product Preview"
                                        className="update_product_preview_image"
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            className="update_product_submit_btn"
                            disabled={loading ? true : false}
                        >
                            {loading ? "Updating..." : "Update Product"}
                        </button>
                    </div>
                </form>
            </div>

            <Footer />
        </>
    );
}

export default UpdateProduct;
