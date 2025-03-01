// TODO - Refacto plus fine avec un hook par fonctionnalité

import { useState, useEffect, useCallback } from "react";
import { useMutation, useQuery } from "@apollo/client";
import useToast from "@/hooks/useToastNotification";
import {
    START_GAME,
    END_GAME,
    GET_WORDS,
    CREATE_GAME,
    MAKE_GUESS,
} from "@/api/api";

const REGEXP_ONLY_LETTERS = /^[A-Za-z]$/;

const useGameLogicSolo = () => {
    const { data } = useQuery(GET_WORDS);
    const [startGame] = useMutation(START_GAME);
    const [endGame] = useMutation(END_GAME);
    const [createGame] = useMutation(CREATE_GAME);
    const [makeGuess] = useMutation(MAKE_GUESS);

    const [targetWord, setTargetWord] = useState("");
    const [rows, setRows] = useState<string[][]>([]);
    const [colors, setColors] = useState<string[][]>([]);
    const [currentRow, setCurrentRow] = useState(0);
    const [keyboardColors, setKeyboardColors] = useState(
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").reduce((acc, letter) => {
            acc[letter] = "bg-keyboardbackground";
            return acc;
        }, {} as Record<string, string>)
    );
    const [correctPositions, setCorrectPositions] = useState<
        Array<string | null>
    >(Array(5).fill(null));
    const [shakeRow, setShakeRow] = useState(false);
    const [gameStatus, setGameStatus] = useState<"playing" | "won" | "lost">(
        "playing"
    );
    const { showToast } = useToast();
    const [isEndGameModalOpen, setIsEndGameModalOpen] = useState(false);

    useEffect(() => {
        const gameId = localStorage.getItem("gameId");
        if (gameId) {
            startGame({ variables: { gameId } })
                .then((response) => {
                    if (response?.data?.startGame) {
                        initializeGame(
                            response.data.startGame.game.word.word_text.toUpperCase()
                        );
                    }
                })
                .catch((error) => {
                    console.error(
                        "Erreur lors du démarrage de la partie :",
                        error
                    );
                    showToast("Erreur lors du démarrage de la partie", "error");
                });
        } else {
            startNewGame();
        }
    }, [startGame]);

    const startNewGame = () => {
        createGame({ variables: { mode: "solo" } })
            .then((response) => {
                if (response?.data?.createGame) {
                    const gameId = response.data.createGame.game.id;
                    const playerGameSessionId =
                        response.data.createGame.playerGameSession.id;
                    localStorage.setItem("gameId", gameId);
                    localStorage.setItem(
                        "playerGameSessionId",
                        playerGameSessionId
                    );
                    startGame({ variables: { gameId } })
                        .then((response) => {
                            if (response?.data?.startGame) {
                                initializeGame(
                                    response.data.startGame.game.word.word_text.toUpperCase()
                                );
                            }
                        })
                        .catch((error) => {
                            console.error(
                                "Erreur lors du démarrage de la partie :",
                                error
                            );
                            showToast("Erreur lors du démarrage de la partie", "error");
                        });
                    setIsEndGameModalOpen(false);
                }
            })
            .catch((error) => {
                console.error(
                    "Erreur lors de la création de la partie :",
                    error
                );
                showToast("Erreur lors de la création de la partie", "error");
            });
    };

    const initializeGame = (word: string) => {
        setTargetWord(word);
        setRows(Array.from({ length: 6 }, () => Array(5).fill("")));
        setColors(
            Array.from({ length: 6 }, () =>
                Array(5).fill("bg-gridbackground text-foreground")
            )
        );
        setKeyboardColors(
            "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").reduce((acc, letter) => {
                acc[letter] = "bg-keyboardbackground";
                return acc;
            }, {} as Record<string, string>)
        );
        setCorrectPositions(Array(5).fill(null));
        setCurrentRow(0);
        setGameStatus("playing");
    };

    const checkWordExists = (word: string) => {
        if (!data || !data.words) {
            console.error(
                "Erreur : les données GET_WORDS ne sont pas encore disponibles."
            );
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

        const playerGameSessionId = localStorage.getItem("playerGameSessionId");
        if (!playerGameSessionId) {
            console.error(
                "Aucun playerGameSessionId trouvé dans le localStorage"
            );
            return;
        }

        // WIP : Toast style
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
            console.error(
                "Le mot n'existe pas dans la base de données ou l'ID est manquant."
            );
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
                if (response?.data?.makeGuess) {
                    const guessResult = response.data.makeGuess.result;
                    if (guessResult) {
                        handleGuessResult(guessResult, currentGuess);
                    } else {
                        showToast("Le résultat de la tentative n'a pas pu être récupéré. ❌", "error");
                    }
                } else {
                    showToast("La tentative n'a pas pu être effectuée correctement. ❌", "error");
                }
            })
            .catch((error) => {
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
        const gameId = localStorage.getItem("gameId");
        if (!gameId) {
            console.error("Aucun gameId trouvé dans le localStorage");
            return;
        }
        endGame({ variables: { gameId, result: status } })
            .then(() => {
                setIsEndGameModalOpen(true);
            })
            .catch((error) => {
                showToast("Erreur lors de la fin de partie ❌", "error");
            });
    };

    const handleKeyPress = useCallback(
        (key: string) => {
            if (gameStatus !== "playing") return;

            if (key === "Effacer") {
                setRows((prevRows) => {
                    const newRows = [...prevRows];
                    const currentLetters = [...newRows[currentRow]];
                    const lastIndex = currentLetters.findIndex(
                        (char) => char === ""
                    );
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
                    const emptyIndex = currentLetters.findIndex(
                        (char) => char === ""
                    );
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

    return {
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
    };
};

export default useGameLogicSolo;