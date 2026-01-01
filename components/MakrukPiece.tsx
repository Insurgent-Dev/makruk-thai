"use client";

import React from 'react';
import {
    Crown,
    Gem,
    Shield,
    Zap,
    Anchor,
    CircleDashed,
    CircleDot,
    LucideIcon
} from 'lucide-react';
import { PieceType, Side } from '@/lib/makruk-engine';
import { cn } from '@/lib/utils';

// Helper for Tailwind merge
// Create lib/utils.ts if it doesn't exist
// I'll define it here for now or just use standard templates

interface PieceProps {
    type: PieceType;
    side: Side;
    active?: boolean;
    className?: string;
}

const pieceIcons: Record<PieceType, LucideIcon> = {
    'khun': Crown,
    'met': Gem,
    'khon': Shield,
    'ma': Zap,
    'ruea': Anchor,
    'bia': CircleDot,
    'bia-ngai': CircleDashed,
};

export const MakrukPiece: React.FC<PieceProps> = ({ type, side, active, className }) => {
    const Icon = pieceIcons[type];
    const isWhite = side === 'white';

    return (
        <div className={cn(
            "relative flex items-center justify-center w-full h-full cursor-grab active:cursor-grabbing transition-all duration-300",
            isWhite ? "text-slate-100" : "text-slate-900",
            active && "scale-110",
            className
        )}>
            {/* 3D Glass Effect Base */}
            <div className={cn(
                "absolute inset-0 rounded-full glass border-2 flex items-center justify-center overflow-hidden",
                isWhite ? "border-white/40 shadow-xl" : "border-black/40 shadow-lg",
                "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:to-transparent",
                "after:absolute after:bottom-0 after:right-0 after:w-full after:h-1/2 after:bg-black/5 after:rounded-full"
            )}>
                {/* Glowing Core */}
                <div className={cn(
                    "absolute h-1/2 w-1/2 rounded-full blur-lg opacity-40",
                    isWhite ? "bg-white" : "bg-black"
                )} />
            </div>

            {/* Icon with Reflection */}
            <div className="relative z-10 drop-shadow-lg">
                <Icon
                    size={36}
                    className={cn(
                        "drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]",
                        !isWhite && "drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]"
                    )}
                />
                {/* Reflection line */}
                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
            </div>

            {/* Selection Glow */}
            {active && (
                <div className="absolute -inset-1 rounded-full animate-pulse-glow bg-current opacity-20 blur-md" />
            )}
        </div>
    );
};
