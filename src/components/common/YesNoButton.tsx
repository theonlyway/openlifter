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
//
// This is a split Yes/No button

import React, { FunctionComponent } from "react";
import Form from "react-bootstrap/Form";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";

interface Props {
  value: boolean;
  setValue: (bool: boolean) => void;
  label: JSX.Element | string;
  yes: string;
  no: string;
}

const YesNoButton: FunctionComponent<Props> = (props) => {
  return (
    <Form.Group>
      <Form.Label>{props.label}</Form.Label>
      <ButtonGroup style={{ width: "100%" }}>
        <Button active={!props.value} variant="outline-secondary" onClick={() => props.setValue(false)}>
          {props.no}
        </Button>
        <Button active={props.value} variant="outline-secondary" onClick={() => props.setValue(true)}>
          {props.yes}
        </Button>
      </ButtonGroup>
    </Form.Group>
  );
};

export default YesNoButton;
