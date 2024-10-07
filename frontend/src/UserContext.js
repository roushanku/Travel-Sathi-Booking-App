import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [searchProduct, setSearchProduct] = useState([]);
  const [filterHotel, setfilterHotel] = useState([]);
  const [formData, setFormData] = useState({
    checkInDate: "",
    checkOutDate: "",
    checkInTime: "",
    checkOutTime: "",
    guestName: "",
    numberOfGuests: 1,
    roomType: "standard",
  });

  useEffect(() => {
    if (!user) {
      axios.get(`${process.env.REACT_APP_BACKEND_URL}/profile`).then(({ data }) => {
        setUser(data);
        setReady(true);
      });
    }
  }, [user]); // Add user as a dependency to re-run the effect if user changes

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        ready,
        searchProduct,
        setSearchProduct,
        filterHotel,
        setfilterHotel,
        formData,
        setFormData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
