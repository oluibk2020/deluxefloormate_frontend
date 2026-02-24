import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { storeContext } from "../context/storeContext";
import FilterForm from "../components/FilterForm";

function Shop() {
  const {
    storeList,
    currentPage,
    totalPages,
    handlePageChange,
    queryProduct,
    categoryList,
  } = useContext(storeContext);

  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    categoryId: "",
    filterPriceFrom: "",
    filterPriceTo: "",
    filterProductName: "",
  });

  const { categoryId, filterPriceFrom, filterPriceTo, filterProductName } =
    filters;

  function handleSearch() {
    handlePageChange(1);
    queryProduct(categoryId, filterPriceTo, filterPriceFrom, filterProductName);
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

  useEffect(() => {
    queryProduct(categoryId, filterPriceTo, filterPriceFrom, filterProductName);
  }, [currentPage]);

  return (
    <section className="bg-gray-50/50 min-h-screen pb-12">
      <div className="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 lg:px-8">
        {/* ================= HEADER SECTION ================= */}
        <header className="text-center sm:text-left mb-10">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
            Product Collection
          </h2>
          <p className="mt-4 max-w-2xl text-base text-gray-500 mx-auto sm:mx-0">
            Would you want to get high-quality rugs, throw pillows, and other
            interior accessories? Check out our store here and get amazing
            prices.
          </p>
        </header>

        {/* ================= FILTER SECTION ================= */}
        <div className="mb-10 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <FilterForm
            filters={filters}
            setFilters={setFilters}
            onSearch={handleSearch}
            onReset={handleReset}
            categoryList={categoryList}
          />
        </div>

        {/* ================= RESULTS INFO ================= */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm font-medium text-gray-500">
            Showing{" "}
            <span className="text-gray-900 font-semibold">{currentPage}</span>{" "}
            of <span className="text-gray-900 font-semibold">{totalPages}</span>{" "}
            pages
          </p>
        </div>

        {/* ================= PRODUCTS GRID ================= */}
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {storeList.map((item) => (
            <li key={item.id} className="group flex h-full">
              <button
                onClick={() => {
                  navigate(`/product/${item.id}`);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="relative flex w-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[3/4]">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                  />
                  {/* Subtle overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10"></div>
                </div>

                {/* Content Container */}
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 transition-colors duration-200 group-hover:text-blue-600 line-clamp-2">
                      {item.title.replace(/\b\w/g, (match) =>
                        match.toUpperCase(),
                      )}
                    </h3>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-lg font-bold text-gray-900">
                      ₦{Number(item.price).toLocaleString()}
                    </p>
                    {/* Fake CTA button for visual appeal */}
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 text-gray-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>

        {/* ================= PAGINATION ================= */}
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
    </section>
  );
}

export default Shop;
