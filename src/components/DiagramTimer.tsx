import { motion } from 'framer-motion';
import type { TimerMode } from '../types';

interface DiagramTimerProps {
    timeLeft: number;
    totalDuration: number;
    mode: TimerMode;
}

export function DiagramTimer({ timeLeft, totalDuration, mode }: DiagramTimerProps) {
    const percentage = timeLeft / totalDuration;

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    // Theme Config
    const getThemeVars = () => {
        switch (mode) {
            case 'work': return { accent: '#ef4444', label: 'PLANET SYNC A' }; // Red
            case 'shortBreak': return { accent: '#06b6d4', label: 'ORRERY PAUSE' }; // Cyan
            case 'longBreak': return { accent: '#a855f7', label: 'SYSTEM REBOOT' }; // Purple
        }
    };

    const { accent, label } = getThemeVars();
    const size = 300;
    const center = size / 2;
    const radius = 120;
    const circumference = 2 * Math.PI * radius;

    return (
        <div className="flex flex-col items-center justify-center p-8 space-y-8 w-full max-w-md mx-auto relative">
            <div className="relative w-[300px] h-[300px] flex items-center justify-center rounded-full bg-slate-100 shadow-[0_0_50px_rgba(0,0,0,0.5)] border-4 border-slate-200">

                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">

                    {/* Static Diagram Elements (The "Paper" Drawing) */}
                    {/* Axis Lines */}
                    <line x1="0" y1="150" x2="300" y2="150" stroke="#cbd5e1" strokeWidth="1" />
                    <line x1="150" y1="0" x2="150" y2="300" stroke="#cbd5e1" strokeWidth="1" />

                    {/* Background Rings */}
                    <circle cx={center} cy={center} r="140" fill="none" stroke="#e2e8f0" strokeWidth="1" />
                    <circle cx={center} cy={center} r="100" fill="none" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 4" />
                    <circle cx={center} cy={center} r="40" fill="none" stroke="#cbd5e1" strokeWidth="1" />

                    {/* Rotating decorative rings */}
                    <motion.circle
                        cx={center} cy={center} r="80"
                        fill="none"
                        stroke="#94a3b8"
                        strokeWidth="0.5"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                        style={{ originX: "150px", originY: "150px" }}
                    />
                    <motion.circle
                        cx={center} cy={center} r="60"
                        fill="none"
                        stroke="#94a3b8"
                        strokeWidth="0.5"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
                        style={{ originX: "150px", originY: "150px" }}
                    />

                    {/* Main Time Track (Background) */}
                    <circle cx={center} cy={center} r={radius} fill="none" stroke="#e2e8f0" strokeWidth="4" />

                    {/* Active Time Ring */}
                    <motion.circle
                        cx={center} cy={center} r={radius}
                        fill="none"
                        stroke={accent} // Accent color
                        strokeWidth="4"
                        strokeDasharray={circumference}
                        animate={{ strokeDashoffset: circumference * (1 - percentage) }}
                        transition={{ duration: 0.5, ease: "linear" }}
                        strokeLinecap="round"
                        className="drop-shadow-sm"
                    />

                    {/* "Planet" indicator at the tip of the time ring */}
                    {/* Visual marker calculation requires math, or we can rotate a group */}
                    <motion.g
                        animate={{ rotate: 360 * percentage }}
                        transition={{ duration: 0.5, ease: "linear" }}
                        style={{ originX: "150px", originY: "150px" }}
                    >
                        {/* The circle draws starting from 3 o'clock in standard SVG (0 deg), 
                         but we rotated SVG -90deg so it starts at 12 o'clock.
                         Wait, strokeDashoffset reduces the line. 
                         If we simply rotate a dot, we need to match the percentage.
                         Actually, let's just use the ring for now to keep it clean, or add a dot at the end.
                     */}
                        {/* 
                        If strokeDashoffset = 0 -> Full circle.
                        If strokeDashoffset = circumference -> Empty.
                        The line "eats" itself counter-clockwise if we increase offset? 
                        Typically offset goes 0 -> C.
                        Visual direction depends on implementation.
                        Let's stick to the ring for simplicity and elegance.
                     */}
                    </motion.g>

                    {/* Central Sun/Core */}
                    <circle cx={center} cy={center} r="10" fill="#1e293b" />
                    <circle cx={center} cy={center} r="4" fill="#f1f5f9" />

                </svg>

                {/* Time Overlay - Dark Text for contrast on light bg */}
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
                    <span className="text-4xl font-mono font-bold tracking-tighter text-slate-800">
                        {formatTime(timeLeft)}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 tracking-widest mt-1">
                        {label}
                    </span>
                </div>

                {/* Decoration Texts */}
                <div className="absolute top-8 text-[8px] font-mono text-slate-400">ORRERY MODEL v1.0</div>
                <div className="absolute bottom-8 text-[8px] font-mono text-slate-400">RELATIVE POSITIONS</div>

            </div>

        </div>
    );
}
