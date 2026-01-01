"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { MakrukEngine, Move } from '@/lib/makruk-engine';
import { MakrukAI } from '@/lib/ai-engine';
import { Character, CHARACTERS, OpponentId } from '@/lib/characters';
import { GameBoard } from '@/components/GameBoard';
import { ChatBox } from '@/components/ChatBox';
import { ControlPanel } from '@/components/ControlPanel';
import { OpponentSelection } from '@/components/OpponentSelection';
import { soundManager } from '@/lib/audio';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [game, setGame] = useState<MakrukEngine | null>(null);
  const [opponent, setOpponent] = useState<Character | null>(null);
  const [message, setMessage] = useState<string>("");
  const [isGameOver, setIsGameOver] = useState(false);

  // Initialize game
  const startGame = useCallback((char: Character) => {
    const newGame = new MakrukEngine();
    setGame(newGame);
    setOpponent(char);
    setMessage(char.quotes.start[Math.floor(Math.random() * char.quotes.start.length)]);
    setIsGameOver(false);
  }, []);

  const handleReset = () => {
    if (opponent) startGame(opponent);
  };

  const handleChangeOpponent = () => {
    setOpponent(null);
    setGame(null);
  };

  const handlePlayerMove = (move: Move) => {
    if (!game || !opponent) return;

    if (move.captured) {
      setMessage(opponent.quotes.playerCapture[Math.floor(Math.random() * opponent.quotes.playerCapture.length)]);
    }

    // Trigger AI move after a delay
    setTimeout(aiMove, 800);
  };

  const aiMove = useCallback(() => {
    if (!game || !opponent || game.turn !== 'black') return;

    const level = CHARACTERS.indexOf(opponent) + 1;
    const ai = new MakrukAI(game, level);
    const bestMove = ai.getBestMove();

    if (bestMove) {
      const move = game.makeMove(bestMove.from, bestMove.to);
      if (move) {
        if (move.captured) {
          soundManager?.playCapture();
          setMessage(opponent.quotes.aiCapture[Math.floor(Math.random() * opponent.quotes.aiCapture.length)]);
        } else {
          soundManager?.playMove();
        }

        // Refresh game state
        setGame(new MakrukEngine(game.board, game.turn));

        // Check for game over (simplified)
        if (game.isCheck('white')) {
          setMessage(opponent.quotes.check[Math.floor(Math.random() * opponent.quotes.check.length)]);
        }
      }
    } else {
      // No moves for AI = Player wins
      setMessage(opponent.quotes.loss[0]);
      setIsGameOver(true);
      soundManager?.playWin();
    }
  }, [game, opponent]);

  return (
    <main className="min-h-screen bg-stone-950 text-white overflow-hidden relative">
      {/* Dynamic Animated Background */}
      <div
        className={cn(
          "fixed inset-0 opacity-10 pointer-events-none transition-all duration-1000",
          opponent?.theme.bg || "bg-white/5"
        )}
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, currentColor 0%, transparent 70%)',
        }}
      />

      {/* Animated Hex/Grid overlay */}
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />

      <div className="relative z-10 py-12 px-4 flex flex-col items-center">
        <header className="mb-12 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black italic tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 mb-2"
          >
            MAKRUK <span className="text-red-500">THAI</span>
          </motion.h1>
          <p className="text-zinc-500 font-mono tracking-widest text-xs uppercase">
            Sassy AI Board Game Universe // v1.0.4-beta
          </p>
        </header>

        <AnimatePresence mode="wait">
          {!opponent ? (
            <motion.div
              key="selection"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="w-full flex flex-col items-center"
            >
              <h2 className="text-2xl font-bold mb-8 text-zinc-400">CHOOSE YOUR CHALLENGER</h2>
              <OpponentSelection onSelect={startGame} />
            </motion.div>
          ) : (
            <motion.div
              key="game"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="w-full max-w-6xl flex flex-col lg:flex-row items-center lg:items-start justify-center gap-12"
            >
              {/* Left Column: Board */}
              <div className="flex flex-col items-center">
                {game && (
                  <GameBoard
                    gameState={game}
                    opponent={opponent}
                    onMove={handlePlayerMove}
                    onPieceCapture={() => { }} // Handle capture list if needed
                  />
                )}
              </div>

              {/* Right Column: AI & Controls */}
              <div className="flex flex-col gap-8 w-full max-w-md">
                <ChatBox opponent={opponent} message={message} />

                {game && (
                  <ControlPanel
                    opponent={opponent}
                    onReset={handleReset}
                    onChangeOpponent={handleChangeOpponent}
                    currentTurn={game.turn}
                  />
                )}

                {/* Score / Capture indicator (Optional) */}
                <div className="glass p-6 rounded-2xl border-white/10 hidden md:block">
                  <h5 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Tactical Feed</h5>
                  <div className="space-y-2 font-mono text-xs">
                    <div className="flex justify-between items-center text-zinc-400">
                      <span>ENGINE STATUS</span>
                      <span className="text-green-500">OPTIMAL</span>
                    </div>
                    <div className="flex justify-between items-center text-zinc-400">
                      <span>PIECE ADVANTAGE</span>
                      <span className={opponent.theme.primary}>+0.0</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Global CSS Scanline (Single) */}
      <div className="scanline" />
    </main>
  );
}
