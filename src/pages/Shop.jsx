import { Link } from "react-router-dom";
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
    <section>
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <header>
          <h2 className="text-xl font-bold text-gray-900 sm:text-3xl">
            Product Collection
          </h2>

          <p className="mt-4 max-w-md text-gray-500">
            Would you want to get high quality rugs, throw pillows and other
            interior accessories. Check out our store here and get amazing
            prices.
          </p>
        </header>

        {/* ================= FILTER SECTION ================= */}
        <FilterForm
          filters={filters}
          setFilters={setFilters}
          onSearch={handleSearch}
          onReset={handleReset}
          categoryList={categoryList}
        />

        {/* ================= RESULTS INFO ================= */}
        <div className="mt-8">
          <p className="text-sm text-gray-500">
            Showing {currentPage} of {totalPages}
          </p>
        </div>

        {/* ================= PRODUCTS GRID ================= */}
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {storeList.map((item) => (
            <li key={item.id}>
              <Link
                to={`/product/${item.id}`}
                className="group block overflow-hidden"
              >
                <img
                  src={item.imageUrl}
                  alt="product"
                  className="h-[350px] w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[450px]"
                />

                <div className="bg-white pt-3">
                  <h3 className="text-base text-gray-700 group-hover:underline">
                    {item.title.replace(/\b\w/g, (match) =>
                      match.toUpperCase(),
                    )}
                  </h3>

                  <p className="mt-2 tracking-wider text-gray-900">
                    ₦{Number(item.price).toLocaleString()} NGN
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {/* ================= PAGINATION ================= */}
        <ol className="mt-8 flex justify-center gap-1 text-xs font-medium">
          <li>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="inline-flex h-8 w-8 items-center justify-center rounded border disabled:bg-gray-200"
            >
              Prev
            </button>
          </li>

          <li className="flex h-8 w-8 items-center justify-center rounded border">
           
              {currentPage} / {totalPages}
            
          </li>

          <li>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="inline-flex h-8 w-8 items-center justify-center rounded border disabled:bg-gray-200"
            >
              Next
            </button>
          </li>
        </ol>
      </div>
    </section>
  );
}

export default Shop;
