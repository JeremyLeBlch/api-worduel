import { useNavigate } from "react-router-dom";
import avatarPlaceholder from "@/assets/images/avatar.jpg";
import unknownAvatar from "../../public/images/unknown.jpg";
import { useMutation, useSubscription, useQuery } from "@apollo/client";
import { CREATE_GAME, CREATE_GAME_DUEL, START_GAME } from "@/api/api";
import { GET_USER_PROFILE } from "@/api/login";
import { GAME_STATUS_UPDATED } from "@/api/subscriptions/gameStatusUpdate";
import { AuthContext } from "@/context/AuthContext";
import { useContext, useState, useEffect } from "react";
import Loader from "@/components/ui/Loader";

const GameModeSelection = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useContext(AuthContext);
  const { data: userData } = useQuery(GET_USER_PROFILE);
  const userAvatar = userData?.me?.avatar ? `/images/${userData.me.avatar}` : avatarPlaceholder;
  const [isSearchingDuel, setIsSearchingDuel] = useState(false);
  const [currentGameId, setCurrentGameId] = useState<string | null>(null);
  // Supprimez cette ligne
  // const [currentPlayerGameSessionId, setCurrentPlayerGameSessionId] = useState<string | null>(null);

  // Solo
  const [createGame, { data: soloData, loading: soloLoading, error: soloError }] = useMutation(CREATE_GAME, {
    onCompleted: (data) => {
      if (data?.createGame) {
        const gameId = data.createGame.game.id;
        const playerGameSessionId = data.createGame.playerGameSession.id;
        localStorage.setItem("gameId", gameId);
        localStorage.setItem("playerGameSessionId", playerGameSessionId);
        navigate("/solo", {
          state: {
            game: data.createGame.game,
            playerGameSession: data.createGame.playerGameSession,
          },
        });
      }
    },
  });

  const handleSoloModeClick = async () => {
    if (!isAuthenticated) {
      alert("Vous devez être connecté pour jouer en mode solo.");
      return;
    }
    await createGame({ variables: { mode: "solo" } });
  };

  // Duel
  const [createGameDuel, { loading: duelLoading, error: duelError }] = useMutation(CREATE_GAME_DUEL, {
    onCompleted: (data) => {
      if (data?.startGameDuel) {
        const gameId = data.startGameDuel.game.id;
        const playerGameSessionId = data.startGameDuel.playerGameSession.id;
        console.log("playerGameSessionId", playerGameSessionId);
        const playerInGame = data.startGameDuel.game.player_in_game;  // Nouveau

        localStorage.setItem("gameId", gameId);
        localStorage.setItem("playerGameSessionId", playerGameSessionId);

        setCurrentGameId(gameId);
        setIsSearchingDuel(true);
        // setCurrentPlayerGameSessionId(playerGameSessionId);

        // Optionnel : tracker le nombre de joueurs
        console.log(`Nombre de joueurs dans la partie : ${playerInGame}`);
      }
    },
  });

  const [startRealGame] = useMutation(START_GAME, {
    onCompleted: (data) => {
      console.log("Mutation startGame completed:", data);
      if (data?.startGame?.game && data?.startGame?.game?.word) {
        const game = data.startGame.game;
        const playerGameSession = data.startGame.playerGameSession;
        const word = game.word.word_text.toUpperCase();
        navigate("/duel", {
          state: {
            game,
            playerGameSession,
            word,
          },
        });
      } else {
        console.error("Pas de mot trouvé pour ce jeu");
        // Gérer le cas où aucun mot n'est associé
      }
    },
    onError: (error) => {
      console.error("Error in startGame mutation:", error);
    },
  });

  const { data: statusData, error: subscriptionError } = useSubscription(GAME_STATUS_UPDATED, {
    variables: { gameId: currentGameId },
    skip: !currentGameId,
  });

  useEffect(() => {
    if (subscriptionError) {
      console.error("Subscription error:", subscriptionError);
      // Vous pouvez afficher une notification utilisateur ici
    }
  }, [subscriptionError]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isSearchingDuel) {
      timeoutId = setTimeout(() => {
        // Annuler la recherche après X secondes
        setIsSearchingDuel(false);
        console.warn("Aucun adversaire trouvé. Réessayez plus tard.");
      }, 60000); // 1 minute par exemple
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isSearchingDuel]);



  useEffect(() => {
    if (statusData?.gameStatusUpdated?.status === "in_progress") {
      startRealGame({
        variables: { gameId: currentGameId }
      });
    }
  }, [statusData, startRealGame, currentGameId]);

  const handleDuelModeClick = async () => {
    if (!isAuthenticated || !user) {
      // Utilisez un toast ou un système de notification plutôt qu'un alert
      console.error("Vous devez être connecté pour jouer en mode duel.");
      return;
    }
    try {
      await createGameDuel();
    } catch (error) {
      // Gestion centralisée des erreurs
      console.error("Impossible de démarrer un duel. Réessayez plus tard.");
    }
  };

  // Animation des 3 petits points sur la modale de recherche d'adversaire
  const [dots, setDots] = useState("");
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 600);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-background p-4">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-32 md:gap-12">
        {/* Solo Mode Card */}
        <div
          onClick={handleSoloModeClick}
          className="card w-72 md:w-80 lg:w-96 lg:py-10 bg-foreground/5 shadow-md hover:bg-secondary hover:shadow-[0_0_22px_8px_hsl(var(--secondary)/0.20)] hover:border-none transform transition duration-300 hover:scale-105 rounded-lg p-4 flex flex-col items-center cursor-pointer hover:text-foreground group"
        >
          <h2 className="text-2xl lg:text-3xl font-semibold mb-4 bg-transparent uppercase tracking-wider text-secondary group-hover:text-foreground ">
            Solo
          </h2>
          <img
            src={userAvatar}
            alt="Solo Mode"
            className="w-32 h-32 object-cover rounded-full mb-4 bg-transparent"
          />
          {soloLoading ? (
            <Loader />
          ) : (
            <p className="text-muted-foreground bg-transparent text-sm">
              Jouez seul, sans limite de temps
            </p>
          )}
          {soloError && (
            <p className="text-red-500 mt-2">Erreur : {soloError.message}</p>
          )}
          {soloData && (
            <p className="text-muted-foreground mt-2">
              Partie créée avec l’ID : {soloData.createGame.game.id}
            </p>
          )}
        </div>

        {/* Duel Mode Card */}
        <div
          onClick={handleDuelModeClick}
          className="card w-72 md:w-80 lg:w-96 lg:py-10 bg-foreground/5 shadow-md hover:bg-primary hover:shadow-[0_0_22px_8px_hsl(var(--primary)/0.20)] hover:border-none transform transition duration-300 hover:scale-105 rounded-lg p-4 flex flex-col items-center cursor-pointer hover:text-foreground group"
        >
          <h2 className="text-2xl lg:text-3xl font-semibold mb-4 bg-transparent uppercase tracking-wider text-primary group-hover:text-foreground">
            Duel
          </h2>
          <div className="relative w-32 h-32 mb-4 bg-transparent group-hover:flex group-hover:justify-center group-hover:items-center group-hover:space-x-4 transition-all duration-300">
            <img
              src={unknownAvatar}
              alt="Player 1"
              className="w-24 h-24 object-cover rounded-full absolute top-0 left-0 group-hover:static transition-all duration-300"
            />
            <span className="absolute top-10 left-10 text-2xl font-bold group-hover:static group-hover:transition-opacity group-hover:duration-300 opacity-0 group-hover:opacity-100 bg-transparent text-foreground">
              VS
            </span>
            <img
              src={userAvatar}
              alt="Player 2"
              className="w-24 h-24 object-cover rounded-full absolute top-7 left-10 group-hover:static transition-all duration-300"
            />
          </div>
          {duelLoading ? (
            <Loader />
          ) : (
            <p className="text-muted-foreground bg-transparent text-sm">Affrontez un adversaire et soyez plus rapide !</p>
          )}
          {duelError && (
            <p className="text-red-500 mt-2 bg-transparent">Erreur : {duelError.message}</p>
          )}
        </div>
      </div>

      {isSearchingDuel && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-background p-8 rounded shadow-lg max-w-md w-full flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-4 bg-transparent">
              Recherche d'un adversaire
              <span className="inline-block w-4 text-left">{dots}</span>
            </h3>
            <Loader />
            {duelError && (
              <p className="text-red-500 mt-4">
                Erreur : {duelError.message}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GameModeSelection;
