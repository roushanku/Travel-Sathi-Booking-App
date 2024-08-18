import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import Perks from "../Perks";
import axios from "axios";
import PhotosUploader from "../PhotosUploader";
import PlacesFormPage from "./PlacesFormPage";
import AccountNav from "../AccountNav";

export default function Placespage() {
  const [reDirectToPlacesList, setreDirectToPlacesList] = useState(false);
  const [places, setPlaces] = useState([]);
  const [isAddNewPlace, setIsAddNewPlace] = useState(false);
  const { action } = useParams();

  useEffect(() => {
    axios.get("http://localhost:4000/user-places").then(({ data }) => {
      console.log("This is the data ", data);
      setPlaces(data);
    });

    // const fetchData = async ()=>{
    //   const res = await axios.get("")
    // }
  }, []);

  if (reDirectToPlacesList && !action) {
    return <Navigate to={"/account/places"} />;
  }

  function isClickedPlace() {
    setIsAddNewPlace(true);
  }

  return (
    <div>
      <AccountNav />
      {action !== "new" && (
        <div className="text-center">
          <Link
            className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full"
            to={"/account/places/new"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            <button onClick={isClickedPlace}>Add new Place</button>
          </Link>
        </div>
      )}
      {isAddNewPlace && <PlacesFormPage />}
      <div className="mt-4">
        {
          places.length > 0 && places.map((place,index) => {
            return (
            <Link to={'/account/places/' + place._id}key={index} className="flex cursor-pointer gap-4 bg-gray-200 p-4 rounded-2xl">
              <div className="w-20 h-32 bg-gray-300 grow shrink-0">
                {place.photos.length > 0 && (
                  <img src={'http://localhost:4000/uploads/'+place.photos[0]} alt=""></img>
                )} 
              </div> 
              <div className="grow-0 shrink">
              <h2 className="text-xl font-bold">{place.title}</h2>
              <p className="text-sm mt-2"> {place.description}</p>
              </div>
              </Link>
            );
          })
        }
      </div>
    </div>
  );
}
