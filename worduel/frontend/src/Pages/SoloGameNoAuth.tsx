import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import BackspaceIcon from "@mui/icons-material/Backspace";
import CheckIcon from "@mui/icons-material/Check";
import { useQuery } from "@apollo/client";
import { GET_WORDS } from "@/api/api";
import clsx from "clsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";


const REGEXP_ONLY_LETTERS = /^[A-Za-z]$/;

const SoloGameNoAuth = () => {
  const { data, loading, error } = useQuery(GET_WORDS);
  const [targetWord, setTargetWord] = useState("");
  const [rows, setRows] = useState<string[][]>([]);
  const [colors, setColors] = useState<string[][]>([]);
  const [currentRow, setCurrentRow] = useState(0);
  const [keyboardColors, setKeyboardColors] = useState(
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").reduce((acc, letter) => {
      acc[letter] = "bg-gray-500";
      return acc;
    }, {} as Record<string, string>)
  );
  const [correctPositions, setCorrectPositions] = useState<Array<string | null>>(Array(5).fill(null));
  const [shakeRow, setShakeRow] = useState(false);
  const [gameStatus, setGameStatus] = useState<"playing" | "won" | "lost">("playing");

  useEffect(() => {
    initializeGame();
  }, [data]);

  const initializeGame = () => {
    if (data && data.words) {
      const filteredWords = data.words.filter(
        (word: { word_text: string }) => word.word_text.length === 5
      );
      const randomWord = filteredWords[Math.floor(Math.random() * filteredWords.length)];
      setTargetWord(randomWord.word_text.toUpperCase());
      setRows(Array.from({ length: 6 }, () => Array(5).fill("")));
      setColors(Array.from({ length: 6 }, () => Array(5).fill("bg-gray-700 text-white")));
      setKeyboardColors(
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").reduce((acc, letter) => {
          acc[letter] = "bg-gray-500";
          return acc;
        }, {} as Record<string, string>)
      );
      setCorrectPositions(Array(5).fill(null));
      setCurrentRow(0);
      setGameStatus("playing");
    }
  };

  const checkWordExists = (word: string) => {
    return data.words.some((w: { word_text: string }) => w.word_text.toUpperCase() === word);
  };

  const checkWord = () => {
    const currentGuess = rows[currentRow].join("").toUpperCase();
    if (!checkWordExists(currentGuess)) {
      toast.info("Mot non valide", { autoClose: 1000 });
      setShakeRow(true);
      setTimeout(() => setShakeRow(false), 500);
      return;
    }

    const targetLetterCounts: Record<string, number> = {};
    for (const letter of targetWord) {
      targetLetterCounts[letter] = (targetLetterCounts[letter] || 0) + 1;
    }

    const newColors = [...colors];
    const newKeyboardColors = { ...keyboardColors };
    const remainingLetterCounts = { ...targetLetterCounts };
    const updatedCorrectPositions = [...correctPositions];

    // Première passe : Mettez les lettres bien placées en bleu et met à jour `updatedCorrectPositions`
    for (let i = 0; i < currentGuess.length; i++) {
      if (currentGuess[i] === targetWord[i]) {
        newColors[currentRow][i] = "bg-primary text-white";
        newKeyboardColors[currentGuess[i]] = "bg-primary";
        remainingLetterCounts[currentGuess[i]] -= 1;
        updatedCorrectPositions[i] = currentGuess[i];
      }
    }

    // Deuxième passe : Lettres mal placées (orange) ou absentes (gris foncé)
    for (let i = 0; i < currentGuess.length; i++) {
      const guessedLetter = currentGuess[i];
      if (guessedLetter !== targetWord[i]) {
        if (remainingLetterCounts[guessedLetter] > 0) {
          newColors[currentRow][i] = "bg-secondary text-white";
          if (newKeyboardColors[guessedLetter] !== "bg-primary") {
            newKeyboardColors[guessedLetter] = "bg-secondary";
          }
          remainingLetterCounts[guessedLetter] -= 1;
        } else {
          newColors[currentRow][i] = "bg-gray-500 text-black";
          if (
            newKeyboardColors[guessedLetter] !== "bg-primary" &&
            newKeyboardColors[guessedLetter] !== "bg-secondary"
          ) {
            newKeyboardColors[guessedLetter] = "bg-gray-700";
          }
        }
      }
    }

    setColors(newColors);
    setKeyboardColors(newKeyboardColors);
    setCorrectPositions(updatedCorrectPositions);

    if (currentGuess === targetWord) {
      setGameStatus("won");
    } else if (currentRow < 5) {
      setCurrentRow((prev) => prev + 1);
    } else {
      setGameStatus("lost");
    }
  };

  const handleKeyPress = useCallback(
    (key: string) => {
      if (gameStatus !== "playing") return;

      if (key === "Effacer") {
        setRows((prevRows) => {
          const newRows = [...prevRows];
          const currentLetters = [...newRows[currentRow]];
          const lastIndex = currentLetters.findIndex((char) => char === "");
          if (lastIndex === -1) {
            currentLetters[currentLetters.length - 1] = "";
          } else if (lastIndex > 0) {
            currentLetters[lastIndex - 1] = "";
          }
          newRows[currentRow] = currentLetters;
          return newRows;
        });
      } else if (key === "Entrer") {
        if (rows[currentRow].join("").length === targetWord.length) {
          checkWord();
        }
      } else if (REGEXP_ONLY_LETTERS.test(key)) {
        setRows((prevRows) => {
          const newRows = [...prevRows];
          const currentLetters = [...newRows[currentRow]];
          const emptyIndex = currentLetters.findIndex((char) => char === "");
          if (emptyIndex !== -1) {
            currentLetters[emptyIndex] = key.toUpperCase();
          }
          newRows[currentRow] = currentLetters;
          return newRows;
        });
      }
    },
    [currentRow, rows, targetWord, gameStatus]
  );

  const handlePhysicalKey = useCallback(
    (event: KeyboardEvent) => {
      const key = event.key.toUpperCase();
      if (key === "BACKSPACE") {
        event.preventDefault();
        handleKeyPress("Effacer");
      } else if (key === "ENTER") {
        event.preventDefault();
        handleKeyPress("Entrer");
      } else if (REGEXP_ONLY_LETTERS.test(key)) {
        handleKeyPress(key);
      }
    },
    [handleKeyPress]
  );

  useEffect(() => {
    window.addEventListener("keydown", handlePhysicalKey);
    return () => window.removeEventListener("keydown", handlePhysicalKey);
  }, [handlePhysicalKey]);

  const renderKey = (label: string) => (
    <Button key={label} className={`m-1 p-2 h-10 w-8 text-sm md:h-12 md:w-16 md:text-xl ${keyboardColors[label]} hover:bg-purple-500`} onClick={() => handleKeyPress(label)}>
      {label}
    </Button>
  );

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur lors du chargement des mots.</p>;

  return (
    <div className="flex flex-col items-center font-poppins">
      
      <Link to="/">
					<Button variant="outline">Retour</Button>
			</Link>

      <h1 className="text-4xl mb-6 mt-6">Mode Solo</h1>
      <ToastContainer position="top-center" autoClose={1000} hideProgressBar />

      <div className="space-y-2 md:space-y-4 lg:space-y-4 mb-6">
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className={clsx(
              "flex space-x-2 md:space-x-4 lg:space-x-4",
              shakeRow && rowIndex === currentRow && "animate-shake"
            )}
          >
            {row.map((letter, letterIndex) => (
              <div
                key={letterIndex}
                className={clsx(
                  colors[rowIndex][letterIndex],
                  "rounded-md p-2 text-center w-14 h-14 flex items-center justify-center font-extrabold text-3xl",
                  rowIndex === currentRow && !letter && correctPositions[letterIndex] ? "opacity-50" : "",
                  rowIndex === currentRow && letterIndex === row.findIndex((char) => char === "") ? "ring-2 ring-primary" : ""
                )}
              >
                {letter || (rowIndex === currentRow && !letter && correctPositions[letterIndex]) || ""}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-10 gap-1">
        {"AZERTYUIOP".split("").map((char) => renderKey(char))}
        {"QSDFGHJKLM".split("").map((char) => renderKey(char))}
        <div className="col-span-10 flex justify-center space-x-2 md:space-x-3 lg:space-x-3 ">
          <Button key="Effacer" className="m-1 w-12 h-10 text-base md:w-24 md:h-12 md:text-xl bg-gray-500 hover:bg-purple-500" onClick={() => handleKeyPress("Effacer")}>
            <BackspaceIcon sx={{ width: '2rem !important', height: '2rem !important' }} className="bg-primary/0" />
          </Button>
          {"WXCVBN".split("").map((char) => renderKey(char))}
          <Button key="Entrer" className="m-1 w-12 h-10 text-base md:w-24 md:h-12 md:text-xl bg-gray-500 hover:bg-purple-500" onClick={() => handleKeyPress("Entrer")}>
            <CheckIcon sx={{ width: '2rem !important', height: '2rem !important' }} className="bg-primary/0" />
          </Button>
        </div>
      </div>

      {gameStatus === "won" && (
        <div className="mt-6 text-center">
          <p className="text-2xl font-bold mb-4">Bravo, vous avez trouvé le mot ! 🎉</p>
          <Button onClick={initializeGame}>Rejouer</Button>
        </div>
      )}
      {gameStatus === "lost" && (
        <div className="mt-6 text-center">
          <p className="text-2xl font-bold mb-4">Dommage, vous y étiez presque ! Le mot était {targetWord}.</p>
          <Button onClick={initializeGame}>Rejouer</Button>
        </div>
      )}
    </div>
  );
};

export default SoloGameNoAuth;


// import { useQuery } from "@apollo/client";
// import { GET_WORDS } from "@/api/api";
// import { Button } from "@/components/ui/button";
// import { Link } from "react-router-dom";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Keyboard from "@/components/layout/Game/Keyboard";
// import useGameLogic from "@/hooks/useGameLogic";
// import GameGrid from "@/components/layout/Game/GameGrid";

// const SoloGameNoAuth = () => {
// 	const { data, loading, error } = useQuery(GET_WORDS);

// 	const {
// 		rows,
// 		colors,
// 		keyboardColors,
// 		correctPositions,
// 		shakeRow,
// 		gameStatus,
// 		handleKeyPress,
// 		initializeGame,
// 		targetWord,
// 		currentRow,
// 	} = useGameLogic(data);

// 	if (loading) return <p>Chargement...</p>;
// 	if (error) return <p>Erreur lors du chargement des mots.</p>;

// 	return (
// 		<div className="flex flex-col items-center font-poppins">
// 			<Link to="/">
// 				<Button variant="outline">Retour</Button>
// 			</Link>

// 			<h1 className="text-4xl mb-6 mt-6">Mode Solo (Test)</h1>
// 			<ToastContainer
// 				position="top-center"
// 				autoClose={1000}
// 				hideProgressBar
// 			/>

// 			<GameGrid
// 				rows={rows}
// 				colors={colors}
// 				correctPositions={correctPositions}
// 				shakeRow={shakeRow}
// 				currentRow={currentRow}
// 			/>

// 			<Keyboard
// 				onKeyPress={handleKeyPress}
// 				keyboardColors={keyboardColors}
// 			/>

// 			{gameStatus === "won" && (
// 				<div className="mt-6 text-center">
// 					<p className="text-2xl font-bold mb-4">
// 						Bravo, vous avez trouvé le mot ! 🎉
// 					</p>
// 					<Button onClick={initializeGame}>Rejouer</Button>
// 				</div>
// 			)}
// 			{gameStatus === "lost" && (
// 				<div className="mt-6 text-center">
// 					<p className="text-2xl font-bold mb-4">
// 						Dommage, vous y étiez presque ! Le mot était{" "}
// 						{targetWord}.
// 					</p>
// 					<Button onClick={initializeGame}>Rejouer</Button>
// 				</div>
// 			)}
// 		</div>
// 	);
// };

// export default SoloGameNoAuth;
