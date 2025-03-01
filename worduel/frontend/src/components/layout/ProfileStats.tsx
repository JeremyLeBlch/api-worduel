import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { Bar, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import { GET_CURRENT_USER, GET_STATS_MY_GAME_SESSIONS } from "@/api/me";
import { GET_USER_PROFILE } from "@/api/login";
import { Button } from "@/components/ui/button";
import { StatsMode, ComputedStats } from "@/types/profileStats";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const ProfileStats: React.FC = () => {
  const { data: currentUserData, loading: userLoading } = useQuery(GET_CURRENT_USER);
  const { data, loading: statsLoading, error, refetch } = useQuery(GET_STATS_MY_GAME_SESSIONS);
  const { data: profileData, loading: profileLoading, error: profileError } = useQuery(GET_USER_PROFILE);

  const [selectedMode, setSelectedMode] = useState<StatsMode>("global");
  const [statsData, setStatsData] = useState(data);

  console.log('statsData: ', statsData);
  console.log('currentUserData: ',currentUserData);
  

  const currentUserId = currentUserData?.me?.id || null;
  console.log('currentUserId: ',currentUserId);
  useEffect(() => {
    const fetchStats = async () => {
      if (!statsLoading && currentUserId) {
        const { data: refreshedData } = await refetch();
        setStatsData(refreshedData);
      }
    };
    fetchStats();
  }, [refetch, currentUserId, statsLoading]);

  if (userLoading || statsLoading || profileLoading) {
    return <p>Chargement des données...</p>;
  }

  if (error || profileError) {
    return <p>Erreur lors du chargement des données : {error?.message || profileError?.message}</p>;
  }

  if (!currentUserId) {
    return <p>Utilisateur non authentifié.</p>;
  }

  const allSessions = data?.statsMyGameSessions || [];
  const sessions = allSessions.filter((game: any) => game.status === "completed");

  const computeStatsForSessions = (sessionsArray: any[]): ComputedStats => {
    
  
    const completedSessions = sessionsArray.filter((game: any) =>
      game.status === "completed" &&
      game.playerGameSessions.some((pgs: any) => pgs.user?.id === currentUserId)
    );
    
    const filteredSessions = completedSessions.map((game: any) => ({
      ...game,
      playerGameSessions: game.playerGameSessions.filter(
        (pgs: any) => pgs.user?.id === currentUserId
      ),
    }));

    const totalGames = filteredSessions.length;
      const totalLosses = filteredSessions.reduce((acc: number, game: any) => {
        const lostSession = game.playerGameSessions.some(
          (pgs: any) => pgs.succeeded === "lost"
        );
        return acc + (lostSession ? 1 : 0);
      }, 0);

      const wonSessions = filteredSessions.filter((game: any) =>
        game.playerGameSessions.some((pgs: any) => pgs.succeeded === "won")
      );

      const drawSessions = filteredSessions.filter((game: any) =>
        game.playerGameSessions.some((pgs: any) => pgs.succeeded === "draw")
      );
  
    const winRate = totalGames > 0 ? (wonSessions.length / totalGames) * 100 : 0;
    const drawRate = totalGames > 0 ? (drawSessions.length / totalGames) * 100 : 0;
    const lossRate = totalGames > 0 ? (totalLosses / totalGames) * 100 : 0;
  
    const allGuesses = completedSessions.flatMap((game: any) =>
      game.playerGameSessions.map((pgs: any) => pgs.guesses_count || 0)
    );
  
    const median = (values: number[]) => {
      if (values.length === 0) return 0;
      const sorted = [...values].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      return sorted.length % 2 === 0
        ? (sorted[mid - 1] + sorted[mid]) / 2
        : sorted[mid];
    };
  
    const durations = completedSessions
      .filter((game: any) => game.ended_at && game.created_at)
      .map((game: any) => {
        const endedAt = parseInt(game.ended_at, 10);
        const startedAt = parseInt(game.created_at, 10);
        return Math.max(0, (endedAt - startedAt) / 1000);
      });
  
    const averageDurationSec = durations.length > 0
      ? durations.reduce((a, b) => a + b, 0) / durations.length
      : 0;
  
    const minDurationSec = durations.length > 0 ? Math.min(...durations) : 0;
    const maxDurationSec = durations.length > 0 ? Math.max(...durations) : 0;
  
    const sortedByDate = [...completedSessions].sort(
      (a: any, b: any) => parseInt(a.created_at, 10) - parseInt(b.created_at, 10)
    );
    
    // Logique des séries
    let bestWinStreak = 0;
    let worstLossStreak = 0;
    let currentStreakCount = 0;
    let currentStreakType: string | null = null;
    
    sortedByDate.forEach((game: any) => {
      // Filtrer uniquement les sessions de l'utilisateur identifié
      const meSession = game.playerGameSessions.find(
        (pgs: any) => pgs.user?.id === currentUserId
      );
    
      if (meSession?.succeeded === currentStreakType) {
        currentStreakCount++;
      } else {
        if (currentStreakType === "won" && currentStreakCount > bestWinStreak) {
          bestWinStreak = currentStreakCount;
        } else if (
          currentStreakType === "lost" &&
          currentStreakCount > worstLossStreak
        ) {
          worstLossStreak = currentStreakCount;
        }
        currentStreakType = meSession?.succeeded || null;
        currentStreakCount = 1;
      }
    });
    
    // Finaliser les séries
    if (currentStreakType === "won" && currentStreakCount > bestWinStreak) {
      bestWinStreak = currentStreakCount;
    } else if (
      currentStreakType === "lost" &&
      currentStreakCount > worstLossStreak
    ) {
      worstLossStreak = currentStreakCount;
    }
    
    const ongoingStreakType = sortedByDate.length > 0
      ? sortedByDate[sortedByDate.length - 1]?.playerGameSessions.find(
          (pgs: any) => pgs.user?.id === currentUserId
        )?.succeeded
      : null;
    
    const ongoingStreakCount =
      ongoingStreakType === currentStreakType ? currentStreakCount : 0;
    
  
    const winsByGuesses = wonSessions.reduce((acc: Record<number, number>, game: any) => {
      game.playerGameSessions.forEach((pgs: any) => {
        if (pgs.succeeded === "won") {
          const guesses = pgs.guesses_count || 0;
          acc[guesses] = (acc[guesses] || 0) + 1;
        }
      });
      return acc;
    }, {});
  
    for (let i = 1; i <= 6; i++) {
      if (!winsByGuesses[i]) {
        winsByGuesses[i] = 0;
      }
    }
  
    return {
      totalGames,
      winRate,
      drawRate,
      lossRate,
      totalLosses,
      averageGuesses:
        allGuesses.length > 0
          ? allGuesses.reduce((a, b) => a + b, 0) / allGuesses.length
          : 0,
      medianGuesses: median(allGuesses),
      winsByGuesses,
      averageDurationSec,
      minDurationSec,
      maxDurationSec,
      bestWinStreak,
      worstLossStreak,
      ongoingStreakCount,
      ongoingStreakType,
    };
  };
  

  const globalStats = computeStatsForSessions(sessions);
  const soloSessions = sessions.filter((s: any) => s.mode === "solo");
  const duelSessions = sessions.filter((s: any) => s.mode === "duel");
  const soloStats = computeStatsForSessions(soloSessions);
  const duelStats = computeStatsForSessions(duelSessions);

  const currentStats =
    selectedMode === "solo"
      ? soloStats
      : selectedMode === "duel"
      ? duelStats
      : globalStats;

  const noDuel = selectedMode === "duel" && duelSessions.length === 0;

  const style = getComputedStyle(document.documentElement);
  const primaryColor = profileData?.me?.primary_color_preference || "hsl(258, 90%, 66%)";
  const secondaryColor = profileData?.me?.secondary_color_preference || "hsl(45, 93%, 47%)";
  const foregroundColor = style.getPropertyValue("--foreground").trim();
  const backgroundColor = style.getPropertyValue("--background").trim();

  const formatColor = (color: string) => (color.startsWith("hsl") ? color : `hsl(${color})`);

  const chartData = {
    labels: selectedMode === "solo"
      ? ["1 essai", "2 essais", "3 essais", "4 essais", "5 essais", "6 essais", "Défaites"]
      : ["0 essais", "1 essai", "2 essais", "3 essais", "4 essais", "5 essais", "6 essais", "Défaites", "Égalités"],
    datasets: [
      {
        label: "Victoires",
        data: [
          ...(selectedMode !== "solo" ? [currentStats.winsByGuesses[0] || 0] : []), // Ajout "0 essais" pour Duel et Global
          currentStats.winsByGuesses[1],
          currentStats.winsByGuesses[2],
          currentStats.winsByGuesses[3],
          currentStats.winsByGuesses[4],
          currentStats.winsByGuesses[5],
          currentStats.winsByGuesses[6],
          currentStats.totalLosses,
          ...(selectedMode !== "solo" ? [currentStats.drawRate] : []), // Ajout "Égalités" pour Duel et Global
        ],
        backgroundColor: formatColor(primaryColor),
      },
    ],
  };

  const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: (context: any) => {
          const datasetLabel = context.dataset.label || "";
          const value = context.raw || 0;
          // Vérifie si c'est une barre représentant les défaites
          if (context.label === "Défaites") {
            return `Défaites: ${value}`;
          }
          return `${datasetLabel} : ${value}`;
        },
      },
      bodyColor: formatColor(primaryColor),
      titleColor: formatColor(secondaryColor),
      backgroundColor: `hsl(${backgroundColor})`,
    },
  },
  scales: {
    x: {
      ticks: {
        color: formatColor(secondaryColor),
      },
    },
    y: {
      beginAtZero: true,
      ticks: {
        color: formatColor(secondaryColor),
        stepSize: 1,
        precision: 0,
      },
    },
  },
  elements: {
    bar: {
      borderRadius: {
        topLeft: 5,
        topRight: 5,
      },
    },
  },
};

  const doughnutData = {
    labels: selectedMode === "solo"
      ? [`Victoires (${currentStats.winRate?.toFixed(1) || "0.0"}%)`, `Défaites (${(100 - currentStats.winRate)?.toFixed(1) || "0.0"}%)`]
      : [
          `Victoires (${currentStats.winRate?.toFixed(1) || "0.0"}%)`,
          `Défaites (${currentStats.lossRate?.toFixed(1) || "0.0"}%)`,
          `Égalités (${currentStats.drawRate?.toFixed(1) || "0.0"}%)`,
        ],
    datasets: [
      {
        data: selectedMode === "solo"
          ? [currentStats.winRate || 0, 100 - (currentStats.winRate || 0)]
          : [
              currentStats.winRate || 0,
              currentStats.lossRate || 0,
              currentStats.drawRate || 0,
            ],
        backgroundColor: [
          formatColor(primaryColor),
          formatColor(secondaryColor),
          ...(selectedMode !== "solo" ? [formatColor("#CCCCCC")] : []),
        ],
        borderWidth: 0,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "bottom" as const,
      },
    },
  };

  const formatDuration = (seconds: number): string => {
    if (seconds < 60) {
      return `${Math.round(seconds)}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}m${remainingSeconds}s`;
  };

  return (
    <div className="flex flex-col gap-4 p-4 rounded w-auto text-left mt-1 md:border border-foreground/20 m-0.5">
      <div className="flex flex-wrap md:flex-nowrap flex-col md:flex-row items-center md:justify-center gap-2 md:gap-4 my-4">
        <Button
          className="w-full md:w-1/2 group relative overflow-hidden"
          variant={selectedMode === "global" ? "default" : "outline"}
          onClick={() => setSelectedMode("global")}
        >
          Stats Globales
        </Button>
        <Button
          className="w-full md:w-1/2 group relative overflow-hidden"
          variant={selectedMode === "solo" ? "default" : "outline"}
          onClick={() => setSelectedMode("solo")}
        >
          Mode Solo
        </Button>
        <Button
          className="w-full md:w-1/2 group relative overflow-hidden"
          variant={selectedMode === "duel" ? "default" : "outline"}
          onClick={() => setSelectedMode("duel")}
        >
          Mode Duel
        </Button>
      </div>

      {noDuel ? (
        <p>Aucune partie en mode duel n'a été complétée pour le moment.</p>
      ) : (
        <>
          <div className=" m-0.5 lg:grid lg:grid-cols-3 lg:gap-4">
            <div className="p-2 border border-foreground/10 rounded">
              <h3 className="text-lg font-semibold mb-1">Stats Générales</h3>

              <p className="text-sm">Parties terminées: {currentStats.totalGames}</p>
              <p className="text-sm">Taux de victoire: {currentStats.winRate.toFixed(2)}%</p>
              <p className="text-sm">Essais moyens: {currentStats.averageGuesses.toFixed(2)}</p>
              <p className="text-sm">Médiane: {currentStats.medianGuesses.toFixed(2)}</p>

            </div>
            <div className="p-2 border border-foreground/10 rounded">
              <h3 className="text-lg font-semibold mb-1">Durée des parties</h3>

              <p className="text-sm">Durée moyenne: {formatDuration(currentStats.averageDurationSec)}</p>
              <p className="text-sm">Durée min: {formatDuration(currentStats.minDurationSec)}</p>
              <p className="text-sm">Durée max: {formatDuration(currentStats.maxDurationSec)}</p>

            </div>
            <div className="p-2 border border-foreground/10 rounded">
              <h3 className="text-lg font-semibold mb-1">Séries</h3>

              <p className="text-sm">Meilleure série de victoires: {currentStats.bestWinStreak}</p>
              <p className="text-sm">Pire série de défaites: {currentStats.worstLossStreak}</p>
              <p className="text-sm">

                Série en cours: {currentStats.ongoingStreakCount}{" "}
                {currentStats.ongoingStreakType === "won" ? "victoire(s)" : "défaite(s)"}{" "}
                d'affilée
              </p>
            </div>
          </div>
          <div className="p-4 border border-foreground/10 m-0.5 text-center rounded">
            <h3 className="pb-6">Répartition des victoires par nombre d’essais</h3>
            <Bar data={chartData} options={chartOptions} />
          </div>
          <div className="px-2 lg:px-36 pt-4 border border-foreground/10 m-0.5 text-center rounded">
            <h3 className="pb-6 ">Pourcentage de Victoires vs Défaites</h3>
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileStats;