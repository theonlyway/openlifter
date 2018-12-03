// vim: set ts=2 sts=2 sw=2 et:

import React from "react";
import { Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

import LanguageSelector from "../components/translations/LanguageSelector";

// Temporary CSS, just for prototyping.
const centerConsole = { maxWidth: 800, margin: "0 auto 10px" };
const buttonConsole = { maxWidth: 400, margin: "20px auto 0 auto" };

const HomeContainer = () => {
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
        <Button bsStyle="warning" bsSize="large" block disabled>
          Load Meet (TODO)
        </Button>
        <Button bsStyle="success" bsSize="large" block disabled>
          Save Meet (TODO)
        </Button>
      </div>
    </div>
  );
};

export default HomeContainer;