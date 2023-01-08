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
import {
  enableStreaming,
  enableStreamingApiAuthentication,
  setStreamingApiKey,
  setStreamingApiUrl,
} from "../../actions/streamingActions";
import { getString } from "../../logic/strings";
import ValidatedInput from "../ValidatedInput";
import { Button, Modal } from "react-bootstrap";

interface StateProps {
  streaming: StreamingState;
  language: Language;
}

interface DispatchProps {
  enableStreaming: (bool: boolean) => void;
  setStreamingApiUrl: (url: string) => void;
  enableStreamingApiAuthentication: (bool: boolean) => void;
  setStreamingApiKey: (key: string) => void;
}

type Props = StateProps & DispatchProps;

interface LocalState {
  connectionModalShow: boolean;
  connectionStatus: {
    apiStatus: string;
    databaseStatus: string;
    authenticationSuccessful: boolean;
    failureMessage: string | null;
  };
}

class StreamingView extends React.Component<Props, LocalState> {
  constructor(props: Props) {
    super(props);
    this.handleTestApiConnection = this.handleTestApiConnection.bind(this);
    this.renderConnectionModal = this.renderConnectionModal.bind(this);
    this.handleCloseConnectionModal = this.handleCloseConnectionModal.bind(this);
    this.state = {
      connectionModalShow: false,
      connectionStatus: {
        apiStatus: "failed",
        databaseStatus: "failed",
        authenticationSuccessful: false,
        failureMessage: null,
      },
    };
  }

  validateRequiredText = (value?: string): Validation => {
    if (!value) return "warning";
    if (value.includes('"')) return "error";
    return "success";
  };

  handleTestApiConnection = () => {
    this.setState({
      connectionStatus: {
        apiStatus: "failed",
        databaseStatus: "failed",
        authenticationSuccessful: false,
        failureMessage: null,
      },
    });
    let fetchHeaders = {};
    if (this.props.streaming.apiAuthentication == true) {
      fetchHeaders = {
        "x-api-key": this.props.streaming.apiKey,
      };
    }
    fetch(this.props.streaming.apiUrl + "/health", {
      method: "GET",
      headers: fetchHeaders,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.databaseStatus === "ok" && data.apiStatus === "ok") {
          this.setState({
            connectionModalShow: true,
            connectionStatus: {
              apiStatus: "ok",
              databaseStatus: "ok",
              authenticationSuccessful: true,
              failureMessage: null,
            },
          });
        }
        if (data.databaseStatus !== "ok" && data.apiStatus === "ok") {
          this.setState({
            connectionModalShow: true,
            connectionStatus: {
              apiStatus: "ok",
              databaseStatus: "failed",
              authenticationSuccessful: true,
              failureMessage: data.failureMessage,
            },
          });
        }
        if (data.status === 401) {
          this.setState({
            connectionModalShow: true,
            connectionStatus: {
              apiStatus: "failed",
              databaseStatus: "failed",
              authenticationSuccessful: false,
              failureMessage: null,
            },
          });
        } else {
          this.setState({
            connectionModalShow: true,
          });
        }
      })
      .catch((error) => {
        //console.log(error);
        this.setState({ connectionModalShow: true });
      });
  };

  handleCloseConnectionModal = () => {
    this.setState({ connectionModalShow: false });
  };

  renderConnectionModal = () => {
    return (
      <Modal show={this.state.connectionModalShow} onHide={this.handleCloseConnectionModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            <FormattedMessage id="streaming.api.test.connection.modal.title" defaultMessage="API Connection test" />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.state.connectionStatus.authenticationSuccessful == false ? (
            <React.Fragment>
              <FormattedMessage
                id="streaming.api.test.connection.modal.api.status.auth.failure"
                defaultMessage="API authentication failed"
              />
              <br />
            </React.Fragment>
          ) : null}
          {this.state.connectionStatus.apiStatus === "ok" ? (
            <FormattedMessage
              id="streaming.api.test.connection.modal.api.status.success"
              defaultMessage="Connection to API was successful"
            />
          ) : (
            <FormattedMessage
              id="streaming.api.test.connection.modal.api.status.failure"
              defaultMessage="Connection to API failed"
            />
          )}
          <br />
          {this.state.connectionStatus.databaseStatus === "ok" ? (
            <FormattedMessage
              id="streaming.api.test.connection.modal.database.status.success"
              defaultMessage="API connection to database was successful"
            />
          ) : (
            <FormattedMessage
              id="streaming.api.test.connection.modal.database.status.failure"
              defaultMessage="API connection to database failed"
            />
          )}
          {this.state.connectionStatus.failureMessage !== null ? (
            <React.Fragment>
              <br />
              {"API failure message: " + this.state.connectionStatus.failureMessage}
            </React.Fragment>
          ) : null}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={this.handleCloseConnectionModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };
  render() {
    const language = this.props.language;
    const stringStreamingEnabled = getString("streaming.enabled", language);
    const stringStreamingDisabled = getString("streaming.disabled", language);
    const stringApiUrl = getString("streaming.api.url", language);
    const stringApiKey = getString("streaming.api.key", language);

    return (
      <Container>
        <Row>
          <Col xs md={this.props.streaming.streamingEnabled == true ? 6 : 0}>
            <Card>
              <Card.Header>
                <FormattedMessage id="streaming.settings" defaultMessage="Streaming settings" />
              </Card.Header>
              <Card.Body>
                <FormGroup key="streaming-enable">
                  <YesNoButton
                    label={<FormattedMessage id="streaming-enable.header" defaultMessage="Enable Streaming?" />}
                    value={this.props.streaming.streamingEnabled}
                    setValue={this.props.enableStreaming}
                    yes={stringStreamingEnabled}
                    no={stringStreamingDisabled}
                  />
                </FormGroup>
                <FormattedMessage
                  id="streaming.settings.notification"
                  defaultMessage="Note: Enabling streaming will require you to configure a connection to an API endpoint"
                />
              </Card.Body>
            </Card>
          </Col>
          {this.props.streaming.streamingEnabled == true ? (
            <Col md={6}>
              <Card>
                <Card.Header>
                  <FormattedMessage id="streaming.api.configuration" defaultMessage="API configuration" />
                </Card.Header>
                <Card.Body>
                  <ValidatedInput
                    label={stringApiUrl}
                    placeholder={stringApiUrl}
                    initialValue={this.props.streaming.apiUrl}
                    validate={this.validateRequiredText}
                    onSuccess={this.props.setStreamingApiUrl}
                    keepMargin={true}
                  />
                  <FormGroup key="streaming.api.authentication">
                    <YesNoButton
                      label={
                        <FormattedMessage
                          id="streaming.api.authentication.setting"
                          defaultMessage="Enable authentication?"
                        />
                      }
                      value={this.props.streaming.apiAuthentication}
                      setValue={this.props.enableStreamingApiAuthentication}
                      yes={stringStreamingEnabled}
                      no={stringStreamingDisabled}
                    />
                  </FormGroup>
                  {this.props.streaming.apiAuthentication == true ? (
                    <React.Fragment>
                      <ValidatedInput
                        label={stringApiKey}
                        placeholder={stringApiKey}
                        initialValue={this.props.streaming.apiKey}
                        validate={this.validateRequiredText}
                        onSuccess={this.props.setStreamingApiKey}
                        keepMargin={true}
                      />
                    </React.Fragment>
                  ) : null}
                  <div className="d-grid">
                    <Button variant="primary" onClick={this.handleTestApiConnection} style={{ marginTop: "8px" }}>
                      <FormattedMessage id="streaming.api.test.connection" defaultMessage="Test connection" />
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ) : null}
        </Row>
        {this.renderConnectionModal()}
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
  enableStreaming: (bool: boolean) => dispatch(enableStreaming(bool)),
  setStreamingApiUrl: (url: string) => dispatch(setStreamingApiUrl(url)),
  enableStreamingApiAuthentication: (bool: boolean) => dispatch(enableStreamingApiAuthentication(bool)),
  setStreamingApiKey: (key: string) => dispatch(setStreamingApiKey(key)),
});

export default connect(mapStateToProps, mapDispatchToProps)(StreamingView);
