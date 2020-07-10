// vim: set ts=2 sts=2 sw=2 et:
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

// This provides an alternative interface to react-intl's <FormattedMessage/>.
//
// FormattedMessage defines a *new* internationalizable message.
// In contrast, LocalizedString fetches an *existing* message from the same store
// and reports it as a simple string (with no formatting or parsing).
//
// This enables reuse of translations, so long as the IDs are stable.

import React from "react";
import { IntlContext } from "react-intl";

import { TranslationId } from "../../types/dataTypes";

interface OwnProps {
  id: TranslationId; // As listed in 'src/translations/en.json'.
}

type Props = OwnProps;

class LocalizedString extends React.Component<Props> {
  render() {
    return (
      <IntlContext.Consumer>
        {(intl) => {
          return intl.messages[this.props.id];
        }}
      </IntlContext.Consumer>
    );
  }
}

export default LocalizedString;
