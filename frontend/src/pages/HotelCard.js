import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../UserContext";
import { useNavigate } from 'react-router-dom';
const ITEMS_PER_PAGE = 3;

const HotelCard = (props) => {
  const { filterHotel, setfilterHotel } = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null); // State to track the currently selected product
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageProducts, setCurrentPageProducts] = useState([]);
  const navigate = useNavigate();  // Hook to navigate programmatically

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  let totalPages = 0;
  if (filterHotel.length > 0) {
    totalPages += Math.ceil(filterHotel.length / ITEMS_PER_PAGE);
  }

  //useeffect for srtting the current page product
  useEffect(() => {
    // Calculate the indices for the current page
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    // Get the current items for the current page
    const currentItems = filterHotel.slice(startIndex, endIndex);

    // Update the state with the current page products
    setCurrentPageProducts(currentItems);
  }, [filterHotel, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      {currentPageProducts && currentPageProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
          {currentPageProducts.map((product, index) =>
            product ? (
              <div
                key={index}
                onClick={() => navigate(`/hotel/${product._id}`)}  // Navigate to the new route
                className="max-w-sm mx-auto bg-white rounded-lg shadow-lg overflow-hidden my-4 m-4"
              >
                {product.photos.length > 0 ? (
                  <img
                    className="w-full h-48 object-cover"
                    src={product.photos[0]}
                    alt="Image"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No Image Available</span>
                  </div>
                )}
                <div className="p-4">
                  <h1 className="text-xl font-bold">Title: {product.title}</h1>
                  <p className="mt-2 text-gray-600">
                    Address: {product.address}
                  </p>
                  <p className="mt-2 text-gray-600">
                    Description: {product.description}
                  </p>
                  <p className="mt-2 text-gray-600">Price: ${product.price}</p>
                  <p className="mt-2 text-gray-600">
                    Max Guests: {product.maxGuests}
                  </p>
                  <button
                    onClick={() => handleOpenModal(product)}
                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                  >
                    More Details
                  </button>
                </div>
              </div>
            ) : (
              <div key={index}></div>
            )
          )}
        </div>
      ) : (
        <div></div>
      )}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg overflow-hidden shadow-lg max-w-md mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">
              Details of {selectedProduct.title}
            </h2>
            <p className="text-gray-700">Address: {selectedProduct.address}</p>
            <p className="text-gray-700">
              Description: {selectedProduct.description}
            </p>
            <p className="text-gray-700">Price: ${selectedProduct.price}</p>
            <p className="text-gray-700">
              Max Guests: {selectedProduct.maxGuests}
            </p>
            <button
              onClick={handleCloseModal}
              className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-center my-4">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => handlePageChange(i + 1)}
            className={`mx-1 px-3 py-1 border rounded ${
              currentPage === i + 1
                ? "bg-blue-500 text-white"
                : "bg-white text-blue-500"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </>
  );
};

export default HotelCard;
