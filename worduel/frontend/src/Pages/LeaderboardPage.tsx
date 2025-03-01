import { GET_LEADERBOARD } from '@/api/api';
import { GET_USER_PROFILE } from "@/api/login";
import { useQuery } from '@apollo/client';
import { FaCrown } from 'react-icons/fa';
import { LeaderboardPlayer } from '@/types/leaderboard';
import Loader from '@/components/ui/Loader';

const LeaderboardPage = () => {
  const { data, loading: isLoading, error: isError } = useQuery<{ leaderboard: LeaderboardPlayer[] }>(GET_LEADERBOARD);

  // Test pour mettre en surbrillance le joueur actuel
  const currentPlayer = useQuery(GET_USER_PROFILE);
  const { data: currentPlayerData, loading: isCurrentPlayerLoading, error: isCurrentPlayerError } = currentPlayer;

  if (isCurrentPlayerLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
      </div>
    );
  }

  if (isCurrentPlayerError) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-destructive-foreground">
          Erreur lors de la récupération des informations du joueur.
        </p>
      </div>
    );
  }

  const currentPlayerUsername = currentPlayerData?.me?.username;

  //

  return (
    <div className="min-h-screen px-4 md:px-8 lg:px-16 w-[90vw] pt-20">
      <div className="max-w-7xl mx-auto py-12">
        <h1 className="text-4xl md:text-5xl font-semibold text-center mb-8">
          Classement
        </h1>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader />
            </div>
          ) : isError ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-lg text-destructive-foreground">
                Erreur lors de la récupération du classement.
              </p>
            </div>
          ) : (
            <table className="table-auto w-full text-left border-collapse rounded-t-lg">
              <thead className="text-lg">
                <tr className='bg-foreground/5 py-4'>
                  <th className="p-4 text-center font-semibold bg-transparent">Rang</th>
                  <th className="p-4 text-center font-semibold bg-transparent">Joueur</th>
                  <th className="p-4 text-center font-semibold bg-transparent">Score Total</th>
                </tr>
              </thead>
              <tbody>
                {data?.leaderboard.map((player: LeaderboardPlayer, index: number) => {
                  let rankIcon = null;
                  let rankTextClass = "text-foreground bg-transparent";

                  if (index === 0) {
                    rankIcon = (
                      <FaCrown className="w-8 h-8 fill-yellow-400 stroke-black" />
                    );
                    rankTextClass = "text-yellow-400 font-bold";
                  } else if (index === 1) {
                    rankIcon = (
                      <FaCrown className="w-6 h-6 fill-gray-400 stroke-black" />
                    );
                    rankTextClass = "text-gray-400 font-bold";
                  } else if (index === 2) {
                    rankIcon = (
                      <FaCrown className="w-5 h-5 fill-amber-500 stroke-black" />
                    );
                    rankTextClass = "text-amber-500 font-bold";
                  }

                    const avatarSrc = player.avatar
                    ? `/images/${player.avatar}`
                    : "/images/default.png";

                  return (
                    <tr key={`${player.username}-${index}`} className="hover:bg-card-hover transition-colors duration-200">
                      {/* Rang */}
                      <td className={`border-b border-foreground/10 p-2 text-center ${player.username === currentPlayerUsername ? 'bg-primary/50' : ''}`}>
                        <div className="grid grid-cols-2 items-center justify-center gap-2 bg-transparent">
                          {/* Icône Couronne */}
                          <div className="flex justify-end bg-transparent ">
                            {rankIcon}
                          </div>
                          {/* Numéro de Rang */}
                          <div className="flex justify-start bg-transparent">
                            <span className={rankTextClass}>{index + 1}</span>
                          </div>
                        </div>
                      </td>

                        {/* Joueur */}
                        <td className={`border-b border-foreground/10 p-2 text-center text-sm ${player.username === currentPlayerUsername ? 'bg-primary/50' : ''}`}>
                        <div className="grid grid-cols-2 items-center justify-center gap-2 bg-transparent">
                          {/* Avatar */}
                          <div className="flex justify-end bg-transparent">
                          <img
                            src={avatarSrc}
                            alt={`Avatar de ${player.username}`}
                            className="w-12 h-12 rounded-full bg-transparent"
                          />
                          </div>
                          {/* Nom */}
                          <div className="flex justify-start bg-transparent">
                          <span className="font-semibold bg-transparent">{player.username}</span>
                          </div>
                        </div>
                        </td>

                      {/* Score Total */}
                      <td className={`border-b border-foreground/10 p-2 text-center ${player.username === currentPlayerUsername ? 'bg-primary/50' : ''}`}>
                        <span className="font-bold bg-transparent">{player.total_score_multi}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
