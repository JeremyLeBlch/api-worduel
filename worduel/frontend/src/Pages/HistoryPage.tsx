import { GET_HISTORY } from '@/api/api';
// import { mockHistory } from '@/mock/mockHistory';
import { GET_STATS_MY_GAME_SESSIONS } from "@/api/me";
import { useQuery } from '@apollo/client';
import { FaCrown } from 'react-icons/fa';
import { HistoryPlayer } from '@/types/history';
import { useState, useEffect } from 'react';
import Loader from '@/components/ui/Loader';
import { Button } from '@/components/ui/button';

const HistoryPage = () => {
  const [selectedTab, setSelectedTab] = useState<'duel' | 'solo'>('solo');

  // Requêtes GraphQL
  const { data: historyData, loading: historyLoading, error: historyError, refetch: refetchHistory } = useQuery<{
    myGameSessions: HistoryPlayer[];
  }>(GET_HISTORY);

  const { data: statsData, loading: statsLoading, error: statsError, refetch: refetchStats } = useQuery(GET_STATS_MY_GAME_SESSIONS);

  const [combinedHistory, setCombinedHistory] = useState<HistoryPlayer[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsFetching(true);
      try {
        await refetchHistory();
        await refetchStats();
      } catch (err) {
        console.error("Erreur lors du refetch:", err);
      } finally {
        setIsFetching(false);
      }
    };

    fetchData();
  }, [refetchHistory, refetchStats]);

  useEffect(() => {
    if (!historyData || !statsData) return;
  
    // Parties terminées dans l'historique
    const historySessions = historyData.myGameSessions.filter(
      (game) => game.succeeded === "won" || game.succeeded === "lost"
    );
  
    // Ajouter `guesses_count` et `duration` depuis statsData
    const updatedHistory = historySessions.map((game) => {
      const matchingSession = statsData.statsMyGameSessions.find(
        (session: any) => session.id === game.id
      );

      let duration: number | null = null;
      if (matchingSession?.started_at && matchingSession?.ended_at) {
        const startedAt = parseInt(matchingSession.created_at, 10);
        const endedAt = parseInt(matchingSession.ended_at, 10);
        duration = startedAt && endedAt ? Math.max(0, (endedAt - startedAt) / 1000) : null;
      }
  
      if (game.mode === "solo" && matchingSession) {
        const playerSession = matchingSession.playerGameSessions.find(
          (pgs: any) => pgs.succeeded === game.succeeded
        );
  
        return {
          ...game,
          guesses_count: playerSession?.guesses_count || null,
          duration, 
        };
      }
  
      return {
        ...game,
        duration, 
      };
    });
  
    setCombinedHistory(updatedHistory as HistoryPlayer[]);
  }, [historyData, statsData]);

  const groupByDate = (history: HistoryPlayer[]): Record<string, HistoryPlayer[]> => {
    return history.reduce((groups, game) => {
      const endedAtTimestamp = typeof game.endedAt === 'string' ? parseInt(game.endedAt, 10) : game.endedAt;

      if (isNaN(endedAtTimestamp)) {
        console.error('Invalid date timestamp:', game.endedAt);
        return groups;
      }

      const dateObj = new Date(endedAtTimestamp);
      const date = dateObj.toLocaleDateString();

      console.log('Date for game', game.wordText, 'is', date);

      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(game);

      return groups;
    }, {} as Record<string, HistoryPlayer[]>);
  };


  const filteredHistory =
  combinedHistory.filter((game) => {
    if (selectedTab === "duel") {
      return game.mode === "duel";
    } else {
      return game.mode === "solo";
    }
  }) || [];

const groupedHistory = groupByDate(filteredHistory);
  console.log('Grouped History:', groupedHistory); 


  return (
    <div className="min-h-screen px-4 md:px-8 lg:px-16 w-screen lg:w-[90vw] pt-20">
      <div className="max-w-7xl mx-auto py-12 space-y-8">
        {/* Titre */}
 

        {/* Onglets (sticky) */}
        <div className="sticky top-11 z-10 flex flex-col justify-center mb-4 space-x-4">
          <h1 className="text-4xl md:text-5xl font-semibold text-center">
            Historique {selectedTab}
          </h1>
          <div className="flex justify-center gap-10 my-8">
            <Button
              onClick={() => setSelectedTab('solo')}
              variant={`${selectedTab === 'solo' ? 'default' : 'outline'}`}
            >
              Solo
            </Button>
            <Button
              onClick={() => setSelectedTab('duel')}
              variant={`${selectedTab === 'duel' ? 'default' : 'outline'}`}
            >
              Duel
            </Button>
          </div>

        </div>



        {/* Contenu */}
        <div className="w-full">
          {historyLoading || statsLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader />
            </div>
          ) : historyError || statsError ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-lg text-destructive-foreground">
                Erreur lors de la récupération de l'historique des parties.
              </p>
            </div>
          ) : (
            <div className="w-full space-y-8">
              {Object.entries(groupedHistory).map(([date, games]) => (
                <div key={date}>
                  {/* Date */}
                  <h2 className="text-xl font-semibold mb-4 pl-2 text-left">{date}</h2>

                  {/* Tableau Responsive */}
                    <div className="overflow-x-auto">
                    <div
                      className={`grid ${selectedTab === 'duel' ? 'grid-cols-5' : 'grid-cols-4'
                        } bg-foreground/5 py-4 rounded-t-lg text-lg`}
                    >
                      {selectedTab === 'duel' ? (
                        <>
                          <div className="font-semibold text-center bg-transparent md:text-lg lg:text-lg">Adversaire</div>
                          <div className="font-semibold text-center bg-transparent md:text-lg lg:text-lg">Résultat</div>
                          <div className="font-semibold text-center bg-transparent md:text-lg lg:text-lg">Score</div>
                          <div className="font-semibold text-center bg-transparent md:text-lg lg:text-lg">Mot</div>
                          <div className="font-semibold text-center bg-transparent md:text-lg lg:text-lg">Durée</div>
                        </>
                      ) : (
                        <>
                          <div className="font-semibold text-center bg-transparent md:text-lg lg:text-lg">Mot</div>
                          <div className="font-semibold text-center bg-transparent md:text-lg lg:text-lg">Résultat</div>
                          <div className="font-semibold text-center bg-transparent md:text-lg lg:text-lg">Tentatives</div>
                          <div className="font-semibold text-center bg-transparent md:text-lg lg:text-lg">Durée</div>
                        </>
                      )}
                    </div>

                    {games.map((game) => {
                      if (selectedTab === 'duel' && game.mode === 'duel') {
                        const myTotalScore =
                          (game.scoreByTimeMe || 0) +
                          (game.scoreByGuessesMe || 0) +
                          (game.scoreBonusMe || 0);
                        const opponentTotalScore =
                          (game.scoreByTimeOpponent || 0) +
                          (game.scoreByGuessesOpponent || 0) +
                          (game.scoreBonusOpponent || 0);

                          let resultText = '';
                          let resultTextClass = '';
                          let crownIcon = null;
                          
                          if (game.succeeded === 'won') {
                            resultText = 'Victoire';
                            resultTextClass = 'font-bold text-primary';
                            crownIcon = <FaCrown className="w-4 h-4 fill-yellow-400 ml-2" />;
                          } else if (game.succeeded === 'lost') {
                            resultText = 'Défaite';
                            resultTextClass = 'text-secondary';
                          } else if (game.succeeded === 'draw') {
                            resultText = 'Égalité';
                            resultTextClass = 'text-muted-foreground';
                          }

                        return (
                          <div
                            // key={game.id}
                            className="grid grid-cols-5 items-center bg-card hover:bg-card-hover py-4 border-b border-foreground/10 last:border-0 transition-colors duration-200 text-sm"
                          >
                            <div className="flex flex-col md:flex-row items-center justify-center md:space-x-4 space-y-2 md:space-y-0">
                              <img
                                src={`/images/${game.avatarOpponent}`}
                                alt={`Avatar de ${game.usernameOpponent}`}
                                className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full object-cover"
                              />
                              <span className="font-semibold">
                                {game.usernameOpponent}
                              </span>
                            </div>

                            <div className="flex items-center justify-center">
                              <span className={resultTextClass}>{resultText}</span>
                              {crownIcon}
                            </div>

                            <div className="text-center">
                              <span className="font-bold">{myTotalScore}</span> - <span>{opponentTotalScore}</span>
                            </div>

                            <div className="text-center font-semibold">{game.wordText}</div>
                            <div className="text-center md:text-lg lg:text-lg">
                              {game.duration
                                ? game.duration < 60
                                  ? `${Math.round(game.duration)}s`
                                  : `${Math.floor(game.duration / 60)}m ${Math.round(game.duration % 60)}s`
                                : "N/A"}
                            </div>
                          </div>
                        );
                      }

                      if (selectedTab === 'solo' && game.mode === 'solo') {
                        const isVictory = game.succeeded === 'won';
                        const resultText = isVictory ? 'Victoire' : 'Défaite';
                        const resultTextClass = isVictory ? 'font-bold text-primary md:text-lg lg:text-lg' : 'text-secondary md:text-lg lg:text-lg';
                        const crownIcon = isVictory ? (
                          <FaCrown className="w-4 h-4 fill-yellow-400 ml-2" />
                        ) : null;

                        return (
                          <div
                            // key={game.id}
                            className="grid grid-cols-4 items-center bg-card hover:bg-card-hover py-2 border-b border-foreground/10 last:border-0 transition-colors duration-200 text-sm"
                          >
                            <div className="text-center font-semibold md:text-lg lg:text-lg">{game.wordText}</div>

                            <div className="flex items-center justify-center">
                              <span className={resultTextClass}>{resultText}</span>
                              {crownIcon}
                            </div>

                            <div className="text-center md:text-lg lg:text-lg">{game.guesses_count || "N/A"}</div>
                            <div className="text-center md:text-lg lg:text-lg">
                              {game.duration
                                ? game.duration < 60
                                  ? `${Math.round(game.duration)}s`
                                  : `${Math.floor(game.duration / 60)}m ${Math.round(game.duration % 60)}s`
                                : "N/A"}
                            </div>
                          </div>
                        );
                      }

                      return null; 
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
