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
  LoRaPacket
} from './types';

export const INITIAL_THRESHOLDS: ThresholdConfig = {
  ammoniaMaxPpm: 25,
  odorMaxIndex: 7,
  humidityMaxPercent: 75,
  overdueTimeoutMinutes: 60,
};

export const INITIAL_RESTROOMS: Restroom[] = [
  {
    id: 'rst-1',
    name: 'Terminal 1 - North Wing (Male)',
    location: 'Building A, Floor 1, Gate 4',
    zone: 'North Wing',
    loraDeviceId: 'lora-node-01',
    status: 'Optimal',
    sensorReadings: {
      ammoniaPpm: 12,
      odorIndex: 3,
      humidityPercent: 52,
      airQualityIndex: 45,
      occupancyCount: 3,
      totalFootfall: 428,
    },
    lastCleanedAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    nextScheduledCleaning: new Date(Date.now() + 25 * 60 * 1000).toISOString(),
    cleaningIntervalMinutes: 60,
    assignedCleanerId: 'cleaner-1',
    assignedCleanerName: 'Rajesh Kumar',
    sopRequirements: [
      'Disinfect urinal sensors and floor drains',
      'Refill liquid soap and foam dispensers',
      'Sanitize door handles & touchless faucets',
      'Mop floor with bio-enzymatic cleaner',
      'Verify LoRa sensor status LED solid green'
    ]
  },
  {
    id: 'rst-2',
    name: 'Terminal 1 - South Concourse (Female)',
    location: 'Building A, Floor 1, Gate 12',
    zone: 'South Concourse',
    loraDeviceId: 'lora-node-02',
    status: 'Action Required',
    sensorReadings: {
      ammoniaPpm: 28,
      odorIndex: 8,
      humidityPercent: 78,
      airQualityIndex: 142,
      occupancyCount: 6,
      totalFootfall: 680,
    },
    lastCleanedAt: new Date(Date.now() - 95 * 60 * 1000).toISOString(),
    nextScheduledCleaning: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    cleaningIntervalMinutes: 60,
    assignedCleanerId: 'cleaner-2',
    assignedCleanerName: 'Priya Sharma',
    sopRequirements: [
      'Full stall sanitation & toilet paper check',
      'Clean mirror surfaces and granite basin',
      'Inspect humidity sensor vent for blockage',
      'Empty waste receptacles & replace liner'
    ]
  },
  {
    id: 'rst-3',
    name: 'Executive Lounge - VIP Suite',
    location: 'Building B, Floor 3, Suite 302',
    zone: 'Executive Suite',
    loraDeviceId: 'lora-node-03',
    status: 'Optimal',
    sensorReadings: {
      ammoniaPpm: 6,
      odorIndex: 1,
      humidityPercent: 44,
      airQualityIndex: 22,
      occupancyCount: 0,
      totalFootfall: 112,
    },
    lastCleanedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    nextScheduledCleaning: new Date(Date.now() + 105 * 60 * 1000).toISOString(),
    cleaningIntervalMinutes: 120,
    assignedCleanerId: 'cleaner-3',
    assignedCleanerName: 'Vikram Singh',
    sopRequirements: [
      'Premium aromatherapy refill',
      'Polishing chrome fixtures & touch points',
      'UV-C wand surface sterilization',
      'Ensure ambient sensor temperature 22°C'
    ]
  },
  {
    id: 'rst-4',
    name: 'Food Court - West Plaza (Gender-Neutral)',
    location: 'Building C, Floor 2, Food Court',
    zone: 'West Plaza',
    loraDeviceId: 'lora-node-04',
    status: 'Critical',
    sensorReadings: {
      ammoniaPpm: 42,
      odorIndex: 9,
      humidityPercent: 86,
      airQualityIndex: 215,
      occupancyCount: 8,
      totalFootfall: 1240,
    },
    lastCleanedAt: new Date(Date.now() - 140 * 60 * 1000).toISOString(),
    nextScheduledCleaning: new Date(Date.now() - 80 * 60 * 1000).toISOString(),
    cleaningIntervalMinutes: 60,
    assignedCleanerId: 'cleaner-4',
    assignedCleanerName: 'Sunita Devi',
    sopRequirements: [
      'Emergency odor neutralization spraying',
      'Check floor drain blockage & overflow',
      'Sanitize high-touch stainless surfaces',
      'Inspect LoRa transmitter node for alarm log'
    ]
  },
  {
    id: 'rst-5',
    name: 'Departure Hall B (Male)',
    location: 'Terminal 2, Level 2, Departure B',
    zone: 'Terminal 2',
    loraDeviceId: 'lora-node-05',
    status: 'Optimal',
    sensorReadings: {
      ammoniaPpm: 14,
      odorIndex: 3,
      humidityPercent: 58,
      airQualityIndex: 48,
      occupancyCount: 4,
      totalFootfall: 530,
    },
    lastCleanedAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    nextScheduledCleaning: new Date(Date.now() + 20 * 60 * 1000).toISOString(),
    cleaningIntervalMinutes: 60,
    assignedCleanerId: 'cleaner-5',
    assignedCleanerName: 'Amit Patel',
    sopRequirements: [
      'Standard stall & urinal cleaning',
      'Restock paper towels and hand sanitizer',
      'Check automatic flusher batteries'
    ]
  },
  {
    id: 'rst-6',
    name: 'Arrivals Hub - Main Baggage Area',
    location: 'Terminal 2, Ground Floor, Carousel 4',
    zone: 'Terminal 2',
    loraDeviceId: 'lora-node-06',
    status: 'Action Required',
    sensorReadings: {
      ammoniaPpm: 26,
      odorIndex: 7,
      humidityPercent: 74,
      airQualityIndex: 110,
      occupancyCount: 5,
      totalFootfall: 890,
    },
    lastCleanedAt: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
    nextScheduledCleaning: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    cleaningIntervalMinutes: 60,
    assignedCleanerId: 'cleaner-1',
    assignedCleanerName: 'Rajesh Kumar',
    sopRequirements: [
      'Wipe down all glass partitions',
      'Deep mop wet areas',
      'Sanitize baby changing table'
    ]
  }
];

export const INITIAL_LORA_DEVICES: LoRaDevice[] = [
  {
    id: 'dev-1',
    hardwareId: 'LORA-868-001',
    assignedRestroom: 'rst-1',
    restroomName: 'Terminal 1 - North Wing (Male)',
    rssi: -72,
    snr: 9.5,
    batteryLevel: 94,
    status: 'Online',
    lastPacketTimestamp: new Date().toISOString(),
    packetCount: 1420,
    frequencyMHz: 868.1,
  },
  {
    id: 'dev-2',
    hardwareId: 'LORA-868-002',
    assignedRestroom: 'rst-2',
    restroomName: 'Terminal 1 - South Concourse (Female)',
    rssi: -84,
    snr: 6.2,
    batteryLevel: 88,
    status: 'Online',
    lastPacketTimestamp: new Date().toISOString(),
    packetCount: 1890,
    frequencyMHz: 868.3,
  },
  {
    id: 'dev-3',
    hardwareId: 'LORA-868-003',
    assignedRestroom: 'rst-3',
    restroomName: 'Executive Lounge - VIP Suite',
    rssi: -58,
    snr: 12.8,
    batteryLevel: 99,
    status: 'Online',
    lastPacketTimestamp: new Date().toISOString(),
    packetCount: 940,
    frequencyMHz: 868.5,
  },
  {
    id: 'dev-4',
    hardwareId: 'LORA-868-004',
    assignedRestroom: 'rst-4',
    restroomName: 'Food Court - West Plaza (Gender-Neutral)',
    rssi: -98,
    snr: 3.1,
    batteryLevel: 72,
    status: 'Warning',
    lastPacketTimestamp: new Date().toISOString(),
    packetCount: 2310,
    frequencyMHz: 868.1,
  },
  {
    id: 'dev-5',
    hardwareId: 'LORA-868-005',
    assignedRestroom: 'rst-5',
    restroomName: 'Departure Hall B (Male)',
    rssi: -66,
    snr: 10.4,
    batteryLevel: 91,
    status: 'Online',
    lastPacketTimestamp: new Date().toISOString(),
    packetCount: 1650,
    frequencyMHz: 868.3,
  },
  {
    id: 'dev-6',
    hardwareId: 'LORA-868-006',
    assignedRestroom: 'rst-6',
    restroomName: 'Arrivals Hub - Main Baggage Area',
    rssi: -79,
    snr: 7.8,
    batteryLevel: 85,
    status: 'Online',
    lastPacketTimestamp: new Date().toISOString(),
    packetCount: 1720,
    frequencyMHz: 868.5,
  }
];

export const INITIAL_CLEANERS: Cleaner[] = [
  {
    id: 'cleaner-1',
    cleanerIdCode: 'CLN-8841',
    name: 'Rajesh Kumar',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    phone: '+91 98765 43210',
    assignedRestroomIds: ['rst-1', 'rst-6'],
    status: 'On Duty',
    performancePoints: 1240,
    completedCleaningsCount: 148,
    missedCleaningsCount: 2,
    blackMarkCount: 0,
    tierBadge: 'Gold',
    sixMonthConsistencyScore: 96,
    joinDate: '2026-01-15'
  },
  {
    id: 'cleaner-2',
    cleanerIdCode: 'CLN-8842',
    name: 'Priya Sharma',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    phone: '+91 98765 43211',
    assignedRestroomIds: ['rst-2'],
    status: 'Active',
    performancePoints: 980,
    completedCleaningsCount: 112,
    missedCleaningsCount: 4,
    blackMarkCount: 1,
    tierBadge: 'Silver',
    sixMonthConsistencyScore: 89,
    joinDate: '2026-02-01'
  },
  {
    id: 'cleaner-3',
    cleanerIdCode: 'CLN-8843',
    name: 'Vikram Singh',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    phone: '+91 98765 43212',
    assignedRestroomIds: ['rst-3'],
    status: 'Active',
    performancePoints: 1850,
    completedCleaningsCount: 210,
    missedCleaningsCount: 0,
    blackMarkCount: 0,
    tierBadge: 'Hygiene Legend',
    sixMonthConsistencyScore: 99,
    joinDate: '2025-11-10'
  },
  {
    id: 'cleaner-4',
    cleanerIdCode: 'CLN-8844',
    name: 'Sunita Devi',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
    phone: '+91 98765 43213',
    assignedRestroomIds: ['rst-4'],
    status: 'Active',
    performancePoints: 620,
    completedCleaningsCount: 78,
    missedCleaningsCount: 7,
    blackMarkCount: 2,
    tierBadge: 'Bronze',
    sixMonthConsistencyScore: 74,
    joinDate: '2026-03-20'
  },
  {
    id: 'cleaner-5',
    cleanerIdCode: 'CLN-8845',
    name: 'Amit Patel',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    phone: '+91 98765 43214',
    assignedRestroomIds: ['rst-5'],
    status: 'On Duty',
    performancePoints: 1420,
    completedCleaningsCount: 165,
    missedCleaningsCount: 1,
    blackMarkCount: 0,
    tierBadge: 'Platinum',
    sixMonthConsistencyScore: 95,
    joinDate: '2025-12-05'
  }
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'att-1',
    cleanerId: 'cleaner-1',
    cleanerIdCode: 'CLN-8841',
    cleanerName: 'Rajesh Kumar',
    checkInTime: new Date(Date.now() - 7 * 3600 * 1000).toISOString(),
    checkOutTime: null,
    shift: 'Morning (08:00 - 16:00)',
    status: 'On Active Duty'
  },
  {
    id: 'att-2',
    cleanerId: 'cleaner-2',
    cleanerIdCode: 'CLN-8842',
    cleanerName: 'Priya Sharma',
    checkInTime: new Date(Date.now() - 6.5 * 3600 * 1000).toISOString(),
    checkOutTime: null,
    shift: 'Morning (08:00 - 16:00)',
    status: 'On Active Duty'
  },
  {
    id: 'att-3',
    cleanerId: 'cleaner-3',
    cleanerIdCode: 'CLN-8843',
    cleanerName: 'Vikram Singh',
    checkInTime: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    checkOutTime: null,
    shift: 'Executive Shift (07:00 - 15:00)',
    status: 'On Active Duty'
  },
  {
    id: 'att-4',
    cleanerId: 'cleaner-5',
    cleanerIdCode: 'CLN-8845',
    cleanerName: 'Amit Patel',
    checkInTime: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    checkOutTime: null,
    shift: 'Midday (12:00 - 20:00)',
    status: 'On Active Duty'
  }
];

export const INITIAL_CLEANING_LOGS: CleaningActivityLog[] = [
  {
    id: 'log-101',
    cleanerId: 'cleaner-1',
    cleanerName: 'Rajesh Kumar',
    restroomId: 'rst-1',
    restroomName: 'Terminal 1 - North Wing (Male)',
    startTime: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    durationMinutes: 20,
    sopCompleted: true,
    notes: 'All urinals disinfected and fresh scent disc placed.',
    computerTimestamp: new Date(Date.now() - 35 * 60 * 1000).toLocaleString(),
    status: 'Verified'
  },
  {
    id: 'log-102',
    cleanerId: 'cleaner-3',
    cleanerName: 'Vikram Singh',
    restroomId: 'rst-3',
    restroomName: 'Executive Lounge - VIP Suite',
    startTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    durationMinutes: 15,
    sopCompleted: true,
    notes: 'VIP sanitization complete, fresh white lilies restocked.',
    computerTimestamp: new Date(Date.now() - 15 * 60 * 1000).toLocaleString(),
    status: 'Verified'
  }
];

export const INITIAL_HYGIENE_ALERTS: HygieneAlert[] = [
  {
    id: 'alt-1',
    restroomId: 'rst-4',
    restroomName: 'Food Court - West Plaza (Gender-Neutral)',
    alertType: 'Ammonia Spike',
    severity: 'Critical',
    message: 'Ammonia reading at 42 PPM exceeds 25 PPM limit!',
    timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    resolved: false,
  },
  {
    id: 'alt-2',
    restroomId: 'rst-2',
    restroomName: 'Terminal 1 - South Concourse (Female)',
    alertType: 'Overdue Cleaning',
    severity: 'Warning',
    message: 'Scheduled cleaning missed by 35 minutes.',
    timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    resolved: false,
  }
];

export const INITIAL_ESCALATIONS: EscalationRecord[] = [
  {
    id: 'esc-1',
    restroomId: 'rst-4',
    restroomName: 'Food Court - West Plaza (Gender-Neutral)',
    overdueMinutes: 80,
    currentLevel: 'Level 3: Admin Manager Alert',
    assignedSupervisor: 'Supervisor Ramesh V.',
    timestamp: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    status: 'Escalated to Admin'
  },
  {
    id: 'esc-2',
    restroomId: 'rst-2',
    restroomName: 'Terminal 1 - South Concourse (Female)',
    overdueMinutes: 35,
    currentLevel: 'Level 2: Supervisor Escalation',
    assignedSupervisor: 'Supervisor Ramesh V.',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    status: 'Active'
  }
];

export const INITIAL_VIOLATIONS: Violation[] = [
  {
    id: 'viol-1',
    cleanerId: 'cleaner-4',
    cleanerIdCode: 'CLN-8844',
    cleanerName: 'Sunita Devi',
    restroomId: 'rst-4',
    restroomName: 'Food Court - West Plaza (Gender-Neutral)',
    title: 'Missed Cleaning Schedule (>90 min delay)',
    severity: 'Severe',
    blackMarkPoints: 2,
    date: '2026-09-12',
    details: 'Failed to initiate cleaning despite 3 system warnings. Odor level reached index 9.'
  },
  {
    id: 'viol-2',
    cleanerId: 'cleaner-2',
    cleanerIdCode: 'CLN-8842',
    cleanerName: 'Priya Sharma',
    restroomId: 'rst-2',
    restroomName: 'Terminal 1 - South Concourse (Female)',
    title: 'Improper Cleaning (SOP Incomplete)',
    severity: 'Minor',
    blackMarkPoints: 1,
    date: '2026-09-08',
    details: 'Soap dispensers left un-replenished; complaint raised by airport terminal inspector.'
  }
];

export const INITIAL_MAINTENANCE_TICKETS: MaintenanceTicket[] = [
  {
    id: 'tkt-101',
    ticketNo: 'MNT-9011',
    restroomId: 'rst-4',
    restroomName: 'Food Court - West Plaza (Gender-Neutral)',
    issueType: 'Sensor Malfunction',
    priority: 'High',
    reportedBy: 'LoRa Auto Diagnostic Engine',
    createdAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    status: 'In Progress',
    description: 'Ammonia sensor showing noisy fluctuation. Recommended probe cleaning or recalibration.'
  },
  {
    id: 'tkt-102',
    ticketNo: 'MNT-9012',
    restroomId: 'rst-1',
    restroomName: 'Terminal 1 - North Wing (Male)',
    issueType: 'Plumbing Defect',
    priority: 'Medium',
    reportedBy: 'Cleaner Rajesh Kumar',
    createdAt: new Date(Date.now() - 240 * 60 * 1000).toISOString(),
    status: 'Open',
    description: 'Urinal stall #3 auto-flush sensor solenoid sticky.'
  }
];

// Generate 60 Days of simulated audit logs for 2-Month retention requirements
export function generate60DayLogs(): AuditLogEntry[] {
  const logs: AuditLogEntry[] = [];
  const categories: AuditLogEntry['category'][] = ['Sensor', 'Cleaner Activity', 'Escalation', 'Device Config', 'Violation', 'Maintenance'];
  const restrooms = INITIAL_RESTROOMS;
  const cleaners = INITIAL_CLEANERS;

  const now = Date.now();
  const dayMs = 24 * 3600 * 1000;

  for (let i = 0; i < 60; i++) {
    const dayDate = new Date(now - i * dayMs);
    const dateStr = dayDate.toISOString().split('T')[0];

    // Add 3-5 log entries per day
    const entriesCount = 3 + Math.floor(Math.random() * 3);
    for (let j = 0; j < entriesCount; j++) {
      const cat = categories[Math.floor(Math.random() * categories.length)];
      const r = restrooms[Math.floor(Math.random() * restrooms.length)];
      const c = cleaners[Math.floor(Math.random() * cleaners.length)];
      const timeStr = `${dateStr} ${String(8 + j * 3).padStart(2, '0')}:${String(15 * j).padStart(2, '0')}:00`;

      let action = '';
      let severity: AuditLogEntry['severity'] = 'Info';

      if (cat === 'Sensor') {
        action = `LoRa Node payload received: Ammonia ${10 + Math.floor(Math.random() * 25)} PPM, Odor Index ${1 + Math.floor(Math.random() * 8)}`;
        severity = action.includes('25') ? 'Warning' : 'Info';
      } else if (cat === 'Cleaner Activity') {
        action = `Cleaning task completed by ${c.name} (${c.cleanerIdCode}) in ${r.name}`;
      } else if (cat === 'Escalation') {
        action = `Overdue cleaning escalated to Level 2 Supervisor for ${r.name}`;
        severity = 'Warning';
      } else if (cat === 'Device Config') {
        action = `LoRa Node location re-bound to ${r.location}`;
      } else if (cat === 'Violation') {
        action = `Black Mark assigned to ${c.name} for missed cleaning window`;
        severity = 'Critical';
      } else {
        action = `Maintenance ticket dispatched for ${r.name} - Sensor maintenance`;
      }

      logs.push({
        id: `audit-${i}-${j}`,
        timestamp: timeStr,
        category: cat,
        restroomName: r.name,
        cleanerName: c.name,
        action,
        severity
      });
    }
  }

  return logs;
}
