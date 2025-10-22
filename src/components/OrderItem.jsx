import { toast } from "react-toastify";
import { useContext, useEffect, useCallback } from "react";
import { storeContext } from "../context/storeContext";
import { Link, useParams } from "react-router-dom"; // useNavigate and useJwt are unused
import Spinner from "../components/Spinner";
import PaymentRedirect from "./PaymentRedirect";

function OrderItem() {
  const {
    orderData,
    orderFetcher,
    isLoading,
    setIsLoading,
    localTime,
    clockConverter,
    deliveryAddress,
    getDeliveryAddress,
    createGatewayInvoice,
    paymentLink,
    // setIsAuth, // Unused
  } = useContext(storeContext);

  const { id: orderId } = useParams(); // Destructure and rename params.id

  // --- Data Fetching and Initialization ---
  const fetchOrderDetails = useCallback(async () => {
    setIsLoading(true);
    try {
      await orderFetcher(orderId); // Fetch order data
    } catch (error) {
      console.error("Failed to fetch order details:", error);
      toast.error("Failed to load your order details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [orderFetcher, orderId, setIsLoading]); // Depend on orderId and memoized functions

  useEffect(() => {
    fetchOrderDetails();
  }, []); // Re-fetch when fetchOrderDetails memoized function changes

  // Update dependent data (time and address) once orderData is available
  useEffect(() => {
    if (orderData && Object.keys(orderData).length > 0) {
      if (orderData.order && orderData.order.createdAt) {
        clockConverter(orderData.order.createdAt);
      }
      if (orderData.order && orderData.order.deliveryAddressId) {
        getDeliveryAddress(orderData.order.deliveryAddressId);
      }
    }
  }, [orderData, clockConverter, getDeliveryAddress]); // Depend on orderData and memoized functions

  // --- Payment Logic ---
  const payNow = useCallback(async () => {
    if (
      orderData &&
      orderData.order &&
      orderData.order.transactionStatus === "pending"
    ) {
      try {
        await createGatewayInvoice(orderData.order.id); // Generate payment link
      } catch (error) {
        console.error("Error creating gateway invoice:", error);
        toast.error("Failed to generate payment link. Please try again.");
      }
    } else if (orderData && orderData.order.transactionStatus === "paid") {
      toast.info("This order has already been paid.");
    }
  }, [orderData, createGatewayInvoice]);

  // --- Redirect to Payment Gateway ---
  if (paymentLink && paymentLink.trim() !== "") {
    return <PaymentRedirect link={paymentLink} />;
  }

  // --- Render Loading State ---
  if (isLoading || !orderData || Object.keys(orderData).length === 0) {
    return <Spinner />;
  }

  // Destructure order and products for easier access after loading
  const { order, products } = orderData;

  // Calculate VAT based on current order data
  const VAT = (0.075 * order.totalAmount).toFixed(2); // Assuming 7.5% VAT

  // Check if order is pending and eligible for online payment (not cash, within 48 hours)
  const isOnlinePaymentPending =
    order.transactionStatus === "pending" &&
    order.paymentMethod !== "cash" &&
    new Date(order.createdAt).getTime() > new Date().getTime() - 172800000; // 48 hours in milliseconds

  // Check if order is pending and requires cash payment (within 48 hours)
  const isCashPaymentPending =
    order.transactionStatus === "pending" &&
    order.paymentMethod === "cash" &&
    new Date(order.createdAt).getTime() > new Date().getTime() - 172800000; // 48 hours in milliseconds

  return (
    <section className="bg-gray-50 py-8 sm:py-12">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl bg-white p-6 rounded-lg shadow-lg">
          <header className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
              🛍️ Your Order Details
            </h1>
            <p className="text-gray-600">Order ID: #{orderId}</p>
          </header>

          {/* Customer Details */}
          <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">
              👤 Customer Information
            </h2>
            <p className="text-gray-700 mb-1">
              <strong>Name:</strong> {order.user.firstName}{" "}
              {order.user.lastName}
            </p>
            <p className="text-gray-700 mb-1">
              <strong>Email:</strong> {order.user.email}
            </p>
            <p className="text-gray-700">
              <strong>Mobile:</strong> {order.user.mobile}
            </p>
          </div>

          {/* Order Items */}
          <div className="mb-8 p-6 bg-green-50 rounded-lg border border-green-200">
            <h2 className="text-xl font-semibold text-green-800 mb-4">
              🛒 Ordered Products
            </h2>
            <ul className="space-y-6">
              {products.map((product) => {
                const orderItem = order.orderItems.find(
                  (item) => item.productId === product.id
                );
                // Ensure orderItem exists before trying to access its properties
                if (!orderItem) return null;

                const itemTotalPrice = (
                  product.price * orderItem.quantity
                ).toFixed(2);

                return (
                  <li
                    className="flex flex-col sm:flex-row items-center gap-4 border-b pb-4 last:border-b-0 last:pb-0"
                    key={product.id}
                  >
                    <Link
                      to={`/product/${product.id}`}
                      className="flex-shrink-0"
                    >
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="h-20 w-20 rounded-md object-cover shadow-sm"
                      />
                    </Link>

                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="text-base font-medium text-gray-900">
                        {product.title.length > 60
                          ? product.title.substring(0, 60) + "..."
                          : product.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Price: ₦{parseInt(product.price).toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 text-sm font-semibold">
                      <span className="px-3 py-1 bg-gray-100 rounded-md">
                        Qty: {orderItem.quantity}
                      </span>
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-md">
                        Total: ₦{itemTotalPrice}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Delivery and Transaction Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {/* Delivery Details */}
            <div className="p-6 bg-yellow-50 rounded-lg border border-yellow-200">
              <h2 className="text-xl font-semibold text-yellow-800 mb-4">
                🚚 Delivery Details
              </h2>
              {deliveryAddress && Object.keys(deliveryAddress).length > 0 ? (
                <dl className="space-y-2 text-sm text-gray-700">
                  <div className="flex justify-between items-start">
                    <dt className="font-medium">Address:</dt>
                    <dd className="text-right flex-1 ml-4">
                      {deliveryAddress.address}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium">Mobile Number:</dt>
                    <dd>{deliveryAddress.mobile}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium">Full Name:</dt>
                    <dd>
                      {deliveryAddress.firstName} {deliveryAddress.lastName}
                    </dd>
                  </div>
                </dl>
              ) : (
                <p className="text-gray-600">Loading delivery address...</p>
              )}
            </div>

            {/* Transaction Details */}
            <div className="p-6 bg-purple-50 rounded-lg border border-purple-200">
              <h2 className="text-xl font-semibold text-purple-800 mb-4">
                💸 Transaction Summary
              </h2>
              <dl className="space-y-2 text-sm text-gray-700">
                <div className="flex justify-between">
                  <dt className="font-medium">Date of Order:</dt>
                  <dd>{localTime || "N/A"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium">Payment Status:</dt>
                  <dd>
                    <span
                      className={`font-semibold ${
                        order.transactionStatus === "paid"
                          ? "text-green-600"
                          : order.transactionStatus === "pending"
                          ? "text-orange-600"
                          : "text-red-600"
                      }`}
                    >
                      {order.transactionStatus.toUpperCase()}
                    </span>
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium">Payment Method:</dt>
                  <dd>{order.paymentMethod}</dd>
                </div>
                <div className="flex justify-between font-bold text-base mt-4 pt-2 border-t border-gray-200">
                  <dt>VAT (7.5%):</dt>
                  <dd>₦{VAT}</dd>
                </div>
                <div className="flex justify-between !text-lg font-extrabold text-gray-900">
                  <dt>Grand Total:</dt>
                  <dd>₦{order.totalAmount.toFixed(2)}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Action Buttons and Payment Instructions */}
          <div className="mt-10 flex flex-col sm:flex-row justify-between items-center gap-4">
            <Link
              to="/orders"
              className="w-full sm:w-auto text-center rounded-full border border-gray-300 bg-gray-100 px-6 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-200 shadow-sm"
            >
              ⬅️ Back to All Orders
            </Link>

            {isOnlinePaymentPending && (
              <button
                onClick={payNow}
                className="w-full sm:w-auto text-center rounded-full bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-md transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                💳 Pay Now with Flutterwave
              </button>
            )}
          </div>

          {isCashPaymentPending && (
            <div className="bg-blue-100 border border-blue-300 text-blue-800 p-6 rounded-lg mt-8 text-center shadow-inner">
              <h3 className="text-lg font-semibold mb-3">
                Cash on Delivery Payment Instructions
              </h3>
              <p className="mb-2">
                Please pay the total amount of{" "}
                <span className="font-bold text-xl text-blue-900">
                  ₦{order.totalAmount.toFixed(2)}
                </span>{" "}
                to the delivery agent upon receiving your order.
              </p>
              <p className="text-sm text-blue-700 italic">
                Note: This order will be cancelled if not paid within 48 hours.
              </p>
            </div>
          )}

          {order.transactionStatus === "paid" && (
            <div className="bg-green-100 border border-green-300 text-green-800 p-6 rounded-lg mt-8 text-center shadow-inner">
              <h3 className="text-lg font-semibold mb-3">
                🎉 Payment Confirmed!
              </h3>
              <p>
                Your order has been successfully paid. We'll send you updates on
                its status soon!
              </p>
            </div>
          )}

          {order.transactionStatus === "failed" && (
            <div className="bg-red-100 border border-red-300 text-red-800 p-6 rounded-lg mt-8 text-center shadow-inner">
              <h3 className="text-lg font-semibold mb-3">🚫 Order Cancelled</h3>
              <p>This order has been cancelled.</p>
            </div>
          )}

          {order.transactionStatus === "pending" &&
            !isOnlinePaymentPending &&
            !isCashPaymentPending && (
              <div className="bg-red-100 border border-red-300 text-red-800 p-6 rounded-lg mt-8 text-center shadow-inner">
                <h3 className="text-lg font-semibold mb-3">
                  ⏰ Payment Window Expired
                </h3>
                <p>
                  The 48-hour payment window for this order has expired. Please
                  contact support if you have any questions.
                </p>
              </div>
            )}
        </div>
      </div>
    </section>
  );
}

export default OrderItem;
