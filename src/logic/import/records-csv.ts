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

import { LiftingRecord, Language, Sex, Equipment, RecordLift, RecordType } from "../../types/dataTypes";
import { Csv, validateCsvColumns } from "../export/csv";
import { getString } from "../strings";
import { validateSex, validateEquipment, validateRecordType, validateRecordLift } from "./validation";
import { displayNumber } from "../units";
import { MeetState } from "../../types/stateTypes";

interface RecordsCsvMetadata {
  allColumns: string[];
  mandatoryColumns: string[];
  optionalColumns: string[];

  columnNames: {
    name: string;
    weight: string;
    date: string;
    location: string;
    division: string;
    sex: string;
    class: string;
    equipment: string;
    recordLift: string;
    recordType: string;
  };
}

export function getRecordCsvMetadata(language: Language): RecordsCsvMetadata {
  const col_name = getString("records.csv.name", language);
  const col_weight = getString("records.csv.weight", language);
  const col_date = getString("records.csv.date", language);
  const col_location = getString("records.csv.location", language);
  const col_division = getString("records.csv.division", language);
  const col_sex = getString("records.csv.sex", language);
  const col_class = getString("records.csv.class", language);
  const col_equipment = getString("records.csv.equipment", language);
  const col_record_lift = getString("records.csv.record-lift", language);
  const col_record_type = getString("records.csv.record-type", language);

  return {
    allColumns: [
      col_name,
      col_weight,
      col_date,
      col_location,
      col_division,
      col_sex,
      col_class,
      col_equipment,
      col_record_lift,
      col_record_type,
    ],
    mandatoryColumns: [
      col_name,
      col_weight,
      col_division,
      col_sex,
      col_class,
      col_equipment,
      col_record_lift,
      col_record_type,
    ],
    optionalColumns: [col_date, col_location],
    columnNames: {
      name: col_name,
      weight: col_weight,
      date: col_date,
      location: col_location,
      division: col_division,
      sex: col_sex,
      class: col_class,
      equipment: col_equipment,
      recordLift: col_record_lift,
      recordType: col_record_type,
    },
  };
}

export const makeExampleRecordsCsv = (language: Language): string => {
  const metadata = getRecordCsvMetadata(language);
  const columnNames = metadata.columnNames;
  const csv = new Csv();
  csv.rows = [[], []]; // appendColumns() will resize the dummy rows correctly.
  csv.appendColumns(metadata.allColumns);

  const firstRow = csv.rows[0];
  firstRow[csv.index(columnNames.name)] = getString("records.example-1.name", language);
  firstRow[csv.index(columnNames.weight)] = "350";
  firstRow[csv.index(columnNames.date)] = getString("records.example.date", language);
  firstRow[csv.index(columnNames.location)] = getString("records.example.location", language);
  firstRow[csv.index(columnNames.division)] = getString("records.example.division", language);
  firstRow[csv.index(columnNames.sex)] = getString("records.example-1.sex", language);
  firstRow[csv.index(columnNames.class)] = getString("records.example-1.class", language);
  firstRow[csv.index(columnNames.equipment)] = getString("records.example-1.equipment", language);
  firstRow[csv.index(columnNames.recordLift)] = getString("records.example-1.record-lift", language);
  firstRow[csv.index(columnNames.recordType)] = getString("records.example-1.record-type", language);

  const secondRow = csv.rows[1];
  secondRow[csv.index(columnNames.name)] = getString("records.example-2.name", language);
  secondRow[csv.index(columnNames.weight)] = "125";
  secondRow[csv.index(columnNames.date)] = getString("records.example.date", language);
  secondRow[csv.index(columnNames.location)] = getString("records.example.location", language);
  secondRow[csv.index(columnNames.division)] = getString("records.example.division", language);
  secondRow[csv.index(columnNames.sex)] = getString("records.example-2.sex", language);
  secondRow[csv.index(columnNames.class)] = getString("records.example-2.class", language);
  secondRow[csv.index(columnNames.equipment)] = getString("records.example-2.equipment", language);
  secondRow[csv.index(columnNames.recordLift)] = getString("records.example-2.record-lift", language);
  secondRow[csv.index(columnNames.recordType)] = getString("records.example-2.record-type", language);

  return csv.toString();
};

export const loadRecordsFromCsv = (csv: Csv, meet: MeetState, language: Language): LiftingRecord[] | string => {
  const metadata = getRecordCsvMetadata(language);
  const columnNames = metadata.columnNames;

  const validationError = validateCsvColumns(csv, language, metadata.mandatoryColumns, metadata.optionalColumns);
  if (validationError !== null) {
    return validationError;
  }

  const errprefix_template = getString("error.csv-field-prefix", language);

  const records: LiftingRecord[] = [];
  // The fieldnames are valid! Now we can start building Entries.
  for (let i = 0; i < csv.rows.length; ++i) {
    // Iterate over each field and integrate it into the Entry object.
    const row: Array<string> = csv.rows[i];

    let fullName: string = "";
    let weight: number = 0;
    let date: string = "";
    let location: string = "";
    let division: string = "";
    let sex: Sex = "F";
    let weightClass: string = "";
    let equipment: Equipment = "Sleeves";
    let recordLift: RecordLift = "Total";
    let recordType: RecordType = "FullPower";

    for (let j = 0; j < row.length; ++j) {
      const fieldname = csv.fieldnames[j];
      const cell = row[j];

      // User-visible row number, for error messages.
      // The first row is for the fieldnames, and spreadsheet programs are 1-indexed.
      const rowstr = displayNumber(i + 2, language);

      // Start building the error string early, since it's repeated a lot.
      const errprefix = errprefix_template
        .replace("{cellType}", fieldname)
        .replace("{cellValue}", cell)
        .replace("{rowNumber}", rowstr);

      if (fieldname === columnNames.name) {
        if (cell.trim() === "") {
          return errprefix + getString("records.import.error-name-missing", language);
        } else {
          fullName = cell;
        }
      } else if (fieldname === columnNames.weight) {
        const parsedFloat = Number(cell);
        if (Number.isNaN(parsedFloat)) {
          return errprefix + getString("error.csv-field-suffix-integer", language);
        } else if (parsedFloat < 0) {
          // Can't be negative, but allow 0 to specify an empty/standard record
          return errprefix + getString("records.import.error-weight-not-negative", language);
        }
        weight = parsedFloat;
      } else if (fieldname === columnNames.date) {
        date = cell;
      } else if (fieldname === columnNames.location) {
        location = cell;
      } else if (fieldname === columnNames.division) {
        const rawDiv = cell.trim();
        if (rawDiv === "") {
          return errprefix + getString("records.import.error-division-missing", language);
          // GPC-NZ - Also allow import of the synthetic "Sub Masters" record division, which isn't a real division
        } else if (meet.divisions.indexOf(rawDiv) === -1 && rawDiv !== "Sub Masters") {
          return (
            errprefix +
            getString("records.import.error-division-invalid", language).replace(
              "{Divisions}",
              meet.divisions.join(", ")
            )
          );
        } else {
          division = cell;
        }
      } else if (fieldname === columnNames.sex) {
        const validationResult = validateSex(cell, language, errprefix);
        if (validationResult.result !== null) {
          sex = validationResult.result;
        } else {
          return validationResult.errorMessage;
        }
      } else if (fieldname === columnNames.class) {
        weightClass = cell;
      } else if (fieldname === columnNames.equipment) {
        const validationResult = validateEquipment(cell, language, errprefix);
        if (validationResult.result !== null) {
          equipment = validationResult.result;
        } else {
          return validationResult.errorMessage;
        }
      } else if (fieldname === columnNames.recordLift) {
        const validationResult = validateRecordLift(cell, language, errprefix);
        if (validationResult.result !== null) {
          recordLift = validationResult.result;
        } else {
          return validationResult.errorMessage;
        }
      } else if (fieldname === columnNames.recordType) {
        const validationResult = validateRecordType(cell, language, errprefix);
        if (validationResult.result !== null) {
          recordType = validationResult.result;
        } else {
          return validationResult.errorMessage;
        }
      }
    }

    //TODO: Validate weight class against sex of record & allowed weight classes in meet

    records.push({
      fullName,
      weight,
      date,
      location,
      division,
      sex,
      weightClass,
      equipment,
      recordLift,
      recordType,
    });
  }
  return records;
};
