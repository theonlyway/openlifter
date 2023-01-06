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

// Provides widgets that overwrite rules with federation defaults.

import React from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import FormGroup from "react-bootstrap/FormGroup";

import { getString } from "../../logic/strings";

import { updateMeet } from "../../actions/meetSetupActions";

import { GlobalState, MeetState } from "../../types/stateTypes";
import { Language } from "../../types/dataTypes";
import { checkExhausted } from "../../types/utils";
import { Dispatch } from "redux";

interface StateProps {
  federation: string;
  language: Language;
}

interface DispatchProps {
  updateMeet: (changes: Partial<MeetState>) => void;
}

interface OwnProps {
  // Used by the MeetSetup component to cause component updates.
  onChange: () => void;
}

type Props = StateProps & DispatchProps & OwnProps;

type AutoFillOption =
  | "Traditional"
  | "365Strong"
  | "BP"
  | "GPC"
  | "RPS"
  | "SPF"
  | "UPA"
  | "USAPL"
  | "USPA"
  | "USPC"
  | "WABDL"
  | "WP"
  | "WPC"
  | "WPPO"
  | "WRPF";

interface InternalState {
  selectedOption: AutoFillOption;
}

const traditionalDefaults: Partial<MeetState> = {
  divisions: [
    "Open",
    "Youth",
    "T13-15",
    "T16-17",
    "T18-19",
    "J20-23",
    "S35-39",
    "M40-44",
    "M45-49",
    "M50-54",
    "M55-59",
    "M60-64",
    "M65-69",
    "M70-74",
    "M75-79",
    "M80+",
  ],
  weightClassesKgMen: [52, 56, 60, 67.5, 75, 82.5, 90, 100, 110, 125, 140],
  weightClassesKgWomen: [44, 48, 52, 56, 60, 67.5, 75, 82.5, 90],
  weightClassesKgMx: [52, 56, 60, 67.5, 75, 82.5, 90, 100, 110, 125, 140],
  formula: "Wilks",
  ageCoefficients: "FosterMcCulloch",
  combineSleevesAndWraps: false,
  combineSingleAndMulti: false,
  allow4thAttempts: true,
};

const _365strongDefaults: Partial<MeetState> = {
  divisions: [
    "J-T",
    "J-U",
    "M1-T",
    "M1-U",
    "M2-T",
    "M2-U",
    "M3-T",
    "M3-U",
    "M4-T",
    "M4-U",
    "M5-T",
    "M5-U",
    "M6-T",
    "M6-U",
    "M7-T",
    "M7-U",
    "M8-T",
    "M8-U",
    "M9-T",
    "M9-U",
    "MPF-T",
    "MPF-U",
    "N-X",
    "O-T",
    "O-U",
    "S-T",
    "S-U",
    "T1-X",
    "T2-X",
    "T3-X",
    "Y-X",
  ],
  weightClassesKgMen: [52, 56, 60, 67.5, 75, 82.5, 90, 100, 110, 125, 140],
  weightClassesKgWomen: [44, 48, 52, 56, 60, 67.5, 75, 82.5, 90],
  weightClassesKgMx: [52, 56, 60, 67.5, 75, 82.5, 90, 100, 110, 125, 140],
  formula: "Wilks",
  ageCoefficients: "FosterMcCulloch",
  combineSleevesAndWraps: false,
  combineSingleAndMulti: false,
  allow4thAttempts: true,
};

const bpDefaults: Partial<MeetState> = {
  divisions: [
    "MR-O",
    "MR-Sj",
    "MR-Jr",
    "MR-M1",
    "MR-M2",
    "MR-M3",
    "MR-M4",
    "MR-M5",
    "MR-G",
    "FR-O",
    "FR-Sj",
    "FR-Jr",
    "FR-M1",
    "FR-M2",
    "FR-M3",
    "FR-M4",
    "FR-M5",
    "FR-G",
    "M-O",
    "M-Sj",
    "M-Jr",
    "M-M1",
    "M-M2",
    "M-M3",
    "M-M4",
    "M-M5",
    "M-G",
    "F-O",
    "F-Sj",
    "F-Jr",
    "F-M1",
    "F-M2",
    "F-M3",
    "F-M4",
    "F-M5",
    "F-G",
  ],
  weightClassesKgMen: [53, 59, 66, 74, 83, 93, 105, 120],
  weightClassesKgWomen: [43, 47, 52, 57, 63, 69, 76, 84],
  weightClassesKgMx: [53, 59, 66, 74, 83, 93, 105, 120],
  formula: "IPF GL Points",
  ageCoefficients: "FosterMcCulloch",
  combineSleevesAndWraps: false,
  combineSingleAndMulti: false,
  allow4thAttempts: false,
};

const gpcDefaults: Partial<MeetState> = {
  divisions: [
    "F-JE",
    "F-JR",
    "F-M1E",
    "F-M1R",
    "F-M2E",
    "F-M2R",
    "F-M3E",
    "F-M3R",
    "F-M4E",
    "F-M4R",
    "F-M5E",
    "F-M5R",
    "F-M6E",
    "F-M6R",
    "F-M7E",
    "F-M7R",
    "F-M8E",
    "F-M8R",
    "F-M9E",
    "F-M9R",
    "F-OE",
    "F-OR",
    "F-SME",
    "F-SMR",
    "F-T1E",
    "F-T1R",
    "F-T2E",
    "F-T2R",
    "F-T3E",
    "F-T3R",
    "M-JE",
    "M-JR",
    "M-M1E",
    "M-M1R",
    "M-M2E",
    "M-M2R",
    "M-M3E",
    "M-M3R",
    "M-M4E",
    "M-M4R",
    "M-M5E",
    "M-M5R",
    "M-M6E",
    "M-M6R",
    "M-M7E",
    "M-M7R",
    "M-M8E",
    "M-M8R",
    "M-M9E",
    "M-M9R",
    "M-OE",
    "M-OR",
    "M-SME",
    "M-SMR",
    "M-T1E",
    "M-T1R",
    "M-T2E",
    "M-T2R",
    "M-T3E",
    "M-T3R",
  ],
  weightClassesKgMen: [56, 60, 67.5, 75, 82.5, 90, 100, 110, 125, 140],
  weightClassesKgWomen: [44, 48, 52, 56, 60, 67.5, 75, 82.5, 90, 110],
  weightClassesKgMx: [56, 60, 67.5, 75, 82.5, 90, 100, 110, 125, 140],
  formula: "Glossbrenner",
  ageCoefficients: "FosterMcCulloch",
  combineSleevesAndWraps: true,
  combineSingleAndMulti: true,
  allow4thAttempts: true,
};

const rpsDefaults: Partial<MeetState> = {
  divisions: [
    // Raw Classic (Bare), Amateur.
    "RC-Y-A",
    "RC-T14-A",
    "RC-T16-A",
    "RC-T18-A",
    "RC-J20-A",
    "RC-O-A",
    "RC-S33-A",
    "RC-M40-A",
    "RC-M45-A",
    "RC-M50-A",
    "RC-M55-A",
    "RC-M60-A",
    "RC-M65-A",
    "RC-M70-A",
    "RC-M75-A",
    "RC-M80-A",
    "RC-M85-A",
    "RC-M90-A",
    "RC-M95-A",
    "RC-M100-A",
    "RC-PF-A",
    "RC-MIL-A",
    "RC-CF-A",
    "RC-AA-A",

    // Raw Classic (Bare), Pro.
    "RC-Y-P",
    "RC-T14-P",
    "RC-T16-P",
    "RC-T18-P",
    "RC-J20-P",
    "RC-O-P",
    "RC-S33-P",
    "RC-M40-P",
    "RC-M45-P",
    "RC-M50-P",
    "RC-M55-P",
    "RC-M60-P",
    "RC-M65-P",
    "RC-M70-P",
    "RC-M75-P",
    "RC-M80-P",
    "RC-M85-P",
    "RC-M90-P",
    "RC-M95-P",
    "RC-M100-P",
    "RC-PF-P",
    "RC-MIL-P",
    "RC-CF-P",
    "RC-AA-P",

    // Raw Classic (Bare), Elite.
    "RC-Y-E",
    "RC-T14-E",
    "RC-T16-E",
    "RC-T18-E",
    "RC-J20-E",
    "RC-O-E",
    "RC-S33-E",
    "RC-M40-E",
    "RC-M45-E",
    "RC-M50-E",
    "RC-M55-E",
    "RC-M60-E",
    "RC-M65-E",
    "RC-M70-E",
    "RC-M75-E",
    "RC-M80-E",
    "RC-M85-E",
    "RC-M90-E",
    "RC-M95-E",
    "RC-M100-E",
    "RC-PF-E",
    "RC-MIL-E",
    "RC-CF-E",
    "RC-AA-E",

    // Raw Modern (Sleeves + Wraps), Amateur.
    "RM-Y-A",
    "RM-T14-A",
    "RM-T16-A",
    "RM-T18-A",
    "RM-J20-A",
    "RM-O-A",
    "RM-S33-A",
    "RM-M40-A",
    "RM-M45-A",
    "RM-M50-A",
    "RM-M55-A",
    "RM-M60-A",
    "RM-M65-A",
    "RM-M70-A",
    "RM-M75-A",
    "RM-M80-A",
    "RM-M85-A",
    "RM-M90-A",
    "RM-M95-A",
    "RM-M100-A",
    "RM-PF-A",
    "RM-MIL-A",
    "RM-CF-A",
    "RM-AA-A",

    // Raw Modern (Sleeves + Wraps), Pro.
    "RM-Y-P",
    "RM-T14-P",
    "RM-T16-P",
    "RM-T18-P",
    "RM-J20-P",
    "RM-O-P",
    "RM-S33-P",
    "RM-M40-P",
    "RM-M45-P",
    "RM-M50-P",
    "RM-M55-P",
    "RM-M60-P",
    "RM-M65-P",
    "RM-M70-P",
    "RM-M75-P",
    "RM-M80-P",
    "RM-M85-P",
    "RM-M90-P",
    "RM-M95-P",
    "RM-M100-P",
    "RM-PF-P",
    "RM-MIL-P",
    "RM-CF-P",
    "RM-AA-P",

    // Raw Modern (Sleeves + Wraps), Elite.
    "RM-Y-E",
    "RM-T14-E",
    "RM-T16-E",
    "RM-T18-E",
    "RM-J20-E",
    "RM-O-E",
    "RM-S33-E",
    "RM-M40-E",
    "RM-M45-E",
    "RM-M50-E",
    "RM-M55-E",
    "RM-M60-E",
    "RM-M65-E",
    "RM-M70-E",
    "RM-M75-E",
    "RM-M80-E",
    "RM-M85-E",
    "RM-M90-E",
    "RM-M95-E",
    "RM-M100-E",
    "RM-PF-E",
    "RM-MIL-E",
    "RM-CF-E",
    "RM-AA-E",

    // Single-ply, Amateur.
    "SP-Y-A",
    "SP-T14-A",
    "SP-T16-A",
    "SP-T18-A",
    "SP-J20-A",
    "SP-O-A",
    "SP-S33-A",
    "SP-M40-A",
    "SP-M45-A",
    "SP-M50-A",
    "SP-M55-A",
    "SP-M60-A",
    "SP-M65-A",
    "SP-M70-A",
    "SP-M75-A",
    "SP-M80-A",
    "SP-M85-A",
    "SP-M90-A",
    "SP-M95-A",
    "SP-M100-A",
    "SP-PF-A",
    "SP-MIL-A",
    "SP-CF-A",
    "SP-AA-A",

    // Single-ply, Pro.
    "SP-Y-P",
    "SP-T14-P",
    "SP-T16-P",
    "SP-T18-P",
    "SP-J20-P",
    "SP-O-P",
    "SP-S33-P",
    "SP-M40-P",
    "SP-M45-P",
    "SP-M50-P",
    "SP-M55-P",
    "SP-M60-P",
    "SP-M65-P",
    "SP-M70-P",
    "SP-M75-P",
    "SP-M80-P",
    "SP-M85-P",
    "SP-M90-P",
    "SP-M95-P",
    "SP-M100-P",
    "SP-PF-P",
    "SP-MIL-P",
    "SP-CF-P",
    "SP-AA-P",

    // Single-ply, Elite.
    "SP-Y-E",
    "SP-T14-E",
    "SP-T16-E",
    "SP-T18-E",
    "SP-J20-E",
    "SP-O-E",
    "SP-S33-E",
    "SP-M40-E",
    "SP-M45-E",
    "SP-M50-E",
    "SP-M55-E",
    "SP-M60-E",
    "SP-M65-E",
    "SP-M70-E",
    "SP-M75-E",
    "SP-M80-E",
    "SP-M85-E",
    "SP-M90-E",
    "SP-M95-E",
    "SP-M100-E",
    "SP-PF-E",
    "SP-MIL-E",
    "SP-CF-E",
    "SP-AA-E",

    // Multi-ply, Amateur.
    "MP-Y-A",
    "MP-T14-A",
    "MP-T16-A",
    "MP-T18-A",
    "MP-J20-A",
    "MP-O-A",
    "MP-S33-A",
    "MP-M40-A",
    "MP-M45-A",
    "MP-M50-A",
    "MP-M55-A",
    "MP-M60-A",
    "MP-M65-A",
    "MP-M70-A",
    "MP-M75-A",
    "MP-M80-A",
    "MP-M85-A",
    "MP-M90-A",
    "MP-M95-A",
    "MP-M100-A",
    "MP-PF-A",
    "MP-MIL-A",
    "MP-CF-A",
    "MP-AA-A",

    // Multi-ply, Pro.
    "MP-Y-P",
    "MP-T14-P",
    "MP-T16-P",
    "MP-T18-P",
    "MP-J20-P",
    "MP-O-P",
    "MP-S33-P",
    "MP-M40-P",
    "MP-M45-P",
    "MP-M50-P",
    "MP-M55-P",
    "MP-M60-P",
    "MP-M65-P",
    "MP-M70-P",
    "MP-M75-P",
    "MP-M80-P",
    "MP-M85-P",
    "MP-M90-P",
    "MP-M95-P",
    "MP-M100-P",
    "MP-PF-P",
    "MP-MIL-P",
    "MP-CF-P",
    "MP-AA-P",

    // Multi-ply, Elite.
    "MP-Y-E",
    "MP-T14-E",
    "MP-T16-E",
    "MP-T18-E",
    "MP-J20-E",
    "MP-O-E",
    "MP-S33-E",
    "MP-M40-E",
    "MP-M45-E",
    "MP-M50-E",
    "MP-M55-E",
    "MP-M60-E",
    "MP-M65-E",
    "MP-M70-E",
    "MP-M75-E",
    "MP-M80-E",
    "MP-M85-E",
    "MP-M90-E",
    "MP-M95-E",
    "MP-M100-E",
    "MP-PF-E",
    "MP-MIL-E",
    "MP-CF-E",
    "MP-AA-E",
  ],
  weightClassesKgMen: [52, 56, 60, 67.5, 75, 82.5, 90, 100, 110, 118, 125, 140],
  weightClassesKgWomen: [44, 48, 52, 56, 60, 67.5, 75, 82.5, 90, 100, 110],
  weightClassesKgMx: [52, 56, 60, 67.5, 75, 82.5, 90, 100, 110, 118, 125, 140],
  formula: "Wilks",
  ageCoefficients: "FosterMcCulloch",
  combineSleevesAndWraps: true,
  combineSingleAndMulti: false,
  allow4thAttempts: true,
};

const spfDefaults: Partial<MeetState> = {
  divisions: [
    "Open",
    "Pre-Teen",
    "T13-15",
    "T16-17",
    "T18-19",
    "J20-23",
    "S33-39",
    "M40-44",
    "M45-49",
    "M50-54",
    "M55-59",
    "M60-64",
    "M65-69",
    "M70-74",
    "M75-79",
    "G80+",
    "FPM",
    "Crossfit",
  ],
  weightClassesKgMen: [44, 48, 52, 56, 60, 67.5, 75, 82.5, 90, 100, 110, 118, 125, 140],
  weightClassesKgWomen: [44, 48, 52, 56, 60, 67.5, 75, 82.5, 90, 100, 110],
  weightClassesKgMx: [44, 48, 52, 56, 60, 67.5, 75, 82.5, 90, 100, 110, 118, 125, 140],
  formula: "Schwartz/Malone",
  ageCoefficients: "FosterMcCulloch",
  combineSleevesAndWraps: false,
  combineSingleAndMulti: false,
  allow4thAttempts: true,
};

const upaDefaults: Partial<MeetState> = {
  divisions: [
    "FG",
    "FG-AD",
    "FGR",
    "FGR-AD",
    "FJ",
    "FJ-AD",
    "FJR",
    "FJR-AD",
    "FJRE",
    "FJRE-AD",
    "FM1",
    "FM1-AD",
    "FM1R",
    "FM1R-AD",
    "FM1RE",
    "FM1RE-AD",
    "FM2",
    "FM2-AD",
    "FM2R",
    "FM2R-AD",
    "FM2RE",
    "FM2RE-AD",
    "FM3",
    "FM3-AD",
    "FM3R",
    "FM3R-AD",
    "FM3RE",
    "FM3RE-AD",
    "FM4",
    "FM4-AD",
    "FM4R",
    "FM4R-AD",
    "FM4RE",
    "FM4RE-AD",
    "FM5",
    "FM5-AD",
    "FM5R",
    "FM5R-AD",
    "FM5RE",
    "FM5RE-AD",
    "FM6",
    "FM6-AD",
    "FM6R",
    "FM6R-AD",
    "FM6RE",
    "FM6RE-AD",
    "FM7",
    "FM7-AD",
    "FM7R",
    "FM7R-AD",
    "FM7RE",
    "FM7RE-AD",
    "FM8",
    "FM8-AD",
    "FM8R",
    "FM8R-AD",
    "FM8RE",
    "FM8RE-AD",
    "FM9",
    "FM9-AD",
    "FM9R",
    "FM9R-AD",
    "FM9RE",
    "FM9RE-AD",
    "FMX",
    "FMX-AD",
    "FMXR",
    "FMXR-AD",
    "FMXRE",
    "FMXRE-AD",
    "FO",
    "FO-AD",
    "FOR",
    "FOR-AD",
    "FORE",
    "FORE-AD",
    "FPFR",
    "FPFR-AD",
    "FS",
    "FS-AD",
    "FSR",
    "FSR-AD",
    "FSRE",
    "FSRE-AD",
    "FT1",
    "FT1-AD",
    "FT1R",
    "FT1R-AD",
    "FT1RE",
    "FT1RE-AD",
    "FT2",
    "FT2-AD",
    "FT2R",
    "FT2R-AD",
    "FT2RE",
    "FT2RE-AD",
    "FT3",
    "FT3-AD",
    "FT3R",
    "FT3R-AD",
    "FT3RE",
    "FT3RE-AD",
    "FTX",
    "FTX-AD",
    "FTXR",
    "FTXR-AD",
    "FTXRE",
    "FTXRE-AD",
    "MG",
    "MG-AD",
    "MGR",
    "MGR-AD",
    "MJ",
    "MJ-AD",
    "MJR",
    "MJR-AD",
    "MJRE",
    "MJRE-AD",
    "MM1",
    "MM1-AD",
    "MM1R",
    "MM1R-AD",
    "MM1RE",
    "MM1RE-AD",
    "MM2",
    "MM2-AD",
    "MM2R",
    "MM2R-AD",
    "MM2RE",
    "MM2RE-AD",
    "MM3",
    "MM3-AD",
    "MM3R",
    "MM3R-AD",
    "MM3RE",
    "MM3RE-AD",
    "MM4",
    "MM4-AD",
    "MM4R",
    "MM4R-AD",
    "MM4RE",
    "MM4RE-AD",
    "MM5",
    "MM5-AD",
    "MM5R",
    "MM5R-AD",
    "MM5RE",
    "MM5RE-AD",
    "MM6",
    "MM6-AD",
    "MM6R",
    "MM6R-AD",
    "MM6RE",
    "MM6RE-AD",
    "MM7",
    "MM7-AD",
    "MM7R",
    "MM7R-AD",
    "MM7RE",
    "MM7RE-AD",
    "MM8",
    "MM8-AD",
    "MM8R",
    "MM8R-AD",
    "MM8RE",
    "MM8RE-AD",
    "MM9",
    "MM9-AD",
    "MM9R",
    "MM9R-AD",
    "MM9RE",
    "MM9RE-AD",
    "MMX",
    "MMX-AD",
    "MMXR",
    "MMXR-AD",
    "MMXRE",
    "MMXRE-AD",
    "MO",
    "MO-AD",
    "MOR",
    "MOR-AD",
    "MORE",
    "MORE-AD",
    "MPFR",
    "MPFR-AD",
    "MS",
    "MS-AD",
    "MSR",
    "MSR-AD",
    "MSRE",
    "MSRE-AD",
    "MT1",
    "MT1-AD",
    "MT1R",
    "MT1R-AD",
    "MT1RE",
    "MT1RE-AD",
    "MT2",
    "MT2-AD",
    "MT2R",
    "MT2R-AD",
    "MT2RE",
    "MT2RE-AD",
    "MT3",
    "MT3-AD",
    "MT3R",
    "MT3R-AD",
    "MT3RE",
    "MT3RE-AD",
    "MTX",
    "MTX-AD",
    "MTXR",
    "MTXR-AD",
    "MTXRE",
    "MTXRE-AD",
  ],
  weightClassesKgMen: [52, 56, 60, 67.5, 75, 82.5, 90, 100, 110, 125, 140],
  weightClassesKgWomen: [44, 48, 52, 56, 60, 67.5, 75, 82.5, 90],
  weightClassesKgMx: [52, 56, 60, 67.5, 75, 82.5, 90, 100, 110, 125, 140],
  formula: "Schwartz/Malone",
  ageCoefficients: "FosterMcCulloch",
  combineSleevesAndWraps: true,
  combineSingleAndMulti: true,
  allow4thAttempts: true,
};

const usaplDefaults: Partial<MeetState> = {
  divisions: [
    "MR-O",
    "MR-Y",
    "MR-Y1",
    "MR-Y2",
    "MR-Y3",
    "MR-T1",
    "MR-T2",
    "MR-T3",
    "MR-Jr",
    "MR-M1a",
    "MR-M1b",
    "MR-M2a",
    "MR-M2b",
    "MR-M3a",
    "MR-M3b",
    "MR-M4a",
    "MR-M4b",
    "MR-M5a",
    "MR-M5b",
    "MR-M6a",
    "MR-M6b",
    "MR-G",
    "M-O",
    "M-Y",
    "M-Y1",
    "M-Y2",
    "M-Y3",
    "M-T1",
    "M-T2",
    "M-T3",
    "M-Jr",
    "M-M1a",
    "M-M1b",
    "M-M2a",
    "M-M2b",
    "M-M3a",
    "M-M3b",
    "M-M4a",
    "M-M4b",
    "M-M5a",
    "M-M5b",
    "M-M6a",
    "M-M6b",
    "M-G",
    "FR-O",
    "FR-Y",
    "FR-Y1",
    "FR-Y2",
    "FR-Y3",
    "FR-T1",
    "FR-T2",
    "FR-T3",
    "FR-Jr",
    "FR-M1a",
    "FR-M1b",
    "FR-M2a",
    "FR-M2b",
    "FR-M3a",
    "FR-M3b",
    "FR-M4a",
    "FR-M4b",
    "FR-M5a",
    "FR-M5b",
    "FR-M6a",
    "FR-M6b",
    "FR-G",
    "F-O",
    "F-Y",
    "F-Y1",
    "F-Y2",
    "F-Y3",
    "F-T1",
    "F-T2",
    "F-T3",
    "F-Jr",
    "F-M1a",
    "F-M1b",
    "F-M2a",
    "F-M2b",
    "F-M3a",
    "F-M3b",
    "F-M4a",
    "F-M4b",
    "F-M5a",
    "F-M5b",
    "F-M6a",
    "F-M6b",
    "F-G",
  ],
  weightClassesKgMen: [53, 59, 66, 74, 83, 93, 105, 120],
  weightClassesKgWomen: [43, 47, 52, 57, 63, 69, 76, 84],
  weightClassesKgMx: [53, 59, 66, 74, 83, 93, 105, 120],
  formula: "IPF GL Points",
  ageCoefficients: "FosterMcCulloch",
  combineSleevesAndWraps: false,
  combineSingleAndMulti: false,
  allow4thAttempts: false,
};

const uspaDefaults: Partial<MeetState> = {
  divisions: [
    "Open",
    "Y4-12",
    "J13-15",
    "J16-17",
    "J18-19",
    "J20-23",
    "S35-39",
    "M40-44",
    "M45-49",
    "M50-54",
    "M55-59",
    "M60-64",
    "M65-69",
    "M70-74",
    "M75-79",
    "M80+",
  ],
  weightClassesKgMen: [52, 56, 60, 67.5, 75, 82.5, 90, 100, 110, 125, 140],
  weightClassesKgWomen: [44, 48, 52, 56, 60, 67.5, 75, 82.5, 90],
  weightClassesKgMx: [52, 56, 60, 67.5, 75, 82.5, 90, 100, 110, 125, 140],
  formula: "Dots",
  ageCoefficients: "FosterMcCulloch",
  combineSleevesAndWraps: false,
  combineSingleAndMulti: false,
  allow4thAttempts: true,
};

const uspcDefaults: Partial<MeetState> = {
  divisions: [
    "Open",
    "J10-12",
    "J13-15",
    "J16-17",
    "J18-19",
    "J20-23",
    "S35-39",
    "M40-44",
    "M45-49",
    "M50-54",
    "M55-59",
    "M60-64",
    "M65-69",
    "M70-74",
    "M75-79",
    "M80+",
  ],
  weightClassesKgMen: [52, 56, 60, 67.5, 75, 82.5, 90, 100, 110, 125, 140],
  weightClassesKgWomen: [44, 48, 52, 56, 60, 67.5, 75, 82.5, 90, 100, 110, 125, 140],
  weightClassesKgMx: [52, 56, 60, 67.5, 75, 82.5, 90, 100, 110, 125, 140],
  formula: "Wilks2020",
  ageCoefficients: "FosterMcCulloch",
  combineSleevesAndWraps: false,
  combineSingleAndMulti: false,
  allow4thAttempts: true,
};

const wabdlDefaults: Partial<MeetState> = {
  divisions: [
    "Open",
    "T12-13",
    "T14-15",
    "T16-17",
    "T18-19",
    "J20-25",
    "S33-39",
    "M40-46",
    "M47-53",
    "M54-60",
    "M61-67",
    "M68-74",
    "M75-79",
    "M80-84",
    "M85-89",
    "M90+",
  ],
  weightClassesKgMen: [44, 48, 52, 56, 60, 67.5, 75, 82.5, 90, 100, 110, 117.5, 125, 140],
  weightClassesKgWomen: [44, 48, 52, 56, 60, 67.5, 75, 82.5, 90, 100],
  weightClassesKgMx: [44, 48, 52, 56, 60, 67.5, 75, 82.5, 90, 100, 110, 117.5, 125, 140],
  formula: "Schwartz/Malone",
  ageCoefficients: "FosterMcCulloch",
  combineSleevesAndWraps: false,
  combineSingleAndMulti: false,
  allow4thAttempts: true,
};

const wpDefaults: Partial<MeetState> = {
  divisions: [
    "Open",
    "Y14-17",
    "J18-23",
    "S33-39",
    "M40-46",
    "M47-53",
    "M54-60",
    "M61-67",
    "M68-74",
    "M75-79",
    "M80-84",
    "M85-89",
    "M90+",
  ],
  weightClassesKgMen: [62, 69, 77, 85, 94, 105, 120],
  weightClassesKgWomen: [48, 53, 58, 64, 72, 84, 100],
  weightClassesKgMx: [62, 69, 77, 85, 94, 105, 120],
  formula: "Wilks2020",
  ageCoefficients: "FosterMcCulloch",
  combineSleevesAndWraps: false,
  combineSingleAndMulti: false,
  allow4thAttempts: false,
};

const wpcDefaults: Partial<MeetState> = {
  divisions: [
    "F_GCR",
    "F_GCR_A",
    "F_GEM",
    "F_GEM_A",
    "F_GES",
    "F_GES_A",
    "F_GR",
    "F_GR_A",
    "F_JCR",
    "F_JCR_A",
    "F_JEM",
    "F_JEM_A",
    "F_JES",
    "F_JES_A",
    "F_JR",
    "F_JR_A",
    "F_MCR_1",
    "F_MCR_1_A",
    "F_MCR_2",
    "F_MCR_2_A",
    "F_MCR_3",
    "F_MCR_3_A",
    "F_MCR_4",
    "F_MCR_4_A",
    "F_MCR_5",
    "F_MCR_5_A",
    "F_MCR_6",
    "F_MCR_6_A",
    "F_MCR_7",
    "F_MCR_7_A",
    "F_MCR_8",
    "F_MCR_8_A",
    "F_MCR_9",
    "F_MCR_9_A",
    "F_MCR_X",
    "F_MCR_X_A",
    "F_MEM_1",
    "F_MEM_1_A",
    "F_MEM_2",
    "F_MEM_2_A",
    "F_MEM_3",
    "F_MEM_3_A",
    "F_MEM_4",
    "F_MEM_4_A",
    "F_MEM_5",
    "F_MEM_5_A",
    "F_MEM_6",
    "F_MEM_6_A",
    "F_MEM_7",
    "F_MEM_7_A",
    "F_MEM_8",
    "F_MEM_8_A",
    "F_MEM_9",
    "F_MEM_9_A",
    "F_MEM_X",
    "F_MEM_X_A",
    "F_MES_1",
    "F_MES_1_A",
    "F_MES_2",
    "F_MES_2_A",
    "F_MES_3",
    "F_MES_3_A",
    "F_MES_4",
    "F_MES_4_A",
    "F_MES_5",
    "F_MES_5_A",
    "F_MES_6",
    "F_MES_6_A",
    "F_MES_7",
    "F_MES_7_A",
    "F_MES_8",
    "F_MES_8_A",
    "F_MES_9",
    "F_MES_9_A",
    "F_MES_X",
    "F_MES_X_A",
    "F_MR_1",
    "F_MR_1_A",
    "F_MR_2",
    "F_MR_2_A",
    "F_MR_3",
    "F_MR_3_A",
    "F_MR_4",
    "F_MR_4_A",
    "F_MR_5",
    "F_MR_5_A",
    "F_MR_6",
    "F_MR_6_A",
    "F_MR_7",
    "F_MR_7_A",
    "F_MR_8",
    "F_MR_8_A",
    "F_MR_9",
    "F_MR_9_A",
    "F_MR_X",
    "F_MR_X_A",
    "F_NEM",
    "F_NR",
    "F_OCR",
    "F_OCR_A",
    "F_OEM",
    "F_OEM_A",
    "F_OES",
    "F_OES_A",
    "F_OR",
    "F_OR_A",
    "F_SCR",
    "F_SCR_A",
    "F_SEM",
    "F_SEM_A",
    "F_SES",
    "F_SES_A",
    "F_SOR",
    "F_SOR_A",
    "F_SR",
    "F_SR_A",
    "F_TCR_1",
    "F_TCR_1_A",
    "F_TCR_2",
    "F_TCR_2_A",
    "F_TCR_3",
    "F_TCR_3_A",
    "F_TCR_X",
    "F_TCR_X_A",
    "F_TEM_1",
    "F_TEM_1_A",
    "F_TEM_2",
    "F_TEM_2_A",
    "F_TEM_3",
    "F_TEM_3_A",
    "F_TEM_X",
    "F_TEM_X_A",
    "F_TES_1",
    "F_TES_1_A",
    "F_TES_2",
    "F_TES_2_A",
    "F_TES_3",
    "F_TES_3_A",
    "F_TES_X",
    "F_TES_X_A",
    "F_TR_1",
    "F_TR_1_A",
    "F_TR_2",
    "F_TR_2_A",
    "F_TR_3",
    "F_TR_3_A",
    "F_TR_X",
    "F_TR_X_A",
    "F_YCR",
    "F_YCR_A",
    "F_YEM",
    "F_YEM_A",
    "F_YES",
    "F_YES_A",
    "F_YR",
    "F_YR_A",
    "M_GCR",
    "M_GCR_A",
    "M_GEM",
    "M_GEM_A",
    "M_GES",
    "M_GES_A",
    "M_GR",
    "M_GR_A",
    "M_JCR",
    "M_JCR_A",
    "M_JEM",
    "M_JEM_A",
    "M_JES",
    "M_JES_A",
    "M_JR",
    "M_JR_A",
    "M_MCR_1",
    "M_MCR_1_A",
    "M_MCR_2",
    "M_MCR_2_A",
    "M_MCR_3",
    "M_MCR_3_A",
    "M_MCR_4",
    "M_MCR_4_A",
    "M_MCR_5",
    "M_MCR_5_A",
    "M_MCR_6",
    "M_MCR_6_A",
    "M_MCR_7",
    "M_MCR_7_A",
    "M_MCR_8",
    "M_MCR_8_A",
    "M_MCR_9",
    "M_MCR_9_A",
    "M_MCR_X",
    "M_MCR_X_A",
    "M_MEM_1",
    "M_MEM_1_A",
    "M_MEM_2",
    "M_MEM_2_A",
    "M_MEM_3",
    "M_MEM_3_A",
    "M_MEM_4",
    "M_MEM_4_A",
    "M_MEM_5",
    "M_MEM_5_A",
    "M_MEM_6",
    "M_MEM_6_A",
    "M_MEM_7",
    "M_MEM_7_A",
    "M_MEM_8",
    "M_MEM_8_A",
    "M_MEM_9",
    "M_MEM_9_A",
    "M_MEM_X",
    "M_MEM_X_A",
    "M_MES_1",
    "M_MES_1_A",
    "M_MES_2",
    "M_MES_2_A",
    "M_MES_3",
    "M_MES_3_A",
    "M_MES_4",
    "M_MES_4_A",
    "M_MES_5",
    "M_MES_5_A",
    "M_MES_6",
    "M_MES_6_A",
    "M_MES_7",
    "M_MES_7_A",
    "M_MES_8",
    "M_MES_8_A",
    "M_MES_9",
    "M_MES_9_A",
    "M_MES_X",
    "M_MES_X_A",
    "M_MR_1",
    "M_MR_1_A",
    "M_MR_2",
    "M_MR_2_A",
    "M_MR_3",
    "M_MR_3_A",
    "M_MR_4",
    "M_MR_4_A",
    "M_MR_5",
    "M_MR_5_A",
    "M_MR_6",
    "M_MR_6_A",
    "M_MR_7",
    "M_MR_7_A",
    "M_MR_8",
    "M_MR_8_A",
    "M_MR_9",
    "M_MR_9_A",
    "M_MR_X",
    "M_MR_X_A",
    "M_NEM",
    "M_NEM_A",
    "M_NR",
    "M_NR_A",
    "M_OCR",
    "M_OCR_A",
    "M_OEM",
    "M_OEM_A",
    "M_OES",
    "M_OES_A",
    "M_OR",
    "M_OR_A",
    "M_PFEM",
    "M_PFEM_A",
    "M_PFR_A",
    "M_SCR",
    "M_SCR_A",
    "M_SEM",
    "M_SEM_A",
    "M_SES",
    "M_SES_A",
    "M_SOEM",
    "M_SOEM_A",
    "M_SOR",
    "M_SOR_A",
    "M_SR",
    "M_SR_A",
    "M_TCR_1",
    "M_TCR_1_A",
    "M_TCR_2",
    "M_TCR_2_A",
    "M_TCR_3",
    "M_TCR_3_A",
    "M_TCR_X",
    "M_TCR_X_A",
    "M_TEM_1",
    "M_TEM_1_A",
    "M_TEM_2",
    "M_TEM_2_A",
    "M_TEM_3",
    "M_TEM_3_A",
    "M_TEM_X",
    "M_TEM_X_A",
    "M_TES_1",
    "M_TES_1_A",
    "M_TES_2",
    "M_TES_2_A",
    "M_TES_3",
    "M_TES_3_A",
    "M_TES_X",
    "M_TES_X_A",
    "M_TR_1",
    "M_TR_1_A",
    "M_TR_2",
    "M_TR_2_A",
    "M_TR_3",
    "M_TR_3_A",
    "M_TR_X",
    "M_TR_X_A",
    "M_YCR",
    "M_YCR_A",
    "M_YEM",
    "M_YEM_A",
    "M_YR",
    "M_YR_A",
  ],
  weightClassesKgMen: [52, 56, 60, 67.5, 75, 82.5, 90, 100, 110, 125, 140],
  weightClassesKgWomen: [44, 48, 52, 56, 60, 67.5, 75, 82.5, 90, 100, 110],
  weightClassesKgMx: [52, 56, 60, 67.5, 75, 82.5, 90, 100, 110, 125, 140],
  formula: "Glossbrenner",
  ageCoefficients: "FosterMcCulloch",
  combineSleevesAndWraps: true,
  combineSingleAndMulti: true,
  allow4thAttempts: true,
};

const wppoDefaults: Partial<MeetState> = {
  divisions: ["Open", "J15-20"],
  weightClassesKgMen: [49, 54, 59, 65, 72, 80, 88, 97, 107],
  weightClassesKgWomen: [41, 45, 50, 55, 61, 67, 73, 79, 86],
  weightClassesKgMx: [49, 54, 59, 65, 72, 80, 88, 97, 107],
  formula: "AH",
  ageCoefficients: "None",
  combineSleevesAndWraps: false,
  combineSingleAndMulti: false,
  allow4thAttempts: true,

  showAlternateUnits: false,
};

const wrpfDefaults: Partial<MeetState> = {
  divisions: [
    "J8-9",
    "J10-11",
    "J12-13",
    "J14-16",
    "J17-19",
    "J20-23",
    "Open",
    "S35-39",
    "M40-44",
    "M45-49",
    "M50-54",
    "M55-59",
    "M60-64",
    "M65-69",
    "M70-74",
    "M75-79",
    "M80+",
  ],
  weightClassesKgMen: [52, 56, 60, 67.5, 75, 82.5, 90, 100, 110, 125, 140],
  weightClassesKgWomen: [44, 48, 52, 56, 60, 67.5, 75, 82.5, 90],
  weightClassesKgMx: [52, 56, 60, 67.5, 75, 82.5, 90, 100, 110, 125, 140],
  formula: "Wilks",
  ageCoefficients: "FosterMcCulloch",
  combineSleevesAndWraps: false,
  combineSingleAndMulti: false,
  allow4thAttempts: true,
};

class AutoFillRules extends React.Component<Props, InternalState> {
  constructor(props: Props) {
    super(props);

    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleClick = this.handleClick.bind(this);

    this.state = {
      selectedOption: "Traditional",
    };
  }

  handleSelectChange = (event: React.BaseSyntheticEvent) => {
    const value = event.currentTarget.value as AutoFillOption;
    // Only handle any valid values & assist the compiler in giving us a compile error if AutoFillOption has more values added
    switch (value) {
      case "Traditional":
      case "365Strong":
      case "BP":
      case "GPC":
      case "RPS":
      case "SPF":
      case "UPA":
      case "USPA":
      case "USPC":
      case "USAPL":
      case "WABDL":
      case "WP":
      case "WPC":
      case "WPPO":
      case "WRPF":
        this.setState({ selectedOption: value });
        break;

      default:
        checkExhausted(value);
        throw new Error(`Expected a value that corresponds to an AutoFillOption, instead got "${value}"`);
    }
  };

  handleClick = () => {
    switch (this.state.selectedOption) {
      case "Traditional":
        this.props.updateMeet(traditionalDefaults);
        this.props.onChange();
        return;
      case "365Strong":
        this.props.updateMeet(_365strongDefaults);
        this.props.onChange();
        return;
      case "BP":
        this.props.updateMeet(bpDefaults);
        this.props.onChange();
        return;
      case "GPC":
        this.props.updateMeet(gpcDefaults);
        this.props.onChange();
        return;
      case "RPS":
        this.props.updateMeet(rpsDefaults);
        this.props.onChange();
        return;
      case "SPF":
        this.props.updateMeet(spfDefaults);
        this.props.onChange();
        return;
      case "UPA":
        this.props.updateMeet(upaDefaults);
        this.props.onChange();
        return;
      case "USAPL":
        this.props.updateMeet(usaplDefaults);
        this.props.onChange();
        return;
      case "USPA":
        this.props.updateMeet(uspaDefaults);
        this.props.onChange();
        return;
      case "USPC":
        this.props.updateMeet(uspcDefaults);
        this.props.onChange();
        return;
      case "WABDL":
        this.props.updateMeet(wabdlDefaults);
        this.props.onChange();
        return;
      case "WP":
        this.props.updateMeet(wpDefaults);
        this.props.onChange();
        return;
      case "WPC":
        this.props.updateMeet(wpcDefaults);
        this.props.onChange();
        return;
      case "WPPO":
        this.props.updateMeet(wppoDefaults);
        this.props.onChange();
        return;
      case "WRPF":
        this.props.updateMeet(wrpfDefaults);
        this.props.onChange();
        return;
      default:
        checkExhausted(this.state.selectedOption);
        return;
    }
  };

  render() {
    const lang = this.props.language;

    const stringTraditional = getString("meet-setup.rules-traditional", lang);
    const string365Strong = getString("meet-setup.rules-365strong", lang);
    const stringBP = getString("meet-setup.rules-bp", lang);
    const stringGPC = getString("meet-setup.rules-gpc", lang);
    const stringRPS = getString("meet-setup.rules-rps", lang);
    const stringSPF = getString("meet-setup.rules-spf", lang);
    const stringUPA = getString("meet-setup.rules-upa", lang);
    const stringUSAPL = getString("meet-setup.rules-usapl", lang);
    const stringUSPA = getString("meet-setup.rules-uspa", lang);
    const stringUSPC = getString("meet-setup.rules-uspc", lang);
    const stringWABDL = getString("meet-setup.rules-wabdl", lang);
    const stringWP = getString("meet-setup.rules-wp", lang);
    const stringWPC = getString("meet-setup.rules-wpc", lang);
    const stringWPPO = getString("meet-setup.rules-wppo", lang);
    const stringWRPF = getString("meet-setup.rules-wrpf", lang);

    return (
      <div>
        <FormGroup>
          <Form.Label>
            <FormattedMessage id="meet-setup.label-auto-fill-rules" defaultMessage="Auto-Fill Rules" />
          </Form.Label>
          <div>
            <FormControl
              as="select"
              onChange={this.handleSelectChange}
              value={this.state.selectedOption}
              style={{ width: "70%", display: "inline-block" }}
              className="custom-select"
            >
              <option key="Traditional" value="Traditional">
                {stringTraditional}
              </option>
              <option key="365Strong" value="365Strong">
                {string365Strong}
              </option>
              <option key="BP" value="BP">
                {stringBP}
              </option>
              <option key="GPC" value="GPC">
                {stringGPC}
              </option>
              <option key="RPS" value="RPS">
                {stringRPS}
              </option>
              <option key="SPF" value="SPF">
                {stringSPF}
              </option>
              <option key="UPA" value="UPA">
                {stringUPA}
              </option>
              <option key="USAPL" value="USAPL">
                {stringUSAPL}
              </option>
              <option key="USPA" value="USPA">
                {stringUSPA}
              </option>
              <option key="USPC" value="USPC">
                {stringUSPC}
              </option>
              <option key="WABDL" value="WABDL">
                {stringWABDL}
              </option>
              <option key="WP" value="WP">
                {stringWP}
              </option>
              <option key="WPC" value="WPC">
                {stringWPC}
              </option>
              <option key="WPPO" value="WPPO">
                {stringWPPO}
              </option>
              <option key="WRPF" value="WRPF">
                {stringWRPF}
              </option>
            </FormControl>

            <Button
              onClick={this.handleClick}
              variant="primary"
              style={{ width: "25%", marginLeft: "5%", padding: "10px" }}
            >
              <FormattedMessage id="meet-setup.button-autofill" defaultMessage="Auto-Fill" />
            </Button>
          </div>
        </FormGroup>
      </div>
    );
  }
}

const mapStateToProps = (state: GlobalState): StateProps => ({
  federation: state.meet.federation,
  language: state.language,
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  return {
    updateMeet: (changes) => dispatch(updateMeet(changes)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AutoFillRules);
