import { Button } from '../ui/button';
import GoogleIcon from '@mui/icons-material/Google';

interface GoogleLoginButtonProps {
  action: 'login' | 'register';
}

const GoogleLoginButton = ({ action }: GoogleLoginButtonProps) => {
  const handleGoogleClick = () => {
    const baseApiUrl = import.meta.env.VITE_API_URL;
    const url = `${baseApiUrl}:4000/auth/google`;
    window.location.href = url;
  };

  return (
    <Button
      variant="outline"
      className="w-full my-2 hover:bg-red-500 hover:border-none transition-all flex items-center justify-center"
      onClick={handleGoogleClick}
      type="button"
    >
      <GoogleIcon className="bg-inherit mr-2" />
      {action === 'login' ? 'Se connecter avec Google' : "S'inscrire avec Google"}
    </Button>
  );
};

export default GoogleLoginButton;