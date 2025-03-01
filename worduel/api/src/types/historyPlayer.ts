
export default class HistoryPlayer {
    public id: string;
    public mode: string;
    public avatarOpponent: string;
    public usernameOpponent: string;
    public scoreByTimeMe: number;
    public scoreByGuessesMe: number;
    public scoreBonusMe: number;
    public scoreByTimeOpponent: number;
    public scoreByGuessesOpponent: number;
    public scoreBonusOpponent: number;
    public succeeded: string;
    public wordText: string;
    public endedAt: string | Date;

    constructor(data: Partial<HistoryPlayer>) {
        this.id = data.id;
        this.mode = data.mode;
        this.avatarOpponent = data.avatarOpponent;
        this.usernameOpponent = data.usernameOpponent;
        this.scoreByTimeMe = data.scoreByTimeMe;
        this.scoreByGuessesMe = data.scoreByGuessesMe;
        this.scoreBonusMe = data.scoreBonusMe;
        this.scoreByTimeOpponent = data.scoreByTimeOpponent;
        this.scoreByGuessesOpponent = data.scoreByGuessesOpponent;
        this.scoreBonusOpponent = data.scoreBonusOpponent;
        this.succeeded = data.succeeded;
        this.wordText = data.wordText;
        this.endedAt = data.endedAt;
    }
}