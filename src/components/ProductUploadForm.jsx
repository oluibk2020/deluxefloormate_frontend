import React, { useState, useContext, useCallback } from "react";
import { storeContext } from "../context/storeContext";
import { Link } from "react-router-dom";
import { toast } from "react-toastify"; // Assuming you have react-toastify installed

function ProductUploadForm() {
  const { API_URL, token } = useContext(storeContext); // Removed isAdmin as it's not used here

  // Consolidated form data into a single state object for better management
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    quantity: "",
    categoryId: "", // Moved categoryId into formData
    imageFile: null, // Stores the File object
    imageUrl: null, // Stores the URL after successful image upload
    imagePreview: null, // Stores the object URL for preview
    featured: false,
    costPrice: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB

  // Handles changes for all text/number inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handles image file selection and validation
  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];

    // Reset image related states
    setFormData((prev) => ({
      ...prev,
      imageFile: null,
      imageUrl: null,
      imagePreview: null,
    }));

    if (!selectedFile) {
      return;
    }

    // Validate file size
    if (selectedFile.size > MAX_FILE_SIZE) {
      toast.error("File size exceeds 3MB limit. Please choose a smaller file.");
      return;
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error("Only JPG, PNG, and GIF formats are allowed.");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      imageFile: selectedFile,
      imagePreview: URL.createObjectURL(selectedFile),
    }));
  };

  // Function to upload the image
  const uploadImage = useCallback(async () => {
    if (!formData.imageFile) {
      throw new Error("No image file selected for upload.");
    }

    const data = new FormData();
    data.append("image", formData.imageFile);

    try {
      const response = await fetch(
        "https://deluxefloormate.com/private/upload.php", // Your image upload endpoint
        {
          method: "POST",
          body: data,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to upload image. Please try again."
        );
      }

      const imageData = await response.json();
      if (imageData.status === "success" && imageData.url) {
        toast.success("Image uploaded successfully!");
        return imageData.url; // Return the URL
      } else {
        throw new Error(
          imageData.message || "Image upload failed with an unknown error."
        );
      }
    } catch (error) {
      console.error("Image upload error:", error);
      throw error; // Re-throw to be caught by the main submit handler
    }
  }, [formData.imageFile]);

  // Function to create the product
  const createProduct = useCallback(
    async (uploadedImageUrl) => {
      const {
        title,
        description,
        price,
        quantity,
        categoryId,
        featured,
        costPrice,
      } = formData;

      // Client-side validation for product details
      if (
        !title ||
        !description ||
        !price ||
        !quantity ||
        !categoryId ||
        !uploadedImageUrl ||
        !costPrice
      ) {
        throw new Error("All product fields and image are required.");
      }

      const payload = {
        title,
        description,
        price: Number(price),
        imageUrl: uploadedImageUrl,
        categoryId: Number(categoryId),
        quantity: Number(quantity),
        featured: Boolean(featured),
        cost: Number(costPrice),
      };

      try {
        const response = await fetch(`${API_URL}/product/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Failed to add product. Please try again."
          );
        }

        const productData = await response.json();
        toast.success(
          `Product "${productData.title || title}" added successfully!`
        );
        console.log("Product upload response:", productData);

        // Clear form after successful submission
        setFormData({
          title: "",
          description: "",
          sellingPrice: "",
          quantity: "",
          categoryId: "",
          imageFile: null,
          imageUrl: null,
          imagePreview: null,
          featured: false,
          costPrice: "",
        });
      } catch (error) {
        console.error("Product creation error:", error);
        throw error; // Re-throw to be caught by the main submit handler
      }
    },
    [formData, API_URL, token]
  );

  // Main submit handler for the entire form
  const handleCombinedSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let finalImageUrl = formData.imageUrl; // Use existing URL if available

      // If no image is uploaded yet, or a new file is selected, upload it
      if (!finalImageUrl && formData.imageFile) {
        finalImageUrl = await uploadImage();
        setFormData((prev) => ({ ...prev, imageUrl: finalImageUrl })); // Store the URL for potential re-submission without re-uploading
      } else if (!formData.imageFile && !finalImageUrl) {
        // Case: No file selected and no existing URL
        throw new Error("Please select an image file for the product.");
      }

      // Now create the product with the (newly uploaded or existing) image URL
      await createProduct(finalImageUrl);
    } catch (error) {
      toast.error(error.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto my-10 p-8 bg-white rounded-lg shadow-xl border border-gray-200">
      <Link
        to="/admin/manage-products"
        className="mb-8 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300"
      >
        🔙 Manage All Products
      </Link>
      <h2 className="text-3xl font-bold mb-8 text-gray-900 text-center">
        ➕ Add New Product
      </h2>

      <form onSubmit={handleCombinedSubmit}>
        {/* Image Upload Section */}
        <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            🖼️ Product Image
          </h3>

          <div className="mb-4">
            <label
              htmlFor="image-upload"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Select Image (Max 3MB, JPG, PNG, GIF)
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/jpeg, image/png, image/gif"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100 cursor-pointer"
            />
          </div>

          {formData.imagePreview && (
            <div className="mt-4 p-4 border border-dashed border-gray-300 rounded-md bg-gray-100 flex justify-center items-center">
              <img
                src={formData.imagePreview}
                alt="Image Preview"
                className="max-w-full h-auto max-h-48 object-contain rounded-md shadow-sm"
              />
            </div>
          )}
          {/* Messages for image upload are now handled by react-toastify */}
        </div>

        {/* Product Details Section */}
        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            🛒 Product Details
          </h3>

          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Product Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label
                htmlFor="costPrice"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Cost Price
              </label>
              <input
                type="number"
                id="costPrice"
                name="costPrice"
                value={formData.costPrice}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Selling Price
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="quantity"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Quantity
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                step="1" // Quantity should typically be integers
                min="0"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div className="mb-4">
            {" "}
            <label
              htmlFor="featured"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Choose To Show On Home Page
            </label>
            <select
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              id="featured"
              name="featured" // Added name attribute
              value={formData.featured} // Controlled component
              onChange={handleInputChange} // Use the consolidated handler
              required
            >
              <option value="">Select to Feature</option>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </div>
          <div className="mb-4">
            {" "}
            {/* Moved categoryId outside the grid for single column on mobile */}
            <label
              htmlFor="categoryId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category
            </label>
            <select
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              id="categoryId"
              name="categoryId" // Added name attribute
              value={formData.categoryId} // Controlled component
              onChange={handleInputChange} // Use the consolidated handler
              required
            >
              <option value="">Select category</option>
              <option value="1">7ft * 10ft Rugs</option>
              <option value="2">Throw pillows</option>
              <option value="3">5ft * 7ft Rugs</option>
              <option value="4">3ft * 5ft Rugs</option>
              <option value="5">10ft * 13ft Rugs</option>
              <option value="6">Footmat</option>
              <option value="7">Skirtings</option>
              <option value="8">European Armstrong carpet</option>
              <option value="9">Diffuser</option>
              <option value="10">PVC vinyl tiles</option>
              <option value="11">Vinyl plank</option>
              <option value="12">Laminate floor</option>
              <option value="13">Wall to wall rug</option>
              <option value="14">8ft * 11ft Rugs</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`mt-8 w-full py-3 px-4 rounded-md text-white text-lg font-medium
            ${
              isLoading
                ? "bg-indigo-300 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
            transition duration-150 ease-in-out`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-6 w-6 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </span>
          ) : (
            "Add Product"
          )}
        </button>
        {/* Consolidated messages are now handled by react-toastify */}
      </form>
    </div>
  );
}

export default ProductUploadForm;
