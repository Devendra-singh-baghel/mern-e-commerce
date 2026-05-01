import React, { useEffect, useState } from 'react'
import "./Products.css"
import PageTitle from '../../components/page_title/PageTitle'
import Navbar from '../../components/navbar/Navbar'
import Footer from '../../components/footer/Footer'
import { useDispatch, useSelector } from 'react-redux'
import Product from '../../components/product/Product'
import Loader from '../../components/loader/Loader'
import { getProduct, removeErrors } from '../../features/products/productSlice'
import { useLocation, useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import NoProducts from '../../components/no_products/NoProducts'
import Pagination from '../../components/pagination/Pagination'

/*
  Products Page Component
  -----------------------
  Responsible for:
  - Fetching products from backend using Redux
  - Handling search via query params (keyword)
  - Managing pagination (sync with URL + state)
  - Displaying products or fallback UI
 */

function Products() {

    // Extracting required data from Redux store
    const { loading, error, products } = useSelector((state) => state.product);

    const dispatch = useDispatch();

    /*
       React Router hooks:
        - location: gives full object of current URL (including query params)
        - navigate: used to programmatically change URL
     */
    const location = useLocation();
    const navigate = useNavigate();

    // URLSearchParams is a browser API that extract query parameters from URL
    const searchParams = new URLSearchParams(location.search);

    // Search keyword and category (used for filtering products)
    const keyword = searchParams.get("keyword");
    const category = searchParams.get("category");

    //Extract page number from URL
    const pageFromURL = parseInt(searchParams.get("page"), 10) || 1;

    //Local state to control current page
    const [currentPage, setCurrentPage] = useState(pageFromURL);

    const categories = ["Electronic", "Furniture", "Stationery", "Fruits", "Home"]
    /*
       Sync state with URL
       --------------------
       - If user manually changes URL or uses browser navigation,
       - update the currentPage state accordingly.
     */
    useEffect(() => {
        setCurrentPage(pageFromURL);
    }, [pageFromURL]);

    /*
       Fetch products from backend
       ----------------------------
       Runs whenever:
       - keyword changes (search)
       - currentPage changes (pagination)
       - location.search changes (future filters support)
     */
    useEffect(() => {
        dispatch(getProduct({ keyword, page: currentPage, category }));
    }, [dispatch, keyword, currentPage, category, location.search]);

    /*
       Error Handling
       ---------------
       If any error occurs during API call:
       - Show toast notification
       - Clear error from Redux store to avoid repetition
     */
    useEffect(() => {
        if (error) {
            toast.error(error.message, {
                position: "top-center",
                autoClose: 3000
            });
            dispatch(removeErrors());
        }
    }, [dispatch, error]);

    /*
       Handle Page Change
       -------------------
       - Updates local state
       - Updates URL query params
       - Triggers new API call via useEffect
     */
    const handlePageChange = (page) => {

        // Prevent unnecessary state update if same page clicked
        if (page !== currentPage) {

            setCurrentPage(page);

            // Clone existing query params to preserve other filters
            const newSearchParams = new URLSearchParams(location.search);

            /*
               Clean URL:
               - Remove page param if page = 1 (default)
               - Otherwise update page value
             */
            if (page === 1) {
                newSearchParams.delete("page");
            } else {
                newSearchParams.set("page", page);
            }

            // Navigate to updated URL without page reload
            navigate(`?${newSearchParams.toString()}`);
        }
    }

    /*
       Handle Category Click
       -------------------
       - Updates URL query params
       - Triggers new API call via useEffect
     */
    const handleCategoryClick = (category) => {
        // Clone existing query params to preserve other filters
        const newSearchParams = new URLSearchParams(location.search);
        newSearchParams.set("category", category);
        newSearchParams.delete("page");
        navigate(`?${newSearchParams.toString()}`);
    }

    // Show loader while fetching data
    if (loading) return <Loader />;

    // Safety check to avoid null errors
    if (!products) return null;

    return (
        <>
            {/* Dynamic Page Title for better SEO */}
            <PageTitle title={keyword ? `${keyword} - Products` : "All Products"} />

            <Navbar />

            <div className="products-layout">

                {/* Sidebar Filter Section */}
                <div className="filter-section">
                    <h3 className="filter-heading">CATEGORIES</h3>
                    <ul>
                        {categories.map((category) => {
                            return (
                                <li
                                    key={category}
                                    onClick={() => handleCategoryClick(category)}
                                >{category}
                                </li>
                            )
                        })}
                    </ul>
                </div>

                {/* Main Products Section */}
                <div className="products-section">

                    {products.length > 0 ? (
                        <div className="products-product-container">
                            {products.map((product) => (
                                <Product product={product} key={product._id} />
                            ))}
                        </div>
                    ) : (
                        <NoProducts keyword={keyword} />
                    )}

                    {/* Pagination Component */}
                    <Pagination
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>

            <Footer />
        </>
    )
}

export default Products