import { useContext } from "react";
import { storeContext } from "./context/storeContext";
import Navbar from "./layout/Navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Footer from "./layout/Footer";
import Shop from "./pages/Shop";
import Product from "./components/Product";
import Login from "./components/Login";
import Register from "./pages/Register";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import NotFound from "./pages/NotFound";
import Logout from "./components/Logout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Orders from "./components/Orders";
import OrderItem from "./components/OrderItem";
import ProductUploadForm from "./components/ProductUploadForm";
import ManageProducts from "./components/ManageProducts";
import ManageOrders from "./components/ManageOrders";
import ManageOrderItem from "./components/ManageOrderItem";
import AdminDashboard from "./pages/AdminDashboard";
import ManageProductItem from "./components/ManageProductItem";
import ManageRoles from "./components/ManageRoles";
import ResetPassword from "./pages/ResetPassword";
import ResetVerification from "./components/ResetVerification";

function App() {
  const { isAuth, isAdmin, isManager } = useContext(storeContext);
  return (
    <Router>
      <Navbar />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/about" element={<About />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/admin/product/:id" element={<ManageProductItem />} />
        <Route path="/order/:id" element={isAuth ? <OrderItem /> : <Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route
          path="/resetpasswordverification"
          element={isAuth ? <Orders /> : <ResetVerification />}
        />
        <Route
          path="/resetpassword"
          element={isAuth ? <Orders /> : <ResetPassword />}
        />
        <Route path="/logout" element={isAuth ? <Logout /> : <Login />} />
        <Route path="/login" element={isAuth ? <Orders /> : <Login />} />
        <Route path="/orders" element={isAuth ? <Orders /> : <Login />} />
        <Route
          path="/admin/product-upload"
          element={isAuth && isAdmin ? <ProductUploadForm /> : <Login />} //for admin only
        />
        <Route
          path="/admin/manage-roles"
          element={isAuth && isAdmin ? <ManageRoles /> : <Login />} //for admin only
        />
        <Route
          path="/admin/manage-products"
          element={isAuth && isAdmin ? <ManageProducts /> : <Login />} //for admin only
        />

        <Route
          path={isManager ? "/manager/dashboard" : "/admin/dashboard"}
          element={
            isAuth && (isAdmin || isManager) ? <AdminDashboard /> : <Login />
          }
        />
        <Route
          path={
            isManager ? "/manager/manage-order/:id" : "/admin/manage-order/:id"
          }
          element={
            isAuth && (isAdmin || isManager) ? <ManageOrderItem /> : <Login />
          }
        />
        <Route
          path={isManager ? "/manager/manage-orders" : "/admin/manage-orders"}
          element={
            isAuth && (isAdmin || isManager) ? <ManageOrders /> : <Login />
          }
        />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
