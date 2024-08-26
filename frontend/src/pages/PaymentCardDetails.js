import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const PaymentCardDetails = ({ onCancel }) => {
  const amount = useParams().cost;
  const [cardDetails, setCardDetails] = useState({
    name: '',
    expiration: '',
    cardNumber: '',
    cvv: '',
    amount: '',
  });

  useEffect(() => {
    if (amount) {
      setCardDetails(prev => ({ ...prev, amount }));
    }
  }, [amount]);

  const handleChange = (e) => {
    setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Your payment is successful!', {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    // Reset form or redirect as needed
  };

  const handleCancel = () => {
    toast.error('Transaction cancelled', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    onCancel();
  };

  return (
    <div className="max-w-md bg-white rounded-xl shadow-md overflow-hidden ml-12">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
        <div className="flex justify-between items-start">
          <div className="w-12 h-8 bg-yellow-400 rounded-sm"></div>
          <div className="text-right">
            <div className="text-sm">{cardDetails.expiration || '09/25'}</div>
            <div className="mt-8 text-xl">{cardDetails.cardNumber || '0000 0000 0000 1600'}</div>
          </div>
        </div>
        <div className="mt-4">{cardDetails.name || 'Pascal Benoit'}</div>
        <div className="mt-1 text-sm">VISA</div>
      </div>
      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" name="name" value={cardDetails.name} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Expiration</label>
            <input type="text" name="expiration" value={cardDetails.expiration} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" placeholder="MM/YY" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Card Number</label>
            <input type="text" name="cardNumber" value={cardDetails.cardNumber} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">CVV</label>
            <input type="password" name="cvv" value={cardDetails.cvv} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <input type="text" name="amount" value={cardDetails.amount} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" readOnly />
          </div>
        </div>
        <div className="mt-6 flex justify-between">
          <button type="button" onClick={handleCancel} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentCardDetails;