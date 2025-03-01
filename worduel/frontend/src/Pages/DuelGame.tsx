// src/components/game/DuelGame.tsx
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Keyboard from "@/components/game/Keyboard";
import GameGrid from "@/components/game/GameGrid";
import OpponentGrid from "@/components/game/OpponentGrid";
import Timer from "@/components/ui/Timer";
import EndGameModal from "@/components/layout/EndGameModal";
import { useLocation } from "react-router-dom";
import useGameLogicDuel from "@/hooks/useGameLogicDuel";
import GameTitle from "@/components/ui/GameTitle";
import useWindowHeight from "@/hooks/useWindowHeight";

const DuelGame: React.FC = () => {
  const location = useLocation();
  const game = location.state?.game;
  const word = location.state?.word || "";
  const gameId = game?.id || localStorage.getItem("gameId");

  const {
    rows,
    colors,
    keyboardColors,
    correctPositions, // Gardé pour le GameGrid
    shakeRow,
    currentRow,
    gameStatus,
    handleKeyPress,
    startNewGame,
    targetWord,
    isEndGameModalOpen,
    setIsEndGameModalOpen,
    opponentRows,
    opponentColors,
    opponentCurrentRow,
    opponentUser,
  } = useGameLogicDuel(gameId, word);

  const handleEndGameModalClose = () => setIsEndGameModalOpen(false);

  const windowHeight = useWindowHeight();

  return (
    <div
      className={`flex flex-col items-center ${
        windowHeight < 750 ? "justify-end" : "justify-evenly pt-4"
      } pb-2 md:justify-center md:pb-0 lg:pt-16 xl:pt-0 font-poppins h-screen w-auto`}
    >
      <ToastContainer position="top-center" autoClose={1000} hideProgressBar />

      <GameTitle title="Duel" />

      <OpponentGrid
        rows={opponentRows}
        colors={opponentColors}
        currentRow={opponentCurrentRow}
        opponentUser={opponentUser} // Passer uniquement les infos de l'adversaire
      />

      <Timer initialTime={600} />

      <GameGrid
        rows={rows}
        colors={colors}
        correctPositions={correctPositions} // Utilisé uniquement par le joueur
        shakeRow={shakeRow}
        currentRow={currentRow}
        isGameSoloGrid={false}
      />

      <Keyboard onKeyPress={handleKeyPress} keyboardColors={keyboardColors} />

      <EndGameModal
        open={isEndGameModalOpen}
        targetWord={targetWord}
        startNewGame={startNewGame}
        handleClose={handleEndGameModalClose}
        gameStatus={gameStatus}
      />
    </div>
  );
};

export default DuelGame;
