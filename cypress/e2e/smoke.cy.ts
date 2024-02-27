import { faker } from "@faker-js/faker";

describe("smoke tests", () => {
  it("should allow you to register and login", () => {
    cy.visitAndCheck("/");
    cy.findByRole("button", { name: /Sign in with GitHub/i }).should('exist')
  });

  // Skipped so mocking of github API can be figured out
  it.skip("should allow you to make a repo", () => {
    const testRepo = {
      title: faker.lorem.words(1),
      body: faker.lorem.sentences(1),
    };
    cy.login();
    cy.visitAndCheck("/repos");

    cy.findByRole("link", { name: /new repo/i }).click();

    cy.findByRole("textbox", { name: /title/i }).type(testRepo.title);
    cy.findByRole("textbox", { name: /body/i }).type(testRepo.body);
    cy.findByRole("button", { name: /save/i }).click();

    cy.findByRole("button", { name: /delete/i }).click();

    cy.findByText("No repos yet");
  });

  it("should show a list of existing repos", () => {
    cy.login();
    cy.visitAndCheck("/repos");
    
    cy.findByRole("list").should('exist');

    cy.findByText("No repos yet").should('not.exist');

  });
});
