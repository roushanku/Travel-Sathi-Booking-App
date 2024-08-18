import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { data } from "autoprefixer";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [searchProduct, setSearchProduct] = useState([]);
  const [filterHotel, setfilterHotel] = useState([]);

  useEffect(() => {
    if (!user) {
      axios.get("http://localhost:4000/profile").then(({ data }) => {
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
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
