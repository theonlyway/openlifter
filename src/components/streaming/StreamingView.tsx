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
import { Language, Validation } from "../../types/dataTypes";
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
import { enableStreaming, setStreamingDatabaseAddress, setStreamingDatabaseType } from "../../actions/streamingActions";
import { getString } from "../../logic/strings";
import ValidatedInput from "../ValidatedInput";

interface StateProps {
  streaming: StreamingState;
  language: Language;
}

interface DispatchProps {
  enableStreaming: (bool: boolean) => void;
  setStreamingDatabaseType: (event: React.BaseSyntheticEvent) => void;
  setStreamingDatabaseAddress: (address: string) => void;
}

type Props = StateProps & DispatchProps;

class StreamingView extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  validateRequiredText = (value?: string): Validation => {
    if (!value) return "warning";
    if (value.includes('"')) return "error";
    return "success";
  };

  render() {
    const language = this.props.language;
    const stringStreamingEnabled = getString("streaming.enabled", language);
    const stringStreamingDisabled = getString("streaming.disabled", language);
    const stringStreamingDatabaseTypeMongoDB = getString("streaming.database.type-mongodb", language);
    const stringStreamingDatabaseAddress = getString("streaming.database.address", language);

    return (
      <Container>
        <Row>
          <Col xs md={this.props.streaming.enabled == true ? 6 : 0}>
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
                    yes={stringStreamingEnabled}
                    no={stringStreamingDisabled}
                  />
                </FormGroup>
                <FormattedMessage
                  id="streaming.settings.notification"
                  defaultMessage="Note: Enabling streaming will require you to configure a connection to a database"
                />
              </Card.Body>
            </Card>
          </Col>
          {this.props.streaming.enabled == true ? (
            <Col md={6}>
              <Card>
                <Card.Header>
                  <FormattedMessage id="streaming.database.configuration" defaultMessage="Database Configuration" />
                </Card.Header>
                <Card.Body>
                  <FormGroup key="streaming.database.type">
                    <Form.Label>
                      <FormattedMessage id="streaming.database.type" defaultMessage="Database type" />
                    </Form.Label>
                    <FormControl
                      as="select"
                      value={this.props.streaming.databaseType}
                      onChange={this.props.setStreamingDatabaseType}
                      className="custom-select"
                    >
                      <option value="mongodb">{stringStreamingDatabaseTypeMongoDB}</option>
                    </FormControl>
                  </FormGroup>
                  {this.props.streaming.databaseType == "mongodb" ? (
                    <React.Fragment>
                      <ValidatedInput
                        label={stringStreamingDatabaseAddress}
                        placeholder={stringStreamingDatabaseAddress}
                        initialValue={this.props.streaming.databaseAddress}
                        validate={this.validateRequiredText}
                        onSuccess={this.props.setStreamingDatabaseAddress}
                        keepMargin={true}
                      />
                      <ValidatedInput
                        label={stringStreamingDatabaseAddress}
                        placeholder={stringStreamingDatabaseAddress}
                        initialValue={this.props.streaming.databaseAddress}
                        validate={this.validateRequiredText}
                        onSuccess={this.props.setStreamingDatabaseAddress}
                        keepMargin={true}
                      />
                      <ValidatedInput
                        label={stringStreamingDatabaseAddress}
                        placeholder={stringStreamingDatabaseAddress}
                        initialValue={this.props.streaming.databaseAddress}
                        validate={this.validateRequiredText}
                        onSuccess={this.props.setStreamingDatabaseAddress}
                        keepMargin={true}
                      />
                    </React.Fragment>
                  ) : null}
                </Card.Body>
              </Card>
            </Col>
          ) : null}
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
  setStreamingDatabaseType: (event) => dispatch(setStreamingDatabaseType(event.currentTarget.value)),
  setStreamingDatabaseAddress: (address: string) => dispatch(setStreamingDatabaseAddress(address)),
});

export default connect(mapStateToProps, mapDispatchToProps)(StreamingView);
