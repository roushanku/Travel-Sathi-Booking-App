import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';
const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    default: uuidv4, // Generate a unique ID by default
    unique: true,
  },
  userId: {
    type: String,
    required: true,
    ref: "User", // Reference to the User model
  },
  hotelId: {
    type: String,
    required: true,
    ref: "Place", // Reference to the Hotel model
  },
  checkInDate: {
    type: Date,
    required: true,
  },
  checkOutDate: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        return value > this.checkInDate;
      },
      message: "Checkout date must be after check-in date.",
    },
  },
  bookingTime: {
    type: Date,
    default: Date.now, // Automatically sets the booking time to the current date and time
    required: true,
  },
  numberOfGuests: {
    type: Number,
    required: true,
    min: 1,
  },
  roomType: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending",
  },
  totalPrice: {
    type: Number,
    required: true,
  },
});

const BookingsModel = mongoose.model("Bookingschema", bookingSchema);

export default BookingsModel;
