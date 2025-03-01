import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useMutation } from "@apollo/client";
import { REGISTER_USER } from "@/api/register";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
//import FacebookIcon from "@mui/icons-material/Facebook";
import GoogleLoginButton from "../ui/GoogleLoginButton";

const RegisterForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [error, setError] = useState("");
	const navigate = useNavigate();

    const [registerUser, { loading }] = useMutation(REGISTER_USER, {
        onCompleted: () => {
          navigate("/connexion");
        },
        onError: (error) => {
            console.error("Erreur lors de l'inscription :", error);
          
            const redirectUrl = error.graphQLErrors?.[0]?.extensions?.redirectUrl;
          
            if (redirectUrl) {
              if (typeof redirectUrl === 'string') {
                window.location.href = redirectUrl;
              }
            } else {
              setError(error.message || "Une erreur est survenue.");
            }
          }
        });

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const validatePassword = (password: string) => {
		const regex =
			/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
		return regex.test(password);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (formData.password !== formData.confirmPassword) {
			setError("Les mots de passe ne correspondent pas");
			return;
		}
		if (!validatePassword(formData.password)) {
			setError(
				"Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un symbole"
			);
			return;
		}
		setError("");

        registerUser({
            variables: {
              email: formData.email,
              password: formData.password,
              username: formData.username || null,
            },
        });
	};

	return (
        <div className="flex justify-center items-center w-full h-full px-4">
            <form
            autoComplete="off"
            onSubmit={handleSubmit}
            className="p-8 rounded w-full max-w-md md:w-1/2 text-left mt-1 divide-y divide-foreground/20 md:border border-foreground/20 md:divide-y"
            >
            <section className="my-1">
                <div className="mb-4">
                <label className="block text-foreground">Pseudo</label>
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    autoComplete="new-username"
                    className="w-full p-2 rounded bg-foreground/5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-inherit font-thin"
                />
                </div>
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
                            <VisibilityOffIcon className="h-5 w-5 bg-transparent" />
                        ) : (
                            <VisibilityIcon className="h-5 w-5 bg-transparent" />
                        )}
                        </button>
                    </div>
                </div>
                <div className="mb-4">
                    <label className="block text-foreground">
                        Répéter le mot de passe
                    </label>
                    <div className="relative">
                        <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        autoComplete="new-password"
                        className="w-full p-2 pr-10 rounded bg-foreground/5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-thin"
                        required
                        />
                        <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                        {showConfirmPassword ? (
                            <VisibilityOffIcon className="h-5 w-5 bg-transparent" />
                        ) : (
                            <VisibilityIcon className="h-5 w-5 bg-transparent" />
                        )}
                        </button>
                    </div>
                </div>
                <Button type="submit" className="w-full">
                    {loading ? "Inscription en cours..." : "S'inscrire"}
                </Button>

                <div className="flex justify-end items-center mt-4 text-right	">
                    <Link to="/connexion" className="text-foreground font-thin text-xs text-right">
                        Vous avez déjà un compte ?
                    </Link>
                </div>
                <div className="my-2 w-full flex items-center justify-center h-8">
                    {error && (
                    <p className="text-secondary text-center text-xs">{error}</p>
                    )}
                </div>

            </section>
            <section className="my-4">
                <div className="flex flex-col justify-between items-center mt-4">
                    <GoogleLoginButton action="register" />
                    {/* <Button
                        variant={"outline"}
                        className="w-full my-2 hover:bg-blue-500 hover:border-none transition-all flex"
                    >
                        <FacebookIcon className="bg-inherit" />
                        S'inscrire avec Facebook
                    </Button> */}
					</div>
				</section>
			</form>
		</div>
	);
};

export default RegisterForm;
