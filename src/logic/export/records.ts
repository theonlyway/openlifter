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

import { RecordsState } from "../../types/stateTypes";
import { Csv, csvString } from "./csv";
import {
  localizeSex,
  localizeEquipment,
  localizeWeightClassStr,
  localizeRecordType,
  localizeRecordLift,
} from "../strings";
import { Language } from "../../types/dataTypes";
import { getRecordCsvMetadata } from "../import/records-csv";

// Exports record data to a CSV file.

export function makeRecordsCsv(recordState: RecordsState, language: Language): string {
  const metadata = getRecordCsvMetadata(language);
  const columnNames = metadata.columnNames;
  const csv = new Csv();

  csv.appendColumns(metadata.allColumns);

  Object.entries(recordState.confirmedRecords).forEach((kvp) => {
    const record = kvp[1];
    if (record !== undefined) {
      const row: Array<string> = new Array(csv.fieldnames.length).fill("");

      row[csv.index(columnNames.name)] = csvString(record.fullName);
      row[csv.index(columnNames.weight)] = csvString(record.weight);
      row[csv.index(columnNames.date)] = csvString(record.date);
      row[csv.index(columnNames.location)] = csvString(record.location);
      row[csv.index(columnNames.division)] = csvString(record.division);
      row[csv.index(columnNames.sex)] = csvString(localizeSex(record.sex, language));
      row[csv.index(columnNames.class)] = csvString(record.weightClass);
      row[csv.index(columnNames.equipment)] = csvString(localizeEquipment(record.equipment, language));
      row[csv.index(columnNames.recordLift)] = csvString(localizeRecordLift(record.recordLift, language));
      row[csv.index(columnNames.recordType)] = csvString(localizeRecordType(record.recordType, language));

      csv.rows.push(row);
    }
  });

  return csv.toString();
}
