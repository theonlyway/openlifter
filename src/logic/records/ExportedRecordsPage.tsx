import React from "react";
import { LiftingRecord, Language } from "../../types/dataTypes";
import { exportedRecordsPageCss } from "./ExportedRecordsPage.css";
import { localizeEquipment, localizeRecordType, localizeRecordLift, localizeSexPlural } from "../strings";
import { FormattedMessage } from "react-intl";
import { logoData } from "./ExportedRecordsPageLogo";
import { RecordCategoryGrouping } from "./records";

interface Props {
  recordCategories: RecordCategoryGrouping[];
  language: Language;
}

export class ExportedRecordsPage extends React.Component<Props, {}> {
  render() {
    return (
      <html>
        <head>
          <title>
            <FormattedMessage id="records.export.page.title" defaultMessage="Powerlifting Records" />
          </title>
          <style>{exportedRecordsPageCss}</style>
        </head>
        <body>
          <div className="recordsPage">
            <div className="logoContainer">
              <img src={logoData} className="responsiveImage"></img>
            </div>

            <p className="recordsPageTitle">
              <FormattedMessage id="records.export.page.title" defaultMessage="Powerlifting Records" />
            </p>
            {this.props.recordCategories.map((category, index) => this.renderCategory(category, index))}
          </div>
        </body>
      </html>
    );
  }

  renderCategory(grouping: RecordCategoryGrouping, index: number) {
    const category = grouping.category;
    const language = this.props.language;
    const localizedSex = localizeSexPlural(category.sex, language);
    const localizedEquipment = localizeEquipment(category.equipment, language);
    return (
      <div key={index} className="recordCategory">
        <p className="categoryHeading">
          {localizedSex} {localizedEquipment} - {category.division} {category.weightClass}
        </p>
        <table>
          <thead>
            <tr>
              <th className="mediumColumn">
                <FormattedMessage id="records.export.page.column-record-type" defaultMessage="Record Lift" />
              </th>
              <th className="tinyColumn">
                <FormattedMessage id="records.export.page.column-weight" defaultMessage="Weight" />
              </th>
              <th className="tinyColumn">
                <FormattedMessage id="records.export.page.column-record-lift" defaultMessage="Lift" />
              </th>
              <th className="largeColumn">
                <FormattedMessage id="records.export.page.column-name" defaultMessage="Name" />
              </th>
              <th className="smallColumn">
                <FormattedMessage id="records.export.page.column-date" defaultMessage="Date" />
              </th>
              <th className="largeColumn">
                <FormattedMessage id="records.export.page.column-location" defaultMessage="Location" />
              </th>
            </tr>
          </thead>
          <tbody>{grouping.records.map((record, index) => this.renderRecord(record, index))}</tbody>
        </table>
      </div>
    );
  }

  renderRecord(record: LiftingRecord, index: number) {
    return (
      <tr key={index}>
        <td>{localizeRecordType(record.recordType, this.props.language)}</td>
        <td>{record.weight}</td>
        <td>{localizeRecordLift(record.recordLift, this.props.language)}</td>
        <td>{record.fullName}</td>
        <td>{record.date}</td>
        <td>{record.location}</td>
      </tr>
    );
  }
}
