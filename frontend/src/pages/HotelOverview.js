import React, { useState } from "react";
import PhotoGallery from "./PhotosGallery.js";
import axios from "axios";
import HotelCard from "./HotelCard.js";
export default function HotelOverview(hotel) {
  // let photos = [hotel.photos[0], hotel.photos[0], hotel.photos[0]];
  const rating = 3.9; // Example rating, you can dynamically pass this as a prop or get it from `hotel`
  const [nearByCity, setNearByCity] = useState([]);
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
        `http://localhost:4000/get-nearbycity`,
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
              onClick={() => console.log("Save clicked")}
              className=" mx-2 bg-gray-200 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              Save
            </button>
            <button
              onClick={() => console.log("Share clicked")}
              className=" mx-2 bg-gray-200 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              Share
            </button>
          </div>
          <div>
            <button
              onClick={() => console.log("Book a room clicked")}
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
    </div>
  );
}
