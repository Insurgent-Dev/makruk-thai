"use client";

import React from 'react';
import { Character, CHARACTERS } from '@/lib/characters';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface OpponentSelectionProps {
    onSelect: (character: Character) => void;
    selectedId?: string;
}

export const OpponentSelection: React.FC<OpponentSelectionProps> = ({ onSelect, selectedId }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-8 max-w-7xl mx-auto">
            {CHARACTERS.map((char) => (
                <motion.div
                    key={char.id}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onSelect(char)}
                    className={cn(
                        "glass relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 border-2 group",
                        selectedId === char.id ? char.theme.border : "border-white/10 hover:border-white/30",
                        selectedId === char.id && char.theme.glow
                    )}
                >
                    {/* Status Badge */}
                    <div className={cn(
                        "absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider z-10",
                        char.theme.bg,
                        char.theme.primary,
                        "border",
                        char.theme.border
                    )}>
                        {char.level}
                    </div>

                    <div className="p-6">
                        {/* Simple Portrait placeholder/icon */}
                        <div className={cn(
                            "w-20 h-20 rounded-2xl mb-4 flex items-center justify-center text-3xl font-bold glass transition-all duration-500",
                            char.theme.bg,
                            char.theme.primary,
                            "group-hover:scale-110",
                            char.theme.border,
                            "border shadow-[inset_0_0_20px_rgba(255,255,255,0.1)]"
                        )}>
                            {char.name.charAt(0)}
                        </div>

                        <h3 className={cn("text-xl font-bold mb-2", char.theme.primary)}>
                            {char.name}
                        </h3>
                        <p className="text-zinc-400 text-sm leading-relaxed">
                            {char.description}
                        </p>
                    </div>

                    {/* Background Ambient Glow */}
                    <div className={cn(
                        "absolute bottom-0 right-0 w-32 h-32 blur-[60px] rounded-full opacity-20 -mr-10 -mb-10 transition-opacity duration-500 group-hover:opacity-40",
                        char.theme.bg
                    )} />

                    {/* Animated selection border */}
                    {selectedId === char.id && (
                        <motion.div
                            layoutId="activeBorder"
                            className={cn("absolute inset-0 border-2 pointer-events-none", char.theme.border)}
                            initial={false}
                        />
                    )}
                </motion.div>
            ))}
        </div>
    );
};
