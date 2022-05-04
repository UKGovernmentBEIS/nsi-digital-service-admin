Cypress.Commands.add("WaitForBrowser", () => {
  waitForBrowser();
});

function waitForBrowser() {
  cy.window().then((win) => {
    return new Cypress.Promise((resolve) =>
      win["requestIdleCallback"](resolve)
    );
  });
}
