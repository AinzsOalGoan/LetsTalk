import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input, Logo } from "./index";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { login as authLogin } from "../store/authSlice";
// import authService from ""; services present in the database

function Login() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm();
	const [error, setError] = useState("");

	const login = async (data) => {
		setError("");

		try {
			// const session = await authService.login(data);//
			if (session) {
                // const userData = await authService.getcurrentUser();//
                console.log("Get user session details")
				if (userData) {
					dispatch(authLogin(userData));//login user
                    console.log("If user is in database login user")
				}
				navigate("/");
			}
		} catch (error) {
			setError(error.message);
		}
	};

	return (
		<div className="flex items-center justify-center w-full bg-gray-700">
			<div className="mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10 mt-5 mb-10">
				{/* Logo */}
				<div className="mb-2 flex justify-center">
					<span className="inline-block w-full max-w-[100px]">
						<Logo width="100%" />
					</span>
				</div>

				{/* Title */}
				<h2 className="text-center text-2xl font-bold leading-tight">
					Sign in to your account
				</h2>
				<p className="mt-2 text-center text-base text-black/60">
					Don&apos;t have an account?&nbsp;
					<Link
						to="/signup"
						className="font-medium text-primary transition-all duration-200 hover:underline">
						Sign Up
					</Link>
				</p>

				{/* General Error */}
				{error && (
					<p className="text-red-600 mt-4 text-center">{error}</p>
				)}

				{/* Login Form */}
				<form onSubmit={handleSubmit(login)} className="mt-6">
					<div className="space-y-5">
						{/* Email Input */}
						<Input
							label="Email:"
							placeholder="Enter your email"
							type="email"
							{...register("email", {
								required: "Email is required",
								pattern: {
									value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
									message: "Enter a valid email address",
								},
							})}
						/>
						{errors.email && (
							<p className="text-sm text-red-500">
								{errors.email.message}
							</p>
						)}

						{/* Password Input */}
						<Input
							label="Password:"
							type="password"
							placeholder="Enter your password"
							{...register("password", {
								required: "Password is required",
								minLength: {
									value: 6,
									message:
										"Password must be at least 6 characters",
								},
							})}
						/>
						{errors.password && (
							<p className="text-sm text-red-500">
								{errors.password.message}
							</p>
						)}

						{/* Submit Button */}
						<Button
							type="submit"
							className="w-full"
							disabled={isSubmitting}>
							{isSubmitting ? "Signing in..." : "Sign in"}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default Login;
