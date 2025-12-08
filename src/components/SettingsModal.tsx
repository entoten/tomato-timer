import { X } from 'lucide-react';
import type { TimerSettings } from '../types';
import { useState } from 'react';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    settings: TimerSettings;
    onSave: (newSettings: TimerSettings) => void;
}

export function SettingsModal({ isOpen, onClose, settings, onSave }: SettingsModalProps) {
    const [localSettings, setLocalSettings] = useState(settings);

    if (!isOpen) return null;

    const handleChange = (key: keyof TimerSettings, value: number) => {
        setLocalSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = () => {
        onSave(localSettings);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-6 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">Timer Settings</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Focus Duration (minutes)</label>
                        <input
                            type="number"
                            value={localSettings.workDuration / 60}
                            onChange={(e) => handleChange('workDuration', Number(e.target.value) * 60)}
                            className="w-full bg-slate-800 border-slate-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-red-500 outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Short Break (minutes)</label>
                        <input
                            type="number"
                            value={localSettings.shortBreakDuration / 60}
                            onChange={(e) => handleChange('shortBreakDuration', Number(e.target.value) * 60)}
                            className="w-full bg-slate-800 border-slate-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Long Break (minutes)</label>
                        <input
                            type="number"
                            value={localSettings.longBreakDuration / 60}
                            onChange={(e) => handleChange('longBreakDuration', Number(e.target.value) * 60)}
                            className="w-full bg-slate-800 border-slate-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Long Break Interval (sets)</label>
                        <input
                            type="number"
                            value={localSettings.longBreakInterval}
                            onChange={(e) => handleChange('longBreakInterval', Number(e.target.value))}
                            className="w-full bg-slate-800 border-slate-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Daily Goal (sets)</label>
                        <input
                            type="number"
                            value={localSettings.dailyGoal}
                            onChange={(e) => handleChange('dailyGoal', Number(e.target.value))}
                            className="w-full bg-slate-800 border-slate-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-green-500 outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Visual Theme</label>
                        <select
                            value={localSettings.visualTheme}
                            onChange={(e) => setLocalSettings(prev => ({ ...prev, visualTheme: e.target.value as 'memory' | 'liquid' | 'erosion' }))}
                            className="w-full bg-slate-800 border-slate-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="memory">Memory Blocks</option>
                            <option value="liquid">Liquid Wave</option>
                            <option value="erosion">Organic Erosion</option>
                        </select>
                    </div>
                </div>

                <div className="mt-8">
                    <button
                        onClick={handleSave}
                        className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
