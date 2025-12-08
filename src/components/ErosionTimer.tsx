import { useEffect, useRef } from 'react';
import { createNoise3D } from 'simplex-noise';
import type { TimerMode } from '../types';

interface ErosionTimerProps {
    timeLeft: number;
    totalDuration: number;
    mode: TimerMode;
}

export function ErosionTimer({ timeLeft, totalDuration, mode }: ErosionTimerProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const timeRef = useRef(0);
    const noise3D = useRef(createNoise3D()).current;

    const percentage = timeLeft / totalDuration;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;

        const render = () => {
            timeRef.current += 0.005; // Slow animation speed

            const width = canvas.width = canvas.parentElement?.clientWidth || 300;
            const height = canvas.height = canvas.parentElement?.clientHeight || 300;

            const imageData = ctx.createImageData(width, height);
            const data = imageData.data;

            // Base color based on mode
            let r = 0, g = 0, b = 0;
            if (mode === 'work') { r = 220; g = 38; b = 38; } // Red-600
            else if (mode === 'shortBreak') { r = 8; g = 145; b = 178; } // Cyan-600
            else { r = 147; g = 51; b = 234; } // Purple-600

            // The "void" threshold moves from -1 (all solid) to 1 (all void)
            // Actually noise is usually -1 to 1.
            // We want to go from fully visible to fully eroded.
            // Let's say threshold goes from -1.0 to 1.0 based on percentage.
            // 100% time left -> threshold = -1.0 (everything visible if noise > -1)
            // 0% time left -> threshold = 1.0 (everything hidden if noise > 1)

            // Inverse logic:
            // threshold = map percentage (1 -> 0) to (-1 -> 1)
            const threshold = (1 - percentage) * 2 - 1;

            for (let x = 0; x < width; x += 2) { // Optimization: Render every 2nd pixel horizontally
                for (let y = 0; y < height; y += 2) {
                    // Normalize coordinates
                    const nx = x * 0.005;
                    const ny = y * 0.005;
                    const nt = timeRef.current; // Time dimension for subtle movement

                    // Get noise value (-1 to 1)
                    const noiseValue = noise3D(nx, ny, nt);

                    // If noise is "above" the rising tide of void (threshold), we draw
                    // Wait, if threshold is increasing (-1 to 1)...
                    // If noiseValue > threshold: draw pixel (Existence)
                    // Else: draw transparent (Void)

                    if (noiseValue > threshold) {
                        // Fill 2x2 block
                        for (let dy = 0; dy < 2; dy++) {
                            for (let dx = 0; dx < 2; dx++) {
                                if (x + dx < width && y + dy < height) {
                                    const i = ((y + dy) * width + (x + dx)) * 4;
                                    data[i] = r;
                                    data[i + 1] = g;
                                    data[i + 2] = b;
                                    data[i + 3] = 255; // Alpha

                                    // Add some "corruption" or darker edges near threshold?
                                    if (noiseValue < threshold + 0.1) {
                                        data[i] = Math.max(0, r - 50);
                                        data[i + 1] = Math.max(0, g - 50);
                                        data[i + 2] = Math.max(0, b - 50);
                                    }
                                }
                            }
                        }
                    }
                }
            }

            ctx.putImageData(imageData, 0, 0);
            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [mode, percentage, noise3D]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col items-center justify-center p-8 space-y-8 w-full max-w-md mx-auto relative">

            {/* Canvas Container */}
            <div className="w-64 h-64 relative rounded-full overflow-hidden border-4 border-slate-700/50 backdrop-blur-sm bg-slate-900/50 shadow-2xl">
                <canvas ref={canvasRef} className="w-full h-full opacity-90" />

                {/* Time Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                    <span className="text-5xl font-mono font-bold tracking-tighter text-white drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]">
                        {formatTime(timeLeft)}
                    </span>
                </div>
            </div>

            <div className="text-center mt-2 text-slate-500 uppercase tracking-[0.2em] text-xs font-bold">
                {mode === 'work' ? 'REALITY DECAY' : 'VOID STABILIZATION'}
            </div>

        </div>
    );
}
