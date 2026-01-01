export type OpponentId = 'nong-nob' | 'pro-kao' | 'master-meow' | 'thunder-god';

export interface Character {
    id: OpponentId;
    name: string;
    level: string;
    description: string;
    theme: {
        primary: string;
        glow: string;
        border: string;
        bg: string;
    };
    quotes: {
        start: string[];
        playerCapture: string[];
        aiCapture: string[];
        win: string[];
        loss: string[];
        check: string[];
    };
}

export const CHARACTERS: Character[] = [
    {
        id: 'nong-nob',
        name: 'Nong Nob',
        level: 'Beginner',
        description: 'A cheerful robot learning the basics. A bit clumsy but very polite.',
        theme: {
            primary: 'text-cyan-400',
            glow: 'shadow-[0_0_20px_rgba(34,211,238,0.5)]',
            border: 'border-cyan-500/50',
            bg: 'bg-cyan-500/10',
        },
        quotes: {
            start: ["Let's have a fun game!", "I'm still learning, please be gentle!", "System boot complete. Ready to play!"],
            playerCapture: ["Oh no! My piece!", "You're good at this!", "Oops, I didn't see that coming."],
            aiCapture: ["I got one!", "Is this how you play?", "Beep boop, move successful."],
            win: ["I won? Really?!", "That was a great game!", "Maybe I'm not so clumsy after all."],
            loss: ["You're way better than me!", "I'll try harder next time!", "Error: I lost. But I had fun!"],
            check: ["Uh oh, my King is in trouble!", "Check! What do I do?", "Intruder alert!"],
        }
    },
    {
        id: 'pro-kao',
        name: 'Pro Kao',
        level: 'Intermediate',
        description: 'A tactical strategist who loves to comment on your every move.',
        theme: {
            primary: 'text-amber-400',
            glow: 'shadow-[0_0_20px_rgba(251,191,36,0.5)]',
            border: 'border-amber-500/50',
            bg: 'bg-amber-500/10',
        },
        quotes: {
            start: ["Hope you've practiced.", "I see every move you make.", "Ready for a real challenge?"],
            playerCapture: ["A temporary setback.", "Calculated risk. Mostly.", "You think that helps?"],
            aiCapture: ["Just as I planned.", "You're leaving yourself open.", "Strategy is everything."],
            win: ["Efficiency is key.", "Better luck next time, rookie.", "All according to the algorithm."],
            loss: ["An anomaly in the data.", "You got lucky this time.", "Recalibrating for our next match."],
            check: ["I've seen worse.", "Check? Interesting choice.", "A bold attempt."],
        }
    },
    {
        id: 'master-meow',
        name: 'Master Meow',
        level: 'Advanced',
        description: 'A sassy feline grandmaster who deeply judges your existence.',
        theme: {
            primary: 'text-purple-400',
            glow: 'shadow-[0_0_20px_rgba(192,132,252,0.5)]',
            border: 'border-purple-500/50',
            bg: 'bg-purple-500/10',
        },
        quotes: {
            start: ["*Yawn* Make it quick.", "I've seen kittens play better.", "Prepare to be embarrassed."],
            playerCapture: ["Lucky guess.", "You actually caught that?", "Don't get too excited, human."],
            aiCapture: ["Delicious.", "Pathetic move.", "I'm bored. Try harder."],
            win: ["Is that all you've got?", "Back to the basics for you.", "Purr-fect victory."],
            loss: ["I was sleeping, obviously.", "This board is rigged.", "Don't tell anyone about this."],
            check: ["How annoying.", "Stop poking my King.", "You're testing my patience."],
        }
    },
    {
        id: 'thunder-god',
        name: 'Thunder God',
        level: 'Champion',
        description: 'God of Chess and Thunder. Intense, loud, and surprisingly petty.',
        theme: {
            primary: 'text-red-500',
            glow: 'shadow-[0_0_30px_rgba(239,68,68,0.7)]',
            border: 'border-red-600/70',
            bg: 'bg-red-600/20',
        },
        quotes: {
            start: ["FEEL THE WRATH OF THE TILES!", "KNEEL BEFORE YOUR MASTER!", "YOUR DOOM IS WRITTEN IN NEON!"],
            playerCapture: ["INSOLENCE!", "A MERE FLEABITE!", "THUNDER NEVER STRIKES TWICE... OH WAIT."],
            aiCapture: ["BEHOLD MY MIGHT!", "CRUSHED LIKE AN ANT!", "THE HEAVENS WEEP FOR YOUR PIECE!"],
            win: ["I AM UNSTOPPABLE!", "THE UNIVERSE BOWS TO ME!", "ANOTHER SOUL CONSUMED!"],
            loss: ["IMPOSSIBLE! THE STARS HAVE MISALIGNED!", "THIS DIMENSION IS BROKEN!", "CURSE YOU, MORTAL!"],
            check: ["STAY BACK, PEASANT!", "MY DIVINE PROTECTION IS ETERNAL!", "HOW DARE YOU!"],
        }
    }
];
