const User = require("../models/UserSchema");
const passport = require("passport");

// Render Registration Form
module.exports.renderRegistration = (req, res) => {
	res.render("users/registration.ejs");
};

// Register user with full details and file upload
module.exports.registerUserWithDetails = async (req, res, next) => {
	try {
		const {
			username,
			password,
			fullName,
			email,
			dob,
			gender,
			phone,
			role,
			city,
			state,
			country,
			github,
			linkedin,
			portfolio
		} = req.body;

		// Basic validation
		if (!username || !password || !fullName || !email) {
			return res.status(400).send("Required fields missing");
		}

		const newUser = new User({
			username,
			fullName,
			email,
			dob,
			gender,
			phone,
			role,
			location: { city, state, country },
			portfolioLinks: { github, linkedin, portfolio },
		});

		// File handling
		if (req.files?.profileImage?.[0]) {
			newUser.profileImage = req.files.profileImage[0].path;
		}

		if (req.files?.resumeFile?.[0]) {
			newUser.resumeFile = req.files.resumeFile[0].path;
		}

		const registeredUser = await User.register(newUser, password);

		req.login(registeredUser, (err) => {
			if (err) {
				console.error("Auto-login error:", err);
				return res.redirect("/users/login");
			}
			res.redirect("/home");
		});
	} catch (err) {
		console.error("Registration error:", err);
		res.status(500).send("Something went wrong during registration.");
	}
};

// Logout
module.exports.logoutUser = (req, res, next) => {
	req.logout((err) => {
		if (err) {
			console.error("Logout error:", err);
			return res.status(500).send("Logout failed.");
		}
		res.redirect("/home");
	});
};

// Login Page
module.exports.renderLogin = (req, res) => {
	res.render("users/login.ejs");
};
