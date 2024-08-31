import { useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../UserContext.js";
import { useContext } from "react";
import { useParams } from "react-router-dom";
import HotelCard from "./HotelCard.js";
export default function BookingPage() {
  const [bookings, setBookings] = useState([]);
  const { user, setUser } = useContext(UserContext);
  console.log(user);
  const userId = user.id == null ? user._id : user.id;
  console.log("this is user ID"  ,userId );
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await axios.post(
          "http://localhost:4000/getBookings",
          {userId} 
        );
        console.log("this is booking pagae", response.data);
        // if (!response.ok) {
        //   throw new Error("Something went wrong in fetching your booking!");
        // }
      } catch (error) {
        console.error(error);
      }
    };
    fetchBooking();
  }, []);
  return (
    <div>
      <h1>Booking Page</h1>
      {/* <div className="flex flex-wrap gap-4">
        {bookings.map((booking) => (
          <HotelCard key={booking._id} hotel={booking} />
        ))}
      </div> */}
    </div>
  );
}
