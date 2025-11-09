import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  workHourStart: Number(process.env.WORK_HOUR_START) || 8,
  workHourEnd: Number(process.env.WORK_HOUR_END) || 4,
  workDays: process.env.WORK_DAYS
    ? process.env.WORK_DAYS.split(",").map(Number)
    : [1, 2, 3, 4, 5],
  holidays: process.env.HOLIDAYS
    ? process.env.HOLIDAYS.split(",")
    : ["2025-01-01","2025-12-21","2025-12-22","2025-12-23","2025-12-24", "2025-12-25","2025-12-26", "2025-12-27","2025-12-28","2025-12-29","2025-12-30","2025-12-31","2026-01-01","2026-01-02","2026-01-03","2026-01-04","2026-01-05","2026-01-06"],
};
