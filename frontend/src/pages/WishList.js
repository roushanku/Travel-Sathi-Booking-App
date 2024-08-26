import { UserContext } from "../UserContext.js";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import HotelCard from "./HotelCard.js";

export default function WishList() {
  const [wishList, setWishList] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await axios.post("http://localhost:4000/wishlist", {
          userId: user.id,
        });
        // console.log(response.data);
        setWishList(response.data);
      } catch (error) {
        console.log("Error in getting wishlist", error);
      }
    };

    fetchWishlist();
  }, [user]);

  return (
    <>
      <h1 className="text-3xl font-bold text-center my-8 text-blue-600">
        Your Wishlist
      </h1>
      <HotelCard hotels={wishList} />
    </>
  );
}
