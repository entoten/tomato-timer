import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { cn } from '../lib/utils';
import type { TimerMode } from '../types';

interface TimerDisplayProps {
    timeLeft: number;
    totalDuration: number;
    mode: TimerMode;
}

export function TimerDisplay({ timeLeft, totalDuration, mode }: TimerDisplayProps) {
    // Create a grid of "memory blocks"
    // Let's us a 10x10 grid = 100 blocks
    // active blocks = ceil(percentage * 100)

    const percentage = (timeLeft / totalDuration);
    const totalBlocks = 100;
    const activeBlocks = Math.ceil(percentage * totalBlocks);

    const blocks = useMemo(() => {
        return Array.from({ length: totalBlocks }, (_, i) => i);
    }, []);

    const getModeColor = () => {
        switch (mode) {
            case 'work': return 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]';
            case 'shortBreak': return 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]';
            case 'longBreak': return 'bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]';
        }
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col items-center justify-center p-8 space-y-8 w-full max-w-md mx-auto">

            {/* Time Text */}
            <div className="relative z-10">
                <h1 className={cn("text-8xl font-mono tracking-tighter tabular-nums text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400 drop-shadow-2xl transition-all duration-500",
                    mode === 'work' ? "from-red-100 to-red-400" :
                        mode === 'shortBreak' ? "from-cyan-100 to-cyan-400" : "from-purple-100 to-purple-400"
                )}>
                    {formatTime(timeLeft)}
                </h1>
                <div className="text-center mt-2 text-slate-400 uppercase tracking-widest text-sm font-semibold">
                    {mode === 'work' ? 'System Processing' : mode === 'shortBreak' ? 'Cooling Down' : 'System Reboot'}
                </div>
            </div>

            {/* Memory Grid */}
            <div className="grid grid-cols-10 gap-2 p-4 bg-slate-900/50 rounded-xl border border-slate-800/50 shadow-inner w-full aspect-square relative overflow-hidden backdrop-blur-sm">
                {blocks.map((i) => {
                    // Standard memory layout often goes row by row
                    // We want to deplete from the end or randomly? 
                    // Sequential depletion is clearer for a timer.
                    const isActive = i < activeBlocks;

                    return (
                        <motion.div
                            key={i}
                            initial={false}
                            animate={{
                                scale: isActive ? 1 : 0.8,
                                opacity: isActive ? 1 : 0.2,
                                backgroundColor: isActive ? '' : ''
                            }}
                            transition={{ duration: 0.3 }}
                            className={cn(
                                "rounded-sm w-full h-full transition-colors duration-300",
                                isActive ? getModeColor() : "bg-slate-800"
                            )}
                        />
                    );
                })}

                {/* Scanline Effect Overlay (Optional cool touch) */}
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] opacity-20" />
            </div>

        </div>
    );
}
