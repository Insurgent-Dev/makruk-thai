"use client";

import React, { useState, useEffect } from 'react';
import { Character } from '@/lib/characters';
import { cn } from '@/lib/utils';
import { RotateCcw, Users, Timer as TimerIcon } from 'lucide-react';

interface ControlPanelProps {
    opponent: Character;
    onReset: () => void;
    onChangeOpponent: () => void;
    currentTurn: 'white' | 'black';
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
    opponent,
    onReset,
    onChangeOpponent,
    currentTurn
}) => {
    const [timeLeft, setTimeLeft] = useState(30);

    useEffect(() => {
        if (timeLeft <= 0) return;
        const timer = setInterval(() => {
            setTimeLeft(t => t - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft, currentTurn]);

    // Reset timer on turn change
    useEffect(() => {
        setTimeLeft(30);
    }, [currentTurn]);

    return (
        <div className="flex flex-wrap items-center justify-center gap-4 p-6 glass rounded-2xl border-white/10">
            {/* Timer */}
            <div className={cn(
                "flex items-center gap-3 px-6 py-3 rounded-xl border-2 transition-all duration-500 bg-black/40",
                timeLeft < 10 ? "border-red-500 animate-pulse" : opponent.theme.border
            )}>
                <TimerIcon className={cn("w-5 h-5", timeLeft < 10 ? "text-red-500" : opponent.theme.primary)} />
                <span className={cn(
                    "text-2xl font-mono font-bold w-12",
                    timeLeft < 10 ? "text-red-500" : "text-white"
                )}>
                    {String(timeLeft).padStart(2, '0')}s
                </span>
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
                <button
                    onClick={onReset}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl glass border-white/10 hover:border-white/30 hover:bg-white/5 transition-all text-sm font-bold uppercase tracking-wider"
                >
                    <RotateCcw className="w-4 h-4" />
                    Reset
                </button>

                <button
                    onClick={onChangeOpponent}
                    className={cn(
                        "flex items-center gap-2 px-6 py-3 rounded-xl border-2 transition-all text-sm font-bold uppercase tracking-wider bg-black/40",
                        opponent.theme.border,
                        opponent.theme.primary,
                        "hover:bg-white/5 hover:scale-105"
                    )}
                >
                    <Users className="w-4 h-4" />
                    Change Opponent
                </button>
            </div>

            {/* Turn Indicator */}
            <div className="flex items-center gap-3 px-6 py-3 rounded-xl glass border-white/10 bg-black/40 min-w-40 justify-center">
                <div className={cn(
                    "w-3 h-3 rounded-full animate-pulse",
                    currentTurn === 'white' ? "bg-white shadow-[0_0_10px_white]" : opponent.theme.primary
                )} />
                <span className="font-bold uppercase tracking-wider text-sm">
                    {currentTurn === 'white' ? 'Your Turn' : `${opponent.name}'s Turn`}
                </span>
            </div>
        </div>
    );
};
