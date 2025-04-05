import React from "react";
import { login as LoginComponent } from "../index";

function Login() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-all duration-300">
			<LoginComponent />
		</div>
	);
}

export default Login;
