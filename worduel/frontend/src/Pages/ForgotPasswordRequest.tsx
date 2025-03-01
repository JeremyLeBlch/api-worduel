import { useState } from 'react';
import { Button } from "@/components/ui/button";

const ForgotPasswordRequest = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch(`${import.meta.env.VITE_API_URL}:4000/request-reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    if (response.ok) {
      setMessage("Un email vous a été envoyé si cet email existe dans notre base de données.");
    } else {
      setMessage(data.message || "Une erreur est survenue");
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-screen px-4">
      <form
        onSubmit={handleSubmit}
        className="p-8 rounded w-full max-w-md text-left divide-y divide-foreground/20 border border-foreground/20"
      >
        <section className="my-4">
          <h2 className="text-2xl font-semibold text-center mb-4">Réinitialiser le mot de passe</h2>
          <p className="text-sm text-center text-muted mb-6">
            Entrez votre email, un lien de réinitialisation vous sera envoyé.
          </p>
          <div className="mb-4">
            <label className="block text-foreground mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre email"
              autoComplete="email"
              className="w-full p-2 rounded bg-foreground/5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Confirmer
          </Button>
          {message && (
            <p
              className={`mt-4 text-center text-sm ${
                message.includes("erreur") ? "text-destructive" : "text-primary"
              }`}
            >
              {message}
            </p>
          )}
        </section>
        <section className="mt-4">
          <p className="text-xs text-center text-muted mt-2">
            Vous souvenez-vous de votre mot de passe ?{" "}
            <a href="/connexion" className="text-primary underline">
              Se connecter
            </a>
          </p>
        </section>
      </form>
    </div>
  );
};

export default ForgotPasswordRequest;
