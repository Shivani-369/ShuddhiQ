export type HygieneStatus = 'Optimal' | 'Action Required' | 'Critical';
export type LoRaStatus = 'Online' | 'Offline' | 'Relocating' | 'Warning';
export type CleanerStatus = 'Active' | 'On Duty' | 'On Break' | 'Off Duty';
export type TierBadge = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Hygiene Legend';
export type AlertSeverity = 'Warning' | 'Critical';
export type EscalationLevel = 'Level 1: Cleaner Alert' | 'Level 2: Supervisor Escalation' | 'Level 3: Admin Manager Alert';
export type TicketStatus = 'Open' | 'In Progress' | 'Resolved';
export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Emergency';

export interface SensorReadings {
  ammoniaPpm: number;      // PPM (unsafe > 25 PPM)
  odorIndex: number;       // 1-10 scale (unsafe > 7)
  humidityPercent: number; // % (unsafe > 75%)
  airQualityIndex: number; // 0-500 AQI
  occupancyCount: number;  // Current people inside
  totalFootfall: number;   // Daily count
}

export interface Restroom {
  id: string;
  name: string;
  location: string;
  zone: string;
  loraDeviceId: string;
  status: HygieneStatus;
  sensorReadings: SensorReadings;
  lastCleanedAt: string;
  nextScheduledCleaning: string;
  cleaningIntervalMinutes: number;
  assignedCleanerId: string;
  assignedCleanerName: string;
  sopRequirements: string[];
}

export interface LoRaDevice {
  id: string;
  hardwareId: string;
  assignedRestroom: string;
  restroomName: string;
  rssi: number; // dBm (-120 to -30)
  snr: number;  // dB (-20 to +15)
  batteryLevel: number; // %
  status: LoRaStatus;
  lastPacketTimestamp: string;
  packetCount: number;
  frequencyMHz: number;
}

export interface LoRaPacket {
  id: string;
  deviceId: string;
  hardwareId: string;
  restroomId: string;
  restroomName: string;
  timestamp: string;
  ammoniaPpm: number;
  odorIndex: number;
  humidityPercent: number;
  footfallCount: number;
  battery: number;
  rssi: number;
  snr: number;
}

export interface Cleaner {
  id: string;
  cleanerIdCode: string; // Unique Cleaner ID e.g. CLN-9021
  name: string;
  avatar: string;
  phone: string;
  assignedRestroomIds: string[];
  status: CleanerStatus;
  performancePoints: number;
  completedCleaningsCount: number;
  missedCleaningsCount: number;
  blackMarkCount: number;
  tierBadge: TierBadge;
  sixMonthConsistencyScore: number; // 0 - 100%
  joinDate: string;
}

export interface AttendanceRecord {
  id: string;
  cleanerId: string;
  cleanerIdCode: string;
  cleanerName: string;
  checkInTime: string;
  checkOutTime: string | null;
  shift: string;
  status: 'Checked In' | 'Checked Out' | 'On Active Duty';
}

export interface CleaningActivityLog {
  id: string;
  cleanerId: string;
  cleanerName: string;
  restroomId: string;
  restroomName: string;
  startTime: string;
  endTime: string | null;
  durationMinutes: number | null;
  sopCompleted: boolean;
  notes: string;
  computerTimestamp: string;
  status: 'In Progress' | 'Completed' | 'Verified';
}

export interface HygieneAlert {
  id: string;
  restroomId: string;
  restroomName: string;
  alertType: 'Ammonia Spike' | 'Odor Hazard' | 'High Humidity' | 'Overdue Cleaning';
  severity: AlertSeverity;
  message: string;
  timestamp: string;
  resolved: boolean;
}

export interface EscalationRecord {
  id: string;
  restroomId: string;
  restroomName: string;
  overdueMinutes: number;
  currentLevel: EscalationLevel;
  assignedSupervisor: string;
  timestamp: string;
  status: 'Active' | 'Escalated to Admin' | 'Resolved';
  resolutionNotes?: string;
}

export interface Violation {
  id: string;
  cleanerId: string;
  cleanerIdCode?: string;
  cleanerName: string;
  restroomId: string;
  restroomName: string;
  title: string;
  severity: 'Minor' | 'Moderate' | 'Severe';
  blackMarkPoints: number;
  date: string;
  details: string;
}

export interface MaintenanceTicket {
  id: string;
  ticketNo: string;
  restroomId: string;
  restroomName: string;
  issueType: 'Sensor Malfunction' | 'Plumbing Defect' | 'Sanitize Dispenser Empty' | 'Hardware Failure';
  priority: TicketPriority;
  reportedBy: string;
  createdAt: string;
  status: TicketStatus;
  description: string;
}

export interface ThresholdConfig {
  ammoniaMaxPpm: number;      // default 25
  odorMaxIndex: number;       // default 7
  humidityMaxPercent: number; // default 75
  overdueTimeoutMinutes: number; // default 60
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  category: 'Sensor' | 'Cleaner Activity' | 'Escalation' | 'Device Config' | 'Violation' | 'Maintenance';
  restroomName: string;
  cleanerName?: string;
  action: string;
  severity: 'Info' | 'Warning' | 'Critical';
}
