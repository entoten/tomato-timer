import { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { cn } from './lib/utils';
import { usePomodoro } from './hooks/usePomodoro';
import { TimerDisplay } from './components/TimerDisplay';
import { Controls } from './components/Controls';
import { SettingsModal } from './components/SettingsModal';
import type { TimerSettings } from './types';

const DEFAULT_SETTINGS: TimerSettings = {
  workDuration: 25 * 60,
  shortBreakDuration: 5 * 60,
  longBreakDuration: 15 * 60,
  longBreakInterval: 4,
  dailyGoal: 8,
  visualTheme: 'memory',
  layout: 'vertical',
  showCurrentTime: false,
};

function App() {
  const {
    mode,
    timeLeft,
    isActive,
    setsSinceLongBreak,
    dailyCompleted,
    settings,
    toggleTimer,
    resetTimer,
    skipTimer,
    updateSettings
  } = usePomodoro(DEFAULT_SETTINGS);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const getTotalDuration = () => {
    switch (mode) {
      case 'work': return settings.workDuration;
      case 'shortBreak': return settings.shortBreakDuration;
      case 'longBreak': return settings.longBreakDuration;
      default: return settings.workDuration;
    }
  };

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans selection:bg-red-500/30">

      {/* Header */}
      <header className="p-6 flex justify-between items-center max-w-2xl mx-auto w-full">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            <span className="font-bold tracking-wider text-sm text-slate-400">TOMATO_TIMER</span>
          </div>
          {settings.showCurrentTime && (
            <div className="px-3 py-1 bg-slate-900 rounded-full border border-slate-800">
              <span className="text-xs font-mono text-slate-300">
                {currentTime.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', hour12: false })}
              </span>
            </div>
          )}
        </div>
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="p-2 hover:bg-slate-900 rounded-lg transition-colors text-slate-400 hover:text-white"
        >
          <Settings size={20} />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center w-full max-w-2xl mx-auto px-4 pb-20">

        <div className={cn(
          "flex flex-col gap-8 w-full max-w-4xl mx-auto items-center justify-center transition-all duration-500",
          settings.layout === 'horizontal' ? "md:flex-row md:gap-16" : ""
        )}>

          <div className="flex-1 w-full max-w-md">
            <TimerDisplay
              timeLeft={timeLeft}
              totalDuration={getTotalDuration()}
              mode={mode}
              theme={settings.visualTheme}
            />
          </div>

          <div className={cn(
            "flex-1 w-full max-w-md flex flex-col justify-center",
            settings.layout === 'horizontal' ? "md:items-start" : "items-center"
          )}>
            <div className="w-full">
              <Controls
                isActive={isActive}
                onToggle={toggleTimer}
                onReset={resetTimer}
                onSkip={skipTimer}
                mode={mode}
              />

              {/* Stats */}
              <div className="mt-12 grid grid-cols-2 gap-4 w-full">
                <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800/50 flex flex-col items-center">
                  <span className="text-slate-500 text-xs uppercase font-bold tracking-widest mb-1">Daily Progress</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-mono">{dailyCompleted}</span>
                    <span className="text-sm text-slate-500 font-mono">/ {settings.dailyGoal}</span>
                  </div>
                  {dailyCompleted >= settings.dailyGoal && (
                    <span className="text-[10px] text-green-400 font-bold mt-1 tracking-wider">GOAL REACHED</span>
                  )}
                </div>
                <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800/50 flex flex-col items-center">
                  <span className="text-slate-500 text-xs uppercase font-bold tracking-widest mb-1">Interval Info</span>
                  <span className="text-3xl font-mono text-slate-400">
                    {setsSinceLongBreak}/{settings.longBreakInterval}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </main>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={updateSettings}
      />
    </div>
  );
}

export default App;
