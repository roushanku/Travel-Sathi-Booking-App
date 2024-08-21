import mongoose from "mongoose"
import { v4 as uuidv4 } from 'uuid';

const placeSchema = new mongoose.Schema({
    owner : {type:mongoose.Schema.Types.ObjectId , ref:'User'},
    title : String,
    address : String,
    photos : [String],
    description : String,
    perks : [String],
    extraInfo : String,
    checkIn : Number,
    checkOut : Number,
    maxGuests : Number,
    economyPrice : Number,
    bussinessPrice : Number,
    premiumPrice : Number,
    vibe : String,
    hotelId : {
        type : String,
        default: uuidv4,
    },   
});

placeSchema.index({
    'title' : 'text',
    'address' : 'text'
});

const PlaceModel = mongoose.model('Place' , placeSchema);

export default PlaceModel;