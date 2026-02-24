import { useContext, useState, useEffect, useCallback } from "react";
import { storeContext } from "../context/storeContext";
import { Link , useNavigate} from "react-router-dom";
import Spinner from "./Spinner";
import { toast } from "react-toastify";
import FilterForm from "./FilterForm";
import {
  IoPencilOutline,
  IoTrashOutline,
  IoEyeOutline,
  IoAddOutline,
  IoCloudDoneOutline,
  IoCloudOfflineOutline,
} from "react-icons/io5";

function ManageProducts() {
  const [title, setTitle] = useState("");
  const [cost, setCost] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [productId, setProductId] = useState(null);

  const [filters, setFilters] = useState({
    categoryId: "",
    filterPriceFrom: "",
    filterPriceTo: "",
    filterProductName: "",
  });

  const navigate = useNavigate();

  const {
    API_URL,
    storeList,
    token,
    queryProduct,
    isLoading,
    setIsLoading,
    totalProducts,
    currentPage,
    totalPages,
    handlePageChange,
    categoryList,
    fetchDiscountStatus,
    setIncreasedPriceInPercentage,
    increasedPriceInPercentage,
    activateDiscount,
    editDiscountStatus
  } = useContext(storeContext);

  const {
    categoryId: filterCategoryId,
    filterPriceFrom,
    filterPriceTo,
    filterProductName,
  } = filters;

  useEffect(() => {
    queryProduct(
      filterCategoryId,
      filterPriceTo,
      filterPriceFrom,
      filterProductName,
    );
  }, [currentPage]);

  function handleSearch() {
    handlePageChange(1);
    queryProduct(
      filterCategoryId,
      filterPriceTo,
      filterPriceFrom,
      filterProductName,
    );
  }

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
          title,
          description,
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
        } else {
          error.forEach((err) => toast.error(err));
        }
        return;
      }

      toast.success("Product updated successfully");
      await queryProduct();
      clearForm();
      setEditMode(false);
    } catch (error) {
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
    quantity,
    cost,
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
      if (!window.confirm("Are you sure you want to delete this product?"))
        return;
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/product/delete/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          toast.success("Product deleted successfully");
          await queryProduct();
        } else {
          toast.error("Failed to delete product");
        }
      } catch (error) {
        console.log(error);
        toast.error("An error occurred.");
      } finally {
        setIsLoading(false);
      }
    },
    [API_URL, token, queryProduct],
  );

  if (isLoading) return <Spinner />;

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              Store Management
            </h1>
            <p className="text-sm text-gray-500">
              Monitor inventory and manage global pricing.
            </p>
          </div>
          <Link
            to="/admin/product-upload"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 active:scale-95"
          >
            <IoAddOutline className="text-xl" />
            New Product
          </Link>
        </div>
        {/* ================= TOP ACTION BAR ================= */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between mb-10">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-10">
            {/* Filters Section */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <FilterForm
                filters={filters}
                setFilters={setFilters}
                onSearch={handleSearch}
                onReset={handleReset}
                categoryList={categoryList}
              />
            </div>

            {/* Global Discount Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div
                    className={`p-2 rounded-lg ${activateDiscount ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"}`}
                  >
                    {activateDiscount ? (
                      <IoCloudDoneOutline size={20} />
                    ) : (
                      <IoCloudOfflineOutline size={20} />
                    )}
                  </div>
                  <h3 className="font-bold text-gray-800">Global Discount</h3>
                </div>
                <span
                  className={`text-[10px] uppercase font-black px-2 py-1 rounded-md ${activateDiscount ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                  >
                  {activateDiscount ? "Active" : "Inactive"}
                </span>
              </div>
                  <span className="text-xs text-gray-500">Increase price globally to activate discount on all products</span>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  editDiscountStatus(
                    !activateDiscount,
                    increasedPriceInPercentage,
                  );
                }}
                className="space-y-3"
              >
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                    %
                  </span>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full pl-8 pr-4 py-2 bg-gray-50 border-gray-200 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                    value={increasedPriceInPercentage}
                    onChange={(e) =>
                      setIncreasedPriceInPercentage(e.target.value)
                    }
                  />
                </div>
                <button
                  type="submit"
                  className={`w-full py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                    activateDiscount
                      ? "bg-red-50 text-red-600 hover:bg-red-100"
                      : "bg-gray-900 text-white hover:bg-black shadow-md"
                  }`}
                >
                  {activateDiscount ? "Stop Discount" : "Apply Discount"}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* ================= EDIT FORM MODAL-LIKE SECTION ================= */}
        {editMode && (
          <div className="mb-12 overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-gray-200 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="bg-gray-900 px-6 py-4">
              <h2 className="text-lg font-bold text-white">
                Edit Product Details
              </h2>
            </div>
            <form
              id="updateProductForm"
              onSubmit={(e) => {
                e.preventDefault();
                updateProductHandler();
              }}
              className="p-8"
            >
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    Product Title
                  </label>
                  <input
                    className="w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-blue-600 focus:ring-blue-600"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    Category
                  </label>
                  <select
                    className="w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-blue-600"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    required
                  >
                    <option value="">Choose category</option>
                    {categoryList.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    Cost Price (₦)
                  </label>
                  <input
                    type="number"
                    className="w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-blue-600"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    Selling Price (₦)
                  </label>
                  <input
                    type="number"
                    className="w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-blue-600"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    className="w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-blue-600"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                  />
                </div>
                <div className="md:col-span-2 lg:col-span-3">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    Description
                  </label>
                  <textarea
                    className="w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-blue-600 h-28"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditMode(false);
                    clearForm();
                  }}
                  className="rounded-xl px-6 py-3 text-sm font-bold text-gray-500 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-10 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================= PRODUCT TABLE ================= */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
          <div className="border-b border-gray-100 px-6 py-5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Inventory Catalog
            </h2>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">
              {totalProducts} Total Items
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                    Product
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                    Cost
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                    Price
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {storeList.map((product) => (
                  <tr
                    key={product.id}
                    className="group hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={product.imageUrl}
                          alt=""
                          className="h-12 w-12 rounded-lg object-cover ring-1 ring-gray-200"
                        />
                        <div>
                          <p className="font-semibold text-gray-900 line-clamp-1">
                            {product.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            Stock: {product.quantity}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      ₦{Number(product.cost).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">
                      ₦{Number(product.price).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {/* VIEW BUTTON - Subtle Gray */}
                        <button
                          onClick={() => {
                            navigate(`/admin/product/${product.id}`);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          title="View Product"
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 shadow-sm transition-all hover:bg-gray-50 hover:text-blue-600 hover:border-blue-200"
                        >
                          <IoEyeOutline size={18} />
                        </button>

                        {/* EDIT BUTTON - Soft Yellow/Amber */}
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
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          title="Edit Product"
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-amber-100 bg-amber-50 text-amber-600 shadow-sm transition-all hover:bg-amber-100 hover:text-amber-700"
                        >
                          <IoPencilOutline size={18} />
                        </button>

                        {/* DELETE BUTTON - Soft Red */}
                        <button
                          onClick={() => deleteProductHandler(product.id)}
                          title="Delete Product"
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 bg-red-50 text-red-500 shadow-sm transition-all hover:bg-red-100 hover:text-red-700"
                        >
                          <IoTrashOutline size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {storeList.length === 0 && (
              <div className="py-20 text-center">
                <p className="text-gray-400">
                  No products found in the inventory.
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="border-t border-gray-100 px-6 py-4 bg-gray-50/30 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="rounded-lg border bg-white px-4 py-2 text-xs font-bold text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50"
              >
                Prev
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="rounded-lg border bg-white px-4 py-2 text-xs font-bold text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageProducts;
