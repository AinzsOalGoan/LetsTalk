import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";
// import authService from "";

const LogoutBtn = () => {
	const dispatch = useDispatch();

	const logoutHandler = async () => {
		try {
			// await authService.logout();//logout service
			dispatch(logout());
		} catch (error) {
			console.error("Logout failed:", error);
		}
	};

	return (
		<button
			className="px-6 py-2 rounded-full transition-all duration-300 
                       bg-red-500 text-white hover:bg-red-600 dark:bg-red-700 
                       dark:hover:bg-red-800 shadow-md"
			onClick={logoutHandler}>
			Logout
		</button>
	);
};

export default LogoutBtn;
