// vim: set ts=2 sts=2 sw=2 et:
//
// This file is part of OpenLifter, simple Powerlifting meet software.
// Copyright (C) 2019 The OpenPowerlifting Project.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

// Defines logic for working with Dates, which is trickier than you might expect:
// the global state wants strings in YYYY-MM-DD, date objects get created from
// strings in UTC time, and React widgets create Dates in local time.

export const iso8601ToLocalDate = (s: string): Date => {
  const [yearStr, monthStr, dayStr] = s.split("-");

  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);

  const d = new Date();
  d.setFullYear(year, month - 1, day);
  return d;
};

export const localDateToIso8601 = (d: Date): string => {
  const year: number = d.getFullYear();
  const month: number = d.getMonth() + 1;
  const day: number = d.getDate();

  const yearStr = String(year);
  let monthStr = String(month);
  if (monthStr.length === 1) {
    monthStr = "0" + monthStr;
  }
  let dayStr = String(day);
  if (dayStr.length === 1) {
    dayStr = "0" + dayStr;
  }

  return yearStr + "-" + monthStr + "-" + dayStr;
};
