'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Restroom,
  LoRaDevice,
  Cleaner,
  AttendanceRecord,
  CleaningActivityLog,
  HygieneAlert,
  EscalationRecord,
  Violation,
  MaintenanceTicket,
  ThresholdConfig,
  AuditLogEntry,
  LoRaPacket,
  HygieneStatus
} from './types';
import {
  INITIAL_RESTROOMS,
  INITIAL_LORA_DEVICES,
  INITIAL_CLEANERS,
  INITIAL_ATTENDANCE,
  INITIAL_CLEANING_LOGS,
  INITIAL_HYGIENE_ALERTS,
  INITIAL_ESCALATIONS,
  INITIAL_VIOLATIONS,
  INITIAL_MAINTENANCE_TICKETS,
  INITIAL_THRESHOLDS,
  generate60DayLogs
} from './mockData';

interface DashboardContextType {
  // Auth state
  isAdminLoggedIn: boolean;
  adminUser: { name: string; email: string; role: string } | null;
  loginAdmin: (email: string) => void;
  logoutAdmin: () => void;

  // Data state
  restrooms: Restroom[];
  loraDevices: LoRaDevice[];
  cleaners: Cleaner[];
  attendanceRecords: AttendanceRecord[];
  cleaningLogs: CleaningActivityLog[];
  alerts: HygieneAlert[];
  escalations: EscalationRecord[];
  violations: Violation[];
  tickets: MaintenanceTicket[];
  thresholds: ThresholdConfig;
  auditLogs: AuditLogEntry[];
  recentPackets: LoRaPacket[];
  isLoRaSimulating: boolean;

  // Actions
  toggleLoRaSimulation: () => void;
  relocateDevice: (deviceId: string, newRestroomId: string, newLocationName: string) => void;
  updateThresholds: (newConfig: Partial<ThresholdConfig>) => void;
  createCleaner: (name: string, phone: string, assignedRestroomIds: string[]) => Cleaner;
  cleanerCheckIn: (cleanerId: string, shift: string) => void;
  cleanerCheckOut: (cleanerId: string) => void;
  logCleaningActivity: (
    cleanerId: string,
    restroomId: string,
    durationMinutes: number,
    sopCompleted: boolean,
    notes: string
  ) => void;
  addViolation: (cleanerId: string, restroomId: string, title: string, severity: 'Minor' | 'Moderate' | 'Severe', details: string) => void;
  createTicket: (restroomId: string, issueType: MaintenanceTicket['issueType'], priority: MaintenanceTicket['priority'], description: string) => void;
  resolveTicket: (ticketId: string) => void;
  resolveAlert: (alertId: string) => void;
  resolveEscalation: (escalationId: string, notes: string) => void;
  updateRestroomSop: (restroomId: string, sopList: string[]) => void;
  updateRestroomSchedule: (restroomId: string, intervalMinutes: number) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(true);
  const [adminUser, setAdminUser] = useState<{ name: string; email: string; role: string } | null>({
    name: 'Admin Chief Controller',
    email: 'admin@airport-hygiene.gov',
    role: 'Central Facility Director'
  });

  const [restrooms, setRestrooms] = useState<Restroom[]>(INITIAL_RESTROOMS);
  const [loraDevices, setLoraDevices] = useState<LoRaDevice[]>(INITIAL_LORA_DEVICES);
  const [cleaners, setCleaners] = useState<Cleaner[]>(INITIAL_CLEANERS);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE);
  const [cleaningLogs, setCleaningLogs] = useState<CleaningActivityLog[]>(INITIAL_CLEANING_LOGS);
  const [alerts, setAlerts] = useState<HygieneAlert[]>(INITIAL_HYGIENE_ALERTS);
  const [escalations, setEscalations] = useState<EscalationRecord[]>(INITIAL_ESCALATIONS);
  const [violations, setViolations] = useState<Violation[]>(INITIAL_VIOLATIONS);
  const [tickets, setTickets] = useState<MaintenanceTicket[]>(INITIAL_MAINTENANCE_TICKETS);
  const [thresholds, setThresholds] = useState<ThresholdConfig>(INITIAL_THRESHOLDS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [recentPackets, setRecentPackets] = useState<LoRaPacket[]>([]);
  const [isLoRaSimulating, setIsLoRaSimulating] = useState<boolean>(true);

  // Initialize 60-day audit log on client mount
  useEffect(() => {
    setAuditLogs(generate60DayLogs());
  }, []);

  // Live LoRa Sensor Telemetry Simulator Loop (Runs every 4 seconds)
  useEffect(() => {
    if (!isLoRaSimulating) return;

    const interval = setInterval(() => {
      // Pick a random device to emit a LoRa telemetry packet
      setLoraDevices((prevDevices) => {
        if (prevDevices.length === 0) return prevDevices;
        const targetIdx = Math.floor(Math.random() * prevDevices.length);
        const device = prevDevices[targetIdx];
        const targetRestroom = restrooms.find(r => r.id === device.assignedRestroom);

        if (!targetRestroom) return prevDevices;

        // Fluctuate values realistically
        const deltaAmmonia = (Math.random() - 0.48) * 3;
        const newAmmonia = Math.max(2, Math.min(80, Math.round((targetRestroom.sensorReadings.ammoniaPpm + deltaAmmonia) * 10) / 10));

        const deltaOdor = (Math.random() - 0.48) * 0.8;
        const newOdor = Math.max(1, Math.min(10, Math.round(targetRestroom.sensorReadings.odorIndex + deltaOdor)));

        const deltaHum = (Math.random() - 0.5) * 2;
        const newHum = Math.max(30, Math.min(95, Math.round(targetRestroom.sensorReadings.humidityPercent + deltaHum)));

        const footfallAdd = Math.random() > 0.6 ? 1 : 0;
        const newFootfall = targetRestroom.sensorReadings.totalFootfall + footfallAdd;

        // Calculate status based on thresholds
        let status: HygieneStatus = 'Optimal';
        if (newAmmonia > thresholds.ammoniaMaxPpm || newOdor > thresholds.odorMaxIndex) {
          status = 'Critical';
        } else if (newAmmonia > thresholds.ammoniaMaxPpm * 0.8 || newOdor > thresholds.odorMaxIndex * 0.8 || newHum > thresholds.humidityMaxPercent) {
          status = 'Action Required';
        }

        // Update Restroom state
        setRestrooms((prevRestrooms) =>
          prevRestrooms.map((r) =>
            r.id === targetRestroom.id
              ? {
                  ...r,
                  status,
                  sensorReadings: {
                    ...r.sensorReadings,
                    ammoniaPpm: newAmmonia,
                    odorIndex: newOdor,
                    humidityPercent: newHum,
                    totalFootfall: newFootfall,
                    occupancyCount: Math.max(0, Math.min(10, r.sensorReadings.occupancyCount + (Math.random() > 0.5 ? 1 : -1)))
                  }
                }
              : r
          )
        );

        // Generate incoming LoRa telemetry packet
        const newPacket: LoRaPacket = {
          id: `pkt-${Date.now()}-${Math.floor(Math.random()*1000)}`,
          deviceId: device.id,
          hardwareId: device.hardwareId,
          restroomId: targetRestroom.id,
          restroomName: targetRestroom.name,
          timestamp: new Date().toLocaleTimeString(),
          ammoniaPpm: newAmmonia,
          odorIndex: newOdor,
          humidityPercent: newHum,
          footfallCount: newFootfall,
          battery: device.batteryLevel,
          rssi: device.rssi + Math.floor((Math.random() - 0.5) * 4),
          snr: Math.round((device.snr + (Math.random() - 0.5)) * 10) / 10
        };

        setRecentPackets((prev) => [newPacket, ...prev.slice(0, 24)]);

        // Automatic Alert Triggering
        if (newAmmonia > thresholds.ammoniaMaxPpm) {
          setAlerts((prevAlerts) => {
            const exists = prevAlerts.some(a => a.restroomId === targetRestroom.id && !a.resolved && a.alertType === 'Ammonia Spike');
            if (exists) return prevAlerts;

            return [
              {
                id: `alt-${Date.now()}`,
                restroomId: targetRestroom.id,
                restroomName: targetRestroom.name,
                alertType: 'Ammonia Spike',
                severity: 'Critical',
                message: `AUTOLOG: LoRa Ammonia Spike detected (${newAmmonia} PPM exceeds limit ${thresholds.ammoniaMaxPpm} PPM)`,
                timestamp: new Date().toLocaleTimeString(),
                resolved: false
              },
              ...prevAlerts
            ];
          });
        }

        return prevDevices.map((d, i) =>
          i === targetIdx
            ? { ...d, lastPacketTimestamp: new Date().toISOString(), packetCount: d.packetCount + 1 }
            : d
        );
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isLoRaSimulating, restrooms, thresholds]);

  // Actions
  const loginAdmin = (email: string) => {
    setIsAdminLoggedIn(true);
    setAdminUser({
      name: 'Admin Chief Controller',
      email,
      role: 'Central Facility Director'
    });
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    setAdminUser(null);
  };

  const toggleLoRaSimulation = () => {
    setIsLoRaSimulating(!isLoRaSimulating);
  };

  const relocateDevice = (deviceId: string, newRestroomId: string, newLocationName: string) => {
    const targetRestroom = restrooms.find(r => r.id === newRestroomId);
    if (!targetRestroom) return;

    setLoraDevices(prev =>
      prev.map(d =>
        d.id === deviceId
          ? {
              ...d,
              assignedRestroom: newRestroomId,
              restroomName: targetRestroom.name,
              status: 'Relocating'
            }
          : d
      )
    );

    // After 1.5s simulated sync, set online
    setTimeout(() => {
      setLoraDevices(prev =>
        prev.map(d => (d.id === deviceId ? { ...d, status: 'Online' } : d))
      );
    }, 1500);

    setRestrooms(prev =>
      prev.map(r => (r.id === newRestroomId ? { ...r, loraDeviceId: deviceId, location: newLocationName } : r))
    );

    // Add audit log entry
    setAuditLogs(prev => [
      {
        id: `audit-${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        category: 'Device Config',
        restroomName: targetRestroom.name,
        action: `LoRa hardware node ${deviceId} re-assigned to ${newLocationName}`,
        severity: 'Info'
      },
      ...prev
    ]);
  };

  const updateThresholds = (newConfig: Partial<ThresholdConfig>) => {
    setThresholds(prev => ({ ...prev, ...newConfig }));
  };

  const createCleaner = (name: string, phone: string, assignedRestroomIds: string[]): Cleaner => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newCleaner: Cleaner = {
      id: `cleaner-${Date.now()}`,
      cleanerIdCode: `CLN-${randomNum}`,
      name,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${name}`,
      phone,
      assignedRestroomIds,
      status: 'Active',
      performancePoints: 500,
      completedCleaningsCount: 0,
      missedCleaningsCount: 0,
      blackMarkCount: 0,
      tierBadge: 'Bronze',
      sixMonthConsistencyScore: 100,
      joinDate: new Date().toISOString().split('T')[0]
    };

    setCleaners(prev => [...prev, newCleaner]);

    setAuditLogs(prev => [
      {
        id: `audit-${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        category: 'Cleaner Activity',
        restroomName: 'Global',
        cleanerName: name,
        action: `Created new cleaner profile: ${name} (${newCleaner.cleanerIdCode})`,
        severity: 'Info'
      },
      ...prev
    ]);

    return newCleaner;
  };

  const cleanerCheckIn = (cleanerId: string, shift: string) => {
    const cleaner = cleaners.find(c => c.id === cleanerId);
    if (!cleaner) return;

    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      cleanerId,
      cleanerIdCode: cleaner.cleanerIdCode,
      cleanerName: cleaner.name,
      checkInTime: new Date().toISOString(),
      checkOutTime: null,
      shift,
      status: 'Checked In'
    };

    setAttendanceRecords(prev => [newRecord, ...prev]);
    setCleaners(prev => prev.map(c => c.id === cleanerId ? { ...c, status: 'On Duty' } : c));
  };

  const cleanerCheckOut = (cleanerId: string) => {
    const nowIso = new Date().toISOString();
    setAttendanceRecords(prev =>
      prev.map(a =>
        a.cleanerId === cleanerId && !a.checkOutTime
          ? { ...a, checkOutTime: nowIso, status: 'Checked Out' }
          : a
      )
    );
    setCleaners(prev => prev.map(c => c.id === cleanerId ? { ...c, status: 'Active' } : c));
  };

  const logCleaningActivity = (
    cleanerId: string,
    restroomId: string,
    durationMinutes: number,
    sopCompleted: boolean,
    notes: string
  ) => {
    const cleaner = cleaners.find(c => c.id === cleanerId);
    const restroom = restrooms.find(r => r.id === restroomId);
    if (!cleaner || !restroom) return;

    const now = new Date();
    const startTime = new Date(now.getTime() - durationMinutes * 60000).toISOString();
    const endTime = now.toISOString();

    const newLog: CleaningActivityLog = {
      id: `log-${Date.now()}`,
      cleanerId,
      cleanerName: cleaner.name,
      restroomId,
      restroomName: restroom.name,
      startTime,
      endTime,
      durationMinutes,
      sopCompleted,
      notes,
      computerTimestamp: now.toLocaleString(),
      status: 'Verified'
    };

    setCleaningLogs(prev => [newLog, ...prev]);

    // Update Restroom hygiene status to optimal
    setRestrooms(prev =>
      prev.map(r =>
        r.id === restroomId
          ? {
              ...r,
              status: 'Optimal',
              lastCleanedAt: endTime,
              nextScheduledCleaning: new Date(now.getTime() + r.cleaningIntervalMinutes * 60000).toISOString(),
              sensorReadings: {
                ...r.sensorReadings,
                ammoniaPpm: Math.max(4, r.sensorReadings.ammoniaPpm - 20),
                odorIndex: 1,
                humidityPercent: 48,
                airQualityIndex: 25
              }
            }
          : r
      )
    );

    // Award Gamification Points & Completed Cleaning Count
    const pointsAwarded = sopCompleted ? 50 : 30;
    setCleaners(prev =>
      prev.map(c => {
        if (c.id !== cleanerId) return c;
        const newPoints = c.performancePoints + pointsAwarded;
        let badge = c.tierBadge;
        if (newPoints > 1800) badge = 'Hygiene Legend';
        else if (newPoints > 1300) badge = 'Platinum';
        else if (newPoints > 1000) badge = 'Gold';
        else if (newPoints > 700) badge = 'Silver';

        return {
          ...c,
          performancePoints: newPoints,
          completedCleaningsCount: c.completedCleaningsCount + 1,
          tierBadge: badge
        };
      })
    );

    // Add Audit Log Entry
    setAuditLogs(prev => [
      {
        id: `audit-${Date.now()}`,
        timestamp: now.toLocaleString(),
        category: 'Cleaner Activity',
        restroomName: restroom.name,
        cleanerName: cleaner.name,
        action: `Cleaning completed in ${restroom.name}. Duration: ${durationMinutes}m. SOP ${sopCompleted ? 'Verified' : 'Partial'}. Points +${pointsAwarded}`,
        severity: 'Info'
      },
      ...prev
    ]);
  };

  const addViolation = (
    cleanerId: string,
    restroomId: string,
    title: string,
    severity: 'Minor' | 'Moderate' | 'Severe',
    details: string
  ) => {
    const cleaner = cleaners.find(c => c.id === cleanerId);
    const restroom = restrooms.find(r => r.id === restroomId);
    if (!cleaner || !restroom) return;

    const points = severity === 'Severe' ? 3 : severity === 'Moderate' ? 2 : 1;

    const newViolation: Violation = {
      id: `viol-${Date.now()}`,
      cleanerId,
      cleanerName: cleaner.name,
      restroomId,
      restroomName: restroom.name,
      title,
      severity,
      blackMarkPoints: points,
      date: new Date().toISOString().split('T')[0],
      details
    };

    setViolations(prev => [newViolation, ...prev]);

    // Deduct points & increment black mark count
    setCleaners(prev =>
      prev.map(c =>
        c.id === cleanerId
          ? {
              ...c,
              blackMarkCount: c.blackMarkCount + points,
              missedCleaningsCount: c.missedCleaningsCount + 1,
              performancePoints: Math.max(0, c.performancePoints - points * 40)
            }
          : c
      )
    );

    setAuditLogs(prev => [
      {
        id: `audit-${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        category: 'Violation',
        restroomName: restroom.name,
        cleanerName: cleaner.name,
        action: `BLACK MARK ISSUED (${severity}): ${title} to ${cleaner.name}`,
        severity: 'Critical'
      },
      ...prev
    ]);
  };

  const createTicket = (
    restroomId: string,
    issueType: MaintenanceTicket['issueType'],
    priority: MaintenanceTicket['priority'],
    description: string
  ) => {
    const restroom = restrooms.find(r => r.id === restroomId);
    if (!restroom) return;

    const ticketNo = `MNT-${Math.floor(9000 + Math.random() * 1000)}`;

    const newTicket: MaintenanceTicket = {
      id: `tkt-${Date.now()}`,
      ticketNo,
      restroomId,
      restroomName: restroom.name,
      issueType,
      priority,
      reportedBy: adminUser?.name || 'System Admin',
      createdAt: new Date().toISOString(),
      status: 'Open',
      description
    };

    setTickets(prev => [newTicket, ...prev]);
  };

  const resolveTicket = (ticketId: string) => {
    setTickets(prev =>
      prev.map(t => (t.id === ticketId ? { ...t, status: 'Resolved' } : t))
    );
  };

  const resolveAlert = (alertId: string) => {
    setAlerts(prev =>
      prev.map(a => (a.id === alertId ? { ...a, resolved: true } : a))
    );
  };

  const resolveEscalation = (escalationId: string, notes: string) => {
    setEscalations(prev =>
      prev.map(e => (e.id === escalationId ? { ...e, status: 'Resolved', resolutionNotes: notes } : e))
    );
  };

  const updateRestroomSop = (restroomId: string, sopList: string[]) => {
    setRestrooms(prev =>
      prev.map(r => (r.id === restroomId ? { ...r, sopRequirements: sopList } : r))
    );
  };

  const updateRestroomSchedule = (restroomId: string, intervalMinutes: number) => {
    setRestrooms(prev =>
      prev.map(r => (r.id === restroomId ? { ...r, cleaningIntervalMinutes: intervalMinutes } : r))
    );
  };

  return (
    <DashboardContext.Provider
      value={{
        isAdminLoggedIn,
        adminUser,
        loginAdmin,
        logoutAdmin,
        restrooms,
        loraDevices,
        cleaners,
        attendanceRecords,
        cleaningLogs,
        alerts,
        escalations,
        violations,
        tickets,
        thresholds,
        auditLogs,
        recentPackets,
        isLoRaSimulating,
        toggleLoRaSimulation,
        relocateDevice,
        updateThresholds,
        createCleaner,
        cleanerCheckIn,
        cleanerCheckOut,
        logCleaningActivity,
        addViolation,
        createTicket,
        resolveTicket,
        resolveAlert,
        resolveEscalation,
        updateRestroomSop,
        updateRestroomSchedule
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
