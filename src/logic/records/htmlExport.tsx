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
import { Language } from "../../types/dataTypes";
import { ExportedRecordsPage } from "./ExportedRecordsPage";
import translations from "../../translations";
import { IntlProvider } from "react-intl";
import { groupAndSortRecordsIntoCategories } from "./records";
import { isNotUndefined } from "../../types/utils";

export function generateRecordsPageHtml(
  updatedRecords: RecordsState,
  meetState: MeetState,
  language: Language
): string {
  const records = Object.entries(updatedRecords.confirmedRecords)
    .map((kvp) => kvp[1])
    .filter(isNotUndefined);

  const recordCategories = groupAndSortRecordsIntoCategories(records, meetState);
  const messages = (translations as any)[language];
  return ReactDOMServer.renderToString(
    <IntlProvider locale={language} defaultLocale="en" key={language} messages={messages}>
      <ExportedRecordsPage recordCategories={recordCategories} language={language} />
    </IntlProvider>
  );
}
