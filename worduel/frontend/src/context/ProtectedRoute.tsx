import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import Loader from "@/components/ui/Loader";

interface ProtectedRouteProps {
	element: JSX.Element;
	roles?: string[];
}

const ProtectedRoute = ({ element, roles }: ProtectedRouteProps) => {
	const { isAuthenticated, user, isLoading } = useContext(AuthContext);
	console.log(isAuthenticated)

	if (isLoading) {
		return <Loader />;
	}

	if (isAuthenticated === undefined) {
		return <Loader />;
	}

  // Loader tant que l'état d'authentification est en cours de chargement
  if (isLoading) {
    return <Loader />;
  }

  // Si l'utilisateur n'est pas authentifié, redirection vers la page de connexion
  if (!isAuthenticated) {
    return <Navigate to="/connexion" />;
  }
 
  
  // Si des rôles spécifiques sont requis et que l'utilisateur n'a pas ces rôles
  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/NotFound" />;
  }

  // Si tout va bien, retourner l'élément protégé
  return element;
};

export default ProtectedRoute;
