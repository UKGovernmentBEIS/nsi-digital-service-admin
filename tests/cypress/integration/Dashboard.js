describe("Dashboard", () => {
  it("Can view notifications", () => {
    cy.visit("/");
    cy.contains("View Notifications").click();
    cy.url().should("include", "/notifications");
  });
});
