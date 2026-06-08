import { useContext, useState, useEffect } from "react";
import { storeContext } from "../context/storeContext";
import Spinner from "./Spinner";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import {
  IoGridOutline,
  IoAddOutline,
  IoDownloadOutline,
  IoListOutline,
  IoInformationCircleOutline,
} from "react-icons/io5";

function ManageCategories() {
  const {
    categoryList,
    categoryFetcher,
    createCategory,
    isLoading,
    setIsLoading,
  } = useContext(storeContext);

  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");

  useEffect(() => {
 categoryFetcher();
  }, []);

  // ================= EXPORT TO EXCEL/CSV =================
  const handleExportCategories = () => {
    if (categoryList.length === 0) {
      toast.error("No categories to export");
      return;
    }

    const dataToExport = categoryList.map((cat) => ({
      "Category ID": cat.id,
      Title: cat.title,
      Description: cat.description || "No description",
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Categories");
    XLSX.writeFile(
      workbook,
      `Categories_Export_${new Date().toLocaleDateString()}.xlsx`,
    );
    toast.success("Categories exported successfully!");
  };

  async function createCategoryHandler() {
    try {
      setIsLoading(true);
      await createCategory( newCategoryName, newCategoryDescription);
      await categoryFetcher();

      setNewCategoryName("");
      setNewCategoryDescription("");
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Failed to create category");
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) return <Spinner />;

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <IoGridOutline size={18} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                Inventory Architecture
              </span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              Product Categories
            </h1>
            <p className="text-sm text-gray-500">
              Organize your products for better discoverability.
            </p>
          </div>

          <button
            onClick={handleExportCategories}
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-100 transition-all hover:bg-emerald-700 active:scale-95"
          >
            <IoDownloadOutline size={20} />
            Export List
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: ADD CATEGORY FORM */}
          <div className="lg:col-span-4">
            <div className="sticky top-8 bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gray-900 px-6 py-4 flex items-center gap-2">
                <IoAddOutline className="text-white" size={20} />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  New Category
                </h3>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  createCategoryHandler();
                }}
                className="p-6 space-y-5"
              >
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">
                    Category Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Electronics"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    required
                    className="w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-sm transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">
                    Description
                  </label>
                  <textarea
                    placeholder="Briefly describe what goes here..."
                    value={newCategoryDescription}
                    onChange={(e) => setNewCategoryDescription(e.target.value)}
                    rows="4"
                    className="w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-sm transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 outline-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-blue-600 py-4 text-sm font-bold text-white shadow-lg shadow-blue-100 transition-all hover:bg-blue-700 active:scale-[0.98]"
                >
                  Create Category
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT: CATEGORY LIST TABLE */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-8 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <IoListOutline className="text-gray-400" size={20} />
                  <h3 className="font-bold text-gray-800">
                    Existing Categories
                  </h3>
                </div>
                <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg uppercase tracking-tighter">
                  {categoryList.length} Total
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/30 text-[10px] font-black uppercase tracking-widest text-gray-400">
                      <th className="px-8 py-4">ID</th>
                      <th className="px-8 py-4">Category Name</th>
                      <th className="px-8 py-4">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {categoryList.length > 0 ? (
                      categoryList.map((category) => (
                        <tr
                          key={category.id}
                          className="group hover:bg-gray-50/80 transition-colors"
                        >
                          <td className="px-8 py-5">
                            <span className="text-xs font-mono text-gray-400">
                              #{category.id}
                            </span>
                          </td>
                          <td className="px-8 py-5">
                            <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {category.title}
                            </p>
                          </td>
                          <td className="px-8 py-5">
                            <p className="text-xs text-gray-500 line-clamp-1 max-w-[300px]">
                              {category.description ||
                                "No description provided."}
                            </p>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="px-8 py-20 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <div className="p-4 bg-gray-50 rounded-full text-gray-300">
                              <IoInformationCircleOutline size={40} />
                            </div>
                            <p className="text-gray-400 text-sm font-medium">
                              No categories created yet.
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageCategories;
