describe("The Meet Setup Page", () => {
  it("successfully loads", () => {
    cy.visit("/meet-setup");
  });

  it("Modifies Sanction Information", () => {
    cy.visit("/meet-setup");
    const meetNameInput = "input[placeholder='Meet Name']";
    cy.get(meetNameInput)
      .clear()
      .should(($input) => {
        expect($input.text()).to.equal("");
      });

    cy.get(meetNameInput).type("Hello").should("have.value", "Hello");
  });
});
