// vim: set ts=2 sts=2 sw=2 et:
//
// Defines the Navigation component for navigating between pages using react-router.

import React from "react";
import { Navbar, Nav, NavItem } from "react-bootstrap";

// The LinkContainer is used to wrap Components that change the URL,
// hooking them up with the Router.
import { LinkContainer } from "react-router-bootstrap";

const Navigation = () => {
  return (
    <Navbar>
      <Navbar.Brand>OpenLifter</Navbar.Brand>

      {/* Navbar uses Toggle and Collapse to automatically create a hamburger menu
          in case of overflow on small screens.*/}
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Nav>
          <LinkContainer exact to="/">
            <NavItem eventKey={1}>Home</NavItem>
          </LinkContainer>
          <LinkContainer to="/meet-setup">
            <NavItem eventKey={2}>Meet Setup</NavItem>
          </LinkContainer>
          <LinkContainer to="/examples">
            <NavItem eventKey={3}>Examples</NavItem>
          </LinkContainer>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Navigation;
