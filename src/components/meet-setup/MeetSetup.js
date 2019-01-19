// vim: set ts=2 sts=2 sw=2 et:
// @flow

import React from "react";
import { connect } from "react-redux";
import { Grid, Col, Row, Panel } from "react-bootstrap";

import MeetName from "./MeetName";
import MeetDate from "./MeetDate";
import MeetLength from "./MeetLength";
import MeetLocation from "./MeetLocation";
import PlatformCounts from "./PlatformCounts";
import InKg from "./InKg";
import FormulaSelect from "./FormulaSelect";
import FederationSelect from "./FederationSelect";
import DivisionSelect from "./DivisionSelect";
import WeightClassesSelect from "./WeightClassesSelect";
import AreWrapsRaw from "./AreWrapsRaw";
import BarAndCollarsWeightKg from "./BarAndCollarsWeightKg";
import Plates from "./Plates";

type Props = {
  inKg: boolean
};

class MeetSetup extends React.Component<Props> {
  render() {

    // This is used as a key to force unit-dependent components to re-initialize state.
    const inKg = this.props.inKg;

    return (
      <Grid>
        <Row>
          <Col md={4}>
            <Panel bsStyle="info">
              <Panel.Heading>Sanction Information</Panel.Heading>
              <Panel.Body>
                <MeetName />
                <MeetLocation />
                <FederationSelect />
                <MeetDate />
                <MeetLength />
                <PlatformCounts />
              </Panel.Body>
            </Panel>
          </Col>

          <Col md={4}>
            <Panel>
              <Panel.Heading>Competition Rules</Panel.Heading>
              <Panel.Body>
                <DivisionSelect />
                <WeightClassesSelect sex="M" label="Men's Weight Classes (kg), omit SHW" />
                <WeightClassesSelect sex="F" label="Women's Weight Classes (kg), omit SHW" />
                <FormulaSelect />
                <AreWrapsRaw />
              </Panel.Body>
            </Panel>
          </Col>

          <Col md={4}>
            <Panel bsStyle="info">
              <Panel.Heading>Weights and Loading Setup</Panel.Heading>
              <Panel.Body>
                <InKg />
                <BarAndCollarsWeightKg key={inKg} />
                <Plates />
              </Panel.Body>
            </Panel>
          </Col>
        </Row>
      </Grid>
    );
  }
}

const mapStateToProps = state => ({
  inKg: state.meet.inKg
});

export default connect(
  mapStateToProps,
  null
)(MeetSetup);
