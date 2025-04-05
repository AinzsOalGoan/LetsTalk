import React from "react";

const Container = ({ children }) => {
	return (
		<div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300">
			{children}
		</div>
	);
};

export default Container;
