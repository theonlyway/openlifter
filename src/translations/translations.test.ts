// vim: set ts=2 sts=2 sw=2 et:
//
// This file is part of OpenLifter, simple Powerlifting meet software.
// Copyright (C) 2020 The OpenPowerlifting Project.
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

import translations from "./index";

describe("translations", () => {
  // Variables are written like "{day} {platform}" in a string.
  // This test asserts that the variables are still present in the translations.
  it("preserves in-string variables", () => {
    const en = translations.en;
    for (const id in en) {
      const english: string = (en as any)[id];

      let searchStart = 0;
      while (english.indexOf("{", searchStart) >= 0) {
        const start = english.indexOf("{", searchStart);
        expect(start).toBeGreaterThanOrEqual(searchStart);

        const end = english.indexOf("}", start);
        expect(end).toBeGreaterThan(start);

        const variable = english.substring(start, end + 1);
        expect(variable).toEqual(expect.stringContaining("{"));
        expect(variable).toEqual(expect.stringContaining("}"));

        // Ensure that the variable appears in each translation.
        for (const language in translations) {
          const str = (translations as any)[language][id];
          expect(str).toEqual(expect.stringContaining(variable));
        }

        searchStart = start + 1;
      }
    }
  });
});
