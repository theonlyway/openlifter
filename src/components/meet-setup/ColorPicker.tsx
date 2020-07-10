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

// Defines a widget for selecting a plate color.

import React from "react";
import { ColorResult, TwitterPicker } from "react-color";

import { PlateColors } from "../../constants/plateColors";

import styles from "./ColorPicker.module.scss";
import * as Popper from "react-popper";

interface OwnProps {
  color: string;
  onChange: (color: string) => void;
}

type Props = OwnProps;

interface InternalState {
  displayColorPicker: boolean;
  color: string;

  // Handle returned by setTimeout() for the timeout that closes the color
  // selector popup after the mouse leaves and time has elapsed.
  timeoutId: any;
}

class ColorPicker extends React.Component<Props, InternalState> {
  constructor(props: Props) {
    super(props);

    this.state = {
      displayColorPicker: false,
      color: props.color,
      timeoutId: null,
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleClick = () => {
    clearTimeout(this.state.timeoutId);
    this.setState({ displayColorPicker: !this.state.displayColorPicker, timeoutId: null });
  };

  handleMouseLeave = () => {
    // Close the popup after a second has elapsed.
    // This gives the user a chance to bring the mouse back into the popup.
    const timeoutId = setTimeout(() => {
      this.setState({ displayColorPicker: false, timeoutId: null });
    }, 1000);
    this.setState({ timeoutId: timeoutId });
  };

  handleMouseEnter = () => {
    // Prevent any close-popup timeout from executing.
    if (this.state.timeoutId !== null) {
      clearTimeout(this.state.timeoutId);
      this.setState({ timeoutId: null });
    }
  };

  handleChange = (color: ColorResult, event: any) => {
    // @types/react-color doesn't define an event for onChange but it is published in
    // their documentation: https://casesandberg.github.io/react-color/#api-onChange
    // If the event was a MouseEvent|TouchEvent (i.e they clicked a swatch) we assume
    // that the user wants the panel to close immediately.
    const displayColorPicker = event.clientX === undefined;
    const hex = color.hex.toUpperCase();
    this.setState({ displayColorPicker, color: hex });
    this.props.onChange(hex);
  };

  render() {
    const colors = Object.values(PlateColors);
    let picker = null;
    if (this.state.displayColorPicker) {
      picker = (
        <Popper.Popper placement="bottom-end">
          {({ ref, style, placement }) => (
            <div ref={ref} style={style} className={styles.onTop} data-placement={placement}>
              <TwitterPicker
                color={this.state.color}
                colors={colors}
                triangle="hide"
                onChange={this.handleChange as any}
              />
            </div>
          )}
        </Popper.Popper>
      );
    }

    return (
      <Popper.Manager>
        <div onMouseLeave={this.handleMouseLeave} onMouseEnter={this.handleMouseEnter}>
          <Popper.Reference>
            {({ ref }) => (
              <div ref={ref} className={styles.swatch} onClick={this.handleClick}>
                <div className={styles.color} style={{ background: this.state.color }} />
              </div>
            )}
          </Popper.Reference>
          {picker}
        </div>
      </Popper.Manager>
    );
  }
}

export default ColorPicker;
