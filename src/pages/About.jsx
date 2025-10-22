import { motion } from "framer-motion";

function About() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.3 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, duration: 0.8 }}
      className="container about px-10"
    >
      <h1 className="text-4xl mb-4 ">About This App</h1>
      <p>
        This Ecommerce App allows you to buy goods and services available on the store.
      </p>
      <p>Version: 1.0.0</p>
    </motion.div>
  );
}
export default About;
