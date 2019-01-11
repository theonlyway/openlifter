// vim: set ts=2 sts=2 sw=2 et:
// @flow
//
// Defines the calculation of Wilks points.
// Taken from https://gitlab.com/openpowerlifting/ipf-points-calculator.

function wilksPoly(a: number, b: number, c: number, d: number, e: number, f: number, x: number) {
  var x2 = x * x,
    x3 = x2 * x,
    x4 = x3 * x,
    x5 = x4 * x;
  return 500.0 / (a + b * x + c * x2 + d * x3 + e * x4 + f * x5);
}

export function wilksMen(bw: number): number {
  bw = Math.min(Math.max(bw, 40.0), 201.9);
  return wilksPoly(-216.0475144, 16.2606339, -0.002388645, -0.00113732, 7.01863e-6, -1.291e-8, bw);
}

export function wilksWomen(bw: number): number {
  bw = Math.min(Math.max(bw, 26.51), 154.53);
  return wilksPoly(594.31747775582, -27.23842536447, 0.82112226871, -0.00930733913, 0.00004731582, -0.00000009054, bw);
}
