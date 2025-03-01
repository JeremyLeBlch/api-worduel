import React from "react";
import { Button } from "../ui/button";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

interface EndGameModalProps {
    open: boolean;
    targetWord: string;
    startNewGame: () => void;
    handleClose: () => void;
    gameStatus: string;
}

const EndGameModal: React.FC<EndGameModalProps> = ({
    open,
    targetWord,
    startNewGame,
    handleClose,
    gameStatus,
}) => {

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="Fin de partie !"
            aria-describedby="modal-modal-description"
            className=" bg-foreground/30 bg-opacity-50"
        >
            <Box className="rounded-md outline-none bg-background flex flex-col items-center p-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 md:w-1/2 lg:w-1/3">
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    {gameStatus === "won" ? "Victoire 🎉" : "C'est loupé 🥲"}
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    {gameStatus === "won"
                        ? "Bravo, vous avez trouvé le bon mot !"
                        : (
                            <>
                                Le mot à trouver était <span className="text-primary font-semibold">{targetWord}</span>
                            </>
                        )}
                </Typography>
                <div className="mt-6 text-center flex justify-around w-full">
                    <Button onClick={() => {startNewGame();}}>Rejouer</Button>
                    <Button variant="secondary" onClick={handleClose}>Fermer</Button>
                </div>
            </Box>
        </Modal>
    );
};

export default EndGameModal;