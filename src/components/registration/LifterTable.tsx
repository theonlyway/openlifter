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

// Defines the table of LifterRows
// Generalized to accept a rowRenderer component, so that different pages
// can render different row level items, while re-using the logic in this component
// to handle rendering one row per lifter
// This is the parent component that determines how many rows to render,
// what data each row should see, etc.

import React from "react";

import { Entry } from "../../types/dataTypes";

interface OwnProps {
  entries: ReadonlyArray<Entry>;
  rowRenderer: any;
}

type Props = OwnProps;

const LifterTable: React.FC<Props> = (props) => {
  const renderRows = () => {
    const LifterRow = props.rowRenderer;
    const { entries } = props;
    return entries.map((entry) => <LifterRow key={entry.id} id={entry.id} />);
  };

  return <div>{renderRows()}</div>;
};

export default LifterTable;
