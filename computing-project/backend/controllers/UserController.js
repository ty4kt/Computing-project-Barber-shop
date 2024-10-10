const {
  UserService,
  UserExistsError,
  InvalidCredentialsError,
} = require("../services/UserService");
const AuthHelper = require("../helpers/AuthHelper");
const MediaService = require("../services/MediaService");
const userService = new UserService();
const User = require("../models/User");
const Media = require("../models/Media");
const cloudinary = require("../config/cloudinary");

class UserController {
  async me(req, res) {
    try {
      const user = await userService.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.json({
        _id: user._id,
        full_name: user.full_name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        location: user.location,
        needs: user.needs,
        accountType: user.accountType,
        profile: user.profile,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async accountSetup(req, res) {
    let { data, checkpoint } = req.body;

    if (!data || !checkpoint) {
      return res
        .status(400)
        .json({ message: "Data and checkpoint are required" });
    }

    // Decode since it's JSON stringified
    data = JSON.parse(data);

    try {
      const user = await userService.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      switch (checkpoint) {
        case "needsStep":
          if (!user.needs) {
            user.needs = { services: [] };
          }

          user.needs.services = data.needs;

          await user.save();

          return res.json({ ok: true, message: "Needs updated successfully" });
        case "locationStep":
          if (!user.location) {
            user.location = {};
          }

          const locationGeoJSON = {
            type: "Point",
            coordinates: [data.longitude, data.latitude], // longitude first, then latitude
          };

          user.location.city = data.city;
          user.location.country = data.country;
          user.location.timezone = data.timezone;
          user.location.location = locationGeoJSON;
          user.location.postcode = data.postcode;

          await user.save();

          return res.json({
            ok: true,
            message: "Location updated successfully",
          });

        default:
          return res.status(400).json({ message: "Invalid checkpoint" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async barberAccountSetup(req, res) {
    let { data, checkpoint } = req.body;

    if (!checkpoint) {
      return res.status(400).json({ message: "Checkpoint is required" });
    }

    // For steps other than profilePictureStep, parse the data
    if (checkpoint !== "profilePictureStep") {
      if (!data) {
        return res
          .status(400)
          .json({ message: "Data is required for this checkpoint" });
      }
      data = JSON.parse(data);
    }

    try {
      const user = await userService.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      switch (checkpoint) {
        case "needsStep":
          if (!user.profile.services) {
            user.profile.services = { services: [] };
          }
          user.profile.services = data.needs;
          await user.save();
          return res.json({ ok: true, message: "Needs updated successfully" });

        case "bioStep":
          if (!user.profile.bio) {
            user.profile.bio = "";
          }
          user.profile.bio = data.bio;
          await user.save();
          return res.json({ ok: true, message: "Bio updated successfully" });

        case "profilePictureStep":
          if (!req.file) {
            return res.status(200).json({ message: "No image uploaded" });
          }
          const imageUrl = req.file.path;
          user.profile.profile_picture = imageUrl;
          await user.save();
          return res.json({
            ok: true,
            message: "Profile picture updated successfully",
          });

        default:
          return res.status(400).json({ message: "Invalid checkpoint" });
      }
    } catch (error) {
      console.error("Error in barberAccountSetup:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async checkAccountSetup(req, res) {
    try {
      const user = await userService.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!user.location) {
        return res.json({ ok: false, checkpoint: "locationStep" });
      }

      return res.json({ ok: true });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async setUserProfilePicture(req, res) {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    try {
      const imageUrl = req.file.path;
      const userId = req.user.id;

      await User.findByIdAndUpdate(
        userId,
        { "profile.profile_picture": imageUrl },
        { new: true }
      );

      res.json({ message: "Profile picture updated successfully" });
    } catch (error) {
      console.error("Error setting user profile picture:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async uploadPortfolioImage(req, res) {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    try {
      const userId = req.user.id;

      const mediaDocuments = req.files.map((file) => ({
        user: userId,
        imageUrl: file.path,
        type: "work",
      }));

      await Media.insertMany(mediaDocuments);

      res.json({ message: "Portfolio images uploaded successfully" });
    } catch (error) {
      console.error("Error uploading portfolio images:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getBarberMedia(req, res) {
    const { barberId } = req.params;

    try {
      const mediaItems = await Media.find({
        user: barberId,
        type: "work",
      }).exec();

      res.json(mediaItems);
    } catch (error) {
      console.error("Error fetching barber's media:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = new UserController();
