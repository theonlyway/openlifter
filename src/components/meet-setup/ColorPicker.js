// vim: set ts=2 sts=2 sw=2 et:
// @flow
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

// Defines a widget for selecting a plate color.

import React from "react";
import { TwitterPicker } from "react-color";

import { PlateColors } from "../../constants/plateColors";

import styles from "./ColorPicker.module.scss";

interface OwnProps {
  color: string;
  onChange: (color: string) => any;
}

type Props = OwnProps;

interface InternalState {
  displayColorPicker: boolean;
  color: string;
}

class ColorPicker extends React.Component<Props, InternalState> {
  constructor(props: Props) {
    super(props);

    this.state = {
      displayColorPicker: false,
      color: props.color
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false });
  };

  handleChange = (color: Object) => {
    this.setState({ displayColorPicker: false, color: color.rgb });
    this.props.onChange(color.hex.toUpperCase());
  };

  render() {
    const colors = Object.values(PlateColors);

    let picker = null;
    if (this.state.displayColorPicker) {
      picker = (
        <div className={styles.popover}>
          <div className={styles.cover} onClick={this.handleClose} />
          <TwitterPicker color={this.state.color} colors={colors} triangle="hide" onChange={this.handleChange} />
        </div>
      );
    }

    return (
      <div>
        <div className={styles.swatch} onClick={this.handleClick}>
          <div className={styles.color} style={{ background: this.state.color }} />
        </div>
        {picker}
      </div>
    );
  }
}

export default ColorPicker;
