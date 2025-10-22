import { GiShop } from "react-icons/gi";
import { useContext } from "react";
import { storeContext } from "../context/storeContext";

function Footer() {
  const footerYear = new Date().getFullYear();
  
    const {  APP_NAME} = useContext(storeContext);

  return (
    <footer className="p-10 bg-gray-900 text-white text-center no-print">
      <span className="block">
        {APP_NAME} Store is the place to find all your goods at affordable price.
      </span>
      <div className="flex justify-center items-center space-x-4">
        <GiShop className="text-5xl" />
        <span>&copy; {footerYear} All rights reserved</span>
      </div>
    </footer>
  );
}
export default Footer;
