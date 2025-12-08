import { motion } from 'framer-motion';
import type { TimerMode } from '../types';

interface RetroTimerProps {
    timeLeft: number;
    totalDuration: number;
    mode: TimerMode;
}

export function RetroTimer({ timeLeft, totalDuration, mode }: RetroTimerProps) {
    const percentage = timeLeft / totalDuration;

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    // Theme colors based on mode (though retro implies a specific palette, we can shift it slightly)
    // Work: Orange/Yellow (Retro Warm)
    // ShortBreak: Teal/Mint (Retro Cool)
    // LongBreak: Purple/Pink (Retro Vapor)

    const getColors = () => {
        switch (mode) {
            case 'work': return ['#F97316', '#F59E0B', '#FDBA74', '#FFF7ED']; // Orange/Amber
            case 'shortBreak': return ['#06B6D4', '#2DD4BF', '#67E8F9', '#ECFEFF']; // Cyan/Teal
            case 'longBreak': return ['#8B5CF6', '#D946EF', '#C084FC', '#FAF5FF']; // Purple/Fuchsia
        }
    };

    const colors = getColors();

    // Rings configuration
    // We want overlapping arcs.
    // Ring 1: Thick outer
    // Ring 2: Medium middle
    // Ring 3: Inner dot or small ring

    const size = 300;
    const center = size / 2;

    return (
        <div className="flex flex-col items-center justify-center p-8 space-y-8 w-full max-w-md mx-auto relative">
            <div className="relative w-[300px] h-[300px] flex items-center justify-center">

                {/* Background Circle (Off-white retro) */}
                <div className="absolute inset-0 rounded-full bg-[#E5E5E5] opacity-10 blur-xl"></div>

                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">

                    {/* Track Rings (faint background for empty state) */}
                    <circle cx={center} cy={center} r="120" fill="none" stroke={colors[3]} strokeWidth="40" opacity="0.1" />
                    <circle cx={center} cy={center} r="85" fill="none" stroke={colors[3]} strokeWidth="20" opacity="0.1" />
                    <circle cx={center} cy={center} r="60" fill="none" stroke={colors[3]} strokeWidth="20" opacity="0.1" />

                    {/* Animated Rings */}

                    {/* Outer Ring: Largest, consumes slowly visually? No, usually all consume together.
                    Let's make them move at slightly different rates or offsets for "Art" feel.
                    Or just strict time representation. Let's do strict but styled.
                */}

                    {/* Outer Ring */}
                    <motion.circle
                        cx={center} cy={center} r="120"
                        fill="none"
                        stroke={colors[0]}
                        strokeWidth="40"
                        strokeLinecap="butt" // Geometric look
                        initial={{ pathLength: 1 }}
                        animate={{ pathLength: percentage }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        style={{ rotate: 0 }}
                    />

                    {/* Middle Ring - Rotated slightly offset? */}
                    <motion.circle
                        cx={center} cy={center} r="85"
                        fill="none"
                        stroke={colors[1]}
                        strokeWidth="20" // Thinner
                        strokeLinecap="butt"
                        initial={{ pathLength: 1 }}
                        animate={{ pathLength: percentage }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        style={{ rotate: 120 }} // Start at different angle? 
                    // SVG rotate doesn't work like that on circle without transform origin.
                    // pathLength animates stroke-dasharray.
                    />
                    {/* To actually rotate the start point of the stroke, we need to rotate the element. 
                     But we already rotated the whole SVG -90deg.
                 */}

                    {/* Inner Ring */}
                    <motion.circle
                        cx={center} cy={center} r="60"
                        fill="none"
                        stroke={colors[2]}
                        strokeWidth="20"
                        strokeLinecap="butt"
                        initial={{ pathLength: 1 }}
                        animate={{ pathLength: percentage }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    />

                    {/* Center Dot */}
                    <circle cx={center} cy={center} r="15" fill="#1e1e1e" />

                </svg>

                {/* Time Overlay - Centered, contrasting but retro */}
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                    {/* We need the text to be readable over the geometric shapes. 
                    Maybe a backdrop or just bold text.
                */}
                    <div className="bg-[#1e1e1e] text-[#E5E5E5] px-4 py-1 rounded-full font-mono font-bold text-3xl tracking-widest shadow-xl border-2 border-slate-700">
                        {formatTime(timeLeft)}
                    </div>
                </div>
            </div>

            <div className="text-center mt-2 text-slate-500 uppercase tracking-[0.2em] text-xs font-bold">
                {mode === 'work' ? 'FOCUS CYCLE' : 'RECHARGE ARC'}
            </div>
        </div>
    );
}
