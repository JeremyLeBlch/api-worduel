import React, { useState, useEffect, useContext } from "react";
import { Button } from "../ui/button";
import SaveIcon from "@mui/icons-material/Save";
import PasswordIcon from "@mui/icons-material/Password";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useNavigate } from "react-router-dom";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

import { DELETE_USER } from "@/api/deleteUser";
import { useQuery, useMutation } from "@apollo/client";
import { GET_USER_PROFILE } from "@/api/login";
import { UPDATE_USER } from "@/api/me";
import { AuthContext } from "../../context/AuthContext";

const avatars = [
	{ id: 1, src: "/images/avatar1.jpg", alt: "Avatar 1" },
	{ id: 2, src: "/images/avatar2.jpg", alt: "Avatar 2" },
	{ id: 3, src: "/images/avatar3.jpg", alt: "Avatar 3" },
	{ id: 4, src: "/images/avatar4.jpg", alt: "Avatar 4" },
	{ id: 5, src: "/images/avatar5.jpg", alt: "Avatar 5" },
	{ id: 6, src: "/images/avatar6.jpg", alt: "Avatar 6" },
	{ id: 7, src: "/images/avatar7.jpg", alt: "Avatar 7" },
	{ id: 8, src: "/images/avatar8.jpg", alt: "Avatar 8" },
	{ id: 9, src: "/images/avatar9.jpg", alt: "Avatar 9" },
	{ id: 10, src: "/images/avatar10.jpg", alt: "Avatar 10" },
];

const formatToHSL = (hslValues: string): string => {
	return `hsl(${hslValues.trim()})`;
};

// Fonction d'extraction de la valeur HSL d'une string
const extractHSLValues = (hslString: string): string => {
	return hslString.replace(/hsl\(|\)/g, "").trim();
};

const primaryColors = [
    { id: 1, color: "hsl(258 90% 66%)" },
    { id: 2, color: "hsl(239 84% 67%)" },
    { id: 3, color: "hsl(192 82% 61%)" },
    { id: 4, color: "hsl(172 66% 50%)" },
    { id: 5, color: "hsl(142 71% 45%)" },
    { id: 6, color: "hsl(84 81% 44%)" },
    
];

const secondaryColors = [
    { id: 1, color: "hsl(45 93% 47%)" },
    { id: 2, color: "hsl(38 92% 50%)" },
    { id: 3, color: "hsl(25 95% 53%)" },
    { id: 4, color: "hsl(0 74% 65%)" },
    { id: 5, color: "hsl(0 84% 60%)" },
    { id: 6, color: "hsl(330 81% 60%)" },
];

const ProfileForm = () => {
	const { logout } = useContext(AuthContext);
	const { data } = useQuery(GET_USER_PROFILE);
	const [deleteUser] = useMutation(DELETE_USER);
  	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);
	const [username, setUsername] = useState<string>("");
	const navigate = useNavigate();
	const { forceRevalidate } = useContext(AuthContext);

	const [selectedPrimaryColor, setSelectedPrimaryColor] = useState<
		number | null
	>(null);
	const [selectedSecondaryColor, setSelectedSecondaryColor] = useState<
		number | null
	>(null);


	

	useEffect(() => {
		if (data && data.me) {
			if (data.me.avatar) {
				const userAvatar = avatars.find((av) => av.src === data.me.avatar);
				if (userAvatar) {
					setSelectedAvatar(userAvatar.id);
				}
			}
	
			// Initialiser le pseudo avec le pseudo actuel
			if (data.me.username) {
				setUsername(data.me.username);
			}
	
			// Couleur primaire
			if (data.me.primary_color_preference) {
				const formattedPrimaryColor = formatToHSL(data.me.primary_color_preference);
				const userPrimaryColor = primaryColors.find(
					(color) => color.color === formattedPrimaryColor
				);
				if (userPrimaryColor) {
					setSelectedPrimaryColor(userPrimaryColor.id);
				}
			}
	
			// Couleur secondaire
			if (data.me.secondary_color_preference) {
				const formattedSecondaryColor = formatToHSL(data.me.secondary_color_preference);
				const userSecondaryColor = secondaryColors.find(
					(color) => color.color === formattedSecondaryColor
				);
				if (userSecondaryColor) {
					setSelectedSecondaryColor(userSecondaryColor.id);
				}
			}
		}
	}, [data]);


	const [updateUser] = useMutation(UPDATE_USER, {
    	refetchQueries: [{ query: GET_USER_PROFILE }],
    	awaitRefetchQueries: true,
	});

	const handleAvatarClick = (id: number) => {
		setSelectedAvatar(id);
	};

	const handlePrimaryColorClick = (id: number) => {
		setSelectedPrimaryColor(id);
		// console.log("Couleur primaire choisie : ", id);
	};

	const handleSecondaryColorClick = (id: number) => {
		setSelectedSecondaryColor(id);
		// console.log("Couleur secondaire choisie : ", id);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
	
		const variables: any = {};
	
		// Si un avatar est sélectionné, on récupère son chemin
		if (selectedAvatar !== null) {
			const chosenAvatar = avatars.find((av) => av.id === selectedAvatar);
			if (chosenAvatar) {
				const avatarFileName = chosenAvatar.src.split('/').pop();
				variables.avatar = avatarFileName;
			}
		}
	
		// Si le pseudo a changé, on l'ajoute aux variables
		if (username && username !== data?.me?.username) {
			variables.username = username;
		}
	
		// Couleur primaire
		if (selectedPrimaryColor !== null) {
			const chosenPrimaryColor = primaryColors.find(
				(color) => color.id === selectedPrimaryColor
			);
			if (chosenPrimaryColor) {
				variables.primary_color_preference = extractHSLValues(
					chosenPrimaryColor.color
				);
			}
		}
	
		// Couleur secondaire
		if (selectedSecondaryColor !== null) {
			const chosenSecondaryColor = secondaryColors.find(
				(color) => color.id === selectedSecondaryColor
			);
			if (chosenSecondaryColor) {
				variables.secondary_color_preference = extractHSLValues(
					chosenSecondaryColor.color
				);
			}
		}
	
		// Appel de la mutation pour mettre à jour les données
		if (Object.keys(variables).length > 0) {
			await updateUser({ variables });
		}
	};

	const handleLogout = async () => {
		await logout();
		navigate('/');
	};

	const handleDeleteAccountClick = () => {
		setShowDeleteModal(true);
	};
	
	const handleDeleteAccountConfirm = async (password: string) => {
		try {
			const response = await deleteUser({ variables: { password } });
			if (response.data.deleteUser) {
			  await logout();
			  await forceRevalidate();
			  console.log("Déconnexion réussie");
			  navigate('/');
			}
		  } catch (error: any) {
			if (error.graphQLErrors && error.graphQLErrors[0].extensions.code === "GOOGLE_AUTH_REQUIRED") {
			  // Afficher un message ou rediriger vers un flux Google
			  alert("Veuillez vous ré-authentifier avec Google.");
			  // Rediriger l'utilisateur vers /auth/google par exemple
			  window.location.href = `${import.meta.env.VITE_API_URL}/auth/google?reAuthForDelete=true`;
			} else {
			  console.error(error);
			}
		}
	};

	return (
		<>
			<form
				className="py-2 px-4 rounded w-auto text-left mt-1 md:border border-foreground/20 m-0.5"
				onSubmit={handleSubmit}
			>
				<section className="my-1">
					<div className="mb-4">
						<label className="block text-foreground font-bold">
							Modifier mon pseudo
						</label>
						<input
							type="text"
							name="pseudo"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							className="w-full p-2 rounded bg-foreground/5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-inherit font-thin"
						/>
					</div>

					<div className="mb-4 border border-foreground/10 rounded p-4">
						<label className="block text-foreground font-bold">
							Modifier mon avatar
						</label>

						<div className="flex flex-row flex-wrap gap-4 items-start w-full ">
							{avatars.map((avatar) => (
								<button
									key={avatar.id}
									type="button"
									onClick={() => handleAvatarClick(avatar.id)}
									className={`rounded-full w-16 h-16 border-2 transition-all ${
										selectedAvatar === avatar.id
											? "border-primary ring-2 ring-primary/50"
											: "border-transparent"
									}`}
								>
									<img
										src={avatar.src}
										alt={avatar.alt}
										className="rounded-full w-full h-full object-cover"
									/>
								</button>
							))}
						</div>
					</div>

					<div className="mb-4 border border-foreground/10 rounded p-4">
						<label className="block text-foreground font-bold">
							Modifier le thème
						</label>
						<div className="flex flex-col justify-between">
							<p className="text-sm mt-2 mb-1">Couleur primaire</p>
							<div className="flex flex-row justify-start gap-4 items-start w-full">
								{primaryColors.map((primaryColor) => (
									<button
										key={primaryColor.id}
										type="button"
										onClick={() =>
											handlePrimaryColorClick(primaryColor.id)
										}
										style={{
											backgroundColor: primaryColor.color,
										}}
										className={`rounded-full w-7 h-7 md:w-9 md:h-9 lg:w-9 md:h-9 transition-all ${
											primaryColor.color
										} ${
											selectedPrimaryColor === primaryColor.id
												? "border-foreground border-2"
												: ""
										}`}
									></button>
								))}
							</div>
						</div>
						<div className="flex flex-col justify-between mt-2">
							<p className="text-sm mt-2 mb-1">Couleur secondaire</p>
							<div className="flex flex-row justify-start gap-4 items-start w-full">
								{secondaryColors.map((secondaryColor) => (
									<button
										key={secondaryColor.id}
										type="button"
										onClick={() =>
											handleSecondaryColorClick(
												secondaryColor.id
											)
										}
										style={{
											backgroundColor: secondaryColor.color,
										}}
										className={`rounded-full w-7 h-7 md:w-9 md:h-9 lg:w-9 md:h-9 transition-all ${
											secondaryColor.color
										} ${
											selectedSecondaryColor ===
											secondaryColor.id
												? "border-foreground border-2"
												: ""
										}`}
									></button>
								))}
							</div>
						</div>
					</div>

					<div className="flex flex-col items-center justify-around py-2 gap-2">
						<Button
							type="submit"
							className="w-full group relative overflow-hidden"
						>
							<SaveIcon className="absolute bg-transparent inset-0 m-auto opacity-0 group-hover:opacity-100 scale-125 transition-all duration-300 text-red-500" />
							<span className="group-hover:opacity-0 transition-opacity duration-300 bg-transparent">
								Enregistrer les modifications
							</span>
						</Button>

						<Button
							variant="outline"
							className="w-full group relative overflow-hidden"
						>
							<PasswordIcon className="absolute bg-transparent inset-0 m-auto opacity-0 group-hover:opacity-100 scale-125 transition-all duration-300 text-red-500" />
							<span className="group-hover:opacity-0 transition-opacity duration-300 bg-transparent">
								Modifier mon mot de passe
							</span>
						</Button>

						<Button
							variant="outline"
							className="w-full group relative overflow-hidden"
							onClick={handleLogout}
						>
							<ExitToAppIcon className="absolute bg-transparent inset-0 m-auto opacity-0 group-hover:opacity-100 scale-125 transition-all duration-300 text-red-500" />
							<span className="group-hover:opacity-0 transition-opacity duration-300 bg-transparent">
								Me déconnecter
							</span>
						</Button>

						<Button
							variant="outline"
							className="w-full group relative overflow-hidden"
							onClick={handleDeleteAccountClick}
						>
							<DeleteForeverIcon className="absolute bg-transparent inset-0 m-auto opacity-0 group-hover:opacity-100 scale-125 transition-all duration-300 text-red-500" />
							<span className="group-hover:opacity-0 transition-opacity duration-300 bg-transparent">
								Supprimer mon compte
							</span>
						</Button>
					</div>
				</section>
			</form>

			<ConfirmDeleteModal
				isOpen={showDeleteModal}
				onClose={() => setShowDeleteModal(false)}
				onConfirm={handleDeleteAccountConfirm}
				message="Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est définitive et vous perdrez toutes vos données."
			/>
		</>
	);
};

export default ProfileForm;
