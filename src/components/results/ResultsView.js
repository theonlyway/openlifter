// vim: set ts=2 sts=2 sw=2 et:
// @flow
//
// The parent component of the Results page,
// contained by the ResultsContainer.

import React from "react";
import { connect } from "react-redux";
import { FormControl, Panel } from "react-bootstrap";

import type { Entry } from "../../reducers/registrationReducer";

import styles from "./ResultsView.module.scss";

const marginStyle = { margin: "0 20px 0 20px" };

type Props = {
  meetName: string,
  formula: string,
  lengthDays: number,
  weightClassesKgMen: Array<number>,
  weightClassesKgWomen: Array<number>,
  entries: Array<Entry>
};

type State = {
  day: number | "all"
};

class ResultsView extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.handleDayChange = this.handleDayChange.bind(this);

    this.state = {
      day: "all"
    };
  }

  makeDayOptions = () => {
    let options = [
      <option key={"all"} value={"all"}>
        All Days Together
      </option>
    ];
    for (let day = 1; day < this.props.lengthDays; day++) {
      options.push(
        <option key={day} value={day}>
          Just Day {day}
        </option>
      );
    }
    return options;
  };

  handleDayChange = event => {
    const day = event.target.value;
    if (this.state.day !== day) {
      this.setState({ day: day });
    }
  };

  render() {
    return (
      <div style={marginStyle}>
        <Panel bsStyle="info">
          <Panel.Heading>Results For...</Panel.Heading>
          <Panel.Body className={styles.controlPanel}>
            <FormControl
              defaultValue={this.state.day}
              componentClass="select"
              onChange={this.handleDayChange}
              className={styles.dropdown}
            >
              {this.makeDayOptions()}
            </FormControl>
          </Panel.Body>
        </Panel>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    meetName: state.meet.name,
    formula: state.meet.formula,
    lengthDays: state.meet.lengthDays,
    weightClassesKgMen: state.meet.weightClassesKgMen,
    weightClassesKgWomen: state.meet.weightClassesKgWomen,
    entries: state.registration.entries
  };
};

export default connect(
  mapStateToProps,
  null
)(ResultsView);
