import { config } from "../config.js";

export function isHoliday(): boolean {
  const today = new Date().toISOString().split("T")[0];
  return config.holidays.includes(today||'');
}
