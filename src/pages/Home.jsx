import { Link } from "react-router-dom";
import { useContext, useEffect } from "react";
import {storeContext} from "../context/storeContext";

function Home() {
  const { storeList, AllProductFetcher, categoryProductFetcher } =
    useContext(storeContext);

   useEffect(() => {
     AllProductFetcher();
   }, []);

   function rugCategoryHandler() {
    categoryProductFetcher(1)
   }
   function pillowCategoryHandler() {
    categoryProductFetcher(2)
   }
  return (
    <>
      <section>
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:items-stretch">
            <div className="grid place-content-center rounded bg-gray-100 p-6 sm:p-8">
              <div className="mx-auto max-w-md text-center lg:text-left">
                <header>
                  <h2 className="text-xl font-bold text-gray-900 sm:text-3xl">
                    Deluxe FloorMate
                  </h2>

                  <p className="mt-4 text-gray-500">
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Quas rerum quam amet provident nulla error!
                  </p>
                </header>

                <Link
                  to="/shop"
                  className="mt-8 inline-block rounded border border-gray-900 bg-gray-900 px-12 py-3 text-sm font-medium text-white transition hover:shadow focus:outline-none focus:ring"
                >
                  Shop All
                </Link>
              </div>
            </div>

            <div className="lg:col-span-2 lg:py-8">
              <ul className="grid grid-cols-2 gap-4">
                <li>
                  <Link
                    to="/shop"
                    onClick={rugCategoryHandler}
                    className="group block"
                  >
                    <img
                      src="https://deluxefloormate.com/private/uploads/20250723_105108_6880be9c72263.jpg"
                      alt="rugs"
                      className="aspect-square w-full rounded object-cover"
                    />

                    <div className="mt-3">
                      <h3 className="font-medium text-gray-900 group-hover:underline group-hover:underline-offset-4">
                        Lovely Rugs
                      </h3>

                      <p className="mt-1 text-sm text-gray-700">From ₦35000</p>
                    </div>
                  </Link>
                </li>

                <li>
                  <Link
                    to="/shop"
                    onClick={pillowCategoryHandler}
                    className="group block"
                  >
                    <img
                      src="https://www.thespruce.com/thmb/vYfw3fHSsFRf3cRA_AcddlHhaJg=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/how-to-mix-and-match-throw-pillows-like-a-pro-1791497-01-16e60d2dd6e84a489f590d1534bab67a.jpg"
                      alt="Throw pillows"
                      className="aspect-square w-full rounded object-cover"
                    />

                    <div className="mt-3">
                      <h3 className="font-medium text-gray-900 group-hover:underline group-hover:underline-offset-4">
                        Beautiful Throw Pillows
                      </h3>

                      <p className="mt-1 text-sm text-gray-700">From ₦15000</p>
                    </div>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      {/* {end of section} */}
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <h2 className="text-xl font-bold text-gray-900 sm:text-3xl mb-7">
          Featured Products
        </h2>
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
                    alt=""
                    className="h-[350px] w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[450px]"
                  />

                  <div className="relative bg-white pt-3">
                    <h3 className=" text-base text-gray-700 group-hover:underline group-hover:underline-offset-4">
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
      </div>
    </>
  );
}
export default Home