import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import GoogleLoginButton from "../ui/GoogleLoginButton";
import { Visibility, VisibilityOff } from '@mui/icons-material';
//import FacebookIcon from "@mui/icons-material/Facebook";
import { useMutation } from '@apollo/client';
import { LOGIN_MUTATION } from '../../api/login'; 
import { AuthContext } from "@/context/AuthContext";


const ConnexionForm = () => {
	const [showPassword, setShowPassword] = useState(false);

	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const { setUser } = useContext(AuthContext);
	const navigate = useNavigate();

	const [login, { loading, error }] = useMutation(LOGIN_MUTATION, {
		onCompleted: (data) => {
		  if (data.login.user) {
			setUser(data.login.user);
			navigate("/game-mode-selection");
		  }
		},
		onError: (error) => {
		  console.error('Erreur lors de la connexion :', error);
		},
	});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
		  const response = await login({
			variables: {
			  email: formData.email,
			  password: formData.password,
			},
		  });
		  console.log('Connexion réussie :', response.data.login.user);
		} catch (err) {
		  console.error('Erreur lors de la connexion :', err);
		}
	  };

	return (
		<div className="flex justify-center items-center w-full h-full px-4">
			<form
				onSubmit={handleSubmit}
				className="p-8 rounded w-full max-w-md md:w-1/2 text-left mt-1 divide-y divide-foreground/20 md:border border-foreground/20 md:divide-y"
			>
				<section className="my-1">
					<div className="mb-4">
						<label className="block text-foreground">E-mail</label>
						<input
							type="email"
							name="email"
							value={formData.email}
                            onChange={handleChange}
							autoComplete="new-email"
							className="w-full p-2 rounded bg-foreground/5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-inherit font-thin"
							required
						/>
					</div>
					<div className="mb-4">
						<label className="block text-foreground">
							Mot de passe
						</label>
						<div className="relative">
							<input
								type={showPassword ? "text" : "password"}
								name="password"
								value={formData.password}
								onChange={handleChange}
								autoComplete="new-password"
								className="w-full p-2 pr-10 rounded bg-foreground/5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-thin"
								required
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute inset-y-0 right-0 pr-3 flex items-center"
							>
							{showPassword ? (
								<VisibilityOff className="h-5 w-5 bg-transparent" />
							) : (
								<Visibility className="h-5 w-5 bg-transparent" />
							)}
							</button>
						</div>
					</div>
					<Button type="submit" className="w-full" disabled={loading}>
						{loading ? 'Connexion...' : 'Se connecter'}
					</Button>

					{error && (
						<p className="text-red-500 mt-2">
						{error.graphQLErrors[0]?.message || 'Erreur lors de la connexion'}
						</p>
					)}

					<div className="flex justify-between items-center mt-4 text-right	">
						<Link
							to="/forgot-password"
							className="text-foreground font-thin text-xs text-right"
						>
							Mot de passe oublié ?
						</Link>
						<Link
							to="/register"
							className="text-foreground font-thin text-xs text-right"
						>
							Vous n'avez pas de compte ?
						</Link>
					</div>
				</section>
				<section className="my-4">
					<div className="flex flex-col justify-between items-center mt-4">
						<GoogleLoginButton action="login" />
						{/* <Button
							variant={"outline"}
							className="w-full my-2 hover:bg-blue-500 hover:border-none transition-all flex"
						>
							<FacebookIcon className="bg-inherit" />
							Se connecter avec Facebook
						</Button> */}
					</div>
				</section>
			</form>
		</div>
	);
};

export default ConnexionForm;
