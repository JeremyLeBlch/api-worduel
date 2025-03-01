import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import Loader from '@/components/ui/Loader';

const LinkEmailSuccess = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    const password = localStorage.getItem("pendingPassword");
    const userId = localStorage.getItem("pendingUserId");
    const email = localStorage.getItem("pendingEmail");

    if (!password || !userId || !email) {
      setError("Informations manquantes pour la liaison email/mot de passe.");
      return;
    }

    const linkEmail = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}:4000/confirm-link-email`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ userId, email, password }),
          }
        );

        if (!response.ok) {
          const data = await response.json();
          setError(data.message || "Une erreur est survenue lors de la liaison email/mot de passe.");
        } else {
          localStorage.removeItem("pendingPassword");
          localStorage.removeItem("pendingUserId");
          localStorage.removeItem("pendingEmail");

          navigate('/game-mode-selection');
        }
      } catch (err) {
        // En cas d'erreur réseau ou autre
        setError("Une erreur réseau est survenue.");
      }
    };

    linkEmail();
  }, [navigate]);

  if (error) {
    return (
      <div className="flex justify-center items-center w-full h-screen px-4">
        <div className="p-8 rounded w-full max-w-md text-left mt-1 divide-y divide-foreground/20 border border-foreground/20">
          <h2 className="text-2xl font-semibold text-center mb-4">Erreur</h2>
          <p className="text-sm text-muted text-center mb-6">{error}</p>
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
    <div className="flex justify-center items-center w-full h-full px-4">
      <Loader />
    </div>
  );
};

export default LinkEmailSuccess;
