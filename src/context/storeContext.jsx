import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

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
  const [userEmail, setUserEmail] = useState("");
  const [managersList, setManagersList] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0)
  const [totalOrders, setTotalOrders] = useState(0)
  const [categoryList, setCategoryList] = useState([
  ]);

  //website url
  const API_URL = import.meta.env.VITE_BACKEND_URL;
  const APP_NAME = import.meta.env.VITE_APP_NAME;
  const token = localStorage.getItem("token");


  // 2. Centralized Logout Function
  // We define this early so we can use it in the useEffect
  const logOut = async (serverLogout = true) => {
    try {
      // Optional: Notify backend
      if (serverLogout) {
        await fetch(`${API_URL}/auth/logout`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      }
    } catch (error) {
      console.log("Logout error", error);
    } finally {
      // ALWAYS clear local state regardless of server response
      localStorage.removeItem("token");
      setIsAuth(false);
      setIsAdmin(false);
      setIsManager(false);
      setFullName("User");
      toast.info("You have been logged out.");
    }
  };

//fetch category list from server on app load
  useEffect(() => {
    categoryFetcher();
  }, []);

  // 3. The "Auto-Logout" Logic
  useEffect(() => {

    const localToken = localStorage.getItem("token");

    if (!localToken) {
      setIsAuth(false);
      return;
    }

    try {
      const decoded = jwtDecode(localToken);
      const currentTime = Date.now() / 1000; // Convert to seconds

      if (decoded.exp < currentTime) {
        // Token is ALREADY expired
        logOut(false);
      } else {
        // Token is Valid
        setIsAuth(true);

        // Handle Roles
        if (decoded.isAdmin) setIsAdmin(true);
        if (decoded.isManager) setIsManager(true);
        // If your token has a name, set it here: setFullName(decoded.name);


        // CALCULATE TIME LEFT and SET TIMER
        const timeUntilExpiry = (decoded.exp - currentTime) * 1000; // Convert back to ms

        console.log(
          `Auto-logout scheduled in ${timeUntilExpiry / 1000} seconds`,
        );

        const timer = setTimeout(() => {
          logOut(false); // Logout client-side when time is up
        }, timeUntilExpiry);

        // Cleanup: Clear timer if user closes app or logs out manually
        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.log("Invalid Token:", error);
      logOut(false);
    }
  }, []); // Runs once on mount

  async function createGatewayInvoice(orderId) {
    const response = await fetch(
      `${API_URL}/payment/initiate/order/${orderId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await response.json();
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
      const response = await fetch(`${API_URL}/order/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

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

      const data = await response.json();

      setOrderData(data);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchManagers() {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/user/managers`, {
        method: "GET",
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
      setManagersList(data);
      setIsLoading(false);
      return;
    } catch (error) {
      console.log(error);
    }
  }

  //fetch all orders from server
  async function fetchOrders(limit = 0) {
    try {
      setIsLoading(true);
      let response;
      if (limit === 0) {
        // Fetch all orders if limit is 0
        response = await fetch(
          `${API_URL}/order`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
      } else{
        // Fetch orders with pagination
        response = await fetch(`${API_URL}/order?limit=${limit}&page=${currentPage}`, {
         method: "GET",
         headers: {
           "Content-Type": "application/json",
           Authorization: `Bearer ${localStorage.getItem("token")}`,
         },
       });
      }

      const data = await response.json();

      if (!response.ok) {
        const error = data.message;
        const errorStatus = response.status;

        if (errorStatus == 401 || errorStatus == 403) {
          toast.error(error);
          logOut(false);
          return;
        }

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

      // console.log(data);
      setFullName(data.firstName);
      setOrderList(data);
      setTotalPages(data.meta.totalPages)
      setTotalOrders(data.meta.totalOrders)
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
        (cartItem) => cartItem.id === productId,
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
        (cartItem) => cartItem.id === productId,
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
  // async function AllProductFetcher() {
  //   try {
  //     const response = await fetch(`${API_URL}/product`);
  //     const data = await response.json();

  //     if (!response.ok) {
  //       const error = data.message;

  //       if (typeof error === "string") {
  //         toast.error(error);
  //         setIsLoading(false);
  //         return;
  //       }

  //       error.forEach((error) => {
  //         toast.error(error);
  //       });
  //       setIsLoading(false);
  //       return;
  //     }

  //     setStoreList(data);
  //   } catch (error) {
  //     toast.error("We are unable to get all products at the moment");
  //     console.log(error);
  //   }
  // }
  // //fetch all products
  // async function AllFeaturedProductsFetcher() {
  //   try {
  //     const response = await fetch(`${API_URL}/product/featured`);
  //     const data = await response.json();

  //     if (!response.ok) {
  //       const error = data.message;

  //       if (typeof error === "string") {
  //         toast.error(error);
  //         setIsLoading(false);
  //         return;
  //       }

  //       error.forEach((error) => {
  //         toast.error(error);
  //       });
  //       setIsLoading(false);
  //       return;
  //     }

  //     setStoreList(data);
  //   } catch (error) {
  //     console.log(error);
  //     toast.error("We are unable to get all products at the moment");
  //   }
  // }

  //fetch single product
  async function productFetcher(id) {
    try {
      const response = await fetch(`${API_URL}/product/${id}`);
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

      setProductData(data);
      return data;
    } catch (error) {
      toast.error("We are unable to get this product at the moment");
      console.log(error);
    }
  }

  //fetch products of a category
  // async function categoryProductFetcher(id) {
  //   try {
  //     const response = await fetch(
  //       `${API_URL}/product/s?limit=20&page=${currentPage}${id ? `&categoryId=${id}` : ""}`,
  //     );
  //     const data = await response.json();

  //     if (!response.ok) {
  //       const error = data.message;

  //       if (typeof error === "string") {
  //         toast.error(error);
  //         setIsLoading(false);
  //         return;
  //       }

  //       error.forEach((error) => {
  //         toast.error(error);
  //       });
  //       setIsLoading(false);
  //       return;
  //     }

  //     setStoreList(data.products);
  //     setTotalPages(data.meta.totalPages);
  //   } catch (error) {
  //     toast.error(
  //       "We are unable to get products of this category at the moment",
  //     );
  //     console.log(error);
  //   }
  // }

  //query products wih search
  async function queryProduct(
    categoryId = "",
    maxPrice = "",
    minPrice = "",
    productName = "",
    isFeatured = ""
  ) {
    try {
      let url = `${API_URL}/product/s?limit=20&page=${currentPage}`;
      if (categoryId.trim().length > 0) url += `&categoryId=${categoryId}`;
      if (maxPrice.trim().length > 0) url += `&maxPrice=${maxPrice}`;
      if (minPrice.trim().length > 0) url += `&minPrice=${minPrice}`;
      if (productName.trim().length > 0) url += `&name=${productName}`;
      if (isFeatured.trim().length > 0) url += `&isFeatured=${isFeatured}`;

      const response = await fetch(url);
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

      setStoreList(data.products);
      setTotalPages(data.meta.totalPages);
      setTotalProducts(data.meta.totalProducts)
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }
  // async function queryProduct(
  //   categoryId = "",
  //   maxPrice = "",
  //   minPrice = "",
  //   productName = "",
  //   isFeatured = ""
  // ) {
  //   try {
  //     let response;
  //     if (
  //       categoryId.trim().length === 0 ||
  //       maxPrice.trim().length === 0 ||
  //       minPrice.trim().length === 0 ||
  //       productName.trim().length === 0
  //     ) {
  //       isFeatured.trim().length !== 0 ? response = await fetch(
  //         `${API_URL}/product/s?limit=20&page=${currentPage}&isFeatured=${isFeatured}`) : response = await fetch(
  //           `${API_URL}/product/s?limit=20&page=${currentPage}`);
  //         } else {
  //           console.log("running all");
  //           response = await fetch(
  //             `${API_URL}/product/s?limit=20&page=${currentPage}&categoryId=${categoryId}&maxPrice=${maxPrice}&minPrice=${minPrice}&name=${productName}`,
  //           );
  //         }
          
  //         const data = await response.json();
  //         console.log(isFeatured, "this is featured", data, "categoryId", categoryId);

  //     if (!response.ok) {
  //       const error = data.message;

  //       if (typeof error === "string") {
  //         toast.error(error);
  //         setIsLoading(false);
  //         return;
  //       }

  //       error.forEach((error) => {
  //         toast.error(error);
  //       });
  //       setIsLoading(false);
  //       return;
  //     }

  //     setStoreList(data.products);
  //     setTotalPages(data.meta.totalPages);
  //     setTotalProducts(data.meta.totalProducts)
  //   } catch (error) {
  //     console.error("Error fetching products:", error);
  //   }
  // }

  //fetch category list from server
  async function categoryFetcher() {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/category`);
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
      console.log(data, "from cat api");
      setCategoryList(data);
      setIsLoading(false);
    } catch (error) {
      toast.error("We are unable to get categories at the moment");
      console.log(error);
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
    userEmail,
    setUserEmail,
    logOut,
    managersList,
    fetchManagers,
    totalProducts,
    totalOrders,
    categoryList,
    categoryFetcher
  };

  return (
    <storeContext.Provider value={contextObj}>{children}</storeContext.Provider>
  );
};
