const {
  UserService,
  UserExistsError,
  InvalidCredentialsError,
} = require("../services/UserService");
const AuthHelper = require("../helpers/AuthHelper");
const userService = new UserService();

class AuthController {
  async register(req, res) {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res
        .status(400)
        .json({ message: "Full name, email and password are required" });
    }

    if ((await userService.passStrength(password)) === false) {
      return res.status(400).json({ message: "Password is too weak" });
    }

    try {
      const user = await userService.register(fullName, email, password, 'client');

      // Generate token after successful registration
      const token = AuthHelper.generateToken(user);

      return res.json({
        success: true,
        message: "User registered successfully",
        token, // Send the token in the response
        user: {
          id: user._id,
          username: user.username, // Make sure the username is available on the user object
        },
      });
    } catch (error) {
      if (
        error instanceof UserExistsError ||
        error.message === "User already exists"
      ) {
        return res.status(409).json({
          success: false,
          message: "User already exists",
        });
      }

      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  async login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    try {
      const user = await userService.login(email, password);

      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const token = AuthHelper.generateToken(user);

      return res.json({
        success: true,
        message: "User logged in successfully",
        token,
        user: {
          id: user._id,
          username: user.username,
        },
      });
    } catch (error) {
      if (
        error instanceof InvalidCredentialsError ||
        error.message === "Invalid credentials"
      ) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  async validateToken(req, res) {
    try {
      const userExists = await userService.findById(req.user.id);

      if (!userExists) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.json({ isValid: true });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "Internal server error", isValid: false });
    }
  }
  
}

module.exports = new AuthController();
