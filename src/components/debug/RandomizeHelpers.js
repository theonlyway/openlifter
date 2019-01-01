// vim: set ts=2 sts=2 sw=2 et:
//
// Common functions shared by the Randomize feature.

// Generate a gibberish string, between 0-11 characters.
export const randomString = () => {
  // Converts each digit to a value in base 36.
  return Math.random()
    .toString(36)
    .substr(2);
};

// Generate a random integer between max and min.
export const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generate a random floating-point number with a set number of fractional digits.
export const randomFixedPoint = (min, max, fixedPoints) => {
  const power = Math.pow(10, fixedPoints);

  // Construct an integer from [0, (max - min + 1) * 10^fixedPoints].
  const k = Math.floor(Math.random() * (max - min + 1) * power);

  // Translate it back to normal space.
  return k / power + min;
};
