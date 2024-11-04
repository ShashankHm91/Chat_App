const User = require("../models/userModel");
const bcrypt = require("bcrypt");

let onlineUsers = new Set(); // Assuming onlineUsers is a Set for managing online users

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Check for user existence
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ msg: "Incorrect Username or Password", status: false });
    }

    // Check password validity
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ msg: "Incorrect Username or Password", status: false });
    }

    // Prepare user data for response
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password; // Exclude password from response

    // Optionally add user to onlineUsers
    onlineUsers.add(user._id.toString()); // Assuming _id is a string

    return res.status(200).json({ status: true, user: userWithoutPassword });
  } catch (ex) {
    console.error(ex); // Log the error for debugging
    next(ex);
  }
};

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Validate password length
    if (password.length < 8) {
      return res.status(400).json({ msg: "Password must be at least 8 characters long", status: false });
    }
    
    // Check for existing username
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck) {
      return res.status(400).json({ msg: "Username already used", status: false });
    }

    // Check for existing email
    const emailCheck = await User.findOne({ email });
    if (emailCheck) {
      return res.status(400).json({ msg: "Email already used", status: false });
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });
    
    // Exclude password from response
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    return res.status(201).json({ status: true, user: userWithoutPassword });
  } catch (ex) {
    console.error(ex);
    next(ex);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);
    return res.status(200).json(users);
  } catch (ex) {
    console.error(ex);
    next(ex);
  }
};

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;

    // Update user avatar
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage,
      },
      { new: true }
    );

    return res.status(200).json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (ex) {
    console.error(ex);
    next(ex);
  }
};

module.exports.logOut = async (req, res, next) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({ msg: "User id is required" });
    }

    // Update lastSeen before logging out
    await User.findByIdAndUpdate(userId, { lastSeen: new Date() });

    // Remove user from online users
    onlineUsers.delete(userId);

    return res.status(200).json({ msg: "Logout successful" });
  } catch (ex) {
    console.error(ex);
    next(ex);
  }
};

module.exports.resetPassword = async (req, res, next) => {
  try {
    const { email, newPassword } = req.body;

    // Validate password length
    if (newPassword.length < 8) {
      return res.status(400).json({ msg: "Password must be at least 8 characters long", status: false });
    }

    // Check for user existence
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "Email not found", status: false });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ status: true, msg: "Password updated successfully" });
  } catch (ex) {
    console.error(ex);
    next(ex);
  }
};
