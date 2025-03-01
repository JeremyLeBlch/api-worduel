import { useState } from 'react';
import { Button } from '../ui/button';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: string) => Promise<void>;
  message: string;
}

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, message }: ConfirmDeleteModalProps) => {
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleConfirm = async () => {
    await onConfirm(password);
    setPassword('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md text-left">
        <h2 className="text-xl font-bold mb-4">Supprimer le compte</h2>
        <p className="mb-4">{message}</p>
        <input
          type="password"
          placeholder="Entrez votre mot de passe"
          className="w-full p-2 border border-foreground/20 rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>Annuler</Button>
          <Button variant="outline" onClick={handleConfirm}>Confirmer</Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
