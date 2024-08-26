import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PaymentInterface from './PaymentInterface';
import PaymentCardDetails from './PaymentCardDetails';

const CardDetailsConsoleParent = () => {
  const [showCardDetails, setShowCardDetails] = useState(false);

  const handlePaymentMethodSubmit = () => {
    setShowCardDetails(true);
  };

  const handleCancel = () => {
    setShowCardDetails(false);
  };

  return (
    <div className="flex p-8">
      <PaymentInterface onSubmit={handlePaymentMethodSubmit} />
      {showCardDetails && <PaymentCardDetails onCancel={handleCancel} />}
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