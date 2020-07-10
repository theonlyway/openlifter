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

import { liftToAttemptFieldName, liftToStatusFieldName, MAX_ATTEMPTS } from "./entry";

import { LiftingOrder, Entry, FieldKg, FieldStatus } from "../types/dataTypes";
import { LiftingState } from "../types/stateTypes";

// Helper function: for a given entry, see what attempt number would be next.
//
// Returns a number >= 1 if the entry is still lifting, representing the next attempt.
// Returns zero if the entry does not have any pending attempts.
const getNextAttemptNumberForEntry = (entry: Entry, fieldKg: FieldKg, fieldStatus: FieldStatus): number => {
  const weightsKg = entry[fieldKg];
  const statuses = entry[fieldStatus];

  // Lifters only set the next attempt, so loop backwards,
  // looking for the first attempt that meets the criteria.
  for (let i = MAX_ATTEMPTS - 1; i >= 0; i--) {
    if (weightsKg[i] !== 0 && statuses[i] === 0) {
      return i + 1;
    }
  }
  return 0;
};

// Helper function: for a given entry, see the maximum attempt number made.
//
// Returns a number >= 1 representing the highest-numbered attempt attempted.
// Returns zero if the entry has not attempted any attempts.
const getMaxAttemptNumberForEntry = (entry: Entry, fieldKg: FieldKg, fieldStatus: FieldStatus): number => {
  const weightsKg = entry[fieldKg];
  const statuses = entry[fieldStatus];

  for (let i = MAX_ATTEMPTS - 1; i >= 0; i--) {
    if (weightsKg[i] !== 0 && statuses[i] !== 0) {
      return i + 1;
    }
  }
  return 0;
};

// Determine the current active attempt for the current lift.
//
// An attempt is active if either:
// 1. It has been overridden by the Attempt selector.
// 2. There exists an attempt of that number with no success/failure value,
//    and there is no lower attempt number with that property.
//
// Returns a number in the (inclusive) range of [1, MAX_ATTEMPTS].
// If there is not enough data to make a decision, returns 1.
const getActiveAttemptNumber = (entriesInFlight: Array<Entry>, lifting: LiftingState): number => {
  const lift = lifting.lift;
  const fieldKg = liftToAttemptFieldName(lift);
  const fieldStatus = liftToStatusFieldName(lift);

  // Allow manual override.
  if (lifting.overrideAttempt !== null) {
    return Number(lifting.overrideAttempt);
  }

  // Iterate in reverse, looking for the earliest attempt that hasn't been lifted.
  let earliestAttemptOneIndexed = MAX_ATTEMPTS + 1;
  for (let i = 0; i < entriesInFlight.length; i++) {
    const entry = entriesInFlight[i];
    const next = getNextAttemptNumberForEntry(entry, fieldKg, fieldStatus);
    // Zero return value means "no pending attempts for this entry."
    if (next > 0 && next < earliestAttemptOneIndexed) {
      earliestAttemptOneIndexed = next;
    }
  }

  // The lowest pending attempt number is the current one.
  if (earliestAttemptOneIndexed < MAX_ATTEMPTS + 1) {
    return earliestAttemptOneIndexed;
  }

  // In the case of no pending lifts, try to helpfully infer the next attempt.
  let latestAttemptOneIndexed = 0;
  for (let i = 0; i < entriesInFlight.length; i++) {
    const entry = entriesInFlight[i];
    const max = getMaxAttemptNumberForEntry(entry, fieldKg, fieldStatus);
    // Zero return value means "no attempted attempts for this entry."
    if (max > latestAttemptOneIndexed) {
      latestAttemptOneIndexed = max;
    }
  }

  // If >0, we know there are no pending attempts, and we know that everyone
  // has taken all of the Nth attempt. So we should display the (N+1)th attempt.
  if (latestAttemptOneIndexed > 0) {
    // Don't auto-advance from 3rd to 4th attempts.
    // However, if we're already on 4th attempts, stay there.
    if (latestAttemptOneIndexed + 1 >= 4) {
      return latestAttemptOneIndexed;
    }

    // Roll-over to the next attempt (with no pending entries).
    return latestAttemptOneIndexed + 1;
  }

  // Otherwise, just default to the first attempt.
  return 1;
};

// Helper function for recursive comparison.
export const compareEntriesByAttempt = (a: Entry, b: Entry, fieldKg: FieldKg, attemptOneIndexed: number): number => {
  const aKg = a[fieldKg][attemptOneIndexed - 1];
  const bKg = b[fieldKg][attemptOneIndexed - 1];

  // If non-equal, sort by weight, ascending.
  if (aKg !== bKg) return aKg - bKg;

  // If the federation uses lot numbers, break ties using lot.
  if (a.lot !== 0 && b.lot !== 0) return a.lot - b.lot;

  // If this is not the first attempt, preserve the order from the last attempt.
  if (attemptOneIndexed > 1) {
    return compareEntriesByAttempt(a, b, fieldKg, attemptOneIndexed - 1);
  }

  // Try to break ties using bodyweight, with the lighter lifter going first.
  if (a.bodyweightKg !== b.bodyweightKg) return a.bodyweightKg - b.bodyweightKg;

  // If we've run out of properties by which to compare them, resort to Name.
  if (a.name < b.name) return -1;
  if (a.name > b.name) return 1;
  return 0;
};

// Helper function: performs an in-place sort on an array of entries.
// Assumes that zero entries are not mixed in with non-zero entries.
export const orderEntriesByAttempt = (
  entries: Array<Entry>,
  fieldKg: FieldKg,
  attemptOneIndexed: number
): Array<Entry> => {
  return entries.sort((a, b) => {
    return compareEntriesByAttempt(a, b, fieldKg, attemptOneIndexed);
  });
};

// Returns a copy of the entries in lifting order for the current attempt.
const orderEntriesForAttempt = (
  entriesInFlight: Array<Entry>,
  lifting: LiftingState,
  attemptOneIndexed: number
): Array<Entry> => {
  const lift = lifting.lift;
  const fieldKg = liftToAttemptFieldName(lift);

  const attemptZeroIndexed = attemptOneIndexed - 1;
  const existsNextAttempt = attemptOneIndexed + 1 <= MAX_ATTEMPTS;
  const existsPrevAttempt = attemptOneIndexed > 1;

  // Divide the entries into disjoint groups:
  const byNextAttempt: Array<Entry> = []; // Entries sorted by their next attempt.
  const byThisAttempt: Array<Entry> = []; // Entries sorted by this attempt.
  const byPrevAttempt: Array<Entry> = []; // Entries sorted by previous attempt.
  const notLifting: Array<Entry> = []; // Entries that don't have this or next attempts in.

  for (let i = 0; i < entriesInFlight.length; i++) {
    const entry = entriesInFlight[i];

    if (existsNextAttempt && entry[fieldKg][attemptZeroIndexed + 1] !== 0) {
      byNextAttempt.push(entry);
    } else if (entry[fieldKg][attemptZeroIndexed] !== 0) {
      byThisAttempt.push(entry);
    } else if (existsPrevAttempt && entry[fieldKg][attemptZeroIndexed - 1] !== 0) {
      byPrevAttempt.push(entry);
    } else {
      notLifting.push(entry);
    }
  }

  // Perform sorting on the relative groups.
  if (existsNextAttempt) {
    orderEntriesByAttempt(byNextAttempt, fieldKg, attemptOneIndexed + 1);
  }
  orderEntriesByAttempt(byThisAttempt, fieldKg, attemptOneIndexed);
  if (existsPrevAttempt) {
    orderEntriesByAttempt(byPrevAttempt, fieldKg, attemptOneIndexed - 1);
  }
  orderEntriesByAttempt(notLifting, fieldKg, attemptOneIndexed);

  // Arrange these three groups consecutively.
  return Array.prototype.concat(byNextAttempt, byThisAttempt, byPrevAttempt, notLifting);
};

// Returns either the current entry ID or null if no active entry.
//
// In the ordered entries, the earliest lifter that hasn't gone yet is going.
// This can be manually overridden by UI controls.
const getCurrentEntryId = (
  lifting: LiftingState,
  orderedEntries: Array<Entry>,
  attemptOneIndexed: number
): number | null => {
  const lift = lifting.lift;
  const fieldKg = liftToAttemptFieldName(lift);
  const fieldStatus = liftToStatusFieldName(lift);

  if (lifting.overrideEntryId !== null) {
    return Number(lifting.overrideEntryId);
  }

  for (let i = 0; i < orderedEntries.length; i++) {
    const entry = orderedEntries[i];
    const idx = attemptOneIndexed - 1;
    if (entry[fieldKg][idx] !== 0 && entry[fieldStatus][idx] === 0) {
      return entry.id;
    }
  }
  return null;
};

type NextEntryInfo = {
  entryId: number;
  attemptOneIndexed: number;
};

// Returns either an Object of {entryId, attemptOneIndexed}, or null.
const getNextEntryInfo = (
  lifting: LiftingState,
  currentEntryId: number | null,
  orderedEntries: Array<Entry>,
  attemptOneIndexed: number
): NextEntryInfo | null => {
  const lift = lifting.lift;
  const fieldKg = liftToAttemptFieldName(lift);
  const fieldStatus = liftToStatusFieldName(lift);

  if (currentEntryId === null) {
    return null;
  }

  // Find the index of the currentEntryId in the orderedEntries.
  const currentEntryIndex = orderedEntries.findIndex((e) => e.id === currentEntryId);
  if (currentEntryIndex === -1) {
    return null;
  }

  // Walk forward, looking for additional valid attempts.
  for (let i = currentEntryIndex + 1; i < orderedEntries.length; i++) {
    const hasAttempt = orderedEntries[i][fieldKg][attemptOneIndexed - 1] !== 0;
    const notTaken = orderedEntries[i][fieldStatus][attemptOneIndexed - 1] === 0;

    if (hasAttempt && notTaken) {
      return {
        entryId: orderedEntries[i].id,
        attemptOneIndexed: attemptOneIndexed,
      };
    }
  }

  // If none were found walking forward, check the next attempt by wrapping around.
  if (attemptOneIndexed + 1 > MAX_ATTEMPTS) {
    return null;
  }
  const nextAttemptOneIndexed = attemptOneIndexed + 1;

  for (let i = 0; i < currentEntryIndex; i++) {
    const hasAttempt = orderedEntries[i][fieldKg][nextAttemptOneIndexed - 1] !== 0;
    const notTaken = orderedEntries[i][fieldStatus][nextAttemptOneIndexed - 1] === 0;

    if (hasAttempt && notTaken) {
      return {
        entryId: orderedEntries[i].id,
        attemptOneIndexed: nextAttemptOneIndexed,
      };
    }
  }

  return null;
};

// Main application logic. Resolves the LiftingState to a LiftingOrder.
export const getLiftingOrder = (entriesInFlight: Array<Entry>, lifting: LiftingState): LiftingOrder => {
  const attemptOneIndexed = getActiveAttemptNumber(entriesInFlight, lifting);
  const orderedEntries = orderEntriesForAttempt(entriesInFlight, lifting, attemptOneIndexed);
  const currentEntryId = getCurrentEntryId(lifting, orderedEntries, attemptOneIndexed);
  const nextEntryInfo = getNextEntryInfo(lifting, currentEntryId, orderedEntries, attemptOneIndexed);

  return {
    orderedEntries: orderedEntries,
    attemptOneIndexed: attemptOneIndexed,
    currentEntryId: currentEntryId,
    nextAttemptOneIndexed: nextEntryInfo ? nextEntryInfo.attemptOneIndexed : null,
    nextEntryId: nextEntryInfo ? nextEntryInfo.entryId : null,
  };
};
