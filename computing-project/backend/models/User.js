const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  city: String,
  country: String,
  timezone: String,
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  postcode: String,
});

const userProfileSchema = new mongoose.Schema({
  barber: {
    type: Boolean,
    default: false,
  },
  bio: {
    type: String,
    required: false,
    default: "I am a customer.",
  },
  services: {
    type: Array,
    required: false,
    default: ["dying"],
  },
  profile_picture: {
    type: String,
    default:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.nicepng.com%2Fpng%2Ffull%2F128-1280406_view-user-icon-png-user-circle-icon-png.png&f=1&nofb=1&ipt=75b590950a4feb915e2065423e5735e5545b2e0d0552534aeb31834f04206c4e&ipo=images",
    required: false,
  },
});

const userNeedsSchema = new mongoose.Schema({
  services: {
    type: Array,
  },
});

const userVerification = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: true,
  },
});

const barberPreferences = new mongoose.Schema({
  likedBarbers: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] },
  ],
  ignoredBarbers: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] },
  ],
});

const userSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    accountType: {
      type: String,
      enum: ["barber", "client"],
    },
    profile: userProfileSchema,
    location: locationSchema,
    needs: userNeedsSchema,
    barberPreferences: barberPreferences,
  },
  {
    timestamps: true,
  }
);

userSchema.index({ "location.coordinates": "2dsphere" });

const User = mongoose.model("User", userSchema);
module.exports = User;
