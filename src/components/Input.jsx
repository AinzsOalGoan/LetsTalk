import React, { useId } from "react";

const Input = React.forwardRef(function Input(
	{ label, type = "text", className = "", error, required = false, ...props },
	ref
) {
	const generatedId = useId();
	const id = props.id || generatedId; // Use provided ID or generate one

	return (
		<div className="w-full">
			{label && (
				<label
					className="inline-block mb-1 pl-1 font-medium text-gray-700"
					htmlFor={id}>
					{label}{" "}
					{required && <span className="text-red-500">*</span>}
				</label>
			)}
			<input
				type={type}
				className={`px-3 py-2 rounded-lg bg-white text-black outline-none border border-gray-300 w-full transition duration-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-500 ${className}`}
				ref={ref}
				id={id}
				required={required}
				{...props}
			/>
			{/* Error Message */}
			{error && <p className="text-sm text-red-500 mt-1">{error}</p>}
		</div>
	);
});

export default Input;
