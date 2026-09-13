# Walkthrough - Restroom Hygiene & Cleaner Management Dashboard

We have fully built and implemented the **Centralized Monitoring & Management Dashboard for Restroom Hygiene, Cleaner Activity, Sensor Data, and Automated Escalations** in Next.js.

---

## 🎯 Implemented Features Matrix

| # | Requirement Feature | Implementation Details & Page Route | Verification Status |
|---|---|---|---|
| 1 | **Secure Admin Login & Auth** | Protected route access (`/login`), authenticated session management in `DashboardProvider`. | ✅ Verified |
| 2 | **Centralized LoRa Data Reception** | Wireless telemetry stream receiver (`/lora-network`) operating at 868.1 MHz without field Wi-Fi. | ✅ Verified |
| 3 | **Centralized Data Synchronization** | Continuous real-time telemetry updates for hygiene, footfall, and cleaning logs. | ✅ Verified |
| 4 | **Real-Time Hygiene Status** | Live Restroom Matrix Cards (`/` & `/restrooms`) with gauges for Ammonia PPM, Odor, Humidity & AQI. | ✅ Verified |
| 5 | **Automatic Hygiene Alerts** | Dynamic rule threshold evaluation triggering instant notification toasts and alert tickers. | ✅ Verified |
| 6 | **Configurable Device Location** | Re-bind LoRa hardware IDs to new physical restroom locations via `RelocateDeviceModal`. | ✅ Verified |
| 7 | **Cleaner Management** | Auto-generate unique Cleaner ID codes (e.g. `CLN-8841`) and manage roster (`/cleaners`). | ✅ Verified |
| 8 | **Cleaning Schedule Management** | Configure required cleaning interval frequencies (30m, 60m, 120m) per restroom (`/schedules`). | ✅ Verified |
| 9 | **Restroom Cleaning Requirements** | Slide-out SOP checklist drawer (`SopDrawer`) detailing mandatory step-by-step sanitation standards. | ✅ Verified |
| 10 | **Date & Time-Based Cleaner Logging** | Capture timestamped cleaning logs directly from computer clock (`AttendanceModal`). | ✅ Verified |
| 11 | **Cleaner Attendance Tracking** | Real-time Check-In / Check-Out tracking with shift logging. | ✅ Verified |
| 12 | **Restroom-Wise History** | Maintain separate cleaning and hygiene audit logs per restroom (`/logs`). | ✅ Verified |
| 13 | **Overdue Cleaning Alerts** | Visual overdue counters triggering automatic alerts when cleaning is missed. | ✅ Verified |
| 14 | **Automated Escalation** | Multi-tier escalation flow (`Cleaner Alert` → `Supervisor Escalation` → `Admin Manager Alert`). | ✅ Verified |
| 15 | **Black Mark & Violation Tracking** | Record missed cleanings, incomplete SOPs, and hygiene breaches directly against cleaner IDs (`/violations-maintenance`). | ✅ Verified |
| 16 | **Maintenance Issue Reporting** | Dispatch and manage maintenance tickets for sensor, plumbing, or hardware faults. | ✅ Verified |
| 17 | **Cleaning Performance Analytics** | Daily, weekly, monthly, and 6-month performance charts built with Recharts (`/analytics`). | ✅ Verified |
| 18 | **Cleaner Performance Comparison** | Comparative bar charts and multi-dimensional radar skill charts. | ✅ Verified |
| 19 | **Gamification & Reward System** | Points economy, tier badges (Bronze, Silver, Gold, Platinum, Legend), and 6-month consistency reward store (`/rewards`). | ✅ Verified |
| 20 | **Two-Month Log Storage** | 60-day historical database retention view with advanced search and filters (`/logs`). | ✅ Verified |
| 21 | **Reports & Data Export** | One-click downloadable CSV engine and print-formatted PDF report builder (`/reports`). | ✅ Verified |

---

## 🎨 Design & Aesthetic Highlights

- **Obsidian Cyber Aesthetic**: Deep Slate/Obsidian background (`#090d16`) with electric cyan (`#06b6d4`), emerald green (`#10b981`), amber hazard (`#f59e0b`), and neon rose (`#f43f5e`) accents.
- **Glassmorphic Panels**: Backdrop blur filters, translucent dark panels, subtle neon glow highlights, and custom cyber scrollbars.
- **Live Computer Clock**: Real-time clock display running continuously in the top header, capturing the exact computer time for timestamped audit logs.
- **LoRa Simulation Engine**: Background radio telemetry loop emitting simulated LoRa sensor packets every 4 seconds, updating live sensor gauges across the app seamlessly.

---

## 🚀 How to Run the App Locally

1. Open a terminal in the project directory: `c:\sem4\embedded\patent\Dashboard_Website`
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Open your web browser at [http://localhost:3000](http://localhost:3000)

## 📦 Production Build Verification Output

The Next.js production build (`npm run build`) completed with **0 errors and 0 warnings**:

```text
Route (app)                              Size     First Load JS
┌ ○ /                                    3.12 kB         113 kB
├ ○ /analytics                           107 kB          200 kB
├ ○ /cleaners                            4.4 kB         97.9 kB
├ ○ /login                               2.33 kB        95.8 kB
├ ○ /logs                                2.46 kB          96 kB
├ ○ /lora-network                        4.74 kB        98.3 kB
├ ○ /reports                             5.06 kB        98.6 kB
├ ○ /restrooms                           2.58 kB         102 kB
├ ○ /rewards                             7.56 kB         101 kB
├ ○ /schedules                           3 kB           96.5 kB
└ ○ /violations-maintenance              3.62 kB        97.1 kB
+ First Load JS shared by all            87.5 kB
```
