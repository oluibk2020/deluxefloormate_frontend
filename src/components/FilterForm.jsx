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
    <div className="mt-8 flex justify-between">
      <details className="group [&_summary::-webkit-details-marker]:hidden">
        <summary className="flex cursor-pointer items-center gap-2 border-b border-gray-400 pb-1 text-gray-900 hover:border-gray-600">
          <span className="text-sm font-medium">Filter Products</span>
        </summary>

        <div className="mt-4 w-80 rounded border border-gray-200 bg-white p-4">
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              onSearch();
            }}
          >
            <input
              type="text"
              placeholder="Product name"
              name="filterProductName"
              value={filterProductName}
              onChange={handleChange}
              className="h-10 rounded border px-2"
            />

            <input
              type="number"
              placeholder="Min Price"
              name="filterPriceFrom"
              value={filterPriceFrom}
              onChange={handleChange}
              className="h-10 rounded border px-2"
            />

            <input
              type="number"
              placeholder="Max Price"
              name="filterPriceTo"
              value={filterPriceTo}
              onChange={handleChange}
              className="h-10 rounded border px-2"
            />

            <select
              name="categoryId"
              value={categoryId}
              onChange={handleChange}
              className="h-10 rounded border"
            >
              <option value="">Choose Category</option>
              {categoryList.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 rounded border bg-gray-100 py-2 text-sm font-medium hover:bg-gray-200"
              >
                Search
              </button>

              <button
                type="button"
                onClick={onReset}
                className="flex-1 rounded border bg-red-50 py-2 text-sm font-medium hover:bg-red-100"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </details>
    </div>
  );
}

export default FilterForm;
