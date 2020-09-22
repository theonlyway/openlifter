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

import { RecordsState, MeetState } from "../../types/stateTypes";
import ReactDOMServer from "react-dom/server";
import React from "react";
import { LiftingRecord, RecordLift, Equipment, RecordType, Sex, Language } from "../../types/dataTypes";
import { checkExhausted, isNotUndefined } from "../../types/utils";
import { ExportedRecordsPage } from "./ExportedRecordsPage";
import translations from "../../translations";
import { IntlProvider } from "react-intl";

export interface RecordCategory {
  sex: Sex;
  division: string;
  weightClass: string;
  equipment: Equipment;
}

export interface RecordCategoryGrouping {
  category: RecordCategory;
  records: LiftingRecord[];
}

function makeCategory(record: LiftingRecord): RecordCategory {
  const category: RecordCategory = {
    sex: record.sex,
    division: record.division,
    weightClass: record.weightClass,
    equipment: record.equipment,
  };
  return category;
}

function makeKey(category: RecordCategory): string {
  return `${category.sex}-${category.division}-${category.weightClass}-${category.equipment}`;
}

function getLiftSortOrder(lift: RecordLift): number {
  if (lift === "S") return 0;
  if (lift === "B") return 1;
  if (lift === "D") return 2;
  if (lift === "Total") return 3;
  checkExhausted(lift);
  return -1;
}

function getSexSortOrder(sex: Sex): number {
  if (sex === "M") return 0;
  if (sex === "F") return 1;
  if (sex === "Mx") return 2;
  checkExhausted(sex);
  return -1;
}

function getRecordTypeSortOrder(recordType: RecordType): number {
  if (recordType === "FullPower") return 0;
  if (recordType === "SingleLift") return 1;
  checkExhausted(recordType);
  return -1;
}

function getEquipmentSortOrder(equipment: Equipment): number {
  if (equipment === "Bare") return 0;
  if (equipment === "Sleeves") return 1;
  if (equipment === "Wraps") return 2;
  if (equipment === "Single-ply") return 3;
  if (equipment === "Multi-ply") return 4;
  if (equipment === "Unlimited") return 5;
  checkExhausted(equipment);
  return -1;
}

function getWeightClassSortOrder(weightClassString: string): number {
  const isSHW = weightClassString.endsWith("+");
  if (isSHW) {
    return Number.POSITIVE_INFINITY;
  }

  const asNumber = Number(weightClassString.replace("+", ""));
  return asNumber;
}

function compareCategory(a: RecordCategory, b: RecordCategory, divisions: readonly string[]): number {
  if (a.sex !== b.sex) {
    return getSexSortOrder(a.sex) - getSexSortOrder(b.sex);
  }
  if (a.equipment !== b.equipment) {
    return getEquipmentSortOrder(a.equipment) - getEquipmentSortOrder(b.equipment);
  }
  if (a.division !== b.division) {
    return divisions.indexOf(a.division) - divisions.indexOf(b.division);
  }
  if (a.weightClass !== b.weightClass) {
    return getWeightClassSortOrder(a.weightClass) - getWeightClassSortOrder(b.weightClass);
  }

  return 0;
}

function compareRecords(a: LiftingRecord, b: LiftingRecord): number {
  if (a.recordType !== b.recordType) {
    return getRecordTypeSortOrder(a.recordType) - getRecordTypeSortOrder(b.recordType);
  }

  if (a.recordLift !== b.recordLift) {
    return getLiftSortOrder(a.recordLift) - getLiftSortOrder(b.recordLift);
  }

  return 0;
}

// Takes all records, groups them into categories and then sorts the categories. This effectively controls the order the records are rendered
function groupRecordsIntoCategories(records: LiftingRecord[], meetState: MeetState): RecordCategoryGrouping[] {
  // Group all records into categories of sex, division, class, equipment, recordType

  const unSortedCategories = new Map<string, LiftingRecord[]>();
  records.forEach((record) => {
    const key = makeKey(record);
    let recordsInCategory = unSortedCategories.get(key);
    if (recordsInCategory === undefined) {
      recordsInCategory = [];
      unSortedCategories.set(key, recordsInCategory);
    }
    recordsInCategory.push(record);
  });

  // Now that all categories have records, within each category sort the records based on their lift & Type (S,B,D,T order), Full Power first
  for (const records of unSortedCategories.values()) {
    records.sort((a, b) => compareRecords(a, b));
  }

  // Ditch the map. Flatten it out into an array, which we'll sort
  const categories: RecordCategoryGrouping[] = [];
  unSortedCategories.forEach((records) => {
    const category = makeCategory(records[0]);
    categories.push({
      category,
      records,
    });
  });

  // Now sort the categories
  categories.sort((a, b) => compareCategory(a.category, b.category, meetState.divisions));

  return categories;
}

export function generateRecordsPageHtml(
  updatedRecords: RecordsState,
  meetState: MeetState,
  language: Language
): string {
  const records = Object.entries(updatedRecords.confirmedRecords)
    .map((entry) => entry[1])
    .filter(isNotUndefined);

  const recordCategories = groupRecordsIntoCategories(records, meetState);
  const messages = (translations as any)[language];
  return ReactDOMServer.renderToString(
    <IntlProvider locale={language} defaultLocale="en" key={language} messages={messages}>
      <ExportedRecordsPage recordCategories={recordCategories} language={language} />
    </IntlProvider>
  );
}
