const User = require("../models/User");
const AuthHelper = require("../helpers/AuthHelper");
const { getDistanceFromLatLonInKm } = require("../helpers/GeoHelper");
const mongoose = require("mongoose");

class UserExistsError extends Error {
  constructor(message) {
    super(message);
    this.name = "UserExistsError";
  }
}
class InvalidCredentialsError extends Error {
  constructor(message) {
    super(message);
    this.name = "InvalidCredentialsError";
  }
}

class UserService {
  async userExists(type, value) {
    try {
      const user = await User.findOne({ [type]: value });

      return user ? true : false;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async findById(id) {
    try {
      return await User.findById(id);
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async register(full_name, email, password, accountType = "client") {
    try {
      if (await this.userExists("email", email)) {
        throw new UserExistsError("User already exists");
      }

      const hashPassword = await AuthHelper.hashPassword(password);

      const user = new User({
        full_name,
        email,
        password: hashPassword,
        accountType: accountType,
        profile: {
          barber: false,
          bio: "I am a " + accountType,
          services: ["test"],
        },
        barberPreferences: {
          likedBarbers: [],
          ignoredBarbers: [],
        },
      });
      return user.save();
    } catch (error) {
      throw error;
    }
  }

  async login(email, password) {
    try {
      const user = await User.findOne({ email });

      if (!user) {
        throw new Error("Invalid credentials");
      }

      if (!(await AuthHelper.comparePassword(password, user.password))) {
        throw new InvalidCredentialsError("Invalid credentials");
      }

      return user;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async passStrength(password) {
    if (password.length < 8) {
      return false;
    }
    return true;
  }
  async retrieveBarbersNearby(userId, userLongitude, userLatitude, maxDistanceInKm) {
    try {
      const user = await User.findById(userId);
  
      if (!user) {
        throw new Error("User not found");
      }
  
      let ignoredBarbers = user.barberPreferences ? user.barberPreferences.ignoredBarbers : [];
      ignoredBarbers = ignoredBarbers || [];
  
      let likedBarbers = user.barberPreferences ? user.barberPreferences.likedBarbers : [];
      likedBarbers = likedBarbers || [];
  
      let excludedBarbers = ignoredBarbers.concat(likedBarbers);
  
      const userServices = user.needs && user.needs.services ? user.needs.services : [];
  
      let barbers = await User.find({
        _id: { $ne: userId, $nin: excludedBarbers },
        accountType: "barber",
        "profile.services": { $in: userServices },
      });
  
      const barbersWithinDistance = [];
      for (const barber of barbers) {
        if (barber.location && barber.location.location.coordinates) {
          const [barberLongitude, barberLatitude] = barber.location.location.coordinates;
          const distance = getDistanceFromLatLonInKm(userLatitude, userLongitude, barberLatitude, barberLongitude);
  
          if (distance <= maxDistanceInKm) {
            barbersWithinDistance.push(barber);
          }
        }
      }
  
      for (let i = barbersWithinDistance.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [barbersWithinDistance[i], barbersWithinDistance[j]] = [barbersWithinDistance[j], barbersWithinDistance[i]];
      }
  
      return barbersWithinDistance.map((barber) => {
        const { _id, full_name, profile, location } = barber.toObject();
        const barberLatitude = barber.location?.location?.coordinates?.[1];
        const barberLongitude = barber.location?.location?.coordinates?.[0];
  
        if (typeof barberLatitude !== "undefined" && typeof barberLongitude !== "undefined") {
          return {
            _id,
            full_name,
            services: profile.services,
            bio: profile.bio,
            location,
            profile,
            distance: getDistanceFromLatLonInKm(userLatitude, userLongitude, barberLatitude, barberLongitude),
          };
        } else {
          console.error(`Coordinates missing for barber ${barber.full_name} (ID: ${barber._id})`);
          return {
            _id,
            full_name,
            services: profile.services,
            bio: profile.bio,
            location,
            profile,
            distance: null,
          };
        }
      });
    } catch (error) {
      console.error("Error retrieving nearby barbers:", error);
      throw error;
    }
  }
  

  async findLikedBarbers(userId) {
    try {
      const user = await User.findById(userId)
        .populate("barberPreferences.likedBarbers")
        .exec();

      return user;
    } catch (error) {
      console.error("Error finding liked barbers:", error);
      throw error;
    }
  }

  async likeBarber(userId, barberId) {
    try {

      const result = await User.findByIdAndUpdate(
        userId,
        {
          $addToSet: { "barberPreferences.likedBarbers": barberId },
        },
        { new: true }
      );

      if (!result) {
        throw new Error(`User with ID ${userId} not found.`);
      }

      return result;
    } catch (error) {
      console.error("Error liking barber:", error);
      throw error;
    }
  }

  async ignoreBarber(userId, barberId) {
    try {
      await User.findByIdAndUpdate(userId, {
        $push: { "barberPreferences.ignoredBarbers": barberId },
      });
    } catch (error) {
      console.error("Error ignoring barber:", error);
      throw error;
    }
  }
}

module.exports = { UserService, UserExistsError, InvalidCredentialsError };
