import { describe, expect, it } from "vitest"
import {
  formatDate,
  getCurrentDate,
  addDays,
  subtractDays,
  isBefore,
  isAfter,
  getRelativeTime,
  getDuration,
  formatDuration,
} from "./date.util"

describe("Date Utils", () => {
  const testDate = new Date("2024-01-01T12:00:00Z")

  describe("formatDate", () => {
    it("should format date with default format", () => {
      expect(formatDate(testDate)).toBe("2024-01-01 12:00:00")
    })

    it("should format date with custom format", () => {
      expect(formatDate(testDate, "YYYY/MM/DD")).toBe("2024/01/01")
    })
  })

  describe("getCurrentDate", () => {
    it("should return current date in default format", () => {
      const current = getCurrentDate()
      expect(current).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
    })
  })

  describe("addDays", () => {
    it("should add days to date", () => {
      const result = addDays(testDate, 1)
      expect(result.toISOString()).toBe("2024-01-02T12:00:00.000Z")
    })
  })

  describe("subtractDays", () => {
    it("should subtract days from date", () => {
      const result = subtractDays(testDate, 1)
      expect(result.toISOString()).toBe("2023-12-31T12:00:00.000Z")
    })
  })

  describe("isBefore", () => {
    it("should check if date is before another date", () => {
      const date1 = new Date("2024-01-01")
      const date2 = new Date("2024-01-02")
      expect(isBefore(date1, date2)).toBe(true)
    })
  })

  describe("isAfter", () => {
    it("should check if date is after another date", () => {
      const date1 = new Date("2024-01-02")
      const date2 = new Date("2024-01-01")
      expect(isAfter(date1, date2)).toBe(true)
    })
  })

  describe("getRelativeTime", () => {
    it("should get relative time", () => {
      const pastDate = new Date(Date.now() - 1000 * 60 * 60)
      expect(getRelativeTime(pastDate)).toBe("an hour ago")
    })
  })

  describe("getDuration", () => {
    it("should get duration between dates", () => {
      const start = new Date("2024-01-01T00:00:00Z")
      const end = new Date("2024-01-01T01:00:00Z")
      expect(getDuration(start, end)).toBe(3600000) // 1 hour = 3600000 milliseconds
    })
  })

  describe("formatDuration", () => {
    it("should format duration", () => {
      expect(formatDuration(3600000)).toBe("an hour")
    })
  })
})
