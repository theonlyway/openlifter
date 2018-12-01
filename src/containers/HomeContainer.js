// vim: set ts=2 sts=2 sw=2 et:

import React from "react";
import { Button } from 'react-bootstrap';

import LanguageSelector from "../components/translations/LanguageSelector";


const HomeContainer = () => {
  return (
    <div>
      <h1>Welcome to OpenLifter!! (ﾉ◕ヮ◕)ﾉ*:・ﾟ✧</h1>
      <LanguageSelector />
      <p>App Icon Goes Here</p>
      <p>Documentation Link Goes Here</p>
      <ul>
        <li>
          <Button>New Meet (◕ᴥ◕ʋ)</Button>
        </li>
        <li>
          <Button>Load Meet (TODO)</Button>
        </li>
        <li>
          <Button>Save Meet (TODO)</Button>
        </li>
      </ul>
    </div>
  );
};

export default HomeContainer;
