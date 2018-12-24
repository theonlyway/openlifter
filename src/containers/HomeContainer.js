// vim: set ts=2 sts=2 sw=2 et:

import React from "react";
import { connect } from "react-redux";
import { Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

import saveAs from "file-saver";

import LanguageSelector from "../components/translations/LanguageSelector";

// Temporary CSS, just for prototyping.
const centerConsole = { maxWidth: 800, margin: "0 auto 10px" };
const buttonConsole = { maxWidth: 400, margin: "20px auto 0 auto" };

class HomeContainer extends React.Component {
  constructor() {
    super();
    this.handleLoadClick = this.handleLoadClick.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);
  }

  // The file input is hidden, and we want to use a button to activate it.
  // This event handler is just a proxy to call the *real* event handler.
  handleLoadClick() {
    let loadhelper = document.getElementById("loadhelper");
    loadhelper.click();
  }

  // TODO: Load in the file and overwrite Redux state.

  handleSaveClick() {
    let meetname = this.props.redux.meet.name;
    if (meetname === "") {
      meetname = "OpenLifter";
    }
    meetname = meetname.replace(/ /g, '-');

    let state = JSON.stringify(this.props.redux);
    let blob = new Blob([state], {type: "text/json;charset=utf-8"});
    saveAs(blob, meetname + ".json");
  }

  render() {
    return (
      <div style={centerConsole}>
        <LanguageSelector />
        <h1>Welcome to OpenLifter!! (ﾉ◕ヮ◕)ﾉ*:・ﾟ✧</h1>
        <div style={buttonConsole}>
          <LinkContainer to="/meet-setup">
            <Button bsStyle="primary" bsSize="large" block>
              New Meet
            </Button>
          </LinkContainer>
          <Button bsStyle="warning" bsSize="large" block onClick={this.handleLoadClick}>
            Load from File
          </Button>
          <Button bsStyle="success" bsSize="large" block onClick={this.handleSaveClick}>
            Save to File
          </Button>
        </div>

        <input id="loadhelper" type="file" style={{display: 'none'}} />
      </div>
    );
  };
};

// Because we want to save the state, separate it out specifically
// into a "redux" prop. Otherwise it gets contaminated by other props.
const mapStateToProps = state => ({
  redux: {
    ...state
  }
});

export default connect(
  mapStateToProps,
  null
)(HomeContainer);
