// vim: set ts=2 sts=2 sw=2 et:
//
// The parent component of the Registration page, contained by the RegistrationContainer.

import React from "react";
import { Panel } from "react-bootstrap";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import LifterTable from "../common/LifterTable";
import LifterRow from "./LifterRow";
import NewButton from "./NewButton";

const marginStyle = { margin: "0 40px 0 40px" };

class RegistrationView extends React.Component {
  render() {
    return (
      <div style={marginStyle}>
        <Panel>
          <Panel.Heading>Lifter Registration</Panel.Heading>
          <Panel.Body>
            <LifterTable entries={this.props.registration.entries} rowRenderer={LifterRow} />
            <NewButton />
          </Panel.Body>
        </Panel>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state
});

RegistrationView.propTypes = {
  registration: PropTypes.shape({
    entries: PropTypes.array
  })
};

export default connect(
  mapStateToProps,
  null
)(RegistrationView);
