import { createContext, useState, useEffect } from "react";
import { useJwt } from "react-jwt";
import { toast } from "react-toastify";

export const storeContext = createContext();

export const StoreProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [storeList, setStoreList] = useState([]);
  const [productData, setProductData] = useState({});
  const [cartData, setCartData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [orderList, setOrderList] = useState({});
  const [orderData, setOrderData] = useState({});
  const [localTime, setLocalTime] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState({});
  const [paymentLink, setPaymentLink] = useState("");
  const [fullName, setFullName] = useState("User");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isManager, setIsManager] = useState(false);

  //website url
  const API_URL = import.meta.env.VITE_BACKEND_URL;
  const APP_NAME = import.meta.env.VITE_APP_NAME;

  //get token from localstorage
  const token = localStorage.getItem("token");
  let decodedPayload;

  function isTokenExpired(token) {
    if (!token) return;

    try {
      const [, payload] = token.split(".");
      decodedPayload = JSON.parse(atob(payload));
      return decodedPayload.exp * 1000 < Date.now();
    } catch (error) {
      console.log(error);
    }
  }

  //check if loggedIn
  async function loginChecker() {
    try {
      //fetch token from local storage
      const localStorageToken = token;
      //set fullName from token

      console.log(localStorageToken);
      const tokenExpiryStatus = isTokenExpired(localStorageToken);
      if (tokenExpiryStatus === false) {
        console.log("token not false");
        setIsAuth(true);
        fetchOrders();
        if (decodedPayload.isAdmin === true) {
          setIsAdmin(true);
        } else if (decodedPayload.isManager === true) {
          setIsManager(true);
        }
      } else {
        setIsAuth(false);
        setIsAdmin(false);
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.log(error);
    }
  }

  //fetch all products on app load
  useEffect(() => {
    AllFeaturedProductsFetcher();
    loginChecker(); //check if user has loggedIn device
  }, []);

  async function createGatewayInvoice(orderId) {
    const response = await fetch(
      `${API_URL}/payment/initiate/order/${orderId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();
    console.log(data.response.data.link);
    setPaymentLink(data.response.data.link);
  }

  async function getDeliveryAddress(id) {
    try {
      const response = await fetch(`${API_URL}/delivery/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setDeliveryAddress(data);
    } catch (error) {
      console.log(error);
    }
  }

  function clockConverter(date) {
    try {
      const convertedTime = new Date(`${date}`).toLocaleString("en-US", {
        timeZone: "Africa/Lagos",
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      });
      setLocalTime(convertedTime);
      return;
    } catch (error) {
      console.log(error);
    }
  }

  //fetch order data from server
  async function orderFetcher(id) {
    try {
      const response = await fetch(`${API_URL}/orders/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setOrderData(data);
    } catch (error) {
      console.log(error);
    }
  }

  //fetch all orders from server
  async function fetchOrders() {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/orders`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      // console.log(data);
      setFullName(data.firstName);
      setOrderList(data);
      setIsLoading(false);
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  //cart fetcher
  function cartFetcher() {
    try {
      const updatedCartData = cartData.map((cartItem) => {
        // Add a 'quantity' attribute with a default value of 1 to each cartItem
        return { ...cartItem, quantity: 1 };
      });
      setCartData(updatedCartData);
    } catch (error) {
      console.log(error);
    }
  }
  
  //add new product to cart
  const addNewProductToCart = (product) => {
    try {
      const productWithQty = { ...product, quantity: 1 };
      setCartData([...cartData, productWithQty]);
    } catch (error) {
      console.log(error);
    }
  };

  //increase product qty
  function increaseQty(productId) {
    try {
      // Check if the product with productId is already in the cart
      const productIndex = cartData.findIndex(
        (cartItem) => cartItem.id === productId
      );

      if (productIndex !== -1) {
        // If the product is in the cart, update its quantity
        const updatedCartData = cartData.map((cartItem, index) => {
          if (index === productIndex) {
            // Increase the quantity by 1 only if it's equal or greater than 1
            const updatedQuantity =
              (cartItem.quantity || 0) >= 1 ? (cartItem.quantity || 0) + 1 : 1;

            return { ...cartItem, quantity: updatedQuantity };
          }
          return cartItem;
        });

        // Update the cartData with the modified array
        setCartData(updatedCartData);
      }
    } catch (error) {
      console.log(error);
    }
  }

  //decrease product quantity
  //increase product qty
  function decreaseQty(productId) {
    try {
      // Check if the product with productId is already in the cart
      const productIndex = cartData.findIndex(
        (cartItem) => cartItem.id === productId
      );

      if (productIndex !== -1) {
        // If the product is in the cart, update its quantity
        const updatedCartData = cartData
          .map((cartItem, index) => {
            if (index === productIndex) {
              // Decrease the quantity by 1 only if it's equal or greater than 1
              const updatedQuantity =
                (cartItem.quantity || 0) > 1 ? (cartItem.quantity || 0) - 1 : 0;

              // Return null to remove the item if the quantity becomes zero
              return updatedQuantity > 0
                ? { ...cartItem, quantity: updatedQuantity }
                : null;
            }
            return cartItem;
          })
          .filter(Boolean); // Filter out null values

        // Update the cartData with the modified array
        setCartData(updatedCartData);
      }
    } catch (error) {
      console.log(error);
    }
  }

  //fetch all products
  async function AllProductFetcher() {
    try {
      const response = await fetch(`${API_URL}/products`);
      const data = await response.json();

      setStoreList(data);
    } catch (error) {
      toast.error("We are unable to get all products at the moment");
    }
  }
  //fetch all products
  async function AllFeaturedProductsFetcher() {
    try {
      const response = await fetch(`${API_URL}/products/featured`);
      const data = await response.json();

      setStoreList(data);
    } catch (error) {
      toast.error("We are unable to get all products at the moment");
    }
  }

  //fetch single product
  async function productFetcher(id) {
    try {
      const response = await fetch(`${API_URL}/products/${id}`);
      const data = await response.json();
      setProductData(data);
      return data;
    } catch (error) {
      toast.error("We are unable to get this product at the moment");
    }
  }

  //fetch products of a category
  async function categoryProductFetcher(id) {
    try {
      const setId = Number(id);
      if (setId <= 2) {
        const response = await fetch(`${API_URL}/categories/${id}`);
        const data = await response.json();

        setStoreList(data);
      } else {
        return AllProductFetcher();
      }
    } catch (error) {
      toast.error(
        "We are unable to get products of this category at the moment"
      );
    }
  }

  //query products wih search
  async function queryProduct(categoryId, maxPrice, minPrice, productName) {
    try {
      const response = await fetch(
        `${API_URL}/products/s?categoryId=${categoryId}&maxPrice=${maxPrice}&minPrice=${minPrice}&name=${productName}&page=${currentPage}`
      );
      const data = await response.json();
      setStoreList(data.products);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Network error");
    }
  }

  //handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  //exporting states
  const contextObj = {
    isAuth,
    setIsAuth,
    isLoading,
    setIsLoading,
    storeList,
    setStoreList,
    productData,
    productFetcher,
    categoryProductFetcher,
    AllProductFetcher,
    queryProduct,
    cartData,
    setCartData,
    addNewProductToCart,
    cartFetcher,
    increaseQty,
    decreaseQty,
    handlePageChange,
    currentPage,
    totalPages,
    setTotalPages,
    orderList,
    fetchOrders,
    orderFetcher,
    orderData,
    localTime,
    clockConverter,
    deliveryAddress,
    getDeliveryAddress,
    paymentLink,
    createGatewayInvoice,
    setPaymentLink,
    API_URL,
    APP_NAME,
    fullName,
    token,
    isAdmin,
    setIsAdmin,
    isManager,
    setIsManager,
  };

  return (
    <storeContext.Provider value={contextObj}>{children}</storeContext.Provider>
  );
};
