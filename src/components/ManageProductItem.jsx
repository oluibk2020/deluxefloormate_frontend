import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useContext } from "react";
import { storeContext } from "../context/storeContext";
import {
  IoArrowForwardCircle,
  IoArrowBackOutline,
  IoBagCheckOutline,
} from "react-icons/io5";

function ManageProductItem() {
  const { productData, productFetcher } =
    useContext(storeContext);

  const params = useParams();
  const navigate = useNavigate();

  //auto fetching of product at page load
  useEffect(() => {
    productFetcher(params.id);
  }, [params.id]);

  const { price, imageUrl, title, description, id, quantity } = productData;


  return (
    <div className="min-h-screen bg-white pb-12">
      {/* Breadcrumb / Back Button */}
      <div className="mx-auto max-w-screen-xl px-4 py-6 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors"
        >
          <IoArrowBackOutline /> Back to Product List
        </button>
      </div>

      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* ================= IMAGE SECTION ================= */}
          <div className="relative group overflow-hidden rounded-3xl bg-gray-100">
            <img
              src={imageUrl}
              alt={title}
              className="h-[400px] w-full object-cover sm:h-[600px] transition-transform duration-700 group-hover:scale-105"
            />
            {quantity > 0 && quantity < 5 && (
              <span className="absolute top-4 left-4 rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-600 shadow-sm">
                Only {quantity} left!
              </span>
            )}
          </div>

          {/* ================= DETAILS SECTION ================= */}
          <div className="flex flex-col justify-center">
            <div className="space-y-4">
              <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
                New Arrival
              </span>

              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                {title}
              </h1>

              <div className="flex items-baseline gap-4">
                <p className="text-2xl font-bold text-gray-900">
                  ₦{Number(price).toLocaleString()}
                </p>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">
                  Description
                </h3>
                <p className="mt-4 text-base leading-relaxed text-gray-600">
                  {description}
                </p>
              </div>

              {/* Action Area */}
              {/* <div className="mt-10 space-y-4">
                {quantity === 0 ? (
                  <div className="rounded-xl bg-red-50 p-4 text-center text-sm font-semibold text-red-600 ring-1 ring-inset ring-red-100">
                    Currently Out of Stock
                  </div>
                ) : (
                  <>
                    {isProductInCart ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 rounded-xl bg-green-50 p-4 text-sm font-semibold text-green-700 ring-1 ring-inset ring-green-100">
                          <IoBagCheckOutline className="text-xl" />
                          This item is already in your cart
                        </div>
                        <Link
                          to="/cart"
                          className="flex w-full items-center justify-center gap-3 rounded-xl bg-gray-900 px-8 py-4 text-white transition-all hover:bg-gray-800 active:scale-[0.98]"
                        >
                          View Cart{" "}
                          <IoArrowForwardCircle className="text-2xl" />
                        </Link>
                      </div>
                    ) : (
                      <button
                        onClick={addToCart}
                        className="group flex w-full items-center justify-center gap-3 rounded-xl bg-blue-600 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 active:scale-[0.98]"
                      >
                        Add to Cart
                        <IoArrowForwardCircle className="text-2xl transition-transform group-hover:translate-x-1" />
                      </button>
                    )}
                  </>
                )}

                <div className="flex items-center justify-center gap-8 pt-6 border-t border-gray-100 text-xs font-medium text-gray-400 uppercase tracking-widest">
                  <span className="flex items-center gap-1">
                    Secure Payment
                  </span>
                  <span className="flex items-center gap-1">
                    Original Product
                  </span>
                  <span className="flex items-center gap-1">Fast Delivery</span>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ManageProductItem;
