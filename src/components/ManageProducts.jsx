import { useContext, useState, useEffect, useMemo, useCallback } from "react";
import { storeContext } from "../context/storeContext";
import { Link } from "react-router-dom";
import Spinner from "./Spinner";
import { toast } from "react-toastify";
import { GiQuakeStomp } from "react-icons/gi"; // This icon is not used in the original component, but kept if you plan to use it.

function ManageProducts() {
  const [title, setTitle] = useState("");
  const [cost, setCost] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [productId, setProductId] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // New state for search query

  const {
    API_URL,
    storeList, // This is your array of all products
    token,
    AllProductFetcher, // This function should ideally fetch ALL products without a query for initial load
    isLoading,
    setIsLoading,
  } = useContext(storeContext);

  // Memoize filtered products to prevent unnecessary re-renders of the list
  const filteredProducts = useMemo(() => {
    if (!storeList) return []; // Handle case where storeList might be null/undefined initially

    // If search query is empty, return all products
    if (searchQuery.trim() === "") {
      return storeList;
    }

    // Filter products based on title (case-insensitive)
    return storeList.filter((product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [storeList, searchQuery]);

  // Fetch all products on component mount (if not already fetched)
  useEffect(() => {
    // You might want to add a check here if AllProductFetcher only fetches
    // products when storeList is empty or on specific conditions to avoid
    // unnecessary API calls if the data is already in context.
    // For example: if (storeList.length === 0) AllProductFetcher();
    if (!storeList || storeList.length === 0) {
      AllProductFetcher();
    }
  }, [AllProductFetcher, storeList]); // Depend on AllProductFetcher and storeList

  const updateProductHandler = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/products/update/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title,
          description: description,
          price: parseFloat(price),
          categoryId: parseInt(categoryId),
          quantity: parseInt(quantity),
          cost: parseFloat(cost),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        toast.error(data.msg || "Unable to update product, try again later");
        console.error("Update failed:", data);
        return;
      }

      toast.success("Product updated successfully");
      await AllProductFetcher(); // Refresh the product list after update
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
    AllProductFetcher,
    setIsLoading,
  ]);

  const clearForm = useCallback(() => {
    setTitle("");
    setDescription("");
    setPrice("");
    setCategoryId("");
    setQuantity("");
  }, []);

  const deleteProductHandler = useCallback(
    async (id) => {
      if (!window.confirm("Are you sure you want to delete this product?")) {
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/products/delete/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (!response.ok) {
          toast.error(
            data.msg || "Unable to delete a product, try again later"
          );
          console.error("Delete failed:", data);
          return;
        }

        toast.success(data.msg);
        await AllProductFetcher(); // Refresh the product list after deletion
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("An error occurred while deleting the product.");
      } finally {
        setIsLoading(false);
      }
    },
    [API_URL, token, AllProductFetcher, setIsLoading]
  );

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      {/* Top action bar: Upload Product & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-1/2 lg:w-1/3">
          <input
            type="text"
            placeholder="Search products by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>

        {/* Upload Product Button */}
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
                Price
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
                <option value="">Select category</option>
                <option value="1">7ft * 10ft Rugs</option>
                <option value="2">Throw pillows</option>
                <option value="3">5ft * 7ft Rugs</option>
                <option value="4">3ft * 5ft Rugs</option>
                <option value="5">10ft * 13ft Rugs</option>
                <option value="6">Footmat</option>
                <option value="7">Skirtings</option>
                <option value="8">European Armstrong carpet</option>
                <option value="9">Diffuser</option>
                <option value="10">PVC vinyl tiles</option>
                <option value="11">Vinyl plank</option>
                <option value="12">Laminate floor</option>
                <option value="13">Wall to wall rug</option>
                <option value="14">8ft * 11ft Rugs</option>
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
        <div className="overflow-x-auto">
          {filteredProducts.length === 0 ? (
            <p className="text-center text-gray-600 py-8 text-lg">
              {searchQuery.trim() !== ""
                ? "No products match your search."
                : "No products available to manage."}
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
                {filteredProducts.map((product) => (
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
      </div>
    </div>
  );
}
export default ManageProducts;
