# Tableau ITSM integration
This project was created for the 2019 Tableau London Hackathon. Its main purpose is to enable business users to open tickets in ServiceNow straight from the Tableau UI from an extension. The opened tickets also contain useful information to IT personnel about the state of the filters, parameters and underlying data for easier problem reproduction.

## How to use
1. Clone this repository
2. Host it using a HTTP server on http://localhost:85. You can do it simply with python by running the command ``python -m http.server 85``
3. Include the extension in a Tableau Dashboard using the .trex file
4. Create a ServiceNow development instance at ServiceNow.com. Set up a user, and set up CORS policy for api/tables and api/attachments from host http://localhost:85, with headers 'Authorization' and 'Content-Type'
5. Configure the extension using the default Configure button. You will need to provide the servicenow instance, username and password
6. Open a ticket using the 'Create ticket' button
7. ???
8. Profit!