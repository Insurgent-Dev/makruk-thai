export type PieceType = 'khun' | 'met' | 'khon' | 'ma' | 'ruea' | 'bia' | 'bia-ngai';
export type Side = 'white' | 'black';

export interface Piece {
    type: PieceType;
    side: Side;
}

export type Board = (Piece | null)[][];

export interface Position {
    row: number;
    col: number;
}

export interface Move {
    from: Position;
    to: Position;
    captured?: Piece;
    promoted?: boolean;
}

export const INITIAL_BOARD: Board = [
    // Row 0 (Black Back Rank)
    [
        { type: 'ruea', side: 'black' },
        { type: 'ma', side: 'black' },
        { type: 'khon', side: 'black' },
        { type: 'khun', side: 'black' },
        { type: 'met', side: 'black' },
        { type: 'khon', side: 'black' },
        { type: 'ma', side: 'black' },
        { type: 'ruea', side: 'black' },
    ],
    // Row 1 (Empty)
    Array(8).fill(null),
    // Row 2 (Black Pawns)
    Array(8).fill({ type: 'bia', side: 'black' }),
    // Row 3-4 (Empty)
    Array(8).fill(null),
    Array(8).fill(null),
    // Row 5 (White Pawns)
    Array(8).fill({ type: 'bia', side: 'white' }),
    // Row 6 (Empty)
    Array(8).fill(null),
    // Row 7 (White Back Rank)
    [
        { type: 'ruea', side: 'white' },
        { type: 'ma', side: 'white' },
        { type: 'khon', side: 'white' },
        { type: 'met', side: 'white' },
        { type: 'khun', side: 'white' },
        { type: 'khon', side: 'white' },
        { type: 'ma', side: 'white' },
        { type: 'ruea', side: 'white' },
    ],
];

export class MakrukEngine {
    board: Board;
    turn: Side;
    moveHistory: Move[];

    constructor(board?: Board, turn?: Side) {
        this.board = board ? JSON.parse(JSON.stringify(board)) : INITIAL_BOARD;
        this.turn = turn || 'white';
        this.moveHistory = [];
    }

    getPiece(pos: Position): Piece | null {
        if (pos.row < 0 || pos.row > 7 || pos.col < 0 || pos.col > 7) return null;
        return this.board[pos.row][pos.col];
    }

    isValidMove(from: Position, to: Position): boolean {
        const piece = this.getPiece(from);
        if (!piece || piece.side !== this.turn) return false;

        const targetPiece = this.getPiece(to);
        if (targetPiece && targetPiece.side === this.turn) return false;

        const dr = to.row - from.row;
        const dc = to.col - from.col;
        const absDr = Math.abs(dr);
        const absDc = Math.abs(dc);

        switch (piece.type) {
            case 'khun':
                return absDr <= 1 && absDc <= 1;

            case 'met':
            case 'bia-ngai':
                return absDr === 1 && absDc === 1;

            case 'khon':
                // Forward, or diagonal
                if (piece.side === 'white') {
                    return (dr === -1 && absDc === 1) || (dr === -1 && dc === 0) || (dr === 1 && absDc === 1);
                } else {
                    return (dr === 1 && absDc === 1) || (dr === 1 && dc === 0) || (dr === -1 && absDc === 1);
                }

            case 'ma':
                return (absDr === 2 && absDc === 1) || (absDr === 1 && absDc === 2);

            case 'ruea':
                if (dr !== 0 && dc !== 0) return false;
                // Check path
                const stepR = dr === 0 ? 0 : dr / absDr;
                const stepC = dc === 0 ? 0 : dc / absDc;
                let r = from.row + stepR;
                let c = from.col + stepC;
                while (r !== to.row || c !== to.col) {
                    if (this.board[r][c]) return false;
                    r += stepR;
                    c += stepC;
                }
                return true;

            case 'bia':
                if (piece.side === 'white') {
                    if (dc === 0 && dr === -1 && !targetPiece) return true;
                    if (absDc === 1 && dr === -1 && targetPiece && targetPiece.side === 'black') return true;
                } else {
                    if (dc === 0 && dr === 1 && !targetPiece) return true;
                    if (absDc === 1 && dr === 1 && targetPiece && targetPiece.side === 'white') return true;
                }
                return false;
        }

        return false;
    }

    getValidMoves(pos: Position): Position[] {
        const moves: Position[] = [];
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                if (this.isValidMove(pos, { row: r, col: c })) {
                    // Additional check: piece should not be in check after move (simplified for now)
                    moves.push({ row: r, col: c });
                }
            }
        }
        return moves;
    }

    makeMove(from: Position, to: Position): Move | null {
        if (!this.isValidMove(from, to)) return null;

        const piece = this.getPiece(from)!;
        const targetPiece = this.getPiece(to);

        const move: Move = {
            from,
            to,
            captured: targetPiece || undefined,
        };

        this.board[to.row][to.col] = piece;
        this.board[from.row][from.col] = null;

        // Promotion
        if (piece.type === 'bia') {
            if (piece.side === 'white' && to.row === 2) { // Makruk promotion is at the 6th rank (index 2 for white)
                piece.type = 'bia-ngai';
                move.promoted = true;
            } else if (piece.side === 'black' && to.row === 5) { // Index 5 for black
                piece.type = 'bia-ngai';
                move.promoted = true;
            }
        }

        this.moveHistory.push(move);
        this.turn = this.turn === 'white' ? 'black' : 'white';
        return move;
    }

    isCheck(side: Side): boolean {
        let kingPos: Position | null = null;
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const p = this.board[r][c];
                if (p && p.type === 'khun' && p.side === side) {
                    kingPos = { row: r, col: c };
                    break;
                }
            }
            if (kingPos) break;
        }

        if (!kingPos) return false;

        const opponentSide = side === 'white' ? 'black' : 'white';
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const p = this.board[r][c];
                if (p && p.side === opponentSide) {
                    // Temporary switch turn to check validity
                    const originalTurn = this.turn;
                    this.turn = opponentSide;
                    if (this.isValidMove({ row: r, col: c }, kingPos)) {
                        this.turn = originalTurn;
                        return true;
                    }
                    this.turn = originalTurn;
                }
            }
        }
        return false;
    }
}
