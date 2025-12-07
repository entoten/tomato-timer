export type TimerMode = 'work' | 'shortBreak' | 'longBreak';

export interface TimerSettings {
    workDuration: number; // in seconds
    shortBreakDuration: number; // in seconds
    longBreakDuration: number; // in seconds
    longBreakInterval: number; // sets required for a long break
    dailyGoal: number; // target sets for the day
}

export interface PomodoroState {
    mode: TimerMode;
    timeLeft: number;
    isActive: boolean;
    completedSets: number; // Total daily sets
    setsSinceLongBreak: number;
}
