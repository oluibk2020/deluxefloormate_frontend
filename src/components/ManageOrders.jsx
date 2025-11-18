import { useContext, useState, useEffect } from "react";
import { storeContext } from "../context/storeContext";
import { Link } from "react-router-dom";
import Spinner from "./Spinner";
import { toast } from "react-toastify";
import _ from "lodash";

function ManageOrders() {
  const [price, setPrice] = useState("");
  const [discountAmountFromServer, setDiscountAmountFromServer] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountPaymentStatusFromServer, setDiscountPaymentStatusFromServer] =
    useState("");
  const [discountPaymentStatus, setDiscountPaymentStatus] = useState("pending");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [newPaymentStatus, setNewPaymentStatus] = useState("");
  const [transactionStatus, setTransactionStatus] = useState("");
  const [otp, setOtp] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [soretdOrders, setSortedOrders] = useState([]);
  const {
    API_URL,
    token,
    isLoading,
    setIsLoading,
    orderList,
    fetchOrders,
    isAdmin,
    isManager,
  } = useContext(storeContext);

  async function fetchOrdersHandler() {
    const data = await fetchOrders();

    //sort lessons
    const sortedOrders = _.orderBy(data.orders, ["createdAt"], ["desc"]);
    setSortedOrders(sortedOrders);
    console.log(sortedOrders);

    setIsLoading(false);
  }
  useEffect(() => {
    fetchOrdersHandler();
  }, []);

  console.log(orderList);

  async function updateOrderHandler() {
    setIsLoading(true);
    try {
      //reject if no orderId or otp or newPaymentStatus
      if (!orderId || !otp || !newPaymentStatus) {
        toast.error("Please fill all fields");
        setIsLoading(false);
        return;
      }

      if (
        isManager &&
        discountAmount > 0 &&
        discountPaymentStatus === "success"
      ) {
        //manager cannot put a discount more than 25% of the price
        const maxDiscount = (5 / 100) * Number(price.replace(/,/g, ""));
        if (discountAmount > maxDiscount) {
          toast.error(
            "Discount amount cannot be more than 5% of the Order price"
          );
          setIsLoading(false);
          return;
        }
      }

      //admin cannot put a discount more than 10% of the price
      const maxDiscount = (10 / 100) * Number(price.replace(/,/g, ""));
      if (discountAmount > maxDiscount) {
        toast.error(
          "Discount amount cannot be more than 10% of the Order price"
        );
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/order/update/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          otp: String(otp),
          transactionStatus: newPaymentStatus,
          discountAmount: Number(discountAmount),
          discountPaymentStatus: discountPaymentStatus,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        const error = data.message;

        if (typeof error === "string") {
          toast.error(error);
          setIsLoading(false);
          return;
        }

        error.forEach((error) => {
          toast.error(error);
        });
        setIsLoading(false);
        return;
      }

      toast.success("Order updated successfully");
      fetchOrdersHandler(); // update the order list
      clearForm();
      setIsLoading(false);
      setEditMode(false);
      return;
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  function clearForm() {
    setPrice("");
    setNewPaymentStatus("");
    setPaymentMethod("");
    setTransactionStatus("");
    setOtp("");
  }

  async function deleteOrderHandler(id) {
    console.log("Delete order with id:", id);

    //confirm deletion
    if (!window.confirm("Are you sure you want to delete this order?")) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/order/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        const error = data.message;

        if (typeof error === "string") {
          toast.error(error);
          setIsLoading(false);
          return;
        }

        error.forEach((error) => {
          toast.error(error);
        });
        setIsLoading(false);
        return;
      }

      toast.success("Order deleted successfully");
      fetchOrders();
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  async function generateTokenHandler() {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/token/admin/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        const error = data.message;

        if (typeof error === "string") {
          toast.error(error);
          setIsLoading(false);
          return;
        }

        error.forEach((error) => {
          toast.error(error);
        });
        setIsLoading(false);
        return;
      }

      toast.success(
        "Token generated successfully. check your email for the token"
      );

      setIsLoading(false);
      return;
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      {isAdmin && (
        <div className="flex justify-end mb-6">
          <button
            onClick={generateTokenHandler}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow-lg transition duration-300 ease-in-out"
          >
            🔙 Generate Secure OTP
          </button>
        </div>
      )}

      {editMode && (
        <div className="bg-white shadow-xl rounded-lg p-6 mb-8 w-full lg:w-3/4 xl:w-1/2 mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
            Update Order 📝
          </h2>
          <form
            id="updateOrderForm"
            onSubmit={(e) => {
              e.preventDefault();
              updateOrderHandler();
            }}
            className="space-y-5"
          >
            <div>
              <p className="block text-gray-700 text-sm font-semibold mb-2">
                Order ID : {orderId}
              </p>
            </div>
            <div>
              <p className="block text-gray-700 text-sm font-semibold mb-2">
                PRICE : ₦ {price} NGN
              </p>
            </div>
            <div>
              <p className="block text-gray-700 text-sm font-semibold mb-2">
                Payment Method : {paymentMethod}
              </p>
            </div>
            <div>
              <p className="block text-gray-700 text-sm font-semibold mb-2">
                Current Payment Status : {transactionStatus}
              </p>
            </div>
            <div>
              <p className="block text-gray-700 text-sm font-semibold mb-2">
                Current Discount Amount : {discountAmountFromServer}
              </p>
            </div>
            <div>
              <p className="block text-gray-700 text-sm font-semibold mb-2">
                Current Discount Status : {discountPaymentStatusFromServer}
              </p>
            </div>

            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="paymentStatus"
              >
                Update Order Payment Status
              </label>
              <select
                className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
                id="paymentStatus"
                required
                value={newPaymentStatus}
                onChange={(e) => setNewPaymentStatus(e.target.value)}
              >
                <option value="">Choose Payment Status</option>
                <option value="failed">Failed</option>
                <option value="success">Success</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="discountAmount"
              >
                Enter Discount Amount (Optional)
              </label>
              <input
                type="number"
                id="discountAmount"
                name="discount Amount"
                value={discountAmount}
                onChange={(e) => setDiscountAmount(e.target.value)}
                className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
                placeholder="Enter Discount Amount"
              />
            </div>

            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="discountStatus"
              >
                Choose Discount Status(Optional)
              </label>
              <select
                className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
                id="discountStatus"
                value={discountPaymentStatus}
                onChange={(e) => setDiscountPaymentStatus(e.target.value)}
              >
                <option value="">Choose Discount Status</option>
                <option value="failed">Failed</option>
                <option value="success">Success</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="otp"
              >
                Enter Secure OTP (One Time Password)
              </label>
              <input
                required
                type="number"
                id="otp"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
                placeholder="Enter OTP"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
              <button
                className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transform transition duration-300 ease-in-out hover:scale-105"
                type="submit"
              >
                Update Order Status
              </button>
              <button
                className="w-full sm:w-auto bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transform transition duration-300 ease-in-out hover:scale-105"
                type="button"
                onClick={() => {
                  setEditMode(false);
                  clearForm();
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white shadow-xl rounded-lg overflow-hidden mt-10">
        <h2 className="text-3xl font-extrabold text-gray-800 p-6 text-center border-b border-gray-200">
          Manage Client Orders 📋
        </h2>
        <div className="overflow-x-auto">
          {Object.keys(soretdOrders).length === 0 ? (
            <p className="text-center text-gray-600 py-8 text-lg">
              No orders available to manage.
            </p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Order ID
                  </th>
                  <th
                    scope="col"
                    className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Transaction Status
                  </th>
                  <th
                    scope="col"
                    className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Price
                  </th>
                  <th
                    scope="col"
                    className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date of Order
                  </th>
                  <th
                    scope="col"
                    className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {soretdOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6 text-sm font-medium text-gray-900">
                      {order.id}
                    </td>
                    <td className="py-4 px-6 text-sm font-medium text-gray-900">
                      {order.transactionStatus}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-700">
                      ₦{Number(order.totalAmount).toLocaleString()} NGN
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-700">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                        <Link
                          to={`/${isAdmin ? "admin" : "manager"}/manage-order/${
                            order.id
                          }`}
                          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                        >
                          View
                        </Link>
                        {order.transactionStatus !== "failed" && (
                          <button
                            onClick={() => {
                              setEditMode(true);

                              //set the form values
                              const totalAmount = Number(
                                order.totalAmount
                              ).toLocaleString();

                              setOrderId(order.id);
                              setPrice(totalAmount);
                              setPaymentMethod(order.paymentMethod);
                              setTransactionStatus(order.transactionStatus);
                              setDiscountAmount(order.discountAmount);
                              setDiscountAmountFromServer(order.discountAmount);
                              setDiscountPaymentStatusFromServer(
                                order.discountPaymentStatus
                              );
                              setDiscountPaymentStatus(
                                order.discountPaymentStatus
                              );
                              //navigate to the update form
                              document
                                .getElementById("updateOrderForm")
                                .scrollIntoView({ behavior: "smooth" });
                            }}
                            type="button"
                            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-gray-800 bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-300 transition duration-150 ease-in-out"
                          >
                            Edit
                          </button>
                        )}

                        {isAdmin && (
                          <button
                            type="button"
                            onClick={() => {
                              deleteOrderHandler(order.id);
                            }}
                            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
export default ManageOrders;
