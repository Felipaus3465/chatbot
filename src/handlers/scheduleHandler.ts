import { config } from "../config.js";

export function isWorkDay(): boolean {
  const day = new Date().getDay();
  return config.workDays.includes(day);
}

export function isWorkHour(): boolean {
  const hour = new Date().getHours();
  return hour >= config.workHourStart && hour < config.workHourEnd;
}

export function isHoliday(): boolean {
  const today = new Date().toISOString().split("T")[0];
  return config.holidays.includes(today||'');
}
