import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { toast } from 'react-toastify';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const ConfirmLinkAccount = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get('userId');
  const googleId = queryParams.get('googleId');
  const { forceRevalidate } = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}:4000/confirm-link-account`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ userId, googleId, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Erreur lors de la liaison du compte Google');
        toast.error(errorData.message || 'Erreur lors de la liaison', { position: 'top-right' });
        return;
      }

      if (response.ok) {
        setIsModalVisible(true);
      }

    } catch {
      setError('Une erreur est survenue, veuillez réessayer.');
      toast.error('Une erreur est survenue, veuillez réessayer.', { position: 'top-right' });
    }
  };

  const handleRedirect = async () => {
    await forceRevalidate();
    setIsModalVisible(false);
    navigate('/game-mode-selection');
  };

  return (
    <div className="flex justify-center items-center w-full h-screen px-4">
      <form
        onSubmit={handleSubmit}
        className="p-8 rounded w-full max-w-md text-left mt-1 divide-y divide-foreground/20 md:border border-foreground/20"
      >
        <section className="my-4">
          <h2 className="text-2xl font-semibold text-center mb-4">Confirmer la liaison</h2>
          <p className="text-sm text-muted text-center mb-6">
            Un compte avec cet email existe déjà. Veuillez saisir votre mot de passe pour confirmer la liaison.
          </p>
          <div className="mb-4 relative">
            <label className="block text-foreground mb-2">Mot de passe</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-2 pr-10 rounded bg-foreground/5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
          {error && <p className="text-destructive text-sm text-center mb-4">{error}</p>}
          <Button type="submit" className="w-full mb-4">
            Confirmer
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate("/connexion")}
            className="w-full text-sm"
          >
            Annuler
          </Button>
        </section>
      </form>

      {isModalVisible && (
        <div className="fixed inset-0 bg-grey bg-opacity-800 flex justify-center items-center ">
          <div className="bg-grey p-6 rounded shadow-lg max-w-sm w-full text-center md:border border-foreground/20">
            <h2 className="text-lg font-bold mb-4">Liaison réussie !</h2>
            <p className="text-sm text-muted mb-6">
              Votre compte Google a été lié avec succès. Vous pouvez maintenant accéder à la sélection des modes de
              jeu.
            </p>
            <Button onClick={handleRedirect} className="w-full">
              Commencer à jouer
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfirmLinkAccount;
