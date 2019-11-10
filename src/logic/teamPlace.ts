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

// This code allows calculating team points for the IrishPF.
// The calculation is as follows:
//  For each category, the team of the first place lifter gets 3 points.
//  For each category, the team of any second place lifter gets 2 points.
//  For each category, the team of any third place lifter gets 1 point.

import { Entry, Event } from "../types/dataTypes";
import { getFinalResults } from "./divisionPlace";
import { getFinalEventTotalKg } from "./entry";

export type Place = number | "DQ";

// Wraps up all the information for a team in one place.
export type TeamResults = {
  team: string;
  cumulativePoints: number;
};

// Constructor.
const makeTeamResults = (team: string): TeamResults => {
  return {
    team: team,
    cumulativePoints: 0
  };
};

// Helper function to accumulate points and stuff in the team map.
const accumulate = (
  teamMap: Map<string, TeamResults>,
  orderedEntries: Array<Entry>,
  event: Event,
  index: number
): void => {
  if (index >= 3) return; // Only count first three places.
  if (index >= orderedEntries.length) return;

  // Don't count lifters without a team.
  const entry = orderedEntries[index];
  if (!entry.team) return;

  // Don't count DQ lifters.
  if (getFinalEventTotalKg(entry, event) <= 0) return;

  // Assign points! The object gets mutated directly, no need to update the map.
  let results = teamMap.get(entry.team);
  if (results) {
    if (index === 0) results.cumulativePoints += 3;
    else if (index === 1) results.cumulativePoints += 2;
    else if (index === 2) results.cumulativePoints += 1;
  }
};

export const getFinalTeamResults = (
  entries: Array<Entry>,
  weightClassesKgMen: Array<number>,
  weightClassesKgWomen: Array<number>,
  weightClassesKgMx: Array<number>,
  combineSleevesAndWraps: boolean
): Array<TeamResults> => {
  let results = getFinalResults(
    entries,
    weightClassesKgMen,
    weightClassesKgWomen,
    weightClassesKgMx,
    combineSleevesAndWraps
  );

  // Make a map of Team to TeamResults.
  // This ensures that every team is already in the map, simplifying code below.
  let teamMap = new Map();
  for (let i = 0; i < entries.length; ++i) {
    const entry = entries[i];
    if (entry.team && !teamMap.has(entry.team)) {
      teamMap.set(entry.team, makeTeamResults(entry.team));
    }
  }

  // For each Category, award points to designated teams, if any.
  for (let i = 0; i < results.length; ++i) {
    const catResults = results[i];
    const event = catResults.category.event;
    const orderedEntries = catResults.orderedEntries;

    accumulate(teamMap, orderedEntries, event, 0);
    accumulate(teamMap, orderedEntries, event, 1);
    accumulate(teamMap, orderedEntries, event, 2);
  }

  // Return a sorted array by cumulativePoints.
  let teamResults: Array<TeamResults> = [];
  for (let [key, obj] of teamMap) {
    teamResults.push(obj);
  }

  // Sort by cumulativePoints, higher points first.
  teamResults.sort((a, b) => {
    return b.cumulativePoints - a.cumulativePoints;
  });

  return teamResults;
};
