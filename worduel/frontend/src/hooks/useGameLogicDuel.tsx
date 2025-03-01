// src/hooks/useGameLogicDuel.tsx
import { useState, useEffect, useCallback } from "react";
import { useMutation, useQuery, useSubscription } from "@apollo/client";
import useToast from "@/hooks/useToastNotification";
import {
    MAKE_GUESS,
    END_GAME,
    GET_WORDS,
    OPPONENT_IN_GAME_QUERY
} from "@/api/api";
import { OPPONENT_PROGRESS } from "@/api/subscriptions/opponentProgress";

const REGEXP_ONLY_LETTERS = /^[A-Za-z]$/;

const useGameLogicDuel = (gameId?: string, initialWord?: string) => {
    const { data } = useQuery(GET_WORDS);
    const { showToast } = useToast();

    const [endGame] = useMutation(END_GAME);
    const [makeGuess] = useMutation(MAKE_GUESS);

    // État joueur
    const playerGameSessionId = localStorage.getItem("playerGameSessionId");
    const targetWord = initialWord || "";
    const [rows, setRows] = useState<string[][]>(
        Array.from({ length: 6 }, () => Array(5).fill(""))
    );
    const [colors, setColors] = useState<string[][]>(
        Array.from({ length: 6 }, () => Array(5).fill("bg-gridbackground text-foreground"))
    );
    const [keyboardColors, setKeyboardColors] = useState<Record<string, string>>(
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").reduce((acc, letter) => {
            acc[letter] = "bg-keyboardbackground";
            return acc;
        }, {} as Record<string, string>)
    );
    const [correctPositions, setCorrectPositions] = useState<(string | null)[]>(Array(5).fill(null));
    const [shakeRow, setShakeRow] = useState(false);
    const [gameStatus, setGameStatus] = useState<"playing" | "won" | "lost">("playing");
    const [isEndGameModalOpen, setIsEndGameModalOpen] = useState(false);
    const [currentRow, setCurrentRow] = useState(0);

    // États adversaire
    const [opponentRows, setOpponentRows] = useState<string[][]>(
        Array.from({ length: 6 }, () => Array(5).fill(""))
    );
    const [opponentColors, setOpponentColors] = useState<string[][]>(
        Array.from({ length: 6 }, () => Array(5).fill("bg-gridbackground text-foreground"))
    );
    const [opponentCurrentRow, setOpponentCurrentRow] = useState<number>(0);

    const [opponentUser, setOpponentUser] = useState<{
        id: string;
        username: string;
        avatar: string;
    }>({
        id: "",
        username: "Adversaire",
        avatar: "/default.png",
    });

    const currentGameId = localStorage.getItem('gameId');

    const currentPlayerGameSessionId = localStorage.getItem('playerGameSessionId'); // Assurez-vous de stocker ce bon ID

const { data: opponentUserData, loading, error } = useQuery(OPPONENT_IN_GAME_QUERY, {
    variables: { 
        gameId: currentGameId,
        playerGameSessionId: currentPlayerGameSessionId // Si votre query le permet
    },
    skip: !currentGameId || !currentPlayerGameSessionId,
});

useEffect(() => {
    if (opponentUserData?.opponentInGame) {
        setOpponentUser(opponentUserData.opponentInGame);
    }
}, [opponentUserData]);

    const { data: opponentData } = useSubscription(OPPONENT_PROGRESS, {
        variables: { gameId: gameId || "" },
        skip: !gameId,
    });

    useEffect(() => {
        const playerGameSessionId = localStorage.getItem("playerGameSessionId");

        if (opponentData?.opponentProgress) {
            const latestGuess = opponentData.opponentProgress.latestGuess;
            const playerGameSession = opponentData.opponentProgress.playerGameSession;

            // Vérification cruciale : ne mettre à jour que si l'ID de session est différent
            if (playerGameSession?.id !== playerGameSessionId) {
                console.log("Mise à jour de l'adversaire uniquement");

                if (latestGuess) {
                    const attemptNumber = latestGuess.attempt_number;
                    const result = latestGuess.result;

                    if (result.correct) {
                        setGameStatus("lost");
                        endGameAction("lost");
                    } else if (!result.correct && attemptNumber === 6) {
                        setGameStatus("won");
                        endGameAction("won");
                    }

                    // Créer une copie totalement nouvelle des rows de l'adversaire
                    setOpponentRows(prevRows => {
                        const newRows = prevRows.map(row => [...row]);
                        // Uniquement remplir la ligne correspondant à la tentative
                        newRows[attemptNumber - 1] = Array(5).fill("");
                        return newRows;
                    });

                    // Créer une copie totalement nouvelle des couleurs de l'adversaire
                    setOpponentColors(prevColors => {
                        const newColors = prevColors.map(row => [...row]);
                        newColors[attemptNumber - 1] = result.positions.map((pos: string) => {
                            switch (pos) {
                                case 'TRUE':
                                    return 'bg-primary text-foreground';
                                case 'PARTIAL':
                                    return 'bg-secondary text-foreground';
                                default:
                                    return 'bg-foreground/50 text-background';
                            }
                        });
                        return newColors;
                    });

                    // Mise à jour du numéro de ligne de l'adversaire
                    setOpponentCurrentRow(attemptNumber);
                }
            } else {
                console.log("Ignoré : même session de jeu");
            }
        }
    }, [opponentData]);


    const checkWordExists = (word: string) => {
        if (!data || !data.words) {
            console.error("GET_WORDS pas disponibles");
            return false;
        }

        const wordFound = data.words.find(
            (w: { word_text: string }) =>
                w.word_text.trim().toUpperCase() === word.trim().toUpperCase()
        );
        return !!wordFound;
    };

    const checkWord = () => {
        const currentGuess = rows[currentRow].join("").toUpperCase().trim();

        if (!playerGameSessionId) {
            console.error("Aucun playerGameSessionId trouvé");
            return;
        }

        if (!checkWordExists(currentGuess)) {
            showToast("Ce mot n'existe pas 😐", "info");
            setShakeRow(true);
            setTimeout(() => setShakeRow(false), 500);
            return;
        }

        const foundWord = data.words.find(
            (w: { word_text: string; id: string }) =>
                w.word_text.trim().toUpperCase() === currentGuess
        );

        if (!foundWord || !foundWord.id) {
            console.error("Mot non valide ou ID manquant.");
            showToast("Mot non valide ❌", "error");
            return;
        }

        const wordId = foundWord.id;

        makeGuess({
            variables: {
                gameSessionId: playerGameSessionId,
                wordId: wordId,
                attemptNumber: currentRow + 1,
            },
        })
            .then((response) => {
                console.log("Requête makeGuess envoyée avec les variables :", {
                    gameSessionId: playerGameSessionId,
                    wordId: wordId,
                    attemptNumber: currentRow + 1,
                });
                if (response?.data?.makeGuess) {
                    const guessResult = response.data.makeGuess.result;
                    if (guessResult) {
                        handleGuessResult(guessResult, currentGuess);
                    } else {
                        showToast("Résultat non récupéré ❌", "error");
                    }
                } else {
                    showToast("Tentative non effectuée ❌", "error");
                }
            })
            .catch((error) => {
                console.error("Erreur makeGuess:", error);
                showToast("Erreur lors de la tentative ❌", "error");
            });
    };

    const handleGuessResult = (result: any, currentGuess: string) => {
        const newColors = [...colors];
        const newKeyboardColors = { ...keyboardColors };
        const updatedCorrectPositions = [...correctPositions];

        for (let i = 0; i < result.positions.length; i++) {
            if (result.positions[i] === "TRUE") {
                newColors[currentRow][i] = "bg-primary text-foreground";
                newKeyboardColors[currentGuess[i]] = "bg-primary";
                updatedCorrectPositions[i] = currentGuess[i];
            } else if (result.positions[i] === "PARTIAL") {
                newColors[currentRow][i] = "bg-secondary text-foreground";
                if (newKeyboardColors[currentGuess[i]] !== "bg-primary") {
                    newKeyboardColors[currentGuess[i]] = "bg-secondary";
                }
            } else {
                newColors[currentRow][i] = "bg-foreground/50 text-background";
                if (
                    newKeyboardColors[currentGuess[i]] !== "bg-primary" &&
                    newKeyboardColors[currentGuess[i]] !== "bg-secondary"
                ) {
                    newKeyboardColors[currentGuess[i]] = "bg-foreground/50";
                }
            }
        }

        setColors(newColors);
        setKeyboardColors(newKeyboardColors);
        setCorrectPositions(updatedCorrectPositions);

        if (result.correct) {
            setGameStatus("won");
            endGameAction("won");
        } else if (currentRow < 5) {
            setCurrentRow((prev) => prev + 1);
        } else {
            setGameStatus("lost");
            endGameAction("lost");
        }
    };

    const endGameAction = (status: "won" | "lost") => {
        const gid = gameId || localStorage.getItem("gameId");
        if (!gid) {
            console.error("Aucun gameId trouvé");
            return;
        }
        endGame({ variables: { gameId: gid, result: status } })
            .then(() => {
                setIsEndGameModalOpen(true);
            })
            .catch((error) => {
                console.error("Erreur lors de la fin de partie:", error);
                showToast("Erreur lors de la fin de partie ❌", "error");
            });
    };

    const handleKeyPress = useCallback(
        (key: string) => {
            if (gameStatus !== "playing" || !targetWord) return;

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

    const startNewGame = useCallback(() => {
        // On va simplement rediriger vers la game-mode-selection
        // Vu que dans le duel, pour relancer une partie, on doit repasser par la selection
        localStorage.removeItem("gameId");
        localStorage.removeItem("playerGameSessionId");
        window.location.href = "/game-mode-selection";
    }, []);

    return {
        // État joueur
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
        setIsEndGameModalOpen,

        // État adversaire
        opponentRows,
        opponentColors,
        opponentCurrentRow,
        opponentUser,
    };
};

export default useGameLogicDuel;
