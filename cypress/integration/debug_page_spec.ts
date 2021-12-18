const getMeet = (state: string) => {
  const json = JSON.parse(state);
  const meet = JSON.parse(json.meet);
  return meet;
};

describe("The Debug Page", () => {
  it("successfully loads", () => {
    cy.visit("/debug");
  });

  beforeEach(() => {
    cy.log("test");
  });

  it("Resets state and creates an empty meet", () => {
    cy.visit("/debug");
    const resetButton = ".btn-danger";
    cy.get(resetButton)
      .click()
      .should(() => {
        const stateString = localStorage.getItem("persist:root");
        const meet = getMeet(stateString);
        expect(meet.name).to.equal("");
        // TODO: More verification for empty meet state if desired
      });
  });

  it("Creates a new meet with default values", () => {
    cy.visit("/debug");
    const meetSetupButton = ".btn-group > :nth-child(1)";
    cy.get(meetSetupButton)
      .click()
      .should(() => {
        const stateString = localStorage.getItem("persist:root");
        const meet = getMeet(stateString);
        expect(meet.name).to.not.equal("");
        expect(meet.divisions.length).to.not.equal(0);
        // TODO: More verification for meet state if desired
      });
  });
});
