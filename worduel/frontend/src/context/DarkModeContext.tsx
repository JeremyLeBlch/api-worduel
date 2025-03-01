import React, { createContext, useContext, useEffect, useState } from "react";

type DarkModeContextType = {
	isDarkMode: boolean;
	toggleDarkMode: () => void;
};

// Création du contexte
const DarkModeContext = createContext<DarkModeContextType | undefined>(
	undefined
);

// Provider
export const DarkModeProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [isDarkMode, setIsDarkMode] = useState(false);

	useEffect(() => {
		const savedTheme = localStorage.getItem("theme") === "dark";
		setIsDarkMode(savedTheme);
		if (savedTheme) {
			document.documentElement.classList.add("dark");
		}
	}, []);

	const toggleDarkMode = () => {
		setIsDarkMode((prev) => {
			const newTheme = !prev;
			localStorage.setItem("theme", newTheme ? "dark" : "light");
			document.documentElement.classList.toggle("dark", newTheme);
			return newTheme;
		});
	};

	return (
		<DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
			{children}
		</DarkModeContext.Provider>
	);
};

export const useDarkMode = () => {
	const context = useContext(DarkModeContext);
	if (!context) {
		throw new Error(
			"useDarkMode doit être utilisé dans un DarkModeProvider"
		);
	}
	return context;
};
