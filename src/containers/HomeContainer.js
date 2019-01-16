// vim: set ts=2 sts=2 sw=2 et:

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

import saveAs from "file-saver";

import LanguageSelector from "../components/translations/LanguageSelector";
import { overwriteStore } from "../actions/globalActions";

// Temporary CSS, just for prototyping.
const centerConsole = { maxWidth: 800, margin: "0 auto 10px" };
const buttonConsole = { maxWidth: 400, margin: "20px auto 0 auto" };

class HomeContainer extends React.Component {
  constructor(props) {
    super(props);
    this.handleLoadClick = this.handleLoadClick.bind(this);
    this.handleLoadFileInput = this.handleLoadFileInput.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);
    this.renderContinueButton = this.renderContinueButton.bind(this);
  }

  // The file input is hidden, and we want to use a button to activate it.
  // This event handler is just a proxy to call the *real* event handler.
  handleLoadClick() {
    const loadhelper = document.getElementById("loadhelper");
    loadhelper.click();
  }

  // Called when a file is selected.
  handleLoadFileInput() {
    const selectedFile = document.getElementById("loadhelper").files[0];
    let rememberThis = this;

    let reader = new FileReader();
    reader.onload = function(event) {
      let errored = false;
      try {
        let obj = JSON.parse(event.target.result);

        // Basic error checking, make sure it's the right format.
        if (
          obj.language === undefined ||
          obj.meet === undefined ||
          obj.registration === undefined ||
          obj.lifting === undefined
        ) {
          errored = true;
        } else {
          rememberThis.props.overwriteStore(obj);
        }
      } catch (err) {
        errored = true;
      }

      if (errored) {
        // TODO: Be a little more helpful.
        window.alert("That didn't look like an OpenLifter file!");
      }
    };
    reader.readAsText(selectedFile);
  }

  handleSaveClick() {
    let meetname = this.props.redux.meet.name;
    if (meetname === "") {
      meetname = "Unnamed-Meet";
    }
    meetname = meetname.replace(/ /g, "-");

    let state = JSON.stringify(this.props.redux);
    let blob = new Blob([state], { type: "application/json;charset=utf-8" });
    saveAs(blob, meetname + ".json");
  }

  renderContinueButton() {
    let meetname = this.props.redux.meet.name;
    if (meetname === "") {
      // Unnamed or unstarted meet, so don't render a continue button
      return;
    }
    return (
      <div style={{ marginBottom: "2rem" }}>
        <h3>In Progress: {meetname}</h3>
        <LinkContainer to="/meet-setup">
          <Button bsStyle="success" bsSize="large" block>
            Continue Current Meet
          </Button>
        </LinkContainer>
      </div>
    );
  }

  render() {
    return (
      <div style={centerConsole}>
        <LanguageSelector />
        <h1>Welcome to OpenLifter Beta!! (ﾉ◕ヮ◕)ﾉ*:・ﾟ✧</h1>
        <div style={buttonConsole}>
          {this.renderContinueButton()}
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

        <input
          id="loadhelper"
          type="file"
          accept=".json"
          style={{ display: "none" }}
          onChange={this.handleLoadFileInput}
        />
      </div>
    );
  }
}

// Because we want to save the state, separate it out specifically
// into a "redux" prop. Otherwise it gets contaminated by other props.
const mapStateToProps = state => ({
  redux: {
    ...state
  }
});

const mapDispatchToProps = dispatch => {
  return {
    overwriteStore: store => dispatch(overwriteStore(store))
  };
};

HomeContainer.propTypes = {
  redux: PropTypes.shape({
    meet: PropTypes.shape({
      name: PropTypes.string
    })
  })
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeContainer);
