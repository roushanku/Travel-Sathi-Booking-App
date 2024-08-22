import React, { useState } from "react";
import HotelOverview from "./HotelOverview.js";
export default function HotelInfoCard({ hotel }) {
  const [activeTab, setActiveTab] = useState("Overview");

  const renderTabContent = () => {
    switch (activeTab) {
      case "Overview":
        return <HotelOverview hotel={hotel} />; // Using HotelOverview component
      case "Prices":
        return <p>Prices content goes here...</p>;
      case "Reviews":
        return <p>Reviews content goes here...</p>;
      case "Photos":
        return <p>Photos content goes here...</p>;
      case "About":
        return <p>About content goes here...</p>;
      default:
        return null;
    }
  };

  return (
    <div className="mx-60  rounded-lg shadow-md overflow-hidden mt-6 p-8">
      {/* Hotel Title */}
      <h1 className="text-3xl bg-green font-bold text-center mb-6">
        Welcome to {hotel.title}
      </h1>

      {/* Tabs */}
      <div className="flex justify-around border-b mb-6">
        {["Overview", "Prices", "Reviews", "Photos", "About"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-4 text-lg w-full ${
              activeTab === tab
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mb-8">{renderTabContent()}</div>
    </div>
  );
}
