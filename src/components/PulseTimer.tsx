import { motion } from 'framer-motion';
import type { TimerMode } from '../types';

interface PulseTimerProps {
    timeLeft: number;
    totalDuration: number;
    mode: TimerMode;
}

export function PulseTimer({ timeLeft, totalDuration, mode }: PulseTimerProps) {
    const percentage = timeLeft / totalDuration;

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    // Colors for the layers. We want translucent colors that blend well.
    // Reference implies reddish/orange/purple mix.
    const getThemeColors = () => {
        switch (mode) {
            case 'work': return [
                'rgba(239, 68, 68, 0.4)',  // Red
                'rgba(249, 115, 22, 0.4)', // Orange
                'rgba(168, 85, 247, 0.4)', // Purple
            ];
            case 'shortBreak': return [
                'rgba(6, 182, 212, 0.4)',  // Cyan
                'rgba(59, 130, 246, 0.4)', // Blue
                'rgba(14, 165, 233, 0.4)', // Sky
            ];
            case 'longBreak': return [
                'rgba(217, 70, 239, 0.4)', // Fuchsia
                'rgba(168, 85, 247, 0.4)', // Purple
                'rgba(236, 72, 153, 0.4)', // Pink
            ];
        }
    };

    const colors = getThemeColors();

    // Blob path generator (simple approximate circle with noise)
    // To make it look "organic", we use a few fixed blob paths that look nice and rotate them.
    // (We need normalized paths or just stick to SVG circles with distortion filters if possible, 
    // but paths are better. Let's use standard circle and simpler distorted paths or just multiple layers of circles that deform.)

    // Actually, standard Framer Motion scale implies size change.
    // Let's us simple circles with some border-radius CSS or SVG distortion filter?
    // SVG filters are great for "gooey" effects but expensive.
    // Let's use overlapping shapes with `mix-blend-mode`.

    return (
        <div className="flex flex-col items-center justify-center p-8 space-y-8 w-full max-w-md mx-auto relative">
            <div className="relative w-[300px] h-[300px] flex items-center justify-center">

                {/* The Breathing Organism */}
                <motion.div
                    className="relative flex items-center justify-center w-full h-full"
                    animate={{
                        scale: [0.95, 1.05, 0.95],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    {/* Layer 1 */}
                    <motion.div
                        className="absolute w-64 h-64 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] backdrop-blur-sm"
                        style={{
                            backgroundColor: colors[0],
                            mixBlendMode: 'screen', // 'screen' or 'plus-lighter' for glow, 'multiply' for dark overlap. User image is dark overlap on white? actually glowing on white.
                            // User image has dark strokes? No, filled translucent shapes.
                            // Let's try 'multiply' for "pigment" look if background is light, but our bg is dark.
                            // On dark bg, 'screen' or 'overlay' is good.
                            rotate: 0
                        }}
                        animate={{
                            rotate: 360,
                            scale: percentage > 0.1 ? percentage : 0.1 // Shrink as time passes
                        }}
                        transition={{
                            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                            scale: { duration: 1 } // Smooth scale update
                        }}
                    />

                    {/* Layer 2 */}
                    <motion.div
                        className="absolute w-64 h-64 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] backdrop-blur-sm"
                        style={{
                            backgroundColor: colors[1],
                            mixBlendMode: 'screen',
                            rotate: 120
                        }}
                        animate={{
                            rotate: -360, // Counter rotate
                            scale: percentage > 0.1 ? percentage * 0.9 : 0.1
                        }}
                        transition={{
                            rotate: { duration: 25, repeat: Infinity, ease: "linear" },
                            scale: { duration: 1 }
                        }}
                    />

                    {/* Layer 3 */}
                    <motion.div
                        className="absolute w-64 h-64 rounded-[30%_70%_70%_30%/30%_30%_70%_70%] backdrop-blur-sm"
                        style={{
                            backgroundColor: colors[2],
                            mixBlendMode: 'screen',
                            rotate: 240
                        }}
                        animate={{
                            rotate: 360,
                            scale: percentage > 0.1 ? percentage * 0.8 : 0.1
                        }}
                        transition={{
                            rotate: { duration: 30, repeat: Infinity, ease: "linear" },
                            scale: { duration: 1 }
                        }}
                    />
                </motion.div>

                {/* Scale ring reference lines (faint) */}
                <div className="absolute inset-0 rounded-full border border-slate-700/30 w-full h-full scale-100" />
                <div className="absolute inset-0 rounded-full border border-slate-700/20 w-full h-full scale-75 m-auto" />
                <div className="absolute inset-0 rounded-full border border-slate-700/10 w-full h-full scale-50 m-auto" />


                {/* Time Overlay - Clean, minimal, floating */}
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                    <div className="bg-slate-900/40 backdrop-blur-md px-6 py-2 rounded-2xl border border-white/10 shadow-2xl">
                        <span className="text-5xl font-sans font-thin tracking-wide text-white drop-shadow-lg">
                            {formatTime(timeLeft)}
                        </span>
                    </div>
                </div>
            </div>

            <div className="text-center mt-2 text-slate-500 uppercase tracking-[0.2em] text-xs font-bold">
                {mode === 'work' ? 'ORGANIC RHYTHM' : 'NATURAL PAUSE'}
            </div>
        </div>
    );
}
