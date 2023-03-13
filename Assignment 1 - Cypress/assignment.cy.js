describe('Cypress Assignment - Test Cases', () => {
  /*
    In order to correctly run the tests, make sure that the database first is cleaned and then is initialised. 
    This can be done here: https://parabank.parasoft.com/parabank/admin.htm. After this, make sure that a user
    with the following credentials is created:
  */

  const firstName = 'TestFirstName'
  const lastName = 'TestLastName'
  const street = 'TestAddress'
  const city = 'TestCity'
  const state = 'TestState'
  const zipCode = 'TestZipCode'
  //const phone = TestPhone --> This value isn't used to recover a lost account
  const ssn = 'TestSSN'
  let userName = 'CypressUserName'
  const password = 'CypressPassword'

  beforeEach(() => {
    // Since we want to visit ParaBank URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
    cy.visit('https://parabank.parasoft.com/parabank/index.htm')

    //The prerequisit for this test is to have an invalid username
    if (Cypress.currentTest.title === 'Recover account succesfully') {
      userName = 'WrongCypressUserName'
    }

    //logging in
    cy.get('input[name=username]').type(`${userName}`)
    cy.get('input[name=password]').type(`${password}`)
    cy.get('form[name="login"]').submit();
  })

  it('Logging in and logging off v', () => {
    //Verify that we are succesfully logged in
    cy.get('.smallText').should('have.text', `Welcome ${firstName} ${lastName}`)
  })

  it('Toggle JMS service succesfully', () => {
    //Goes to the administration page
    cy.get('a[href="admin.htm"]').click()
    //Clicks the button that toggles the JMS service and
    //makes sure that the status changes
    cy.get('.form2').eq(1).within(() => {
      cy.get('td[width="20%"]').invoke('text').then((text) => {
        const originalValue = text.trim()
        cy.get('.button').click()
        cy.get('td[width="20%"]').should('not.have.text', originalValue)
      })
    })
  })

  it('Recover account succesfully', () => {
    //After entering a wrong user name, we verify that we have the wrong credentials
    cy.get('.error').should('have.text', 'The username and password could not be verified.')

    cy.get('a:contains("Forgot login info?")').click()

    cy.get('input[name=firstName]').type(`${firstName}`)
    cy.get('input[name=lastName]').type(`${lastName}`)
    cy.get('input[name=address\\.street]').type(`${street}`)
    cy.get('input[name=address\\.city]').type(`${city}`)
    cy.get('input[name=address\\.state]').type(`${state}`)
    cy.get('input[name=address\\.zipCode]').type(`${zipCode}`)
    cy.get('input[name=address\\.zipCode]').type(`${zipCode}`)
    cy.get('input[name=ssn]').type(`${ssn}`)

    cy.contains('input[type="submit"]', 'Find My Login Info').click()
    //Verifies that after entering our correct lookup info, we are then succesfully logged in
    cy.get('p:contains("Your login information was located successfully. You are now logged in")').should('exist')
  })

  afterEach(() => {
    //logging out
    cy.get('a[href="/parabank/logout.htm"]').click()
  })
})
