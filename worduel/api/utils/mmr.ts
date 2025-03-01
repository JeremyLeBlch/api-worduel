function calculateMMRChange(session, result) {
    if (result === "won") {
        return 20; // Gain de MMR en cas de victoire
    } else if (result === "lost") {
        return -10; // Perte de MMR en cas de défaite
    }
    return 0; // Aucun changement si la partie est en cours ou autre
}

export default calculateMMRChange