'use client';

import React, { useState } from 'react';
import {
  Radio,
  WifiOff,
  RefreshCw,
  MapPin,
  BatteryCharging,
  Zap,
  Activity,
  Sliders,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useDashboard } from '../../lib/store';
import { RelocateDeviceModal } from '../../components/RelocateDeviceModal';
import { Restroom } from '../../lib/types';

export default function LoraNetworkPage() {
  const {
    loraDevices,
    recentPackets,
    isLoRaSimulating,
    toggleLoRaSimulation,
    restrooms
  } = useDashboard();

  const [selectedRestroom, setSelectedRestroom] = useState<Restroom | null>(null);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/80">
        <div className="flex items-start gap-4">
          <div className="p-3.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Radio className="w-8 h-8 animate-pulse text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono mb-1">
              <Zap className="w-3.5 h-3.5" /> LONG-RANGE LOW-POWER COMMUNICATIONS LAYER
            </div>
            <h1 className="text-2xl font-extrabold text-white">Centralized LoRa Data Reception</h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Receive restroom sensor telemetry via LoRa sub-GHz radio (868.1 MHz). Zero field Wi-Fi network requirement.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-mono text-emerald-400 font-bold">LORA GATEWAY: ONLINE</span>
          </div>
          <button
            onClick={toggleLoRaSimulation}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition shadow-glow-cyan/20"
          >
            <RefreshCw className={`w-4 h-4 ${isLoRaSimulating ? 'animate-spin' : ''}`} />
            <span>{isLoRaSimulating ? 'Streaming Telemetry' : 'Resume Telemetry Stream'}</span>
          </button>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-start gap-3">
          <WifiOff className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-white mb-0.5">No Field Wi-Fi Dependency</h4>
            <p className="text-slate-400 text-[11px]">
              Sub-GHz penetration reaches basement restrooms and concrete airport concourses without Wi-Fi access points.
            </p>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-start gap-3">
          <Activity className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-white mb-0.5">Centralized Synchronization</h4>
            <p className="text-slate-400 text-[11px]">
              Continuous ingestion updates restroom hygiene, cleaning status, footfall, and sensor data in real-time.
            </p>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-start gap-3">
          <MapPin className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-white mb-0.5">Configurable Device Relocation</h4>
            <p className="text-slate-400 text-[11px]">
              Re-bind LoRa hardware IDs dynamically when monitoring devices are physically relocated to new restrooms.
            </p>
          </div>
        </div>
      </div>

      {/* LoRa Devices Directory Table */}
      <div className="glass-panel rounded-3xl border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Radio className="w-5 h-5 text-cyan-400" /> Active LoRa Telemetry Nodes ({loraDevices.length})
          </h2>
          <span className="text-xs font-mono text-slate-400">Gateway Receiver: GW-SUBGHZ-01</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3">Hardware ID</th>
                <th className="p-3">Assigned Restroom</th>
                <th className="p-3">Signal RSSI</th>
                <th className="p-3">SNR Quality</th>
                <th className="p-3">Battery %</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {loraDevices.map((device) => {
                const restroom = restrooms.find(r => r.id === device.assignedRestroom);

                return (
                  <tr key={device.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3 font-bold text-cyan-300 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      {device.hardwareId}
                    </td>
                    <td className="p-3 text-slate-200">{device.restroomName}</td>
                    <td className="p-3">
                      <span className={device.rssi > -80 ? 'text-emerald-400' : 'text-amber-400'}>
                        {device.rssi} dBm
                      </span>
                    </td>
                    <td className="p-3 text-slate-300">+{device.snr} dB</td>
                    <td className="p-3 text-slate-300 flex items-center gap-1">
                      <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
                      {device.batteryLevel}%
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] border ${
                          device.status === 'Online'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        }`}
                      >
                        {device.status}
                      </span>
                    </td>
                    <td className="p-3 text-right font-sans">
                      <button
                        onClick={() => setSelectedRestroom(restroom || null)}
                        className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 rounded-lg transition text-[11px]"
                      >
                        Relocate Node
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Wireless Data Packet Log Stream */}
      <div className="glass-panel rounded-3xl border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" /> Live Ingested Packet Telemetry Stream
          </h3>
          <span className="text-xs font-mono text-emerald-400 animate-pulse">LIVE RECEPTION ACTIVE</span>
        </div>

        <div className="space-y-2 font-mono text-xs">
          {recentPackets.map((pkt) => (
            <div
              key={pkt.id}
              className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-2xl flex flex-wrap items-center justify-between gap-2 hover:border-cyan-500/40 transition"
            >
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span className="text-cyan-300 font-bold">{pkt.hardwareId}</span>
                <span className="text-slate-400 text-[11px]">[{pkt.restroomName}]</span>
              </div>

              <div className="flex items-center gap-4 text-slate-300">
                <span>Ammonia: <strong className="text-emerald-400">{pkt.ammoniaPpm} PPM</strong></span>
                <span>Odor: <strong className="text-purple-400">{pkt.odorIndex}/10</strong></span>
                <span>Hum: <strong className="text-blue-400">{pkt.humidityPercent}%</strong></span>
                <span>Footfall: <strong className="text-amber-400">{pkt.footfallCount}</strong></span>
              </div>

              <span className="text-slate-500 text-[10px]">{pkt.timestamp}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Device Relocation Modal */}
      <RelocateDeviceModal
        restroom={selectedRestroom}
        isOpen={!!selectedRestroom}
        onClose={() => setSelectedRestroom(null)}
      />
    </div>
  );
}
