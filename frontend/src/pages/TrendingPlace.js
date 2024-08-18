import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./DisplayHotel";
import { useContext } from "react";
import { UserContext } from "../UserContext";
import HotelCard from "./HotelCard";

const VibesFilter = ({ vibes, selectedVibe, setSelectedVibe }) => (
  <div className="text-center p-4">
    <h1 className="text-2xl font-bold mb-4">Quick and Trip Planner</h1>
    <h2 className="text-xl mb-6">Pick a vibe and explore top destinations</h2>
    <div className="p-4">
      {vibes.map((vibe, index) => (
        <button
          key={index}
          onClick={() => setSelectedVibe(vibe)}
          className={`m-2 p-2 rounded ${
            selectedVibe === vibe
              ? "bg-blue-700 text-white"
              : "bg-slate text-black-400 hover:bg-blue-700"
          }`}
        >
          {vibe}
        </button>
      ))}
    </div>
  </div>
);

const WelcomeText = () => (
  <div className="text-4xl font-bold text-center mb-8">
    <span className="inline-block animate-marquee">
      Welcome to TravelSathii, Let's Explore the World!!
    </span>
  </div>
);

const TrendingPlace = () => {
  const [vibes, setVibes] = useState([]);
  const [selectedVibe, setSelectedVibe] = useState("");
  const { filterHotel, setfilterHotel } = useContext(UserContext);

  useEffect(() => {
    const fetchVibes = async () => {
      try {
        const response = await axios.post(`http://localhost:4000/vibes`);

        const data = await response.data;
        // console.log(data);
        setVibes(data);
      } catch (error) {
        console.error("Error fetching vibes:", error);
      }
    };

    fetchVibes();
  }, []);

  useEffect(() => {
    const specificPlace = async () => {
      try {
        console.log("vibe", selectedVibe);
        const response = await axios.get(
          `http://localhost:4000/vibeplace/?search=${selectedVibe}`
        );

        const data = response.data;

        // setPlaces(data);
        // setSearchProduct(data);
        setfilterHotel(data);
      } catch (err) {
        console.error("Error fetching vibes:", err);
      }
    };
    specificPlace();
  }, [selectedVibe]);

  return (
    <div className="h-screen flex flex-col py-20">
      <WelcomeText />
      <VibesFilter
        vibes={vibes}
        selectedVibe={selectedVibe}
        setSelectedVibe={setSelectedVibe}
      />
      <HotelCard />
    </div>
  );
};

export default TrendingPlace;
