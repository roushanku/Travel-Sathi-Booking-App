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
import fs from "fs";
import Booking from "./Models/Booking.js";
import SearchHistory from "./Models/History.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { rejects } from "assert";
import PlaceModel from "./Models/Place.js";
import { title } from "process";
import { v4 } from "uuid";
import axios from "axios";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "heieeomieie390443ndsm";
const MAX_QUERIES = 3;

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.get("/test", (req, res) => {
  res.send("This is test");
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
  // console.log(req.body);
  let Name = req.body.name;
  let Email = req.body.email;
  let Pass = req.body.password;
  console.log("Register Invoked");
  const newUser = new UserModel({
    name: Name,
    email: Email,
    password: bcrypt.hashSync(Pass, bcryptSalt),
  });
  const savedUser = await newUser.save();
  console.log(savedUser);
  res.json(savedUser);
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
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
    } else res.status(422).send("pass not ok");
  } else res.status(401).json("not found");
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

app.post("/upload-by-link", async (req, res) => {
  const newName = Date.now() + ".jpg";
  const { link } = req.body;
  //   console.log("imagedownloader");

  const url = link;
  const imagePath = path.resolve(__dirname, "uploads", newName); // path where the image will be saved

  downloadImage(url, imagePath)
    .then(() => console.log("Image downloaded successfully"))
    .catch((err) => console.error(err));
  console.log(newName);
  res.json(newName);
  // const {link} = req.body;
  // const newName = 'photo'+ Date.now() + '.jpg';
  // console.log(newName);
  // await imageDownloader.image({
  //   url : link,
  //   dest : __dirname + '/uploads/' + newName,
  // });

  // console.log("image downloaded...");
  // res.json(newName);
});

const photosMiddleware = multer({ dest: "uploads/" });

app.post("/upload", photosMiddleware.array("photos", 100), (req, res) => {
  // console.log(req.files);
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname } = req.files[i];
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = path + "." + ext;
    fs.renameSync(path, newPath);
    uploadedFiles.push(newPath);
    uploadedFiles.push(newPath.replace("uploads/", ""));
  }
  res.json(uploadedFiles);
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

app.post("/bookings", async (req, res) => {
  const { token } = req.cookies;
  const userData = await getUserDataFromToken(token);
  const { place, checkIn, checkOut, numgerOfGuest, name, phone, price } =
    req.body;
  // console.log(req.body);
  Booking.create({
    place,
    checkIn,
    checkOut,
    numgerOfGuest,
    name,
    phone,
    price,
    user: userData.id,
  })
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => {
      throw err;
    });
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

    console.log(req.query);

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

    console.log(modified);

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
    console.log(query);
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
  console.log(city);
  try {
    const nearbyCity = await Place.find({ address: city });
    // console.log(nearbyCity);
    res.status(200).json(nearbyCity);
  } catch (eror) {
    res.status(201).json({ message: "error in finding nearbycity" });
  }
});

app.post("/save-wishlist", async (req, res) => {
  const { hotelId } = req.body;
  const { userId } = req.body;
  console.log(hotelId);
  console.log(userId);
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      res.json({
        status: "error",
        message: "User not found",
      });
      return;
    }
    const hotel = await Place.findById(hotelId);
    if (!hotel) {
      res.json({
        status: "error",
        message: "Hotel not found",
      });
      return;
    }
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

app.listen(4000, () => {
  console.log("Server is running");
});
