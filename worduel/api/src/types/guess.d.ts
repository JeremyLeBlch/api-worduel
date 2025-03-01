interface Guess {
    id: string;
    game_session_id: string;
    word_id: string;
    attempt_number: number;
    result: JSON;
    created_at: Date;
}

export type PositionValue = 'TRUE' | 'FALSE' | 'PARTIAL';

export default Guess;
