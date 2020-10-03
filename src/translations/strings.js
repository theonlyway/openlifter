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

let strings = [];

/* eslint-disable */

// Generic strings for common nouns that aren't really particular to a context.
strings = strings.concat([
  { id: "common.age", defaultMessage: "Age" },
  { id: "common.any", defaultMessage: "Any" },
  { id: "common.button-close", defaultMessage: "Close" },
  { id: "common.button-continue", defaultMessage: "Continue" },
  { id: "common.country", defaultMessage: "Country" },
  { id: "common.danger-allcaps", defaultMessage: "DANGER!!!" },
  { id: "common.federation", defaultMessage: "Federation" },
  { id: "common.importation-error", defaultMessage: "Importation Error" },
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
  { id: "equipment.unlimited", defaultMessage: "Unlimited" },
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
  { id: "formula.ipf-gl-points", defaultMessage: "IPF GL Points" },
  { id: "formula.ipf-points", defaultMessage: "IPF Points" },
  { id: "formula.nasa-points", defaultMessage: "NASA Points" },
  { id: "formula.reshel", defaultMessage: "Reshel" },
  { id: "formula.schwartz-malone", defaultMessage: "Schwartz/Malone" },
  { id: "formula.total", defaultMessage: "Total" },
  { id: "formula.wilks", defaultMessage: "Wilks" },
  { id: "formula.wilks2020", defaultMessage: "Wilks2020" },
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

// Strings for error messages.
strings = strings.concat([
  { id: "error.invalid-openlifter", defaultMessage: "That didn't look like a valid OpenLifter file!" },
  { id: "error.csv-unknown-header", defaultMessage: "Unknown header {name} in column {ABC}. Here's a list of all accepted column names: {validList}." },
  { id: "error.csv-duplicate-header", defaultMessage: "The header {name} appears twice, in columns {firstABC} and {secondABC}." },
  { id: "error.csv-missing-header", defaultMessage: "The mandatory column {name} is missing." },
  { id: "error.csv-day-platform-order", defaultMessage: "The {day} column must precede the {platform} column." },
  { id: "error.csv-field-prefix", defaultMessage: "Invalid {cellType} '{cellValue}' in row {rowNumber}: " },
  { id: "error.csv-field-suffix-integer", defaultMessage: "expected an integer." },
  { id: "error.csv-field-suffix-positive", defaultMessage: "can't be less than 1." },
  { id: "error.csv-field-suffix-day-overflow", defaultMessage: "the Meet Setup page specifices only {numDays} days." },
  { id: "error.csv-field-suffix-platform-overflow", defaultMessage: "Day {dayNumber} only has {numPlatforms} platforms." },
  { id: "error.csv-field-suffix-flight-invalid", defaultMessage: "expected a valid flight." },
  { id: "error.csv-field-suffix-name-blank", defaultMessage: "every lifter must have a name." },
  { id: "error.csv-field-suffix-sex-invalid", defaultMessage: "valid sexes are {M}, {F}, and {Mx}." },
  { id: "error.csv-field-suffix-equipment-invalid", defaultMessage: "valid Equipment values are {bare}, {sleeves}, {wraps}, {single}, and {multi}." },
  { id: "error.csv-field-suffix-division-blank", defaultMessage: "the first division is mandatory." },
  { id: "error.csv-field-suffix-division-invalid", defaultMessage: "not a valid division per the Meet Setup page." },
  { id: "error.csv-field-suffix-division-duplicate", defaultMessage: "the lifter was already registered in that division by another column." },
  { id: "error.csv-field-suffix-event-blank", defaultMessage: "the first event is mandatory." },
  { id: "error.csv-field-suffix-event-duplicate", defaultMessage: "the lifter was already registered in that event by another column." },
  { id: "error.csv-field-suffix-event-invalid", defaultMessage: "valid events are {SBD}, {BD}, {SB}, {SD}, {S}, {B}, and {D}." },
  { id: "error.csv-field-suffix-date-format", defaultMessage: "date must be in the unambiguous international standard: YYYY-MM-DD." },
  { id: "error.csv-field-empty-or-positive", defaultMessage: "expected an empty cell or a positive integer." },
  { id: "error.csv-field-unknown-boolean", defaultMessage: "expected '{Yes}', '{No}', or a blank field." },
  { id: "error.internal-error", defaultMessage: "An unexpected internal error occurred." },
  { id: "error.version-mismatch", defaultMessage: "This meet uses data version {thisVersion}, but the selected file uses data version {otherVersion}." },
  { id: "error.meetname-mismatch", defaultMessage: "This meet is named '{thisName}', but the selected file is for a meet named '{otherName}'. As a safety check, the names much match for merging to be allowed." },
  { id: "error.no-platform-data", defaultMessage: "The selected file does not have any lifting data for Day {day} Platform {platform}." },
  { id: "error.not-json", defaultMessage: "Could not parse file as JSON." },
]);

// Strings for the Home page.
strings = strings.concat([
  { id: "home.error-load-popup-title", defaultMessage: "Load from File Error" },
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
  { id: "meet-setup.rules-bp", defaultMessage: "BP Rules" },
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
  { id: "import.column-age", defaultMessage: "Age" },
  { id: "import.column-memberid", defaultMessage: "MemberID" },
  { id: "import.column-country", defaultMessage: "Country" },
  { id: "import.column-state", defaultMessage: "State" },
  { id: "import.column-lot", defaultMessage: "Lot" },
  { id: "import.column-guest", defaultMessage: "Guest" },
  { id: "import.column-novice", defaultMessage: "Novice" },
  { id: "import.column-can-break-records", defaultMessage: "Can Break Records" },
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
  { id: "lifting.current-weight-kg-lbs", defaultMessage: "{kg}kg / {lbs}lb" },
  { id: "lifting.current-weight-kg", defaultMessage: "{kg}kg" },
  { id: "lifting.current-weight-lbs-kg", defaultMessage: "{lbs}lb / {kg}kg" },
  { id: "lifting.current-weight-lbs", defaultMessage: "{lbs}lb" },
  { id: "lifting.flight-complete", defaultMessage: "Flight Complete" },
  { id: "lifting.footer-day-template", defaultMessage: "Day {N}" },
  { id: "lifting.footer-platform-template", defaultMessage: "Platform {N}" },
  { id: "lifting.footer-flight-template", defaultMessage: "Flight {flight}" },
  { id: "lifting.footer-attempt-template", defaultMessage: "Attempt {N}" },
  { id: "lifting.footer-squat", defaultMessage: "Squat" },
  { id: "lifting.footer-bench", defaultMessage: "Bench" },
  { id: "lifting.footer-deadlift", defaultMessage: "Deadlift" },
  { id: "lifting.footer-no-flights", defaultMessage: "No Flights" },
  { id: "lifting.footer-no-lifters", defaultMessage: "No Lifters" },
  { id: "lifting.division-column-width-label", defaultMessage: "Division Column Width" },
  { id: "lifting.records-attempt-1-record-notice", defaultMessage: "{Lift} Record Attempt"},
  { id: "lifting.records-attempt-2-records-notice", defaultMessage: "{Lift1} & {Lift2} Record Attempt"},
  { id: "lifting.records-bench", defaultMessage: "Bench" },
  { id: "lifting.records-official", defaultMessage: "Official" },
  { id: "lifting.records-squat", defaultMessage: "Squat" },
  { id: "lifting.records-total", defaultMessage: "Total" },
  { id: "lifting.records-unofficial", defaultMessage: "Unofficial" },
  { id: "lifting.records-deadlift", defaultMessage: "Deadlift" }
]);

// Strings for the Records page.
strings = strings.concat([
  { id: "records.csv.name", defaultMessage: "Full Name" },
  { id: "records.csv.weight", defaultMessage: "Weight" },
  { id: "records.csv.date", defaultMessage: "Date" },
  { id: "records.csv.location", defaultMessage: "Location" },
  { id: "records.csv.division", defaultMessage: "Division" },
  { id: "records.csv.sex", defaultMessage: "Sex" },
  { id: "records.csv.class", defaultMessage: "Class" },
  { id: "records.csv.equipment", defaultMessage: "Equipment" },
  { id: "records.csv.record-lift", defaultMessage: "Lift" },
  { id: "records.csv.record-type", defaultMessage: "Record Type" },
  { id: "records.example-1.name", defaultMessage: "Elijah Example" },
  { id: "records.example.location", defaultMessage: "Elite Raw Imaginary Powerlifting Fed Worlds 2035" },
  { id: "records.example.date", defaultMessage: "2035-04-05" },
  { id: "records.example.division", defaultMessage: "Open" },
  { id: "records.example-1.sex", defaultMessage: "M" },
  { id: "records.example-1.class", defaultMessage: "66" },
  { id: "records.example-1.equipment", defaultMessage: "Sleeves" },
  { id: "records.example-1.record-lift", defaultMessage: "Total" },
  { id: "records.example-1.record-type", defaultMessage: "Full Power" },
  { id: "records.example-2.name", defaultMessage: "Elsie Example" },
  { id: "records.example-2.sex", defaultMessage: "F" },
  { id: "records.example-2.class", defaultMessage: "84+" },
  { id: "records.example-2.equipment", defaultMessage: "Single-Ply" },
  { id: "records.example-2.record-lift", defaultMessage: "Bench" },
  { id: "records.example-2.record-type", defaultMessage: "Single Lift" },
  { id: "records.export-filename", defaultMessage: "{MeetName}-Records" },
  { id: "records.import.error-name-missing", defaultMessage: "Name must be provided"},
  { id: "records.import.error-division-missing", defaultMessage: "Division must be provided"},
  { id: "records.import.error-division-invalid", defaultMessage: "Division is not recognized. Must be one of {Divisions}"},
  { id: "records.import.error-weight-not-negative", defaultMessage: "Weight cant be negative"},
  { id: "records.total", defaultMessage: "Total" },
  { id: "records.record-type.full-power", defaultMessage: "Full Power" },
  { id: "records.record-type.single-lift", defaultMessage: "Single Lift" },
  { id: "records.template-filename", defaultMessage: "records-template" },
]);

// Strings for the exports records page
strings = strings.concat([
  { id: "records.export.page.column-date", defaultMessage: "Date"},
  { id: "records.export.page.column-location", defaultMessage: "Location"},
  { id: "records.export.page.column-name", defaultMessage: "Name"},
  { id: "records.export.page.column-record-lift", defaultMessage: "Lift"},
  { id: "records.export.page.column-record-type", defaultMessage: "Record Type"},
  { id: "records.export.page.title", defaultMessage: "Powerlifting Records"},
  { id: "records.export.page.column-weight", defaultMessage: "Weight"},
  ]);

// Strings for the Results page.
strings = strings.concat([
  { id: "results.combine-platforms-header", defaultMessage: "Combine Platforms for Day {N}" },
  { id: "results.merge-platform", defaultMessage: "Merge Day {day} Platform {platform}" },
  { id: "results.export-platform", defaultMessage: "Export Day {day} Platform {platform}" },
  { id: "results.merge-error-title", defaultMessage: "Merge Error" },
  { id: "results.best-juniors-lifter", defaultMessage: "Best Juniors Lifter" },
  { id: "results.best-masters-lifter", defaultMessage: "Best Masters Lifter" },
  { id: "results.best-lifter", defaultMessage: "Best Lifter" },
  { id: "results.by-division", defaultMessage: "By Division" },
  { id: "results.all-days-together", defaultMessage: "All Days Together" },
  { id: "results.just-day-n", defaultMessage: "Just Day {N}" },
  { id: "results.platform-export-filename", defaultMessage: "{meetName}-Day-{day}-Platform-{platform}" },
  { id: "results.column-rank", defaultMessage: "Rank" },
  { id: "results.column-sex", defaultMessage: "Sex" },
  { id: "results.column-equipment", defaultMessage: "Equipment" },
  { id: "results.column-age-points", defaultMessage: "Age-Points" },
  { id: "results.value-not-applicable", defaultMessage: "N/A" },
  { id: "results.lifter-disqualified", defaultMessage: "DQ" },
  { id: "results.lifter-guest", defaultMessage: "G" },
  { id: "results.mens", defaultMessage: "Men's" },
  { id: "results.womens", defaultMessage: "Women's" },
  { id: "results.mxs", defaultMessage: "Mx" },
  { id: "results.novice", defaultMessage: "Novice" },
  { id: "results.member", defaultMessage: "Member" },
  { id: "results.combined-sleeves-wraps", defaultMessage: "Sleeves + Wraps" },
  { id: "results.spoken-unit-kilo", defaultMessage: "kilo" },
  { id: "results.spoken-unit-pound", defaultMessage: "pound" },
  { id: "results.division-template", defaultMessage: "{sex} {weightClass} {spokenUnits} {equipment} {division} {event}" },
  { id: "results.category-template", defaultMessage: "{sex} {equipment} {event}" },
]);

/* eslint-enable */

exports.strings = strings;
