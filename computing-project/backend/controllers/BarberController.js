const { UserService } = require("../services/UserService");
const userService = new UserService();

class BarberController {
  async findNearbyBarbers(req, res) {
    const userId = req.user.id;
    const { longitude, latitude, maxDistanceInMeters } = req.query;

    try {
      const nearbyBarbers = await userService.retrieveBarbersNearby(
        userId,
        parseFloat(longitude),
        parseFloat(latitude),
        parseInt(maxDistanceInMeters)
      );
      res.json(nearbyBarbers);
    } catch (error) {
      console.error("Error finding nearby barbers:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async likeBarber(req, res) {
    const userId = req.user.id;
    const { barberId } = req.body;

    try {
      await userService.likeBarber(userId, barberId);
      res.json({ ok: true, message: "Barber liked successfully" });
    } catch (error) {
      console.error("Error liking barber:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async ignoreBarber(req, res) {
    const userId = req.user._id;
    const { barberId } = req.params;

    try {
      await userService.ignoreBarber(userId, barberId);
      res.json({ ok: true, message: "Barber ignored successfully" });
    } catch (error) {
      console.error("Error ignoring barber:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async barberListLiked(req, res) {
    try {
      const userId = req.user.id;
  
      const user = await userService.findLikedBarbers(userId);
      if (!user) {
        return res.status(404).json({ ok: false, message: "User not found" });
      }
  
      if (user.barberPreferences.likedBarbers.length === 0) {
        return res.status(200).json({ ok: true, likedBarbers: [] });
      }
  
      const redactedLikedBarbers = user.barberPreferences.likedBarbers.map(barber => {
        const { password, email, barberPreferences, ...safeData } = barber.toObject();
        return safeData;
      });
  
      return res.status(200).json({ ok: true, likedBarbers: redactedLikedBarbers });
    } catch (error) {
      console.error("Error retrieving liked barbers:", error);
      res.status(500).json({ ok: false, message: "Internal server error" });
    }
  }
  
}

module.exports = new BarberController();
