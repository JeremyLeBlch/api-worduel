import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const ConfirmLinkGoogle = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get("userId");
  const googleId = queryParams.get("googleId");
  const email = queryParams.get("email"); // Assurez-vous de passer l'email dans l'URL si nécessaire

  const handleGoogleAuth = () => {
    if (!userId || !googleId) {
      console.error("Paramètres userId ou googleId manquants.");
      return;
    }

    if (!password) {
      console.error("Veuillez saisir un mot de passe.");
      return;
    }

    localStorage.setItem("pendingPassword", password);
    localStorage.setItem("pendingUserId", userId);
    if (email) localStorage.setItem("pendingEmail", email);

    const googleAuthUrl = `${import.meta.env.VITE_API_URL}:4000/auth/google?userId=${userId}&googleId=${googleId}`;
    window.location.href = googleAuthUrl;
  };

  if (!userId || !googleId) {
    return (
      <div className="flex justify-center items-center w-full h-screen px-4">
        <div className="p-8 rounded w-full max-w-md text-left mt-1 divide-y divide-foreground/20 border border-foreground/20">
          <h2 className="text-2xl font-bold text-center mb-4">Erreur</h2>
          <p className="text-muted text-center mb-6">
            Les paramètres de liaison (userId, googleId) sont manquants ou invalides.
          </p>
          <Button
            variant="secondary"
            onClick={() => navigate("/connexion")}
            className="w-full"
          >
            Retour à la connexion
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center w-full h-screen px-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleGoogleAuth();
        }}
        className="p-8 rounded w-full max-w-md text-left mt-1 divide-y divide-foreground/20 border border-foreground/20"
      >
        <section className="my-4">
          <h2 className="text-2xl font-semibold text-center mb-4">
            Confirmer la liaison du compte
          </h2>
          <p className="text-sm text-muted text-center mb-6">
            Un compte créé via Google avec cet email existe déjà. Veuillez entrer un mot de passe
            pour lier un accès email/mot de passe, puis vous connecter avec Google pour
            confirmer la liaison.
          </p>
          <div className="mb-4 relative">
            <label className="block text-foreground mb-2">Mot de passe</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-2 pr-10 rounded bg-foreground/5 focus:outline-none focus:ring-2 focus:ring-primary"
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
          <Button type="submit" className="w-full mb-4">
            S'authentifier avec Google
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate("/connexion")}
            className="w-full"
          >
            Annuler
          </Button>
        </section>
      </form>
    </div>
  );
};

export default ConfirmLinkGoogle;
