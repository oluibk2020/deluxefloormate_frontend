import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useContext } from "react";
import { storeContext } from "../context/storeContext";

function ManageProductItem() {
  const { productData, cartData, productFetcher } =
    useContext(storeContext);

  const params = useParams();

  //auto fetching of product at page load
  useEffect(() => {
    productFetcher(params.id);
  }, []);

  const { price, imageUrl, title, description, id, quantity } = productData;

  //adding items to cart
 

  //checking for productId in Cart to see if it is in cart(-1 = false, 0 = true)
  const productIndex = cartData.findIndex((cartItem) => cartItem.id === id);

  return (
    <div className="container my-7 mx-auto border-red-700 lg:flex">
      <div className="hidden productDetail pt-3 p-10">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Product Description
        </h1>
        <div className="mt-3.5 text-sm text-gray-500">{description}</div>
      </div>

      <div className="group relative block overflow-hidden w-96 mx-auto">
        <img
          src={imageUrl}
          alt=""
          className="h-64 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-72"
        />

        <div className="relative border border-gray-100 bg-white p-6">
          <span className="whitespace-nowrap bg-yellow-400 px-3 py-1.5 text-xs font-medium">
            {" "}
            New{" "}
          </span>

          <h3 className="mt-4 text-lg font-medium text-gray-900">{title}</h3>

          <p className="mt-1.5 text-sm text-gray-700">
            {" "}
            ₦{Number(price).toLocaleString()} NGN{" "}
          </p>
          <p className="mt-1.5 text-sm text-gray-700">
            {" "}
            Qty Remaining - {Number(quantity).toLocaleString()}
          </p>

          <div className="mt-4">
            {quantity === 0 ? (
              <div className="block w-full p-4 text-gray-900 text-sm font-medium mb-3">
                Product is currently out of stock
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <div className="hidden md:block w-1/2  py-10">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Product Description
        </h1>
        <div className="mt-3.5 text-sm text-gray-500">{description}</div>
      </div>
    </div>
  );
}
export default ManageProductItem;
