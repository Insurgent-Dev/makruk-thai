"use client";

import React, { useState, useEffect } from 'react';
import { MakrukEngine, Position, Board, Side, Move } from '@/lib/makruk-engine';
import { MakrukPiece } from './MakrukPiece';
import { cn } from '@/lib/utils';
import { Character } from '@/lib/characters';
import { soundManager } from '@/lib/audio';

interface GameBoardProps {
    opponent: Character;
    onMove: (move: Move) => void;
    onPieceCapture: (pieceType: string) => void;
    gameState: MakrukEngine;
}

export const GameBoard: React.FC<GameBoardProps> = ({
    opponent,
    onMove,
    onPieceCapture,
    gameState
}) => {
    const [selected, setSelected] = useState<Position | null>(null);
    const [validMoves, setValidMoves] = useState<Position[]>([]);

    const handleSquareClick = (r: number, c: number) => {
        if (gameState.turn !== 'white') return; // Only player moves white for now

        const currentPos = { row: r, col: c };
        const clickedPiece = gameState.getPiece(currentPos);

        // If a move is selected
        if (selected) {
            const move = validMoves.find(m => m.row === r && m.col === c);
            if (move) {
                const result = gameState.makeMove(selected, currentPos);
                if (result) {
                    if (result.captured) {
                        soundManager?.playCapture();
                        onPieceCapture(result.captured.type);
                    } else {
                        soundManager?.playMove();
                    }
                    onMove(result);
                    setSelected(null);
                    setValidMoves([]);
                    return;
                }
            }
        }

        // Select piece
        if (clickedPiece && clickedPiece.side === 'white') {
            setSelected(currentPos);
            setValidMoves(gameState.getValidMoves(currentPos));
        } else {
            setSelected(null);
            setValidMoves([]);
        }
    };

    return (
        <div className="relative perspective-1000 p-8 flex justify-center items-center">
            {/* Outer Floating Glow Case */}
            <div className={cn(
                "relative p-4 rounded-xl transition-all duration-700",
                opponent.theme.glow,
                "bg-stone-900/40 backdrop-blur-xl border-4",
                opponent.theme.border
            )}>
                {/* Pulsing Perimeter */}
                <div className={cn(
                    "absolute -inset-1 rounded-xl animate-pulse-glow opacity-30 blur-xl pointer-events-none",
                    opponent.theme.bg
                )} />

                {/* The Grid */}
                <div className="relative grid grid-cols-8 grid-rows-8 w-[320px] h-[320px] md:w-[600px] md:h-[600px] gap-1 rotate-x-10">
                    {/* Scan lines moving across the board */}
                    <div className="scanline" />

                    {gameState.board.map((row, r) =>
                        row.map((piece, c) => {
                            const isSelected = selected?.row === r && selected?.col === c;
                            const isValid = validMoves.some(m => m.row === r && m.col === c);
                            const isDark = (r + c) % 2 === 1;

                            return (
                                <div
                                    key={`${r}-${c}`}
                                    onClick={() => handleSquareClick(r, c)}
                                    className={cn(
                                        "relative flex items-center justify-center rounded-sm transition-all duration-200 cursor-pointer overflow-hidden group",
                                        isDark ? "bg-black/40" : "bg-white/5",
                                        "border border-white/5",
                                        isValid && "bg-white/20 ring-2 ring-inset ring-white/30",
                                        isSelected && "bg-white/10 ring-2 ring-inset ring-white/50"
                                    )}
                                >
                                    {/* Square Inner Glow */}
                                    <div className="absolute inset-0 grid-glow opacity-0 group-hover:opacity-100 transition-opacity" />

                                    {/* Neon Reflections for corners */}
                                    <div className={cn(
                                        "absolute top-0 left-0 w-2 h-2 border-t border-l opacity-20 transition-all group-hover:opacity-60",
                                        opponent.theme.border
                                    )} />

                                    {piece && (
                                        <div className={cn(
                                            "w-[85%] h-[85%] piece-float",
                                            isSelected && "scale-110"
                                        )}>
                                            <MakrukPiece
                                                type={piece.type}
                                                side={piece.side}
                                                active={isSelected}
                                            />
                                        </div>
                                    )}

                                    {/* Move indicator dot */}
                                    {isValid && !piece && (
                                        <div className="w-3 h-3 rounded-full bg-white/40 blur-[1px] shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                                    )}
                                    {isValid && piece && (
                                        <div className="absolute inset-0 border-4 border-red-500/30 rounded-full blur-[2px]" />
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};
