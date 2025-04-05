import React from "react";
import { Link } from "react-router-dom";
import {Logo} from "../index";

const FooterSection = ({ title, links }) => (
	<div className="w-full p-6 md:w-1/2 lg:w-2/12">
		<div className="h-full">
			<h3 className="tracking-px mb-9 text-xs font-semibold uppercase text-gray-500 dark:text-gray-300">
				{title}
			</h3>
			<ul>
				{links.map((link) => (
					<li key={link} className="mb-4">
						<Link
							className="text-base font-medium text-gray-900 dark:text-gray-200 hover:text-gray-700 dark:hover:text-gray-400"
							to="/">
							{link}
						</Link>
					</li>
				))}
			</ul>
		</div>
	</div>
);

function Footer() {
	const sections = [
		{
			title: "Company",
			links: ["Features", "Pricing", "Affiliate Program", "Press Kit"],
		},
		{
			title: "Support",
			links: ["Account", "Help", "Contact Us", "Customer Support"],
		},
		{
			title: "Legals",
			links: ["Terms & Conditions", "Privacy Policy", "Licensing"],
		},
	];

	return (
		<section
			className={`relative overflow-hidden py-10 border-t-2 ${"bg-gray-400 border-black dark:bg-gray-900 dark:border-gray-700"}`}>
			<div className="relative z-10 mx-auto max-w-7xl px-4">
				<div className="flex flex-wrap -m-6">
					{/* Branding */}
					<div className="w-full p-6 md:w-1/2 lg:w-5/12">
						<div className="flex h-full flex-col justify-between">
							<div className="mb-4 inline-flex items-center">
								<Logo width="100px" />
							</div>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								&copy; Copyright 2023. All Rights Reserved by
								Let's Talk.
							</p>
						</div>
					</div>

					{/* Sections */}
					{sections.map((section) => (
						<FooterSection key={section.title} {...section} />
					))}
				</div>
			</div>
		</section>
	);
}

export default Footer;
