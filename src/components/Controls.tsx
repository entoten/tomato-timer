import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import { cn } from '../lib/utils';
import type { TimerMode } from '../types';

interface ControlsProps {
    isActive: boolean;
    onToggle: () => void;
    onReset: () => void;
    onSkip: () => void; // We might need a skip function if we want to manually skip breaks/work
    mode: TimerMode;
}

export function Controls({ isActive, onToggle, onReset, onSkip, mode }: ControlsProps) {

    const getButtonColor = () => {
        switch (mode) {
            case 'work': return 'bg-red-500 hover:bg-red-600 text-white';
            case 'shortBreak': return 'bg-cyan-500 hover:bg-cyan-600 text-black';
            case 'longBreak': return 'bg-purple-500 hover:bg-purple-600 text-white';
        }
    };

    return (
        <div className="flex items-center gap-4 justify-center mt-6">
            <button
                onClick={onReset}
                className="p-4 rounded-full bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
                title="Reset"
            >
                <RotateCcw size={24} />
            </button>

            <button
                onClick={onToggle}
                className={cn(
                    "p-6 rounded-full shadow-lg transform active:scale-95 transition-all text-white",
                    getButtonColor()
                )}
                title={isActive ? 'Pause' : 'Start'}
            >
                {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" />}
            </button>

            <button
                onClick={onSkip}
                className="p-4 rounded-full bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
                title="Skip"
            >
                <SkipForward size={24} />
            </button>
        </div>
    );
}
