"use client";

import React from 'react';
import { Character } from '@/lib/characters';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatBoxProps {
    opponent: Character;
    message: string;
}

export const ChatBox: React.FC<ChatBoxProps> = ({ opponent, message }) => {
    return (
        <div className="flex flex-col items-center gap-4 w-full max-w-md mx-auto mb-6">
            <AnimatePresence mode="wait">
                <motion.div
                    key={message}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className={cn(
                        "glass relative p-4 rounded-2xl w-full border-2",
                        opponent.theme.border,
                        "after:content-[''] after:absolute after:bottom-[-10px] after:left-1/2 after:translate-x-[-50%] after:w-0 after:h-0 after:border-l-[10px] after:border-l-transparent after:border-r-[10px] after:border-r-transparent after:border-t-[10px]",
                        opponent.id === 'nong-nob' && "after:border-t-cyan-500/50",
                        opponent.id === 'pro-kao' && "after:border-t-amber-500/50",
                        opponent.id === 'master-meow' && "after:border-t-purple-500/50",
                        opponent.id === 'thunder-god' && "after:border-t-red-600/70",
                    )}
                >
                    {/* Sassy AI Message */}
                    <p className={cn(
                        "text-center font-medium italic",
                        opponent.theme.primary
                    )}>
                        "{message}"
                    </p>

                    {/* Small pulsing neon dot to indicate "talking" */}
                    <div className={cn(
                        "absolute top-2 right-4 w-2 h-2 rounded-full animate-pulse",
                        opponent.id === 'nong-nob' && "bg-cyan-400",
                        opponent.id === 'pro-kao' && "bg-amber-400",
                        opponent.id === 'master-meow' && "bg-purple-400",
                        opponent.id === 'thunder-god' && "bg-red-500",
                    )} />
                </motion.div>
            </AnimatePresence>

            <div className="flex items-center gap-3">
                <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg glass border-2",
                    opponent.theme.border,
                    opponent.theme.primary
                )}>
                    {opponent.name.charAt(0)}
                </div>
                <div>
                    <h4 className={cn("font-bold text-sm", opponent.theme.primary)}>
                        {opponent.name}
                    </h4>
                    <p className="text-zinc-500 text-xs">AI Level: {opponent.level}</p>
                </div>
            </div>
        </div>
    );
};
