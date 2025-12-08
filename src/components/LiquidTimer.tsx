import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import type { TimerMode } from '../types';

interface LiquidTimerProps {
    timeLeft: number;
    totalDuration: number;
    mode: TimerMode;
}

export function LiquidTimer({ timeLeft, totalDuration, mode }: LiquidTimerProps) {
    const percentage = (timeLeft / totalDuration);

    // Wave animation variants
    const waveVariants = {
        animate: {
            x: ["0%", "-50%"],
            transition: {
                x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 5,
                    ease: "linear",
                },
            },
        } as any, // Temporary fix for strict typing on Variants
    };

    const getThemeColor = () => {
        switch (mode) {
            case 'work': return {
                liquid: 'fill-red-500',
                bg: 'bg-red-950/30',
                text: 'text-red-100',
                drop: 'shadow-[0_0_30px_rgba(239,68,68,0.3)]'
            };
            case 'shortBreak': return {
                liquid: 'fill-cyan-500',
                bg: 'bg-cyan-950/30',
                text: 'text-cyan-100',
                drop: 'shadow-[0_0_30px_rgba(6,182,212,0.3)]'
            };
            case 'longBreak': return {
                liquid: 'fill-purple-500',
                bg: 'bg-purple-950/30',
                text: 'text-purple-100',
                drop: 'shadow-[0_0_30px_rgba(168,85,247,0.3)]'
            };
        }
    };

    const colors = getThemeColor();

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col items-center justify-center p-8 space-y-8 w-full max-w-md mx-auto">

            {/* Liquid Container */}
            <div className={cn("relative w-64 h-64 rounded-full overflow-hidden border-4 border-slate-700/50 backdrop-blur-sm", colors.bg, colors.drop)}>

                {/* Wave SVG */}
                <motion.div
                    className="absolute bottom-0 left-0 w-[200%] h-full"
                    style={{
                        bottom: `${(percentage * 100) - 100}%`
                        // We start at -100% (empty) to 0% (full)? 
                        // Actually, if percentage is 1 (full), bottom should be 0.
                        // If percentage is 0 (empty), bottom should be -100%.
                        // Wait, wave needs to sit *at* the water level.
                    }}
                >
                    <motion.div
                        className="w-full h-full absolute"
                        variants={waveVariants}
                        animate="animate"
                    >
                        <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" className={cn("w-full h-full", colors.liquid, "opacity-80")}>
                            <path d="M0,0 C250,50 250,0 500,0 C750,0 750,50 1000,50 L1000,1000 L0,1000 Z" />
                        </svg>
                    </motion.div>
                </motion.div>

                {/* Time Text Overlay */}
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none mix-blend-plus-lighter">
                    <span className={cn("text-5xl font-mono font-bold tracking-tighter", colors.text)}>
                        {formatTime(timeLeft)}
                    </span>
                </div>

            </div>

            <div className="text-center mt-2 text-slate-400 uppercase tracking-widest text-sm font-semibold">
                {mode === 'work' ? 'SYSTEM FLUID' : mode === 'shortBreak' ? 'COOLANT REFILL' : 'SYSTEM FLUSH'}
            </div>

        </div>
    );
}
