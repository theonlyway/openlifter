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

import React from "react";

import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

// Extracted out so that <pre> renders linebreaks properly.
const licenseText =
  "This program is free software: you can redistribute it and/or modify\n" +
  "it under the terms of the GNU Affero General Public License as\n" +
  "published by the Free Software Foundation, either version 3 of the\n" +
  "License, or (at your option) any later version.\n" +
  "\n" +
  "This program is distributed in the hope that it will be useful,\n" +
  "but WITHOUT ANY WARRANTY; without even the implied warranty of\n" +
  "MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\n" +
  "GNU Affero General Public License for more details.";

class AboutContainer extends React.Component<{}> {
  render() {
    return (
      <Container>
        <Row>
          <Col md={6}>
            <Card>
              <Card.Header>Credits</Card.Header>
              <Card.Body>
                <p>
                  OpenLifter is made by the{" "}
                  <a href="https://www.openpowerlifting.org" rel="noopener noreferrer" target="_blank">
                    OpenPowerlifting project
                  </a>
                  .
                </p>
                <p>
                  <ul>
                    <li>Mike Beelen &mdash; Dutch localization</li>
                    <li>Arman Danielyan &mdash; Russian localization</li>
                    <li>Tommy DeFea &mdash; Graphic design</li>
                    <li>Alper Dokucu &mdash; Turkish localization</li>
                    <li>Trystan Oakley &mdash; Testing</li>
                    <li>Jared Klopper &mdash; Programming</li>
                    <li>Kai Ma &mdash; Simplified Chinese localization</li>
                    <li>Rodney Marsh &mdash; Programming</li>
                    <li>Matt Pearce &mdash; Coefficient calculations</li>
                    <li>Alan Sambol &mdash; Croatian localization</li>
                    <li>Sean Stangl &mdash; Programming and maintenance</li>
                    <li>Michael Vessia &mdash; Programming and maintenance</li>
                    <li>Andrius Virbičianskas &mdash; Lithuanian localization</li>
                    <li>Sarah Wellberg &mdash; UX design and testing</li>
                    <li>Jo Whiteley &mdash; Testing</li>
                  </ul>
                </p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card>
              <Card.Header>License</Card.Header>
              <Card.Body>
                <p>OpenLifter is Copyright (C) 2018-2019 The OpenPowerlifting Project.</p>
                <p>OpenLifter is Free Software. Free Software grants you the following freedoms:</p>
                <ol>
                  <li>The freedom to run the program as you wish, for any purpose.</li>
                  <li>The freedom to study how the program works, and change it as you wish.</li>
                  <li>The freedom to redistribute copies so you can help others.</li>
                  <li>The freedom to distribute copies of your modified versions to others.</li>
                </ol>
                <p>
                  The AGPLv3+ license we use means that if you distribute this software or host it on a server, you must
                  give your users the same rights we give you, including full source code. In addition, AGPLv3+ code
                  must <i>remain</i> free/libre, and cannot be included in proprietary software or in free/libre
                  software with a weaker or incompatible license.
                </p>
                <p>Here is the short license blurb:</p>
                <pre>{licenseText}</pre>
                <a href="https://www.gnu.org/licenses/agpl-3.0.en.html" rel="noopener noreferrer" target="_blank">
                  Full Text of the GNU Affero General Public License, Version 3
                </a>
                <br />
                <a href="https://www.gnu.org/licenses/gpl-faq.html" rel="noopener noreferrer" target="_blank">
                  FAQ about GNU Licenses
                </a>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default AboutContainer;
