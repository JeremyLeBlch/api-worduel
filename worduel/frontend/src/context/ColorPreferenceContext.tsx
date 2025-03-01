import { createContext, useState, useEffect, ReactNode } from "react";
import { GET_USER_PROFILE } from "@/api/login";
import { useQuery } from "@apollo/client";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

interface PreferencesContextProps {
	primaryColor: string;
	secondaryColor: string;
	setPrimaryColor: (color: string) => void;
	setSecondaryColor: (color: string) => void;
}

export const PreferencesContext = createContext<
	PreferencesContextProps | undefined
>(undefined);



export const ColorPreferenceProvider = ({ children }: { children: ReactNode }) => {
	const { isAuthenticated } = useContext(AuthContext);
	const { data, loading, error } = useQuery(GET_USER_PROFILE, {
		skip: !isAuthenticated,
	});
	const [primaryColor, setPrimaryColor] = useState("192 82% 61%");
	const [secondaryColor, setSecondaryColor] = useState("0 74% 65%");

	useEffect(() => {
		if (!loading && !error && data?.me) {
			const newPrimary = data.me.primary_color_preference || primaryColor;
			const newSecondary = data.me.secondary_color_preference || secondaryColor;

			setPrimaryColor(newPrimary);
			setSecondaryColor(newSecondary);

			// Mettre à jour les variables CSS
			document.documentElement.style.setProperty("--primary", newPrimary);
			document.documentElement.style.setProperty("--secondary", newSecondary);
		}
	}, [data, loading, error]);

	if (loading) {
		return <div>Chargement...</div>;
	}

	if (error) {
		console.error("Erreur lors du chargement des préférences :", error);
		return <div>Une erreur est survenue.</div>;
	}

	return (
		<PreferencesContext.Provider
			value={{
				primaryColor,
				secondaryColor,
				setPrimaryColor,
				setSecondaryColor,
			}}
		>
			{children}
		</PreferencesContext.Provider>
	);
};
