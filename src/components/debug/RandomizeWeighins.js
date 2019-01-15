// vim: set ts=2 sts=2 sw=2 et:
//
// Randomizes the Registration page, for debugging.

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Button } from "react-bootstrap";

import { randomInt, randomFixedPoint } from "./RandomizeHelpers";

import { updateRegistration } from "../../actions/registrationActions";
import { enterAttempt } from "../../actions/liftingActions";

class RandomizeWeighinsButton extends React.Component {
  constructor(props) {
    super(props);
    this.randomizeWeighins = this.randomizeWeighins.bind(this);
  }

  randomAttempt() {
    const multiple = 2.5;
    return Math.floor(randomFixedPoint(25, 360, 1) / multiple) * multiple;
  }

  randomizeWeighins() {
    const entries = this.props.registration.entries;

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];

      // Get a random bodyweight.
      // ==========================================
      const bodyweightKg = randomFixedPoint(20, 150, 1);
      this.props.updateRegistration(entry.id, {
        bodyweightKg: bodyweightKg
      });

      // Get a random age.
      const age = randomInt(5, 79);
      this.props.updateRegistration(entry.id, {
        age: age
      });

      // Figure out which events we're generating information for.
      // ==========================================
      let hasSquat = false;
      let hasBench = false;
      let hasDeadlift = false;
      for (let j = 0; j < entry.events.length; j++) {
        const e = entry.events[j];
        if (e.includes("S")) {
          hasSquat = true;
        }
        if (e.includes("B")) {
          hasBench = true;
        }
        if (e.includes("D")) {
          hasDeadlift = true;
        }
      }

      // Set attempts.
      // ==========================================
      if (hasSquat) {
        this.props.enterAttempt(entry.id, "S", 1, this.randomAttempt());
      }
      if (hasBench) {
        this.props.enterAttempt(entry.id, "B", 1, this.randomAttempt());
      }
      if (hasDeadlift) {
        this.props.enterAttempt(entry.id, "D", 1, this.randomAttempt());
      }

      // Set rack info.
      // ==========================================
      if (hasSquat) {
        const height = String(randomInt(2, 18));
        const pos = Math.random() < 0.9 ? "out" : "in";
        this.props.updateRegistration(entry.id, {
          squatRackInfo: height + pos
        });
      }

      if (hasBench) {
        const height = String(randomInt(0, 12));
        const safety = String(randomInt(0, 4));
        this.props.updateRegistration(entry.id, {
          benchRackInfo: height + "/" + safety
        });
      }
    }
  }

  render() {
    return <Button onClick={this.randomizeWeighins}>Weigh-ins</Button>;
  }
}

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => {
  return {
    updateRegistration: (entryId, obj) => dispatch(updateRegistration(entryId, obj)),
    enterAttempt: (entryId, lift, attemptOneIndexed, weightKg) =>
      dispatch(enterAttempt(entryId, lift, attemptOneIndexed, weightKg))
  };
};

RandomizeWeighinsButton.propTypes = {
  meet: PropTypes.shape({}),
  registration: PropTypes.shape({
    entries: PropTypes.array.isRequired
  }),
  updateRegistration: PropTypes.func.isRequired,
  enterAttempt: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RandomizeWeighinsButton);
