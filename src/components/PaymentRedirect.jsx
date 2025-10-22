import { useContext } from "react";
import {storeContext }from "../context/storeContext";

function PaymentRedirect({ link }) {
  const {
    setPaymentLink,
  } = useContext(storeContext);
  function resetPaymentLink() {
    setPaymentLink("")
  }

  return (
    <section className="rounded-3xl shadow-2xl">
      <div className="p-8 text-center sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-widest text-pink-500">
          Your order is now pending
        </p>

        <h2 className="mt-6 text-3xl font-bold">
          You will be redirected for you to make payment for the order!
        </h2>

        <a
          className="mt-8 inline-block w-full rounded-full bg-pink-600 py-4 text-sm font-bold text-white shadow-xl"
          href={link}
          target="_blank"
          onClick={resetPaymentLink}
          rel="noopener noreferrer"
        >
          Pay Now
        </a>
      </div>
    </section>
  );
}
export default PaymentRedirect;
