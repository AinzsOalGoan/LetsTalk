const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");
const User = require("../models/UserSchema");


// Login Page
module.exports.renderLogin = (req, res) => {
	res.render("users/login.ejs");
};

// Register Page
module.exports.renderRegister = (req, res) => {
	res.render("users/signup.ejs");
};

// Register user
module.exports.registerUser = asyncHandler(async (req, res) => {
	const { username, password, fullName } = req.body;
	if (!username || !password || !fullName) {
		throw new ApiError(400, "All fields are required.");
	}

	const user = new User({ username, fullName });

	let registeredUser;
	try {
		registeredUser = await User.register(user, password);
	} catch (err) {
		throw new ApiError(500, "User registration failed", [], err.stack);
	}

	req.login(registeredUser, (err) => {
		if (err) {
			// Passing the error to the next middleware instead of throwing it
			return next(
				new ApiError(
					500,
					"Login after registration failed",
					[],
					err.stack
				)
			);
		}
		res.redirect("/home");
	});
});

// Logout
module.exports.logoutUser = (req, res, next) => {
	req.logout((err) => {
		if (err) {
			// Passing the error to the next middleware instead of throwing it
			return next(new ApiError(500, "Logout failed", [], err.stack));
		}
		res.redirect("/home");
	});
};

// See profile [remove the skillissue code part]
module.exports.seeProfile = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id).lean();

	if (!user) {
		throw new ApiError(404, "User not found");
	}

	const problemsSolved = await Promise.all(
		user.problemsSolved.map(async (solved) => {
			const problem = await Problem.findById(solved.problemId); // Ensure Problem model is imported
			return {
				problemId: solved.problemId,
				title: problem ? problem.title : "Unknown Title",
			};
		})
	);

	res.render("users/profile", {
		user,
		username: user.username,
		profileLinks: user.profileLinks,
		stats: user.stats,
		points: user.points,
		totalSubmissions: user.totalSubmissions,
		problemsSolved,
		likedProblems: user.likedProblems,
		Country: user.Country,
	});
});
