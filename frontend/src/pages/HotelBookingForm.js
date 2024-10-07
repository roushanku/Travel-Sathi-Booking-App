import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../UserContext.js";
import { useContext } from "react";
export default function HotelBookingForm() {
  const navigate = useNavigate(); // Hook to navigate programmatically
  const { id } = useParams();
  const [hotelPrice, setHotelPrice] = useState(0);  
  const [hotel,setHotel] = useState([]);
  const { formData, setFormData } = useContext(UserContext);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/places/${id}`);
        setHotelPrice(response.data.price);
        setHotel(response.data);
      } catch (error) {
        console.error("Error fetching hotel data: ", error);
      }
    };
    fetchData();
  }, []);

  // const [formData, setFormData] = useState({
  //   checkInDate: "",
  //   checkOutDate: "",
  //   checkInTime: "",
  //   checkOutTime: "",
  //   guestName: "",
  //   numberOfGuests: 1,
  //   roomType: "standard",
  // });

  const [errors, setErrors] = useState({
    checkInTime: "",
  });

  const [costToPay, setCostToPay] = useState(null); // Set to null initially
  const nightlyRate = 100; // Example rate per night
  const today = new Date().toISOString().split("T")[0];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let error = "";

    if (name === "checkInTime" && formData.checkInDate) {
      const selectedTime = new Date(`${formData.checkInDate}T${value}`);
      const now = new Date();
      const selectedDate = new Date(formData.checkInDate);
      now.setSeconds(0, 0); // Reset seconds and milliseconds to compare times

      if (
        selectedDate.toDateString() === now.toDateString() &&
        selectedTime <= now
      ) {
        error = "Check-in time must be later than the current time";
      }
    }

    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: error,
    });
  };

  const calculateCost = () => {
    const checkIn = new Date(formData.checkInDate);
    const checkOut = new Date(formData.checkOutDate);
    const timeDifference = checkOut - checkIn;
    const daysDifference = timeDifference / (1000 * 3600 * 24);

    if (daysDifference > 0) {
      setCostToPay(daysDifference * hotelPrice);
    } else {
      alert("Checkout date must be after check-in date");
      setCostToPay(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateCost();
  };

  return (
    <div className="max-w-4xl bg-white p-6 rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-semibold mb-4">Hotel Booking Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Guest Name
            <input
              type="text"
              name="guestName"
              value={formData.guestName}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </label>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Number of Guests
            <input
              type="number"
              name="numberOfGuests"
              value={formData.numberOfGuests}
              onChange={handleInputChange}
              min="1"
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </label>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Room Type
            <select
              name="roomType"
              value={formData.roomType}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="standard">Standard</option>
              <option value="deluxe">Deluxe</option>
              <option value="suite">Suite</option>
            </select>
          </label>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Check-in Date
            <input
              type="date"
              name="checkInDate"
              value={formData.checkInDate}
              onChange={handleInputChange}
              min={today} // Restricts the date selection to today onwards
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </label>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Check-in Time
            <input
              type="time"
              name="checkInTime"
              value={formData.checkInTime}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </label>
          {errors.checkInTime && (
            <p className="text-red-500 text-sm mt-1">{errors.checkInTime}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Check-out Date
            <input
              type="date"
              name="checkOutDate"
              value={formData.checkOutDate}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </label>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Check-out Time
            <input
              type="time"
              name="checkOutTime"
              value={formData.checkOutTime}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </label>
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-purple-600 text-white rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          Calculate Cost
        </button>
      </form>

      {/* Conditionally render the Pay button after cost is calculated */}
      {costToPay !== null && (
        <div className="mt-4">
          <button
              onClick={() => navigate(`/hotel/payment/${hotel._id}/${costToPay}`)}
            className="w-full py-2 px-4 bg-green-600 text-white rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Pay ${costToPay}
          </button>
        </div>
      )}
    </div>
  );
}
