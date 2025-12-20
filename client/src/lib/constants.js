import {
    Swords,
    Dice5,
    Target,
    Puzzle,
    BookOpen,
    Zap,
    Crown,
    Coins,
    Clock,
    Flame,
} from "lucide-react";

export const pricingTiers = [
    {
        badgeColor: "bg-zinc-500/10 border-zinc-500 text-zinc-400",
        name: "Free",
        price: 0,
        features: [
            { icon: Swords, label: "5 coding duels per day" },
            { icon: Dice5, label: "Randomly assigned questions" },
            { icon: Puzzle, label: "Limited rotating problem pool" },
            { icon: Clock, label: "Standard duel cooldown" },
            { icon: Coins, label: "5 daily coins" },
        ],
        cta: "Get Started",
        popular: false,
    },
    {
        badgeColor: "bg-amber-600/10 border-amber-600 text-amber-500",
        name: "Bronze",
        price: 29,
        features: [
            { icon: Swords, label: "15 coding duels per day" },
            { icon: Target, label: "Random + partially selected questions" },
            { icon: Puzzle, label: "Expanded rotating problem pool" },
            { icon: Clock, label: "Reduced duel cooldown" },
            { icon: Coins, label: "15 daily coins" },
        ],
        cta: "Upgrade to Bronze",
        popular: false,
    },
    {
badgeColor: "bg-slate-400/10 border-slate-400 text-slate-300",
        name: "Silver",
        price: 59,
        features: [
            { icon: Swords, label: "Unlimited coding duels" },
            { icon: Target, label: "Fully selected questions" },
            { icon: BookOpen, label: "Full problem pool access" },
            { icon: Zap, label: "Faster matchmaking" },
            { icon: Coins, label: "30 daily coins" },
        ],
        cta: "Go Silver",
        popular: true, // best value
    },
    {
        badgeColor: "bg-yellow-500/10 border-yellow-500 text-yellow-400",
        name: "Gold",
        price: 99,
        features: [
            { icon: Swords, label: "Unlimited duels + rematches" },
            { icon: Crown, label: "Priority question selection" },
            { icon: BookOpen, label: "Extended problem pool (new & rare)" },
            { icon: Flame, label: "Priority matchmaking" },
            { icon: Coins, label: "50 daily coins" },
        ],
        cta: "Go Gold",
        popular: false,
    },
];
