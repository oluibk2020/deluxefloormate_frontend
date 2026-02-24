import { useState } from "react";

function FilterForm({
  filters,
  setFilters,
  onSearch,
  onReset,
  categoryList = [],
}) {
  const { categoryId, filterPriceFrom, filterPriceTo, filterProductName } =
    filters;

  function handleChange(e) {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSearch();
      }}
      className="w-full"
    >
      {/* Header Section */}
      <div className="mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-5 w-5 text-gray-400"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
          />
        </svg>
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">
          Filter & Refine
        </h3>
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Product Name Input */}
        <div className="flex flex-col">
          <label
            htmlFor="filterProductName"
            className="mb-1.5 text-xs font-semibold text-gray-500"
          >
            Keyword
          </label>
          <input
            id="filterProductName"
            type="text"
            placeholder="Search products..."
            name="filterProductName"
            value={filterProductName}
            onChange={handleChange}
            className="block w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-900 transition-all placeholder:text-gray-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-600/10"
          />
        </div>

        {/* Category Select */}
        <div className="flex flex-col">
          <label
            htmlFor="categoryId"
            className="mb-1.5 text-xs font-semibold text-gray-500"
          >
            Category
          </label>
          <select
            id="categoryId"
            name="categoryId"
            value={categoryId}
            onChange={handleChange}
            className="block w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-900 transition-all focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-600/10"
          >
            <option value="">All Categories</option>
            {categoryList.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
        </div>

        {/* Min Price */}
        <div className="flex flex-col">
          <label
            htmlFor="filterPriceFrom"
            className="mb-1.5 text-xs font-semibold text-gray-500"
          >
            Min Price (₦)
          </label>
          <input
            id="filterPriceFrom"
            type="number"
            placeholder="0"
            name="filterPriceFrom"
            value={filterPriceFrom}
            onChange={handleChange}
            className="block w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-900 transition-all placeholder:text-gray-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-600/10"
          />
        </div>

        {/* Max Price */}
        <div className="flex flex-col">
          <label
            htmlFor="filterPriceTo"
            className="mb-1.5 text-xs font-semibold text-gray-500"
          >
            Max Price (₦)
          </label>
          <input
            id="filterPriceTo"
            type="number"
            placeholder="Any"
            name="filterPriceTo"
            value={filterPriceTo}
            onChange={handleChange}
            className="block w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-900 transition-all placeholder:text-gray-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-600/10"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex flex-col-reverse justify-end gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex w-full items-center justify-center rounded-xl bg-white px-6 py-2.5 text-sm font-semibold text-red-600 shadow-sm ring-1 ring-inset ring-red-100 transition-all hover:bg-red-50 hover:ring-red-200 focus:outline-none focus:ring-4 focus:ring-red-100 active:scale-95 sm:w-auto"
        >
          Reset Filters
        </button>

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-8 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-blue-600/20 active:scale-95 sm:w-auto"
        >
          Apply Filters
        </button>
      </div>
    </form>
  );
}

export default FilterForm;
