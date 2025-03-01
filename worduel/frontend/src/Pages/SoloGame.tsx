import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Keyboard from "@/components/game/Keyboard";
import GameGrid from "@/components/game/GameGrid";
import useGameLogicSolo from "@/hooks/useGameLogicSolo";
import EndGameModal from "@/components/layout/EndGameModal";
import GameTitle from "@/components/ui/GameTitle";

const SoloGame = () => {
    const {
        rows,
        colors,
        keyboardColors,
        correctPositions,
        shakeRow,
        gameStatus,
        handleKeyPress,
        startNewGame,
        targetWord,
        currentRow,
        isEndGameModalOpen,
        setIsEndGameModalOpen
    } = useGameLogicSolo();

    const handleEndGameModalClose = () => setIsEndGameModalOpen(false);

    return (
        <div className="flex flex-col items-center font-poppins h-screen my-auto justify-center">

            <GameTitle title="Solo"/>

            <ToastContainer
                position="top-center"
                autoClose={1000}
                hideProgressBar
            />

            <GameGrid
                rows={rows}
                colors={colors}
                correctPositions={correctPositions}
                shakeRow={shakeRow}
                currentRow={currentRow}
                isGameSoloGrid={true}
            />

            <Keyboard
                onKeyPress={handleKeyPress}
                keyboardColors={keyboardColors}
            />

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

export default SoloGame;