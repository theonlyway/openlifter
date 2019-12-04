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

import { Csv } from "../export/csv";
import { makeExampleRegistrationsCsv, loadRegistrations } from "./registration-csv";
import { getString } from "../strings";

import rootReducer from "../../reducers/rootReducer";

const makeState = language => {
  const state = rootReducer({}, "OVERWRITE_STORE"); // Get a default global state.
  state.meet.divisions = [
    getString("import.example-division1", language),
    getString("import.example-division2", language)
  ];
  return state;
};

describe("loadRegistrations", () => {
  it("can load the example in German", () => {
    const example = makeExampleRegistrationsCsv("de");
    expect(typeof example).toEqual("string");

    const csv = new Csv();
    expect(typeof csv.fromString(example)).toEqual("object");

    const entries = loadRegistrations(makeState("de"), csv, "de");
    expect(typeof entries).toEqual("object");
  });
});

describe("loadRegistrations", () => {
  it("can load the example in English", () => {
    const example = makeExampleRegistrationsCsv("en");
    expect(typeof example).toEqual("string");

    const csv = new Csv();
    expect(typeof csv.fromString(example)).toEqual("object");

    const entries = loadRegistrations(makeState("en"), csv, "en");
    expect(typeof entries).toEqual("object");
  });
});

describe("loadRegistrations", () => {
  it("can load the example in Esperanto", () => {
    const example = makeExampleRegistrationsCsv("eo");
    expect(typeof example).toEqual("string");

    const csv = new Csv();
    expect(typeof csv.fromString(example)).toEqual("object");

    const entries = loadRegistrations(makeState("eo"), csv, "eo");
    expect(typeof entries).toEqual("object");
  });
});

describe("loadRegistrations", () => {
  it("can load the example in Spanish", () => {
    const example = makeExampleRegistrationsCsv("es");
    expect(typeof example).toEqual("string");

    const csv = new Csv();
    expect(typeof csv.fromString(example)).toEqual("object");

    const entries = loadRegistrations(makeState("es"), csv, "es");
    expect(typeof entries).toEqual("object");
  });
});

describe("loadRegistrations", () => {
  it("can load the example in French", () => {
    const example = makeExampleRegistrationsCsv("fr");
    expect(typeof example).toEqual("string");

    const csv = new Csv();
    expect(typeof csv.fromString(example)).toEqual("object");

    const entries = loadRegistrations(makeState("fr"), csv, "fr");
    expect(typeof entries).toEqual("object");
  });
});

describe("loadRegistrations", () => {
  it("can load the example in Croatian", () => {
    const example = makeExampleRegistrationsCsv("hr");
    expect(typeof example).toEqual("string");

    const csv = new Csv();
    expect(typeof csv.fromString(example)).toEqual("object");

    const entries = loadRegistrations(makeState("hr"), csv, "hr");
    expect(typeof entries).toEqual("object");
  });
});

describe("loadRegistrations", () => {
  it("can load the example in Italian", () => {
    const example = makeExampleRegistrationsCsv("it");
    expect(typeof example).toEqual("string");

    const csv = new Csv();
    expect(typeof csv.fromString(example)).toEqual("object");

    const entries = loadRegistrations(makeState("it"), csv, "it");
    expect(typeof entries).toEqual("object");
  });
});

describe("loadRegistrations", () => {
  it("can load the example in Lithuanian", () => {
    const example = makeExampleRegistrationsCsv("lt");
    expect(typeof example).toEqual("string");

    const csv = new Csv();
    expect(typeof csv.fromString(example)).toEqual("object");

    const entries = loadRegistrations(makeState("lt"), csv, "lt");
    expect(typeof entries).toEqual("object");
  });
});

describe("loadRegistrations", () => {
  it("can load the example in Dutch", () => {
    const example = makeExampleRegistrationsCsv("nl");
    expect(typeof example).toEqual("string");

    const csv = new Csv();
    expect(typeof csv.fromString(example)).toEqual("object");

    const entries = loadRegistrations(makeState("nl"), csv, "nl");
    expect(typeof entries).toEqual("object");
  });
});

describe("loadRegistrations", () => {
  it("can load the example in Portuguese", () => {
    const example = makeExampleRegistrationsCsv("pt");
    expect(typeof example).toEqual("string");

    const csv = new Csv();
    expect(typeof csv.fromString(example)).toEqual("object");

    const entries = loadRegistrations(makeState("pt"), csv, "pt");
    expect(typeof entries).toEqual("object");
  });
});

describe("loadRegistrations", () => {
  it("can load the example in Russian", () => {
    const example = makeExampleRegistrationsCsv("ru");
    expect(typeof example).toEqual("string");

    const csv = new Csv();
    expect(typeof csv.fromString(example)).toEqual("object");

    const entries = loadRegistrations(makeState("ru"), csv, "ru");
    expect(typeof entries).toEqual("object");
  });
});

describe("loadRegistrations", () => {
  it("can load the example in Turkish", () => {
    const example = makeExampleRegistrationsCsv("tr");
    expect(typeof example).toEqual("string");

    const csv = new Csv();
    expect(typeof csv.fromString(example)).toEqual("object");

    const entries = loadRegistrations(makeState("tr"), csv, "tr");
    expect(typeof entries).toEqual("object");
  });
});

describe("loadRegistrations", () => {
  it("can load the example in Simplified Chinese", () => {
    const example = makeExampleRegistrationsCsv("zh-Hans");
    expect(typeof example).toEqual("string");

    const csv = new Csv();
    expect(typeof csv.fromString(example)).toEqual("object");

    const entries = loadRegistrations(makeState("zh-Hans"), csv, "zh-Hans");
    expect(typeof entries).toEqual("object");
  });
});
