import { useEffect, useState } from "react";
import axios from "axios";
import HotelCard from "./HotelCard.js";

export default function NeayByHotel({ hotel }) {
  const [nearByHotel, setNearByHotel] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const address = hotel.hotel.address;
      const title = hotel.hotel.title;
    //   console.log("this is address", address);

      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/get-nearbycity`,
          { city: address  , title: title}
        );
        setNearByHotel(response.data);
        // console.log("this is nearby hotel", response.data);
      } catch (error) {
        console.log("error in fetching nearbyCity", error);
      }
    }
    fetchData();
  }, [hotel]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-center my-8 text-blue-600">
        Nearby Hotel
      </h1>
      <HotelCard hotels={nearByHotel} />
    </div>
  );
}
