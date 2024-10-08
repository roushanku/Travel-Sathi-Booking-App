import mongoose, { model } from "mongoose";

const {Schema} = mongoose;

const UserSchema = new Schema({
    name : String,
    email : {
        type : String,
        unique : true
    },
    password : String,
    wishList : [{
        type : Schema.Types.ObjectId,
        ref : 'Place'
    }],
    roleType : {
        type : String,
        default : "customer"
    },
})

const UserModel = new mongoose.model('User' , UserSchema);

export default UserModel;