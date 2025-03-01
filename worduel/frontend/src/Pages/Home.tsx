import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/Logo";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

const Home = () => {

  const { isAuthenticated } = useContext(AuthContext);
  
  const navigate = useNavigate();

  const handleStartToPlayClick = () => {
    navigate("/game-mode-selection");
  };

  return (
    <section className="min-h-screen w-screen flex flex-col justify-center items-center p-4">

      <header className="py-8 px-4 mx-auto max-w-screen-sm">
        <div className="h-32 w-auto">
          <Logo />
        </div>
      </header>
      
      <div className="flex flex-col items-center justify-evenly max-w-screen-sm mx-auto gap-6 md:flex-row w-full">
        {!isAuthenticated ? (
          <>
            <Link to="/connexion">
              <Button>Connexion</Button>
            </Link>
            <Link to="/register">
              <Button variant="secondary">Inscription</Button>
            </Link>
          </>
        ) : (
          <Button onClick={handleStartToPlayClick}>
            Commencer à jouer
          </Button>
        )}
      </div>
    </section>
  );
};

export default Home;
