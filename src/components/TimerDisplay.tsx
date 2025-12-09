import type { TimerMode } from '../types';
import { MemoryTimer } from './MemoryTimer';
import { LiquidTimer } from './LiquidTimer';
import { ErosionTimer } from './ErosionTimer';
import { RetroTimer } from './RetroTimer';
import { PulseTimer } from './PulseTimer';
import { DiagramTimer } from './DiagramTimer';

interface TimerDisplayProps {
    timeLeft: number;
    totalDuration: number;
    mode: TimerMode;
    theme: 'memory' | 'liquid' | 'erosion' | 'retro' | 'pulse' | 'diagram';
}

export function TimerDisplay({ timeLeft, totalDuration, mode, theme }: TimerDisplayProps) {
    if (theme === 'liquid') {
        return <LiquidTimer timeLeft={timeLeft} totalDuration={totalDuration} mode={mode} />;
    }
    if (theme === 'erosion') {
        return <ErosionTimer timeLeft={timeLeft} totalDuration={totalDuration} mode={mode} />;
    }
    if (theme === 'retro') {
        return <RetroTimer timeLeft={timeLeft} totalDuration={totalDuration} mode={mode} />;
    }
    if (theme === 'pulse') {
        return <PulseTimer timeLeft={timeLeft} totalDuration={totalDuration} mode={mode} />;
    }
    if (theme === 'diagram') {
        return <DiagramTimer timeLeft={timeLeft} totalDuration={totalDuration} mode={mode} />;
    }
    return <MemoryTimer timeLeft={timeLeft} totalDuration={totalDuration} mode={mode} />;
}
