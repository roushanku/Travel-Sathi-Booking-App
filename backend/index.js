import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import UserModel from "./Models/User.js";
import Place from "./Models/Place.js";
import bcrypt from "bcryptjs";
import "dotenv/config";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import imageDownloader from "image-downloader";
import path, { resolve } from "path";
import downloadImage from "./controller/image_controller.js";
import multer from "multer";
import fs, { stat } from "fs";
import Booking from "./Models/Booking.js";
import SearchHistory from "./Models/History.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { rejects } from "assert";
import PlaceModel from "./Models/Place.js";
import { title } from "process";
import { v4 } from "uuid";
import axios from "axios";
import BookingsModel from "./Models/Booking.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "heieeomieie390443ndsm";
const MAX_QUERIES = 3;

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.get("/", (req, res) => {
  res.send("Express on Vercel");
});
// connecting to DB
// dAhGXLPdNsUQBQuE
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Conected");
  })
  .catch((err) => {
    console.log(`${err} did not connect`);
  });

app.post("/register", async (req, res) => {
  let { name, email, password, roleType } = req.body;

  try {
    const existingUser = await UserModel.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "User already registered..." });
    }

    const newUser = new UserModel({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
      roleType,
    });

    const savedUser = await newUser.save();
    res
      .status(201)
      .json({ message: "User registered successfully", user: savedUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userDoc = await UserModel.findOne({ email });
    if (userDoc) {
      const passok = bcrypt.compareSync(password, userDoc.password);
      if (passok) {
        jwt.sign(
          { email: userDoc.email, id: userDoc._id },
          jwtSecret,
          {},
          (err, token) => {
            if (err) throw err;
            res.cookie("token", token).json(userDoc);
          }
        );
      } else {
        res.status(422).json({ message: "Incorrect password" });
      }
    } else {
      res.status(401).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const { name, email, id } = await UserModel.findById(userData.id);
      res.json({ name, email, id });
    });
  } else {
    res.json(null);
  }
  // res.json({token});
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json(true);
});

app.post("/places", (req, res) => {
  const { token } = req.cookies;
  const {
    title,
    address,
    photos,
    description,
    Perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
    vibe,
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;

    const placeDoc = await Place.create({
      owner: userData.id,
      price,
      title,
      address,
      photos,
      description,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      Perks,
      vibe,
    });
    res.json(placeDoc);
  });
});

app.get("/user-places", (req, res) => {
  const { token } = req.cookies;
  // console.log("This is the toke:",token);
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    const { id } = userData;
    res.json(await Place.find({ owner: id }));
  });
});

app.get("/places/:id", async (req, res) => {
  // res.json(req.params);
  const { id } = req.params;
  res.json(await Place.findById(id));
});

app.put("/places", async (req, res) => {
  const { token } = req.cookies;
  let hotelId = uuidv4();
  const {
    id,
    title,
    address,
    addedPhotos,
    description,
    Perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    economyPrice,
    bussinessPrice,
    premiumPrice,
  } = req.body;

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    const placeDoc = await Place.findById(id);
    if (userData.id === placeDoc.owner.toString()) {
      placeDoc.set({
        title,
        address,
        addedPhotos,
        description,
        Perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        economyPrice,
        bussinessPrice,
        premiumPrice,
        hotelId,
      });
      await placeDoc.save();
    }
    res.json("ok");
  });
});

app.get("/places", async (req, res) => {
  res.json(await Place.find());
});

app.post("/booking", async (req, res) => {
  const { token } = req.cookies;
  const userData = await getUserDataFromToken(token);
  const { hotelId, userId, formData, totalPrice } = req.body;
  const { checkInDate, checkOutDate, numberOfGuests, roomType } = formData;
  console.log("booking called..", hotelId, userId, formData, totalPrice);
  try {
    const booked = await BookingsModel.create({
      userId,
      hotelId,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      roomType,
      totalPrice,
    });
    console.log("Reached");
    await booked.save();
    res.json({
      status: true,
      message: "Booking done!",
    });
  } catch (err) {
    res.json({
      status: false,
      message: err,
    });
  }
});

app.post("/getBookings", async (req, res) => {
  const { userId } = req.body;
  console.log("this is user ID", userId);
  console.log(userId);
  try {
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const bookings = await BookingsModel.find({ userId: userId });
    if (!bookings) {
      return res.status(400).json({ message: "No bookings found" });
    }
    console.log(bookings);
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

function getUserDataFromToken(token) {
  return new Promise((resolve, rejects) => {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      resolve(userData);
    });
  });
}

app.get("/bookings", async (req, res) => {
  const { token } = req.cookies;
  const userData = await getUserDataFromToken(token);
  res.json(await Booking.find({ user: userData.id }).populate("place"));
});

app.get("/search", async (req, res) => {
  try {
    const query = req.query.search;

    // console.log(req.query);

    const searchCriteria = [];

    if (query) {
      searchCriteria.push(
        { title: { $regex: query, $options: "i" } },
        { address: { $regex: query, $options: "i" } }
      );
    }

    let modified;
    if (searchCriteria.length > 0) {
      modified = await Place.find({ $or: searchCriteria });
    } else {
      modified = await Place.find();
    }

    // console.log(modified);

    res.status(200).json(modified);
  } catch (err) {
    // Handle errors and send the error response
    console.error(err);
    res.status(500).send(err);
  }
});

app.get("/autosuggestion", async (req, res) => {
  try {
    const query = req.query.search;

    // console.log(query);

    if (!query) {
      return res.status(400).json({ message: "Search pattern is required" });
    }

    const regex = new RegExp(query, "i");

    //using aggregation pipelines..
    const pipeline = [
      { $match: { $or: [{ address: regex }, { title: regex }] } },
      { $project: { title: 1, address: 1, _id: 0 } },
      { $limit: 100 },
    ];

    const autoSuggestionResults = await PlaceModel.aggregate(pipeline);
    // console.log(autoSuggestionResults);

    const exactMatches = new Set();
    const regexMatches = new Set();

    autoSuggestionResults.forEach((item) => {
      if (item.address.toLowerCase().includes(query.toLowerCase())) {
        exactMatches.add(item.address.toLowerCase());
      }

      if (item.title.toLowerCase().includes(query.toLowerCase())) {
        exactMatches.add(item.title.toLowerCase());
      }
    });

    // console.log("Exact Matches:", exactMatches);
    const combinedMatches = Array.from(
      new Set([...exactMatches, ...regexMatches])
    ).slice(0, 10);

    res.status(200).json(combinedMatches);
  } catch (error) {
    // console.error('Error in fetching name and address:', error);
    res.status(500).json({ message: "Error in fetching name and address" });
  }
});

app.post("/vibes", async (req, res) => {
  try {
    const result = await PlaceModel.find({}, { vibe: 1, _id: 0 });
    const vibesSet = new Set(result.map((item) => item.vibe));
    const vibesArray = Array.from(vibesSet);
    vibesArray.push("All");
    vibesArray.sort();
    res.status(200).json(vibesArray);
  } catch (error) {
    console.error("Error fetching vibes:", error);
    res.status(500).json({ message: "Error in vibes" });
  }
});

app.get("/vibeplace", async (req, res) => {
  try {
    const query = req.query.search;
    // console.log(query);
    let place;
    if (query === "All") {
      const hotel = await PlaceModel.find();
      place = hotel;
    } else {
      const hotel = await PlaceModel.find({ vibe: query }, {});
      place = hotel;
    }

    res.status(200).json(place);
  } catch {
    res
      .status(500)
      .json({ message: "Error in finding place of specific vibes" });
  }
});

app.post("/search-history-user", async (req, res) => {
  const { email } = req.body;
  try {
    const history = await SearchHistory.findOne({ email: email });
    res.json(history ? history.queries : []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Endpoint to add a new search query for a specific user
app.post("/search-history", async (req, res) => {
  const { email, query } = req.body;

  try {
    let history = await SearchHistory.findOne({ email });

    if (!history) {
      history = new SearchHistory({ email, queries: [query] });
    } else {
      // Remove duplicate queries
      history.queries = history.queries.filter((q) => q !== query);
      // Add the new query to the start of the array
      history.queries.unshift(query);
      // Limit the number of stored queries
      if (history.queries.length > MAX_QUERIES) {
        history.queries.pop();
      }
    }

    await history.save();
    res.status(201).json(history.queries);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.post("/get-nearbycity", async (req, res) => {
  const { city, title } = req.body;
  // console.log(city);
  try {
    const nearbyCity = await Place.find({ address: city });
    // console.log(nearbyCity);
    res.status(200).json(nearbyCity);
  } catch (eror) {
    res.status(201).json({ message: "error in finding nearbycity" });
  }
});

app.post("/save-wishlist", async (req, res) => {
  const { hotelId, userId } = req.body;
  // console.log("debug", userId);

  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.json({
        status: "error",
        message: "User not found",
      });
    }

    const hotel = await Place.findById(hotelId);
    if (!hotel) {
      return res.json({
        status: "error",
        message: "Hotel not found",
      });
    }

    // Check if the hotel is already in the wishlist
    const isAlreadyInWishlist = user.wishList.some(
      (wish) => wish.toString() === hotelId
    );

    if (isAlreadyInWishlist) {
      return res.json({
        status: "success",
        message: "Hotel is already in your wishlist",
      });
    }

    // Add the hotel to the wishlist
    user.wishList.push(hotel);
    await user.save();

    res.json({
      status: "success",
      message: "Hotel added to wishlist",
    });
  } catch (err) {
    res.json({
      status: "error",
      message: "Error in adding hotel to wishlist",
    });
  }
});

app.post("/wishlist", async (req, res) => {
  const { userId } = req.body;
  // console.log("debug", userId);
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      res.json({
        status: "error",
        message: "User not found",
      });
      return;
    }
    res.json(user.wishList);
  } catch (err) {
    res.json({
      status: "error",
      message: "Error in getting wishlist",
    });
  }
});

app.listen(4000, () => {
  console.log("Server is running");
});
