import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PaymentInterface from "./PaymentInterface";
import PaymentCardDetails from "./PaymentCardDetails";
import { UserContext } from "../UserContext.js";
import { useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const CardDetailsConsoleParent = () => {
  const [showCardDetails, setShowCardDetails] = useState(false);
  const { formData, setFormData } = useContext(UserContext);
  const { user, setUser } = useContext(UserContext);
  const { hotelID } = useParams();
  const handleShowCardDetails = () =>{
    setShowCardDetails(true);
  }

  const handlePaymentMethodSubmit = async () => {
    console.log("Payment Method Submitted");
    try {
      console.log(formData);
      const userId = user.id;

      const response = await axios.post("http://localhost:4000/booking", {
        hotelID,
        userId,
        formData,
      });
      console.log(response.data);
    } catch (error) {
      console.error("Error in Booking", error);
    }
  };

  const handleCancel = () => {
    setShowCardDetails(false);
  };

  return (
    <div className="flex p-8">
      <PaymentInterface onSubmit={handleShowCardDetails} />
      {showCardDetails && <PaymentCardDetails onCancel={handleCancel} onSubmit={handlePaymentMethodSubmit} />}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default CardDetailsConsoleParent;
