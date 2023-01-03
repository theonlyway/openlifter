/* eslint-disable @typescript-eslint/no-unused-vars */
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

// The parent component of the Results page, contained by the ResultsContainer.

import React from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { Language } from "../../types/dataTypes";
import { GlobalState, StreamingState } from "../../types/stateTypes";
import { Dispatch } from "redux";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import FormGroup from "react-bootstrap/FormGroup";
import Row from "react-bootstrap/Row";
import YesNoButton from "../common/YesNoButton";
import { enableStreaming } from "../../actions/streamingActions";

interface StateProps {
  streaming: StreamingState;
  language: Language;
}

interface DispatchProps {
  enableStreaming: (bool: boolean) => void;
}

type Props = StateProps & DispatchProps;

class StreamingView extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <Container>
        <Row>
          <Col md={6}>
            <Card>
              <Card.Header>
                <FormattedMessage id="streaming.settings" defaultMessage="Streaming settings" />
              </Card.Header>
              <Card.Body>
                <FormGroup key="streaming-enable">
                  <YesNoButton
                    label={<FormattedMessage id="streaming-enable.header" defaultMessage="Enable Streaming?" />}
                    value={this.props.streaming.enabled}
                    setValue={this.props.enableStreaming}
                    yes="Enable"
                    no="Disable"
                  />
                </FormGroup>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card>
              <Card.Header>
                <FormattedMessage id="streaming.database.configuration" defaultMessage="Database Configuration" />
              </Card.Header>
              <Card.Body>something</Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = (state: GlobalState): StateProps => {
  return {
    streaming: state.streaming,
    language: state.language,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  enableStreaming: (bool) => dispatch(enableStreaming(bool)),
});

export default connect(mapStateToProps, mapDispatchToProps)(StreamingView);
