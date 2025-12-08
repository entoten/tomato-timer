import { useState, useEffect, useCallback, useRef } from 'react';
import type { TimerMode, TimerSettings } from '../types';

const STORAGE_KEY = 'tomato-timer-daily-stats';

interface DailyStats {
    date: string;
    count: number;
}

export function usePomodoro(initialSettings: TimerSettings) {
    const [settings, setSettings] = useState<TimerSettings>(initialSettings);
    const [mode, setMode] = useState<TimerMode>('work');
    const [timeLeft, setTimeLeft] = useState(initialSettings.workDuration);
    const [isActive, setIsActive] = useState(false);
    const [setsSinceLongBreak, setSetsSinceLongBreak] = useState(0);
    const [dailyCompleted, setDailyCompleted] = useState(0);

    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const wakeLockRef = useRef<WakeLockSentinel | null>(null);

    // Load daily stats
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed: DailyStats = JSON.parse(stored);
                const today = new Date().toDateString();
                if (parsed.date === today) {
                    setDailyCompleted(parsed.count);
                } else {
                    // Reset if new day
                    localStorage.removeItem(STORAGE_KEY);
                }
            } catch (e) {
                console.error("Failed to parse daily stats", e);
            }
        }
    }, []);

    // Handle Wake Lock
    useEffect(() => {
        const requestWakeLock = async () => {
            if ('wakeLock' in navigator) {
                try {
                    const wakeLock = await navigator.wakeLock.request('screen');
                    wakeLockRef.current = wakeLock;
                    // console.log('Wake Lock active');
                } catch (err: any) {
                    console.error(`${err.name}, ${err.message}`);
                }
            }
        };

        const releaseWakeLock = async () => {
            if (wakeLockRef.current) {
                try {
                    await wakeLockRef.current.release();
                    wakeLockRef.current = null;
                    // console.log('Wake Lock released');
                } catch (err: any) {
                    console.error(`${err.name}, ${err.message}`);
                }
            }
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && isActive) {
                requestWakeLock();
            }
        };

        if (isActive) {
            requestWakeLock();
            document.addEventListener('visibilitychange', handleVisibilityChange);
        } else {
            releaseWakeLock();
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        }

        return () => {
            releaseWakeLock();
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [isActive]);

    // Update daily stats
    const incrementDaily = useCallback(() => {
        const today = new Date().toDateString();
        const newCount = dailyCompleted + 1;
        setDailyCompleted(newCount);
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, count: newCount }));
    }, [dailyCompleted]);

    // Handle timer logic
    const playNotificationSound = useCallback(() => {
        // Simple beep or creating Audio object
        // For now, no-op or placeholder
        try {
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'); // Simple bell sound
            audio.play().catch(e => console.log('Audio play failed', e));
        } catch (e) {
            console.error(e);
        }
    }, []);

    const switchMode = useCallback((newMode: TimerMode) => {
        setMode(newMode);
        let duration = settings.workDuration;
        if (newMode === 'shortBreak') duration = settings.shortBreakDuration;
        if (newMode === 'longBreak') duration = settings.longBreakDuration;
        setTimeLeft(duration);
    }, [settings]); // settings is a dependency because durations come from it

    const handleTimerComplete = useCallback(() => {
        setIsActive(false);
        playNotificationSound();

        if (mode === 'work') {
            incrementDaily();
            const newSets = setsSinceLongBreak + 1;
            setSetsSinceLongBreak(newSets);

            if (newSets >= settings.longBreakInterval) {
                switchMode('longBreak');
            } else {
                switchMode('shortBreak');
            }
        } else {
            // Break finished, back to work
            if (mode === 'longBreak') {
                setSetsSinceLongBreak(0);
            }
            switchMode('work');
        }
    }, [mode, setsSinceLongBreak, incrementDaily, settings, switchMode, playNotificationSound]);

    // Handle timer logic
    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            // Timer finished
            handleTimerComplete();
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isActive, timeLeft, handleTimerComplete]);

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        let duration = settings.workDuration;
        if (mode === 'shortBreak') duration = settings.shortBreakDuration;
        if (mode === 'longBreak') duration = settings.longBreakDuration;
        setTimeLeft(duration);
    };

    const updateSettings = (newSettings: TimerSettings) => {
        setSettings(newSettings);
        // If not active, update current time to match new duration for current mode
        if (!isActive) {
            if (mode === 'work') setTimeLeft(newSettings.workDuration);
            if (mode === 'shortBreak') setTimeLeft(newSettings.shortBreakDuration);
            if (mode === 'longBreak') setTimeLeft(newSettings.longBreakDuration);
        }
    };

    return {
        mode,
        timeLeft,
        isActive,
        setsSinceLongBreak,
        dailyCompleted,
        settings,
        toggleTimer,
        resetTimer,
        setMode: switchMode,
        updateSettings,
        skipTimer: handleTimerComplete
    };
}
