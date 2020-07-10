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

// Defines Foster-McCulloch age coefficients.
//
// These are taken from the OpenPowerlifting coefficients module,
// translated from the original Rust code.

const AGE_COEFFICIENTS = [
  // Coefficients in the range of 0-4 are clearly nonsense.
  0.0, // 0
  0.0, // 1
  0.0, // 2
  0.0, // 3
  0.0, // 4
  // These coefficients don't actually exist, and are just low-balled best guesses.
  // Kids really shouldn't be competing in this sport...
  // Ranges from age 5 to 13.
  1.73, // 5
  1.67, // 6
  1.61, // 7
  1.55, // 8
  1.49, // 9
  1.43, // 10
  1.38, // 11
  1.33, // 12
  1.28, // 13
  // Foster coefficients:
  // http://www.usapl-sd.com/Formulas/Foster.htm
  // Ranges from age 14 to 22.
  1.23, // 14
  1.18, // 15
  1.13, // 16
  1.08, // 17
  1.06, // 18
  1.04, // 19
  1.03, // 20
  1.02, // 21
  1.01, // 22
  // Lifters in the range 23-40 receive no handicap.
  1.0, // 23
  1.0, // 24
  1.0, // 25
  1.0, // 26
  1.0, // 27
  1.0, // 28
  1.0, // 29
  1.0, // 30
  1.0, // 31
  1.0, // 32
  1.0, // 33
  1.0, // 34
  1.0, // 35
  1.0, // 36
  1.0, // 37
  1.0, // 38
  1.0, // 39
  1.0, // 40
  // McCulloch coefficients:
  //  http://www.usapl-sd.com/Formulas/Mcculloch.htm (contains some errors).
  // Errors were corrected using the Masters coefficients from:
  //  http://worldpowerliftingcongress.com/wp-content/uploads/2015/02/Glossbrenner.htm
  // Ranges from age 41 to 80.
  1.01, // 41
  1.02, // 42
  1.031, // 43
  1.043, // 44
  1.055, // 45
  1.068, // 46
  1.082, // 47
  1.097, // 48
  1.113, // 49
  1.13, // 50
  1.147, // 51
  1.165, // 52
  1.184, // 53
  1.204, // 54
  1.225, // 55
  1.246, // 56
  1.268, // 57
  1.291, // 58
  1.315, // 59
  1.34, // 60
  1.366, // 61
  1.393, // 62
  1.421, // 63
  1.45, // 64
  1.48, // 65
  1.511, // 66
  1.543, // 67
  1.576, // 68
  1.61, // 69
  1.645, // 70
  1.681, // 71
  1.718, // 72
  1.756, // 73
  1.795, // 74
  1.835, // 75
  1.876, // 76
  1.918, // 77
  1.961, // 78
  2.005, // 79
  2.05, // 80
  // These coefficients taken from:
  // http://www.usapltwinportsrawopen.com/resources/USAPL+Age+Coefficients.pdf
  // Ranges from age 81 to 90.
  2.096, // 81
  2.143, // 82
  2.19, // 83
  2.238, // 84
  2.287, // 85
  2.337, // 86
  2.388, // 87
  2.44, // 88
  2.494, // 89
  2.549, // 90
  // Coefficients above 90 were just guessed at, and are unstandardized.
  2.605, // 91
  2.662, // 92
  2.72, // 93
  2.779, // 94
  2.839, // 95
  2.9, // 96
  2.962, // 97
  3.025, // 98
  3.089, // 99
  3.154, // 100
];

// Maps the given age into the table above.
export const fosterMcCulloch = (age: number): number => {
  if (!Number.isInteger(age) || age <= 0) {
    return 1.0;
  }

  // Greater-than is correct here: (age) is used to index into table, not (age-1).
  if (age > AGE_COEFFICIENTS.length) {
    return 1.0;
  }

  return AGE_COEFFICIENTS[age];
};
