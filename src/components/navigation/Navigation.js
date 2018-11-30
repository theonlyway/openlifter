// vim: set ts=2 sts=2 sw=2 et:

import React from "react";
import styled from "styled-components";
import NavigationLinks from "./NavigationLinks";

const NavBarStyled = styled.nav.attrs({
  className: "navbar fixed-top justify-content-start",
  id: "opl-navbar"
})`
  border-top: 1px solid black;
  border-bottom: 1px solid black;
  z-index: 999;
  margin-bottom: 20px;
`;

const Navigation = () => {
  return (
    <NavBarStyled>
      <NavigationLinks />
    </NavBarStyled>
  );
};

export default Navigation;
