import IPlayerGameSession from "./playerGameSession";

export default interface IGame {
    id?: string;
    creatorId?: string;
    mode: "solo" | "duel";
    wordId?: string;
    status: "waiting" | "in_progress" | "completed" | "cancelled";
    maxPlayers?: number;
    playerInGame?: number;
    started_at?: Date;
    ended_at?: string;
    created_at?: Date;
    updated_at?: Date;
    playerGameSessions?: IPlayerGameSession[];
}

