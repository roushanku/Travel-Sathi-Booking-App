import React, { useState } from "react";
import PhotoGallery from "./PhotosGallery.js";
import axios from "axios";
import { UserContext } from "../UserContext.js";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import HotelCard from "./HotelCard.js";
import NeayByHotel from "./NeayByHotel.js";

export default function HotelOverview(hotel) {
  // let photos = [hotel.photos[0], hotel.photos[0], hotel.photos[0]];
  const rating = 3.9; // Example rating, you can dynamically pass this as a prop or get it from `hotel`
  const [nearByCity, setNearByCity] = useState([]);
  const { user, setUser } = useContext(UserContext);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate(); // Hook to navigate programmatically
  const [errorMessage, setErrorMessage] = useState("");
  const Toast = ({ message, type }) => {
    return (
      <div
        className={`fixed top-4 right-4 p-4 rounded-md ${
          type === "success" ? "bg-green-500" : "bg-red-500"
        } text-white shadow-lg`}
      >
        {message}
      </div>
    );
  };
  const handleSaveToWishList = async (hotelId, userId) => {
    try {
      // console.log(userId);
      const response = await axios.post("${process.env.REACT_APP_BACKEND_URL}/save-wishlist", {
        hotelId,
        userId,
      });

      // console.log("this is res", response.data.message);

      setToast({ message: response.data.message, type: response.data.status });

      // Clear toast after 3 seconds
      setTimeout(() => setToast(null), 3000);
    } catch (error) {
      console.log("error in saving to wishlist", error);
      setToast({ message: "Error in saving to wishlist", type: "error" });

      // Clear toast after 3 seconds
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleSaveClick = () => {
    if (!user) {
      setErrorMessage("Please log in first to save the product.");
      setTimeout(() => {
        navigate("/login"); // Navigate to the login page after setting the error message
      }, 1000);
    } else {
      setErrorMessage(""); // Clear any previous error message
      handleSaveToWishList(hotel.hotel._id, user.id);
    }
  };

  const renderStars = () => {
    const totalStars = 5;
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;

    return (
      <div className="flex items-center">
        {[...Array(totalStars)].map((_, index) => {
          if (index < fullStars) {
            return (
              <span key={index} className="text-yellow-500 text-lg">
                ★
              </span>
            );
          } else if (index === fullStars && halfStar) {
            return (
              <span key={index} className="text-yellow-500 text-lg">
                ★
              </span>
            ); // Full star instead of half for simplicity
          } else {
            return (
              <span key={index} className="text-gray-300 text-lg">
                ★
              </span>
            );
          }
        })}
      </div>
    );
  };

  const FindnearByCity = async () => {
    const address = hotel.address;
    try {
      const nearbyCity = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/get-nearbycity`,
        address
      );
      setNearByCity(nearByCity);
    } catch {
      console.log("error in fetching nearbyCity");
    }
  };
  return (
    <div>
      <div>
        {/* Hotel Information */}
        <div className="flex justify-between items-center mt-4">
          <div>
            {renderStars()}
            <div className="text-gray-600">{hotel.address}</div>
            <div className="text-gray-600">0788 229 5752</div>
          </div>
          <div className="text-blue-600 font-bold text-xl">
            ₹{hotel.economyPrice}{" "}
            <span className="text-gray-500 text-sm">24-25 Aug</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-4">
          <div className="flex justify-end">
            <button
              onClick={() => console.log("Directions clicked")}
              className=" mr-2 bg-gray-200 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              Directions
            </button>
            <button
              onClick={handleSaveClick}
              className="mx-2 bg-gray-200 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              Save
            </button>
            {errorMessage && (
              <p className="text-red-500 mt-2">{errorMessage}</p>
            )}

            {toast && <Toast message={toast.message} type={toast.type} />}
            <button
              onClick={() => console.log("Share clicked")}
              className=" mx-2 bg-gray-200 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              Share
            </button>
          </div>
          <div>
            <button
              onClick={() => navigate(`/hotel/booking/${hotel.hotel._id}`)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Book a room
            </button>
          </div>
        </div>
      </div>
      <div>
        <PhotoGallery hotel={hotel} />
      </div>

      <div>
        <NeayByHotel hotel={hotel} />
      </div>
    </div>
  );
}
