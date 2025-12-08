import type { TimerMode } from '../types';
import { MemoryTimer } from './MemoryTimer';
import { LiquidTimer } from './LiquidTimer';
import { ErosionTimer } from './ErosionTimer';

interface TimerDisplayProps {
    timeLeft: number;
    totalDuration: number;
    mode: TimerMode;
    theme: 'memory' | 'liquid' | 'erosion'; // Passed from App
}

export function TimerDisplay({ timeLeft, totalDuration, mode, theme }: TimerDisplayProps) {
    if (theme === 'liquid') {
        return <LiquidTimer timeLeft={timeLeft} totalDuration={totalDuration} mode={mode} />;
    }
    if (theme === 'erosion') {
        return <ErosionTimer timeLeft={timeLeft} totalDuration={totalDuration} mode={mode} />;
    }
    return <MemoryTimer timeLeft={timeLeft} totalDuration={totalDuration} mode={mode} />;
}
