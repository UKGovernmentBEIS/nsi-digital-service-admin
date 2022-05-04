describe("Notifications", () => {
  it("Can view notifications", () => {
    cy.visit("/notifications");
    cy.get(".govuk-table__cell a").first().click();
    cy.url().should("include", "/notification");
  });
});
