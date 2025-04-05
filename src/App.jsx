import "./App.css";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { login, logout } from "./store/authSlice";
import {Navbar, Footer} from "./components/index";
import { Outlet } from "react-router-dom";

function App() {
	const [loading, setLoading] = useState(true);
	const dispatch = useDispatch();
	useEffect(() => {
		const fetchUser = async () => {
			try {
				// const userData = await authService.getcurrentUser();
				if (userData) {
					dispatch(login(userData));
				} else {
					dispatch(logout());
				}
			} catch (error) {
				console.error("Error fetching user:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchUser();
	}, [dispatch]);

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-900">
				<p className="text-lg font-semibold text-white">Loading...</p>
			</div>
		);
	}

	return (
		//wrap this in themeprovider
		<>
			<div className="min-h-screen flex flex-wrap content-between">
				<div className="w-full block">
					<Navbar />
					<main>
						<Outlet />
					</main>
					<Footer />
				</div>
			</div>
		</>
	);
}

export default App;
