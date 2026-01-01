import { MakrukEngine, Move, Position, PieceType } from './makruk-engine';

const PIECE_VALUES: Record<PieceType, number> = {
    'khun': 10000,
    'ruea': 800,
    'ma': 400,
    'khon': 200,
    'met': 100,
    'bia-ngai': 100,
    'bia': 50,
};

export class MakrukAI {
    engine: MakrukEngine;
    level: number; // 1 to 4

    constructor(engine: MakrukEngine, level: number) {
        this.engine = engine;
        this.level = level;
    }

    getBestMove(): { from: Position; to: Position } | null {
        const allMoves: { from: Position; to: Position; score: number }[] = [];

        // Collect all valid moves for black
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const piece = this.engine.getPiece({ row: r, col: c });
                if (piece && piece.side === 'black') {
                    const validMoves = this.engine.getValidMoves({ row: r, col: c });
                    validMoves.forEach(mv => {
                        const target = this.engine.getPiece(mv);
                        let score = 0;
                        if (target) {
                            score = PIECE_VALUES[target.type];
                        }

                        // Add some randomness
                        score += Math.random() * 10;

                        allMoves.push({ from: { row: r, col: c }, to: mv, score });
                    });
                }
            }
        }

        if (allMoves.length === 0) return null;

        if (this.level === 1) {
            // Random
            return allMoves[Math.floor(Math.random() * allMoves.length)];
        }

        // Level 2-4: Pick the moves with highest immediate score (greedy)
        // For a future iteration, we can add minimax here.
        allMoves.sort((a, b) => b.score - a.score);

        // Add some noise based on level
        const poolSize = Math.max(1, 5 - this.level);
        const selected = allMoves[Math.floor(Math.random() * Math.min(poolSize, allMoves.length))];

        return selected;
    }
}
