import { Link } from "react-router-dom";
import { useContext, useEffect } from "react";
import {storeContext} from "../context/storeContext";
import FilterForm from "../components/FilterForm";

function Shop() {
  const {
    storeList,
    currentPage,
    totalPages,
    handlePageChange,
    AllProductFetcher,
  } = useContext(storeContext);

  useEffect(() => {
   AllProductFetcher() 
  },[])
  

  return (
    <section>
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <header className="">
          <h2 className="text-xl font-bold text-gray-900 sm:text-3xl">
            Product Collection
          </h2>

          <p className="mt-4 max-w-md  text-gray-500">
            Would you want to get high quality rugs, throw pillows and other
            interior accessories. Check out our store here and get amazing prices.
          </p>
        </header>

        <FilterForm />

        <div className="mt-8">
          <p className="text-sm text-gray-500">
            Showing <span> {currentPage} </span> of {totalPages}
          </p>
        </div>

        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {storeList.map((item) => {
            return (
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

                  <div className="relative bg-white pt-3">
                    <h3 className="text-base text-gray-700 group-hover:underline group-hover:underline-offset-4">
                      {item.title.replace(/\b\w/g, (match) =>
                        match.toUpperCase()
                      )}
                    </h3>

                    <p className="mt-2">
                      <span className="sr-only"> Regular Price </span>

                      <span className="tracking-wider text-gray-900">
                        {" "}
                        ₦{Number(item.price).toLocaleString()} NGN{" "}
                      </span>
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>

        <ol className="mt-8 flex justify-center gap-1 text-xs font-medium">
          <li>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-100"
            >
              <span className="sr-only">Prev Page</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </li>

          <li>
            <div
              className="block h-8 w-8 rounded border border-gray-100 bg-white text-center leading-8 text-gray-900"
            >
              {currentPage}
            </div>
          </li>

          <li>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-100"
            >
              <span className="sr-only">Next Page</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </li>
        </ol>
      </div>
    </section>
  );
}
export default Shop;
