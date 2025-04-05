import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../store/authSlice";
import { Button, Input, Logo } from "./index";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
// import authService from "../appwrite/auth";

function Signup() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm();
	const [error, setError] = useState("");

	const create = async (data) => {
		setError("");
		try {
			const newUser = await authService.createAccount(data);
			if (newUser) {
				const currentUser = await authService.getcurrentUser();
				if (currentUser) {
					dispatch(login(currentUser));
					navigate("/");
				}
			}
		} catch (error) {
			setError(error.message);
		}
	};

	return (
		<div className="flex items-center justify-center w-full bg-gray-700 ">
			<div className="mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10 mt-3 mb-3">
				<div className="mb-2 flex justify-center">
					<span className="inline-block w-full max-w-[100px]">
						<Logo width="100%" />
					</span>
				</div>
				<h2 className="text-center text-2xl font-bold leading-tight">
					Sign up to create an account
				</h2>
				<p className="mt-2 text-center text-base text-black/60">
					Already have an account?&nbsp;
					<Link
						to="/login"
						className="font-medium text-primary transition-all duration-200 hover:underline">
						Sign In
					</Link>
				</p>
				{error && (
					<p className="text-red-600 mt-4 text-center">{error}</p>
				)}

				<form
					onSubmit={handleSubmit(create)}
					className="mt-6 space-y-5">
					<Input
						label="Full Name:"
						placeholder="Enter your full name"
						{...register("name", {
							required: "Full name is required",
						})}
					/>
					{errors.name && (
						<p className="text-red-500 text-sm">
							{errors.name.message}
						</p>
					)}

					<Input
						label="Email:"
						placeholder="Enter your email"
						type="email"
						{...register("email", {
							required: "Email is required",
							pattern: {
								value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
								message: "Invalid email format",
							},
						})}
					/>
					{errors.email && (
						<p className="text-red-500 text-sm">
							{errors.email.message}
						</p>
					)}

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
						<p className="text-red-500 text-sm">
							{errors.password.message}
						</p>
					)}

					<Input
						label="Confirm Password:"
						type="password"
						placeholder="Confirm your password"
						{...register("confirmPassword", {
							required: "Please confirm your password",
							validate: (value) =>
								value === watch("password") ||
								"Passwords do not match",
						})}
					/>
					{errors.confirmPassword && (
						<p className="text-red-500 text-sm">
							{errors.confirmPassword.message}
						</p>
					)}

					<Button type="submit" className="w-full">
						Create Account
					</Button>
				</form>
			</div>
		</div>
	);
}

export default Signup;
