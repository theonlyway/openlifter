// vim: set ts=2 sts=2 sw=2 et:

// Sets a weightKg that doesn't have a good/failed value, for entering in attempts.
export const enterAttempt = (entryId, lift, attemptOneIndexed, weightKg) => {
  return {
    type: "ENTER_ATTEMPT",
    entryId: entryId,
    lift: lift,
    attemptOneIndexed: attemptOneIndexed,
    weightKg: weightKg
  };
};

// Marks a lift "good" or "failed".
//
// entryId is the ID of the affected entry, a Number.
// lift is "S", "B", or "D".
// attempt is 1,2,3,4.
// success is a bool for whether to mark the lift as a success or as a failure.
export const markLift = (entryId, lift, attempt, success) => {
  return {
    type: "MARK_LIFT",
    success: success
  };
};

// Sets the current group of lifters.
// This is always manually set by the score table.
export const setLiftingGroup = (day, platform, flight, lift) => {
  return {
    type: "SET_LIFTING_GROUP",
    day: day,
    platform: platform,
    flight: flight,
    lift: lift
  };
};

// Overrides the calculated meet progress logic by forcing display of an attempt,
// even if it has already been marked "good lift" or "no lift".
export const overrideAttempt = attempt => {
  return {
    type: "OVERRIDE_ATTEMPT",
    attempt: attempt
  };
};

// Overrides the calculated meet progress logic by forcing display of a specific lifter,
// even if they have already had their attempt entered.
export const overrideEntryId = entryId => {
  return {
    type: "OVERRIDE_ENTRY_ID",
    entryId: entryId
  };
};
