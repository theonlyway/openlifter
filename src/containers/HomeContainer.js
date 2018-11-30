// vim: set ts=2 sts=2 sw=2 et:

import React from "react";
import LanguageSelector from "../components/translations/LanguageSelector";

const HomeContainer = () => {
  return (
    <div>
      <h1>Welcome to OpenLifter!! (ﾉ◕ヮ◕)ﾉ*:・ﾟ✧</h1>
      <LanguageSelector />
      <p>App Icon Goes Here</p>
      <p>Documentation Link Goes Here</p>
      <ul>
        <li><button>New Meet (◕ᴥ◕ʋ)</button></li>
        <li><button>Load Meet (TODO)</button></li>
        <li><button>Save Meet (TODO)</button></li>
      </ul>
    </div>
  );
};

export default HomeContainer;
