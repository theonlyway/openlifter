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

// Defines the MeetDate date picker.

import React from "react";
import { connect } from "react-redux";
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import { FormattedMessage } from "react-intl";

import Form from "react-bootstrap/Form";
import FormGroup from "react-bootstrap/FormGroup";

import { setMeetDate } from "../../actions/meetSetupActions";
import { iso8601ToLocalDate, localDateToIso8601 } from "../../logic/date";

import { GlobalState } from "../../types/stateTypes";
import { Language } from "../../types/dataTypes";
import { Dispatch } from "redux";

// The react-datepicker gets locale information from the "date-fns" package.
// In order for it to understand what our Languages are, we have to register
// those locales. The react-datepicker provides a helper function to do this.
import de from "date-fns/locale/de";
import el from "date-fns/locale/el";
import eo from "date-fns/locale/eo";
import es from "date-fns/locale/es";
import et from "date-fns/locale/et";
import fr from "date-fns/locale/fr";
import hr from "date-fns/locale/hr";
import it from "date-fns/locale/it";
import lt from "date-fns/locale/lt";
import nl from "date-fns/locale/nl";
import pt from "date-fns/locale/pt";
import ru from "date-fns/locale/ru";
import tr from "date-fns/locale/tr";
import uk from "date-fns/locale/uk";
import zh_CN from "date-fns/locale/zh-CN";

// Register the date-fns/locales with the DatePicker.
registerLocale("de", de);
registerLocale("el", el);
registerLocale("eo", eo);
registerLocale("es", es);
registerLocale("et", et);
registerLocale("fr", fr);
registerLocale("hr", hr);
registerLocale("it", it);
registerLocale("lt", lt);
registerLocale("nl", nl);
registerLocale("pt", pt);
registerLocale("ru", ru);
registerLocale("tr", tr);
registerLocale("uk", uk);
registerLocale("zh-Hans", zh_CN);

interface StateProps {
  date: string;
  language: Language;
}

interface DispatchProps {
  setMeetDate: (date: Date) => void;
}

type Props = StateProps & DispatchProps;

class MeetDate extends React.Component<Props> {
  render() {
    // The DatePicker manipulates a Date object in local time.
    const initialDate: Date = iso8601ToLocalDate(this.props.date);

    return (
      <FormGroup>
        <Form.Label>
          <FormattedMessage id="meet-setup.start-date" defaultMessage="Start Date" />
        </Form.Label>
        <div style={{ textAlign: "center" }}>
          <DatePicker
            dateFormat="yyyy-MM-dd"
            selected={initialDate}
            onChange={this.props.setMeetDate}
            inline
            locale={this.props.language}
          />
        </div>
      </FormGroup>
    );
  }
}

const mapStateToProps = (state: GlobalState): StateProps => ({
  date: state.meet.date,
  language: state.language,
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  return {
    setMeetDate: (date) => {
      dispatch(setMeetDate(localDateToIso8601(date)));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MeetDate);
