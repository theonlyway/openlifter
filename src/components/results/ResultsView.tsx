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

// The parent component of the Results page, contained by the ResultsContainer.

import React from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import CardDeck from "react-bootstrap/CardDeck";
import FormControl from "react-bootstrap/FormControl";

import { saveAs } from "file-saver";

import ByDivision from "./ByDivision";
import ByPoints from "./ByPoints";
import ErrorModal from "../ErrorModal";

import { mergePlatform } from "../../actions/registrationActions";

import { liftingPresentOnPlatform, getWhetherPlatformsHaveLifted } from "../../logic/entry";
import { getString } from "../../logic/strings";
import { exportAsOplCsv } from "../../logic/export/oplcsv";
import { exportAsUSAPLCsv } from "../../logic/export/usapl";

import { Entry, Language } from "../../types/dataTypes";
import { GlobalState } from "../../types/stateTypes";

import styles from "./ResultsView.module.scss";
import { FormControlTypeHack, checkExhausted, assertString } from "../../types/utils";
import { Dispatch } from "redux";

type ResultsBy = "Division" | "Points" | "BestMastersLifter" | "BestJuniorsLifter";

const assertValidResultsBy = (value: string): value is ResultsBy => {
  const resultsBy = value as ResultsBy;
  switch (resultsBy) {
    case "BestJuniorsLifter":
    case "BestMastersLifter":
    case "Division":
    case "Points":
      return true;
    default:
      checkExhausted(resultsBy);
      throw new Error(`Expected a valid value for ResultsBy. Got "${value}"`);
  }
};

interface StateProps {
  global: GlobalState;
  language: Language;
}

interface DispatchProps {
  mergePlatform: (day: number, platform: number, platformEntries: Array<Entry>) => void;
}

type Props = StateProps & DispatchProps;

interface InternalState {
  day: number;
  by: ResultsBy;
  // Controls the ErrorModal popup. Shown when error !== "".
  error: string;
}

// FIXME: Unfortunate use of globals :/ I don't have a better idea.
// This is to pass information from the merge button click handler to the
// file loader click handler.
let globalMergeDay: number = 0;
let globalMergePlatform: number = 0;

class ResultsView extends React.Component<Props, InternalState> {
  constructor(props: Props) {
    super(props);

    this.handleDayChange = this.handleDayChange.bind(this);
    this.handleByChange = this.handleByChange.bind(this);
    this.handleExportAsOplCsvClick = this.handleExportAsOplCsvClick.bind(this);
    this.handleExportAsUSAPLCsvClick = this.handleExportAsUSAPLCsvClick.bind(this);
    this.handleExportPlatformClick = this.handleExportPlatformClick.bind(this);
    this.handleMergePlatformClick = this.handleMergePlatformClick.bind(this);
    this.handleLoadFileInput = this.handleLoadFileInput.bind(this);
    this.closeErrorModal = this.closeErrorModal.bind(this);
    this.makePlatformMergeButtons = this.makePlatformMergeButtons.bind(this);

    this.state = {
      day: 0, // Meaning "all". Flow complained about mixing numbers and strings.
      by: "Division",
      error: "",
    };
  }

  makeDayOptions = () => {
    const language = this.props.language;
    const options = [
      <option key={"all"} value={0}>
        {getString("results.all-days-together", language)}
      </option>,
    ];

    const justDayTemplate = getString("results.just-day-n", language);
    for (let day = 1; day <= this.props.global.meet.lengthDays; day++) {
      options.push(
        <option key={day} value={day}>
          {justDayTemplate.replace("{N}", String(day))}
        </option>
      );
    }
    return options;
  };

  handleDayChange = (event: React.FormEvent<FormControlTypeHack>) => {
    const day = Number(event.currentTarget.value);
    if (this.state.day !== day) {
      this.setState({ day: day });
    }
  };

  handleByChange = (event: React.FormEvent<FormControlTypeHack>) => {
    const by = event.currentTarget.value;
    if (this.state.by !== by && assertString(by) && assertValidResultsBy(by)) {
      this.setState({ by: by });
    }
  };

  handleExportAsOplCsvClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    // TODO: Share this logic with HomeContainer.
    let meetname = this.props.global.meet.name;
    if (meetname === "") {
      meetname = getString("common.unnamed-filename", this.props.language);
    }
    meetname = meetname.replace(/ /g, "-");

    const csv: string = exportAsOplCsv(this.props.global);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    saveAs(blob, meetname + ".opl.csv");
  };

  handleExportAsUSAPLCsvClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    // TODO: Share this logic with handleExportAsOplCsvClick.
    let meetname = this.props.global.meet.name;
    if (meetname === "") {
      meetname = getString("common.unnamed-filename", this.props.language);
    }
    meetname = meetname.replace(/ /g, "-");

    const csv: string = exportAsUSAPLCsv(this.props.global);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    saveAs(blob, meetname + ".USAPL.csv");
  };

  handleExportPlatformClick = (day: number, platform: number, event: Record<string, any>) => {
    // TODO: Share this logic with handleExportAsOplCsvClick.
    const language = this.props.language;
    let meetname = this.props.global.meet.name;
    if (meetname === "") {
      meetname = getString("common.unnamed-filename", language);
    }
    meetname = meetname.replace(/ /g, "-");

    const template = getString("results.platform-export-filename", language);
    const exportname = template
      .replace("{day}", String(day))
      .replace("{platform}", String(platform))
      .replace("{meetName}", meetname);

    const state = JSON.stringify(this.props.global);
    const blob = new Blob([state], { type: "application/json;charset=utf-8" });
    saveAs(blob, exportname + ".export.openlifter");
  };

  // The file input is hidden, and we want to use a button to activate it.
  // This event handler makes a proxy call to the *real* event handler.
  handleMergePlatformClick = (day: number, platform: number, event: Record<string, any>) => {
    const loadHelper = document.getElementById("loadhelper");
    if (loadHelper !== null) {
      globalMergeDay = day;
      globalMergePlatform = platform;
      loadHelper.click();
    }
  };

  // Called when a file is selected for merging platform data.
  handleLoadFileInput = () => {
    const loadHelper = document.getElementById("loadhelper");
    if (loadHelper === null || !(loadHelper instanceof HTMLInputElement) || loadHelper.files === null) {
      return;
    }

    // Get the (day, platform) from global state.
    const day: number = globalMergeDay;
    const platform: number = globalMergePlatform;

    // Remember the props in the onload() closure.
    const props = this.props;
    const language = props.language;

    const rememberThis = this;
    const selectedFile = loadHelper.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      let error: string | null = null;

      // If this occurs, we've introduced a bug when initiating the file reader, or the read failed.
      // Add this check as a guard so the typing is narrowed
      if (typeof reader.result !== "string") {
        window.alert(getString("error.internal-error", language));
        return;
      }

      try {
        const obj: GlobalState = JSON.parse(reader.result);

        // stateVersion must match.
        if (obj.versions.stateVersion !== props.global.versions.stateVersion) {
          const e = getString("error.version-mismatch", language);
          error = e
            .replace("{thisVersion}", props.global.versions.stateVersion)
            .replace("{otherVersion}", obj.versions.stateVersion);
        } else if (obj.meet.name !== props.global.meet.name) {
          // The meet name must match, for sanity checking.
          const e = getString("error.meetname-mismatch", language);
          error = e.replace("{thisName}", props.global.meet.name).replace("{otherName}", obj.meet.name);
        } else if (!liftingPresentOnPlatform(obj.registration.entries, day, platform)) {
          // The meet must actually contain data from the given (day, platform).
          const e = getString("error.no-platform-data", language);
          error = e.replace("{day}", String(day)).replace("{platform}", String(platform));
        } else {
          // Sanity checks passed: fire off a mergePlatform action!
          const platformEntries = obj.registration.entries.filter((e) => {
            return e.day === day && e.platform === platform;
          });
          props.mergePlatform(day, platform, platformEntries);
        }
      } catch (err) {
        error = getString("error.not-json", language);
      }

      if (typeof error === "string") {
        rememberThis.setState({ error: error });
      }
    };
    reader.readAsText(selectedFile);
  };

  closeErrorModal = () => {
    this.setState({ error: "" });
  };

  makePlatformMergeButtons = () => {
    // Array accessed by platformsHaveLifted[day-1][platform-1].
    const platformsHaveLifted: Array<Array<boolean>> = getWhetherPlatformsHaveLifted(
      this.props.global.meet.platformsOnDays,
      this.props.global.registration.entries
    );

    const language = this.props.language;
    const combineTemplate = getString("results.combine-platforms-header", language);
    const mergeTemplate = getString("results.merge-platform", language);
    const exportTemplate = getString("results.export-platform", language);

    const forms = [];
    const numDays = Math.min(this.props.global.meet.lengthDays, platformsHaveLifted.length);

    for (let i = 0; i < numDays; i++) {
      const liftedOnDay = platformsHaveLifted[i];

      const buttons = [];
      for (let j = 0; j < liftedOnDay.length; j++) {
        const lifted = liftedOnDay[j];
        const variant = lifted === true ? "success" : "warning";
        const marginStyle = j > 0 ? { marginLeft: "14px" } : undefined;

        const actionTemplate = lifted === true ? exportTemplate : mergeTemplate;
        buttons.push(
          <Button
            key={i + "-" + j}
            variant={variant}
            style={marginStyle}
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
              lifted === true
                ? this.handleExportPlatformClick(i + 1, j + 1, e)
                : this.handleMergePlatformClick(i + 1, j + 1, e);
            }}
          >
            {actionTemplate.replace("{day}", String(i + 1)).replace("{platform}", String(j + 1))}
          </Button>
        );
      }

      forms.push(
        <div key={i}>
          <div>{combineTemplate.replace("{N}", String(i + 1))}</div>
          <div>{buttons}</div>
          {i < platformsHaveLifted.length - 1 ? <br /> : null}
        </div>
      );
    }

    return forms;
  };

  render() {
    const language = this.props.language;
    let results = null;
    switch (this.state.by) {
      case "Division":
        results = <ByDivision key={this.state.day} day={this.state.day} />;
        break;
      case "Points":
        results = (
          <ByPoints key={this.state.day} day={this.state.day} ageCoefficients="None" agePointsCategory="BestLifter" />
        );
        break;
      case "BestMastersLifter":
        results = (
          <ByPoints
            key={this.state.day}
            day={this.state.day}
            ageCoefficients={this.props.global.meet.ageCoefficients}
            agePointsCategory="BestMastersLifter"
          />
        );
        break;
      case "BestJuniorsLifter":
        results = (
          <ByPoints
            key={this.state.day}
            day={this.state.day}
            ageCoefficients={this.props.global.meet.ageCoefficients}
            agePointsCategory="BestJuniorsLifter"
          />
        );
        break;
      default:
        break;
    }

    let daySelector = null;
    if (this.props.global.meet.lengthDays > 1) {
      daySelector = (
        <FormControl
          value={this.state.day.toString()}
          as="select"
          onChange={this.handleDayChange}
          className={`custom-select ${styles.dropdown}`}
          style={{ marginRight: "15px" }}
        >
          {this.makeDayOptions()}
        </FormControl>
      );
    }

    return (
      <div>
        <ErrorModal
          error={this.state.error}
          title={getString("results.merge-error-title", language)}
          show={this.state.error !== ""}
          close={this.closeErrorModal}
        />

        <CardDeck>
          <Card style={{ marginBottom: "17px" }}>
            <Card.Header>
              <FormattedMessage id="results.merge-platforms-card-header" defaultMessage="Merge Platforms" />
            </Card.Header>
            <Card.Body>
              <div style={{ fontWeight: "bold" }}>
                <FormattedMessage
                  id="results.merge-platforms-warning"
                  defaultMessage="Merging platforms will overwrite data. Please save before merging."
                />
              </div>
              <br />
              {this.makePlatformMergeButtons()}
            </Card.Body>
          </Card>

          <Card style={{ marginBottom: "17px" }}>
            <Card.Header>
              <FormattedMessage id="results.export-results-card-header" defaultMessage="Export Official Results" />
            </Card.Header>
            <Card.Body>
              <Button onClick={this.handleExportAsOplCsvClick}>
                <FormattedMessage
                  id="results.export-openpowerlifting-button"
                  defaultMessage="Export for OpenPowerlifting"
                />
              </Button>

              <Button onClick={this.handleExportAsUSAPLCsvClick} style={{ marginLeft: "14px" }}>
                <FormattedMessage id="results.export-usapl-button" defaultMessage="Export for USAPL" />
              </Button>
            </Card.Body>
          </Card>
        </CardDeck>

        <Card>
          <Card.Header>
            <FormattedMessage id="results.results-card-header" defaultMessage="Results For..." />
          </Card.Header>
          <Card.Body className={styles.controlCard}>
            {daySelector}

            <FormControl
              value={this.state.by}
              as="select"
              onChange={this.handleByChange}
              className={`custom-select ${styles.dropdown}`}
            >
              <option value="Division">{getString("results.by-division", language)}</option>
              {this.props.global.meet.ageCoefficients !== "None" ? (
                <option value="BestJuniorsLifter">{getString("results.best-juniors-lifter", language)}</option>
              ) : null}
              {this.props.global.meet.ageCoefficients !== "None" ? (
                <option value="BestMastersLifter">{getString("results.best-masters-lifter", language)}</option>
              ) : null}
              <option value="Points">{getString("results.best-lifter", language)}</option>
            </FormControl>
          </Card.Body>
        </Card>

        {results}

        <input
          id="loadhelper"
          type="file"
          accept=".openlifter,.openlifter.txt"
          style={{ display: "none" }}
          onChange={this.handleLoadFileInput}
        />
      </div>
    );
  }
}

const mapStateToProps = (state: GlobalState): StateProps => {
  return {
    global: state,
    language: state.language,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  return {
    mergePlatform: (day, platform, platformEntries) => dispatch(mergePlatform(day, platform, platformEntries)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ResultsView);
