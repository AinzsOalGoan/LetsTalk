const User = require("../models/UserSchema");
const Recruiter = require("../models/RecruterSchema");
const passport = require("passport");

// GET: Registration Page
module.exports.renderRegistration = (req, res) => {
	res.render("users/registration.ejs");
};

// POST: Register User with Details
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

		// Register user (hash password)
		const registeredUser = await User.register(newUser, password);

		req.login(registeredUser, (err) => {
			if (err) return next(err);
			res.redirect("/home");
		});
	} catch (err) {
		console.error("Registration error:", err);
		res.status(500).send("Something went wrong during registration.");
	}
};

// GET: Login Page
module.exports.renderLogin = (req, res) => {
	res.render("users/login.ejs");
};

// GET: Logout
module.exports.logoutUser = (req, res, next) => {
	req.logout((err) => {
		if (err) return next(err);
		res.redirect("/home");
	});
};

// GET: User Profile Page
module.exports.getProfile = async (req, res) => {
	try {
		const user = req.user;

		if (!user) return res.status(401).send("Unauthorized");

		if (user.role === "recruiter") {
			const recruiterDetails = await Recruiter.findOne({ user: user._id })
				.populate("jobsPosted")
				.populate("Rounds");

			return res.render("users/profile", { user, recruiterDetails });
		} else {
			await user.populate("appliedJobs.jobId");

			return res.render("users/profile", { user });
		}
	} catch (err) {
		console.error("Error fetching profile:", err);
		res.status(500).send("Error fetching profile");
	}
};

