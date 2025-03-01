import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch(`${import.meta.env.VITE_API_URL}:4000/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword, confirmPassword }),
    });
    const data = await response.json();
    if (response.ok) {
      setMessage("Votre mot de passe a été réinitialisé avec succès.");
      setTimeout(() => navigate('/connexion'), 3000);
    } else {
      setMessage(data.message || "Une erreur est survenue");
    }
  };

  return (
    <div>
      <h2>Nouveau mot de passe</h2>
      <p>Veuillez entrer votre nouveau mot de passe.</p>
      <form onSubmit={handleSubmit}>
        <input 
          type="password" 
          required 
          value={newPassword} 
          onChange={(e) => setNewPassword(e.target.value)} 
          placeholder="Nouveau mot de passe" 
        />
        <input 
          type="password" 
          required 
          value={confirmPassword} 
          onChange={(e) => setConfirmPassword(e.target.value)} 
          placeholder="Confirmer le mot de passe" 
        />
        <button type="submit">Réinitialiser</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPassword;
