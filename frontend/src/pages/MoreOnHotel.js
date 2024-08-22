import axios from "axios";
import { useDeferredValue, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import HotelInfoCard from './HotelInfoCard.js'; // Make sure the path is correct

export default function MoreOnHotel() {
  const [hotel, setHotel] = useState({});
  const { id } = useParams();

  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/places/${id}`);
        // console.log("This is the data:", response.data);
        // console.log(hotel.photos[0]);
        setHotel(response.data);
      } catch (error) {
        console.error("Error fetching hotel data:", error);
      }
    };

    fetchHotelData();
  }, [id]);

  return (
    <>
      {Object.keys(hotel).length > 0 ? (
        <HotelInfoCard hotel={hotel} />
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
}

