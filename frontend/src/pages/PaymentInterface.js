import React, { useState } from "react";
const PaymentMethod = ({ type, last4, expiry, isDefault, onClick }) => (
  <div
    className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
      isDefault
        ? "border-purple-500 shadow-md transform -translate-y-1"
        : "border-gray-200 hover:shadow-sm"
    }`}
    onClick={onClick}
  >
    <div className="flex items-center">
      {type === "visa" && (
        <div className="text-blue-600 font-bold mr-2">VISA</div>
      )}
      {type === "mastercard" && (
        <div className="text-orange-500 font-bold mr-2">MasterCard</div>
      )}
      {type === "paypal" && (
        <div className="text-blue-400 font-bold mr-2">PayPal</div>
      )}
      <div>
        <div className="text-sm">xxxx xxxx xxxx {last4}</div>
        <div className="text-xs text-gray-500">Expires {expiry}</div>
      </div>
    </div>
    <input
      type="radio"
      checked={isDefault}
      className="form-radio h-5 w-5 text-purple-600"
      readOnly
    />
  </div>
);

const PaymentInterface = ({ onSubmit }) => {
  const [selectedMethod, setSelectedMethod] = useState("visa");

  return (
    <div className="max-w-md bg-white p-6 rounded-xl shadow-md mt-8 ml-8">
      <div className="text-sm text-gray-500 mb-2">
        Account → Payment methods
      </div>
      <h2 className="text-2xl font-bold mb-4">Choose your payment method</h2>

      <div className="space-y-3 mb-4">
        <PaymentMethod
          type="visa"
          last4="8908"
          expiry="09/27"
          isDefault={selectedMethod === "visa"}
          onClick={() => setSelectedMethod("visa")}
        />
        <PaymentMethod
          type="mastercard"
          last4="7777"
          expiry="01/24"
          isDefault={selectedMethod === "mastercard"}
          onClick={() => setSelectedMethod("mastercard")}
        />
        <PaymentMethod
          type="paypal"
          last4="6498"
          expiry="12/23"
          isDefault={selectedMethod === "paypal"}
          onClick={() => setSelectedMethod("paypal")}
        />

        <div className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:shadow-sm">
          <div className="text-purple-600 mr-2">+</div>
          <div>Add Payment Method</div>
        </div>
      </div>

      <button
        className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold"
        onClick={onSubmit}
      >
        Submit
      </button>
    </div>
  );
};

export default PaymentInterface;
