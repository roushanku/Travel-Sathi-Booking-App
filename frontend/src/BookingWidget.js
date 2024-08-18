import { useContext, useEffect, useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import axios from "axios";
import { Navigate, useParams } from "react-router-dom";
import { UserContext } from "./UserContext.js";

export default function BookingWidget({ place }) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [numberOfGuest, setNumberOfGuest] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [redirect, setRedirect] = useState("");
  const {id} = useParams();
  const {user,setUser} =  useContext(UserContext);

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  let numberOfNights = 0;
  if (checkIn && checkOut) {
    numberOfNights = differenceInCalendarDays(
      new Date(checkOut),
      new Date(checkIn)
    );
  }

  async function bookThisPlace() {
    // const data = {
    //     checkIn , checkOut , numberOfGuest , name , phone,
    //     place:place._id , price : numberOfNights * place.price,
    // };

    if(user) {
        const response = await axios.post("http://localhost:4000/bookings", {
        checkIn,
        checkOut,
        numberOfGuest,
        name,
        phone,
        place: place._id,
        price: numberOfNights * place.price,
        });

    const bookingId = response.data._id;
    setRedirect(`/account/bookings/ ${bookingId}`);
    }

    else{
        alert("Booking failed ,login first for booking")
    }
    
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div className="bg-gray-200 p-4 rounded-2xl">
      <div className="text-2xl text-center">
        Price : ${place.price} / Per Night
      </div>
      <div className="border rounded-2xl">
        <div className="flex">
          {/* <div className="py-4 px-4 rounded-2xl">
                    <label>Check in:</label>
                    <input type="date" value={checkIn} 
                    onChange={ev => setCheckIn(ev.target.value)}/>
                </div> */}

          <div className="py-4 px-4 rounded-2xl">
            <label>Check in:</label>
            <input
              type="date"
              value={checkIn}
              min={new Date().toISOString().split("T")[0]}
              onChange={(ev) => setCheckIn(ev.target.value)}
            />
          </div>

          <div className="py-4 px-4 rounded-2xl border-l">
            <label>Check out:</label>
            <input
              type="date"
              value={checkOut}
              onChange={(ev) => setCheckOut(ev.target.value)}
            />
          </div>
        </div>
        <div className="py-4 px-4 rounded-2xl border-l">
          <label>Number of guest:</label>
          <input
            type="number"
            value={numberOfGuest}
            onChange={(ev) => setNumberOfGuest(ev.target.value)}
          />
        </div>
        {numberOfNights > 0 && (
          <div>
            <div className="py-4 px-4 rounded-2xl border-l">
              <label>Your Full name :</label>
              <input
                type="text"
                value={name}
                onChange={(ev) => setName(ev.target.value)}
              />

              <label>Your phone number :</label>
              <input
                type="tel"
                value={phone}
                onChange={(ev) => setPhone(ev.target.value)}
              />
            </div>

            <button onClick={bookThisPlace} className="primary mt-4">
                {numberOfNights > 0 && (
                <>
                    <span>Amount to pay : $ {numberOfNights * place.price}</span>
                </>
                )}
                <br />
                Book this place
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
