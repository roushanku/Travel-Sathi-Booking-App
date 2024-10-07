import {useEffect, useState} from "react";
import axios from "axios";
import { Link } from "react-router-dom";
export default function IndexPage() {
    const [places , setPlaces] = useState([]);
    useEffect(() => {
      axios.get(`${process.env.REACT_APP_BACKEND_URL}/places`).then(response => {
        setPlaces(response.data);
      })
    } , []);
    return (
      <div className="mt-8 grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols4">
        {places.length > 0 && places.map(place => (
          <Link to={'/place/' + place._id}>
            <div className="bg-gray-500">
              this is for photos
              <br/>
              will be fix this soon stay updated....
              {/* {place.photos?.[0] && (
                <img src=`${process.env.REACT_APP_BACKEND_URL}/uploads/` + place/>
              )}  */}
              <img src="https://pix8.agoda.net/hotelImages/47148746/0/ccdf7c3bf969c4af4395dcf20f726ecc.jpg?ce=0&s=1024x768"></img>
              
            </div>
            <h3 className="font-bold">{place.address}</h3>
            <h2 className="text-sm truncate">{place.title}</h2>
            <div className="mt-1">
              <span className="font-bold">Price : ${place.price}</span> per night
            </div>
          </Link>
        ))} 
    </div>
    )
}