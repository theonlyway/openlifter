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

// This defines translation IDs that aren't provided by a <FormattedMessage/>.
//
// Because they're not defined in the source code itself, the automatic scanner
// won't pick them up. So they're defined here instead.
//
// The "manage.js" script picks these up and combines them with the automatically
// detected messages to create the JSON translation files.

let strings = new Array();

/* eslint-disable */

// Generic strings for common nouns that aren't really particular to a context.
strings = strings.concat([
  { id: "common.age", defaultMessage: "Age" },
  { id: "common.country", defaultMessage: "Country" },
  { id: "common.federation", defaultMessage: "Federation" },
  { id: "common.kilograms", defaultMessage: "Kilograms" },
  { id: "common.name", defaultMessage: "Name" },
  { id: "common.pounds", defaultMessage: "Pounds" },
  { id: "common.response-no", defaultMessage: "No" },
  { id: "common.response-yes", defaultMessage: "Yes" },
  { id: "common.select-placeholder", defaultMessage: "Select..." },
  { id: "common.unnamed-filename", defaultMessage: "Unnamed-Meet" },
]);

// Strings for the Equipment type.
strings = strings.concat([
  { id: "equipment.bare", defaultMessage: "Bare" },
  { id: "equipment.sleeves", defaultMessage: "Sleeves" },
  { id: "equipment.wraps", defaultMessage: "Wraps" },
  { id: "equipment.single-ply", defaultMessage: "Single-ply" },
  { id: "equipment.multi-ply", defaultMessage: "Multi-ply" },
]);

// Strings for the Event type.
strings = strings.concat([
  { id: "event.s", defaultMessage: "S" },
  { id: "event.b", defaultMessage: "B" },
  { id: "event.d", defaultMessage: "D" },
  { id: "event.sb", defaultMessage: "SB" },
  { id: "event.sd", defaultMessage: "SD" },
  { id: "event.bd", defaultMessage: "BD" },
  { id: "event.sbd", defaultMessage: "SBD" },
]);

// Strings for the Flight type.
strings = strings.concat([
  { id: "flight.a", defaultMessage: "A" },
  { id: "flight.b", defaultMessage: "B" },
  { id: "flight.c", defaultMessage: "C" },
  { id: "flight.d", defaultMessage: "D" },
  { id: "flight.e", defaultMessage: "E" },
  { id: "flight.f", defaultMessage: "F" },
  { id: "flight.g", defaultMessage: "G" },
  { id: "flight.h", defaultMessage: "H" },
  { id: "flight.i", defaultMessage: "I" },
  { id: "flight.j", defaultMessage: "J" },
  { id: "flight.k", defaultMessage: "K" },
  { id: "flight.l", defaultMessage: "L" },
  { id: "flight.m", defaultMessage: "M" },
  { id: "flight.n", defaultMessage: "N" },
  { id: "flight.o", defaultMessage: "O" },
  { id: "flight.p", defaultMessage: "P" },
]);

// Strings for the Formula type.
strings = strings.concat([
  { id: "formula.ah", defaultMessage: "AH (Haleczko)" },
  { id: "formula.bodyweight-multiple", defaultMessage: "Bodyweight Multiple" },
  { id: "formula.dots", defaultMessage: "Dots" },
  { id: "formula.glossbrenner", defaultMessage: "Glossbrenner" },
  { id: "formula.ipf-points", defaultMessage: "IPF Points" },
  { id: "formula.nasa-points", defaultMessage: "NASA Points" },
  { id: "formula.reshel", defaultMessage: "Reshel" },
  { id: "formula.schwartz-malone", defaultMessage: "Schwartz/Malone" },
  { id: "formula.total", defaultMessage: "Total" },
  { id: "formula.wilks", defaultMessage: "Wilks" },
]);

// Strings for the AgeCoefficients type.
strings = strings.concat([
  { id: "age-coefficients.none", defaultMessage: "None" },
  { id: "age-coefficients.foster-mcculloch", defaultMessage: "Foster-McCulloch" },
]);

// Strings for the Sex type.
strings = strings.concat([
  { id: "sex.m", defaultMessage: "M" },
  { id: "sex.f", defaultMessage: "F" },
  { id: "sex.mx", defaultMessage: "Mx" },
]);

// Strings for the Meet Setup page.
strings = strings.concat([
  { id: "meet-setup.bar-weight-bench-kg", defaultMessage: "Bench Bar + Collars weight (kg)" },
  { id: "meet-setup.bar-weight-bench-lbs", defaultMessage: "Bench Bar + Collars weight (lbs)" },
  { id: "meet-setup.bar-weight-deadlift-kg", defaultMessage: "Deadlift Bar + Collars weight (kg)" },
  { id: "meet-setup.bar-weight-deadlift-lbs", defaultMessage: "Deadlift Bar + Collars weight (lbs)" },
  { id: "meet-setup.bar-weight-squat-kg", defaultMessage: "Squat Bar + Collars weight (kg)" },
  { id: "meet-setup.bar-weight-squat-lbs", defaultMessage: "Squat Bar + Collars weight (lbs)" },
  { id: "meet-setup.city-town", defaultMessage: "City/Town" },
  { id: "meet-setup.divisions-placeholder", defaultMessage: "Type a division and press Enter..." },
  { id: "meet-setup.label-also-show-kilograms", defaultMessage: "Also show attempts in kilograms?" },
  { id: "meet-setup.label-also-show-pounds", defaultMessage: "Also show attempts in pounds?" },
  { id: "meet-setup.label-classes-men", defaultMessage: "Men's Weight Classes (kg), omit SHW" },
  { id: "meet-setup.label-classes-mx", defaultMessage: "Mx Weight Classes (kg), omit SHW" },
  { id: "meet-setup.label-classes-women", defaultMessage: "Women's Weight Classes (kg), omit SHW" },
  { id: "meet-setup.meet-name", defaultMessage: "Meet Name" },
  { id: "meet-setup.placeholder-classes", defaultMessage: "Type a weight class and press Enter..." },
  { id: "meet-setup.plates-kg", defaultMessage: "Weight (kg)" },
  { id: "meet-setup.plates-lbs", defaultMessage: "Weight (lbs)" },
  { id: "meet-setup.rules-gpc", defaultMessage: "GPC Rules" },
  { id: "meet-setup.rules-spf", defaultMessage: "SPF Rules" },
  { id: "meet-setup.rules-traditional", defaultMessage: "Traditional Rules" },
  { id: "meet-setup.rules-upa", defaultMessage: "UPA Rules" },
  { id: "meet-setup.rules-usapl", defaultMessage: "USAPL Rules" },
  { id: "meet-setup.rules-uspa", defaultMessage: "USPA Rules" },
  { id: "meet-setup.rules-wabdl", defaultMessage: "WABDL Rules" },
  { id: "meet-setup.rules-wpc", defaultMessage: "WPC Rules" },
  { id: "meet-setup.rules-wrpf", defaultMessage: "WRPF Rules" },
  { id: "meet-setup.state-province", defaultMessage: "State/Province" },
]);

// Strings for the Registration page.
strings = strings.concat([
  { id: "registration.birthdate-placeholder", defaultMessage: "YYYY-MM-DD" },
  { id: "registration.button-delete", defaultMessage: "Delete" },
  { id: "registration.member-id-placeholder", defaultMessage: "ID" },
  { id: "registration.state-province", defaultMessage: "State" },
]);

// Strings for the CSV import/export feature on the Registration page.
strings = strings.concat([
  { id: "import.template-filename", defaultMessage: "registration-template" },
  { id: "import.export-filename", defaultMessage: "{MeetName}-Registrations" },
  { id: "import.example-name", defaultMessage: "Emily Example" },
  { id: "import.example-division1", defaultMessage: "Open" },
  { id: "import.example-division2", defaultMessage: "J20-23" },
  { id: "import.example-instagram", defaultMessage: "emily_example_" },
  { id: "import.example-notes", defaultMessage: "emily@example.com: she's the best!" },
  { id: "import.example-sex", defaultMessage: "F" },
  { id: "import.example-country", defaultMessage: "USA" },
  { id: "import.example-state", defaultMessage: "NY" },
  { id: "import.example-birthdate", defaultMessage: "1998-02-16" },
  { id: "import.column-day", defaultMessage: "Day" },
  { id: "import.column-platform", defaultMessage: "Platform" },
  { id: "import.column-flight", defaultMessage: "Flight" },
  { id: "import.column-name", defaultMessage: "Name" },
  { id: "import.column-sex", defaultMessage: "Sex" },
  { id: "import.column-equipment", defaultMessage: "Equipment" },
  { id: "import.column-division-n", defaultMessage: "Division{N}" },
  { id: "import.column-event-n", defaultMessage: "Event{N}" },
  { id: "import.column-birthdate", defaultMessage: "BirthDate" },
  { id: "import.column-memberid", defaultMessage: "MemberID" },
  { id: "import.column-country", defaultMessage: "Country" },
  { id: "import.column-state", defaultMessage: "State" },
  { id: "import.column-lot", defaultMessage: "Lot" },
  { id: "import.column-team", defaultMessage: "Team" },
  { id: "import.column-instagram", defaultMessage: "Instagram" },
  { id: "import.column-notes", defaultMessage: "Notes" },
]);

// Strings for the Weigh-ins page.
strings = strings.concat([
  { id: "weigh-ins.bodyweight-header-kg", defaultMessage: "Bodyweight Kg" },
  { id: "weigh-ins.bodyweight-header-lbs", defaultMessage: "Bodyweight Lbs" },
  { id: "weigh-ins.squat-header-kg", defaultMessage: "Squat Opener Kg" },
  { id: "weigh-ins.squat-header-lbs", defaultMessage: "Squat Opener Lbs" },
  { id: "weigh-ins.bench-header-kg", defaultMessage: "Bench Opener Kg" },
  { id: "weigh-ins.bench-header-lbs", defaultMessage: "Bench Opener Lbs" },
  { id: "weigh-ins.deadlift-header-kg", defaultMessage: "Deadlift Opener Kg" },
  { id: "weigh-ins.deadlift-header-lbs", defaultMessage: "Deadlift Opener Lbs" },
  { id: "weigh-ins.bodyweight-placeholder", defaultMessage: "Bwt" },
  { id: "weigh-ins.squat-rack-placeholder", defaultMessage: "S.Rack" },
  { id: "weigh-ins.squat-placeholder", defaultMessage: "Squat" },
  { id: "weigh-ins.bench-rack-placeholder", defaultMessage: "B.Rack" },
  { id: "weigh-ins.bench-placeholder", defaultMessage: "Bench" },
  { id: "weigh-ins.deadlift-placeholder", defaultMessage: "Dead" },
]);

// Strings for the Flight Order page.
strings = strings.concat([
  { id: "flight-order.squat-column-header", defaultMessage: "Squat" },
  { id: "flight-order.bench-column-header", defaultMessage: "Bench" },
  { id: "flight-order.deadlift-column-header", defaultMessage: "Deadlift" },
  { id: "flight-order.kilograms-header", defaultMessage: "Kg" },
  { id: "flight-order.pounds-header", defaultMessage: "Lbs" },
]);

// Strings for the Lifting page.
strings = strings.concat([
  { id: "lifting.column-age", defaultMessage: "Age" },
  { id: "lifting.column-b1", defaultMessage: "B1" },
  { id: "lifting.column-b2", defaultMessage: "B2" },
  { id: "lifting.column-b3", defaultMessage: "B3" },
  { id: "lifting.column-b4", defaultMessage: "B4" },
  { id: "lifting.column-bestbench", defaultMessage: "Bench" },
  { id: "lifting.column-bestsquat", defaultMessage: "Squat" },
  { id: "lifting.column-bodyweight", defaultMessage: "Bwt" },
  { id: "lifting.column-d1", defaultMessage: "D1" },
  { id: "lifting.column-d2", defaultMessage: "D2" },
  { id: "lifting.column-d3", defaultMessage: "D3" },
  { id: "lifting.column-d4", defaultMessage: "D4" },
  { id: "lifting.column-division", defaultMessage: "Division" },
  { id: "lifting.column-equipment", defaultMessage: "Equip" },
  { id: "lifting.column-finaltotal", defaultMessage: "Total" },
  { id: "lifting.column-finalpoints", defaultMessage: "Points" },
  { id: "lifting.column-lifter", defaultMessage: "Lifter" },
  { id: "lifting.column-lot", defaultMessage: "Lot" },
  { id: "lifting.column-place", defaultMessage: "Place" },
  { id: "lifting.column-projectedtotal", defaultMessage: "Total" },
  { id: "lifting.column-projectedpoints", defaultMessage: "Points" },
  { id: "lifting.column-s1", defaultMessage: "S1" },
  { id: "lifting.column-s2", defaultMessage: "S2" },
  { id: "lifting.column-s3", defaultMessage: "S3" },
  { id: "lifting.column-s4", defaultMessage: "S4" },
  { id: "lifting.column-weightclass", defaultMessage: "Class" },
  { id: "lifting.flight-complete", defaultMessage: "Flight Complete" },
  { id: "lifting.footer-day-template", defaultMessage: "Day {N}" },
  { id: "lifting.footer-platform-template", defaultMessage: "Platform {N}" },
  { id: "lifting.footer-flight-template", defaultMessage: "Flight {flight}" },
  { id: "lifting.footer-attempt-template", defaultMessage: "Attempt {N}" },
  { id: "lifting.footer-squat", defaultMessage: "Squat" },
  { id: "lifting.footer-bench", defaultMessage: "Bench" },
  { id: "lifting.footer-deadlift", defaultMessage: "Deadlift" },
]);
/* eslint-enable */

exports.strings = strings;
