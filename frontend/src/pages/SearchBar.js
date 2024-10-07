import React, { useContext, useEffect, useRef } from "react";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import ProductCard from "./DisplayHotel";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
const SearchBar = () => {
  const [available, setAvailable] = useState(false);

  const [searchText, setSearchText] = useState("");

  const [isInputEmpty, setIsInputEmpty] = useState(true);
  const { searchProduct, setSearchProduct, user } = useContext(UserContext);
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState([]);
  const debounceRef = useRef(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (user && user.email) {
      // Fetch search history on component mount if user exists
      const fetchHistory = async () => {
        try {
          const response = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/search-history-user`,
            { email: user.email }
          );
          // console.log("search history from DB", response.data);
          setHistory(response.data || []);
        } catch (error) {
          console.error("Error fetching search history:", error);
        }
      };

      fetchHistory();
    }
  }, [user]);

  const debounce = (func, delay) => {
    return (...args) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const fetchSuggestions = async (query) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/autosuggestion?search=${query}`
      );
      //   console.log(response);
      if (response) {
        setSuggestions(response.data);
      }
    } catch (err) {
      console.log("error in fetching data", err);
    }
  };

  const debouncedFetchSuggestions = debounce((query) => {
    if (query.length >= 3) {
      fetchSuggestions(query);
    } else {
      setSuggestions([]);
      setHistory([]);
    }
  }, 300);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchText(e.target.value);
    setIsInputEmpty(value.trim() === "");

    if (value.trim().length >= 3) {
      debouncedFetchSuggestions(value.trim());
    } else {
      setSuggestions([]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
      setSuggestions([]);
    }
  };

  const handleSearch = async () => {
    try {
      //   console.log("search text", searchText);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/search?search=${searchText}`
      );
      setSearchProduct(response.data);

      if (response.data !== null) {
        setAvailable(!available);
        navigate("/searchedProduct");
      }
    } catch (err) {
      console.log("error in searching", err);
    }

    if (user && user.email) {
      // Fetch search history on component mount if user exists
      const fetchHistory = async () => {
        try {
          const response = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/search-history`,
            { email: user.email, query: searchText }
          );
          //   setHistory(response.data || []);
        } catch (error) {
          console.error("Error fetching saving history:", error);
        }
      };

      fetchHistory();
    }
  };

  useEffect(() => {
    if (searchText) {
      handleSearch();
    }
  }, [searchText]);

  const clearSearchText = () => {
    setSearchText("");
    setIsInputEmpty(true);
    setSuggestions([]);
    setHistory([]);
  };

  const handleIconClick = () => {
    setSuggestions([]);
  };

  return (
    <>
      <div className="relative w-full max-w-md mx-auto mt-4">
        <input
          type="text"
          placeholder="Search for Hotels and Place"
          className="w-full py-2 px-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
          value={searchText}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
        />
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
          {searchText && (
            <CloseIcon
              className="text-black h-5 w-5 cursor-pointer"
              onClick={clearSearchText}
            />
          )}

          <SearchIcon
            className="text-black h-5 w-5 cursor-pointer"
            onClick={handleIconClick}
          />
        </div>

        {suggestions.length > 0 && (
          <ul className="absolute bg-white border border-gray-300 w-full mt-1 rounded-lg max-h-60 overflow-auto z-[1]">
            {suggestions.slice(0, 3).map((suggestion, index) => (
              <li
                key={index}
                className="py-2 px-4 cursor-pointer hover:bg-gray-200"
                onClick={async () => {
                  setSearchText(suggestion);
                  setIsInputEmpty(false);
                  setSuggestions([]);
                  // await handleSearch(searchText);
                }}
              >
                {suggestion}
              </li>
            ))}
          </ul>
          // <h3 className="font-bold">History:</h3>
          //   <ul className="bg-white border border-gray-300 w-full mt-1 rounded-lg max-h-60 overflow-auto z-[1]">
          //     {history.slice(0, 2).map((item, index) => (
          //       <li
          //         key={index}
          //         className="py-2 px-4 cursor-pointer hover:bg-gray-200"
          //         onClick={() => {
          //           setSearchText(item);
          //           setIsInputEmpty(false);
          //           setSuggestions([]);
          //         }}
          //       >
          //         {item}
          //       </li>
          //     ))}
          //   </ul>
          // </div>
        )}
      </div>
    </>
  );
};

export default SearchBar;
