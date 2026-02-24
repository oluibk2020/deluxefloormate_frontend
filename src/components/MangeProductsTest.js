import { useContext, useState, useEffect, useCallback } from "react";
import { storeContext } from "../context/storeContext";
import { Link } from "react-router-dom";
import Spinner from "./Spinner";
import { toast } from "react-toastify";
import FilterForm from "./FilterForm";
function ManageProducts() {
  const [title, setTitle] = useState("");
  const [cost, setCost] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [productId, setProductId] = useState(null);

  // ✅ NEW: Filters state
  const [filters, setFilters] = useState({
    categoryId: "",
    filterPriceFrom: "",
    filterPriceTo: "",
    filterProductName: "",
  });

  const {
    API_URL,
    storeList, // This is your array of all products
    token,
    queryProduct, // This function should ideally fetch ALL products without a query for initial load
    isLoading,
    setIsLoading,
    totalProducts,
    currentPage,
    totalPages,
    handlePageChange,
    categoryList,
  } = useContext(storeContext);

  const {
    categoryId: filterCategoryId,
    filterPriceFrom,
    filterPriceTo,
    filterProductName,
  } = filters;

  // ✅ Fetch products when page changes (respect filters)
  useEffect(() => {
    queryProduct(
      filterCategoryId,
      filterPriceTo,
      filterPriceFrom,
      filterProductName,
    );
  }, [currentPage]);

  // ✅ Search handler
  function handleSearch() {
    handlePageChange(1);
    queryProduct(
      filterCategoryId,
      filterPriceTo,
      filterPriceFrom,
      filterProductName,
    );
  }

  // ✅ Reset handler
  function handleReset() {
    const emptyFilters = {
      categoryId: "",
      filterPriceFrom: "",
      filterPriceTo: "",
      filterProductName: "",
    };

    setFilters(emptyFilters);
    handlePageChange(1);
    queryProduct();
  }

  // Fetch all products on component mount (if not already fetched)
  useEffect(() => {
    queryProduct(
      filterCategoryId,
      filterPriceTo,
      filterPriceFrom,
      filterProductName,
    );
  }, [currentPage]);

  const updateProductHandler = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/product/update/${productId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title,
          description: description,
          price: Number(price),
          quantity: Number(quantity),
          cost: Number(cost),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        const error = data.message;

        if (typeof error === "string") {
          toast.error(error);
          setIsLoading(false);
          return;
        }

        error.forEach((error) => {
          toast.error(error);
        });
        setIsLoading(false);
        return;
      }

      toast.success("Product updated successfully");
      await queryProduct(); // Refresh the product list after update
      clearForm();
      setEditMode(false);
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("An error occurred while updating the product.");
    } finally {
      setIsLoading(false);
    }
  }, [
    API_URL,
    productId,
    title,
    description,
    price,
    categoryId,
    quantity,
    token,
    queryProduct,
    setIsLoading,
  ]);

  const clearForm = useCallback(() => {
    setTitle("");
    setDescription("");
    setPrice("");
    setCategoryId("");
    setQuantity("");
    setCost("");
  }, []);

  const deleteProductHandler = useCallback(
    async (id) => {
      if (!window.confirm("Are you sure you want to delete this product?")) {
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/product/delete/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (!response.ok) {
          const error = data.message;

          if (typeof error === "string") {
            toast.error(error);
            setIsLoading(false);
            return;
          }

          error.forEach((error) => {
            toast.error(error);
          });
          setIsLoading(false);
          return;
        }

        toast.success("Product deleted successfully");
        await queryProduct(); // Refresh the product list after deletion
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("An error occurred while deleting the product.");
      } finally {
        setIsLoading(false);
      }
    },
    [API_URL, token, filters],
  );

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      {/* Top action bar: Upload Product & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full sm:w-1/2 lg:w-1/3">
          <FilterForm
            filters={filters}
            setFilters={setFilters}
            onSearch={handleSearch}
            onReset={handleReset}
            categoryList={categoryList}
          />
        </div>
        {/* Upload products */}

        <Link
          to="/admin/product-upload"
          className="w-full sm:w-auto text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow-lg transition duration-300 ease-in-out"
        >
          ➕ Upload New Product
        </Link>
      </div>

      {editMode && (
        <div className="bg-white shadow-xl rounded-lg p-6 mb-8 w-full lg:w-3/4 xl:w-1/2 mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
            Update Product 📝
          </h2>
          <form
            id="updateProductForm"
            onSubmit={(e) => {
              e.preventDefault();
              updateProductHandler();
            }}
            className="space-y-5"
          >
            <div>
              <label
                className="block text-gray-700 text-sm font-semibold mb-2"
                htmlFor="title"
              >
                Title
              </label>
              <input
                className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
                id="title"
                type="text"
                placeholder="Enter product title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label
                className="block text-gray-700 text-sm font-semibold mb-2"
                htmlFor="price"
              >
                Selling Price
              </label>
              <input
                className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
                id="price"
                type="number"
                placeholder="Enter price"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div>
              <label
                className="block text-gray-700 text-sm font-semibold mb-2"
                htmlFor="costPrice"
              >
                Cost Price
              </label>
              <input
                className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
                id="costPrice"
                type="number"
                placeholder="Enter Cost price"
                required
                value={cost}
                onChange={(e) => setCost(e.target.value)}
              />
            </div>
            <div>
              <label
                className="block text-gray-700 text-sm font-semibold mb-2"
                htmlFor="quantity"
              >
                Quantity
              </label>
              <input
                className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
                id="quantity"
                type="number"
                placeholder="Enter Quantity"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div>
              <label
                className="block text-gray-700 text-sm font-semibold mb-2"
                htmlFor="description"
              >
                Description
              </label>
              <textarea
                className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out h-32 resize-none"
                id="description"
                placeholder="Enter product description"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            <div>
              <label
                className="block text-gray-700 text-sm font-semibold mb-2"
                htmlFor="category"
              >
                Category
              </label>
              <select
                className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
                id="category"
                required
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">Choose a category</option>
                {categoryList.length > 0 &&
                  categoryList.map((item) => {
                    return (
                      <option key={item.id} value={item.id}>
                        {item.title}
                      </option>
                    );
                  })}
              </select>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
              <button
                className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transform transition duration-300 ease-in-out hover:scale-105"
                type="submit"
              >
                Update Product
              </button>
              <button
                className="w-full sm:w-auto bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transform transition duration-300 ease-in-out hover:scale-105"
                type="button"
                onClick={() => {
                  setEditMode(false);
                  clearForm();
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white shadow-xl rounded-lg overflow-hidden mt-10">
        <h2 className="text-3xl font-extrabold text-gray-800 p-6 text-center border-b border-gray-200">
          Product Catalog 📋
        </h2>
        <h3 className="text-2xl font-bold text-gray-800 p-6 text-center">
          Total Products: {totalProducts}
        </h3>
        <div className="mt-8">
          <p className="text-sm text-gray-500">
            Showing <span> {currentPage} </span> of {totalPages} pages
          </p>
        </div>
        <div className="overflow-x-auto">
          {storeList.length === 0 ? (
            <p className="text-center text-gray-600 py-8 text-lg">
              "No products available to manage."
            </p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Title
                  </th>
                  <th
                    scope="col"
                    className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Image
                  </th>
                  <th
                    scope="col"
                    className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Cost Price
                  </th>
                  <th
                    scope="col"
                    className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Selling Price
                  </th>
                  <th
                    scope="col"
                    className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {storeList.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6 text-sm font-medium text-gray-900">
                      {product.title}
                    </td>
                    <td className="py-4 px-6">
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="h-16 w-16 object-cover rounded-md shadow-sm"
                      />
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-700">
                      ₦{Number(product.cost).toLocaleString()} NGN
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-700">
                      ₦{Number(product.price).toLocaleString()} NGN
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                        <Link
                          to={`/admin/product/${product.id}`}
                          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => {
                            setEditMode(true);
                            setProductId(product.id);
                            setTitle(product.title);
                            setDescription(product.description);
                            setPrice(product.price);
                            setCategoryId(product.categoryId);
                            setQuantity(product.quantity);
                            setCost(product.cost);

                            //navigate to the update form
                            document
                              .getElementById("updateProductForm")
                              .scrollIntoView({ behavior: "smooth" });
                          }}
                          type="button"
                          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-gray-800 bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-300 transition duration-150 ease-in-out"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            deleteProductHandler(product.id);
                          }}
                          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <nav className="inline-flex items-center gap-2 rounded-full bg-white px-2 py-2 shadow-sm ring-1 ring-gray-100">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="inline-flex h-10 w-24 items-center justify-center rounded-full text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 hover:bg-gray-50 hover:text-blue-600 text-gray-600"
              >
                &larr; Previous
              </button>

              <div className="flex items-center justify-center px-4 text-sm font-medium text-gray-700 border-x border-gray-100">
                Page {currentPage} of {totalPages}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="inline-flex h-10 w-24 items-center justify-center rounded-full text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 hover:bg-gray-50 hover:text-blue-600 text-gray-600"
              >
                Next &rarr;
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}
export default ManageProducts;
