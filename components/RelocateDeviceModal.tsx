'use client';

import React, { useState } from 'react';
import { X, Radio, MapPin, CheckCircle, ShieldAlert } from 'lucide-react';
import { Restroom } from '../lib/types';
import { useDashboard } from '../lib/store';

interface RelocateDeviceModalProps {
  restroom: Restroom | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RelocateDeviceModal: React.FC<RelocateDeviceModalProps> = ({
  restroom,
  isOpen,
  onClose
}) => {
  const { loraDevices, restrooms, relocateDevice } = useDashboard();
  const [selectedRestroomId, setSelectedRestroomId] = useState<string>(restroom?.id || '');
  const [newLocationString, setNewLocationString] = useState<string>(restroom?.location || '');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen || !restroom) return null;

  const currentDevice = loraDevices.find(d => d.id === restroom.loraDeviceId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentDevice) return;

    relocateDevice(currentDevice.id, selectedRestroomId, newLocationString);
    setIsSuccess(true);

    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="glass-panel w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-5 border-b border-slate-800 pb-4">
          <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Configurable Device Location</h3>
            <p className="text-xs text-slate-400">Re-assign LoRa node when hardware is physically relocated</p>
          </div>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="text-sm font-bold text-white">LoRa Node Location Updated!</h4>
            <p className="text-xs text-slate-400 font-mono">Telemetry re-route acknowledged by Central Gateway</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">LoRa Hardware ID:</span>
                <span className="font-mono text-cyan-400 font-bold">{currentDevice?.hardwareId || restroom.loraDeviceId}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Current Assigned Zone:</span>
                <span>{restroom.name}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">LoRa Frequency:</span>
                <span className="font-mono text-slate-400">868.1 MHz ISM</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Target Restroom Assignment
              </label>
              <select
                value={selectedRestroomId}
                onChange={(e) => {
                  setSelectedRestroomId(e.target.value);
                  const selectedR = restrooms.find(r => r.id === e.target.value);
                  if (selectedR) setNewLocationString(selectedR.location);
                }}
                className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs"
              >
                {restrooms.map(r => (
                  <option key={r.id} value={r.id} className="bg-slate-900 text-white">
                    {r.name} ({r.zone})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                New Physical Physical Location Label
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  value={newLocationString}
                  onChange={(e) => setNewLocationString(e.target.value)}
                  className="w-full glass-input pl-9 pr-3.5 py-2.5 rounded-xl text-xs"
                  placeholder="e.g. Building B, Floor 2, Gate 15"
                  required
                />
              </div>
            </div>

            <div className="pt-3 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white text-xs font-semibold shadow-glow-cyan/30 transition"
              >
                Save Location Config
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
