
const User = require('../models/UserSchema')

// Login Page
module.exports.renderLogin = (req, res) => {
    res.render('users/login.ejs');
};

// Register user
module.exports.registerUser = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = new User({ username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, (err) => {
            if (err) return next(err); // Pass error to the error handler
            res.redirect('/home');
        });
    } catch (err) {
        next(err); // Pass error to the error handler
    }
}

// Register page
module.exports.renderRegister = (req, res) => {
    res.render('users/signup.ejs');
};

// Logout
module.exports.logoutUser = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err); // Pass error to the error handler
        res.redirect('/home');
    });
}

module.exports.seeProfile = async (req, res, next) => {
    try {
        let user = await User.findById(req.user._id).lean(); // Ensure data is fully fetched

        console.log("User Stats:", user.stats); // Debugging log

        let problemsSolved = await Promise.all(user.problemsSolved.map(async (solved) => {
            let problem = await Problem.findById(solved.problemId);
            return {
                problemId: solved.problemId,
                title: problem ? problem.title : 'Unknown Title'
            };
        }));

        res.render('users/profile', {
            user,
            username: user.username,
            profileLinks: user.profileLinks,
            stats: user.stats,  // Explicitly pass stats
            points: user.points,
            totalSubmissions: user.totalSubmissions,
            problemsSolved,
            likedProblems: user.likedProblems,
            Country: user.Country
        });
    } catch (err) {
        next(err);
    }
}
