// vim: set ts=2 sts=2 sw=2 et:

import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import LanguageSelector from "../translations/LanguageSelector";

const NavbarHolder = styled.div.attrs({
  id: "navbarSupportedContent"
})`
  margin-bottom: -1rem;
  height: 60px;
`;

const Navbar = styled.ul.attrs({
  className: "navbar-nav mr-auto"
})`
  padding-left: 0px;
`;

const NavLink = styled(Link).attrs({ className: "nav-link" })`
  font-size: 1.125rem !important;
  padding: 1rem !important;
  text-decoration: none !important;
  color: black;
`;

const NavigationLinks = () => {
  return (
    <NavbarHolder>
      <Navbar>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/configure-meet">Meet Configuration</NavLink>
        <NavLink to="/examples">Examples</NavLink>
        <LanguageSelector />
      </Navbar>
    </NavbarHolder>
  );
};

export default NavigationLinks;
