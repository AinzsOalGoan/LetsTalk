import React from "react";
import {Signup as SignupComponent} from "../index";

function Signup() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-all duration-300">
			<SignupComponent />
		</div>
	);
}

export default Signup;
