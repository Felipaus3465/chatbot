import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  workHourStart: Number(process.env.WORK_HOUR_START) || 8,
  workHourEnd: Number(process.env.WORK_HOUR_END) || 17,
  workDays: process.env.WORK_DAYS
    ? process.env.WORK_DAYS.split(",").map(Number)
    : [1, 2, 3, 4, 5],
  holidays: process.env.HOLIDAYS
    ? process.env.HOLIDAYS.split(",")
    : ["2025-01-01", "2025-12-25"],
};
