# Setting up Cointrip
Cointrip's backend uses JavaScript compiled via TypeScript, PostgreSQL for the database, Node.js/Express.js for the server, and Dwolla.js' client for transactions.
If using Windows, you will need Windows Subsystem for Linux (aka WSL) set up on your machine. Navigate to https://docs.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-wsl for the instructions to do so.

To set up the database:
- Install and open your Ubuntu terminal. *The version recommended for this project is 18.04.*
- Enter "sudo service postgresql start" and enter your password.
- Then enter "createdb cointrip".
- Finally type "psql cointrip" and you will have successfully started the database.

# Starting the server:
- Clone this repo.
- Open your terminal, WSL Ubuntu terminal recommended.
- Navigate to where this repo was cloned, cd in the repo, and finally type "npm install".

# Setting up Dwolla.js:
- Dwolla requires a key and a secret to create an instance of their client. This project was built via their sandbox mode, you can go to https://developers.dwolla.com/guides/sandbox#testing-in-the-sandbox to sign up and obtain your key and secret codes.
- Once you obtain these 2 codes, I recommend you assign them to environment variables. This repo takes advantage of 'dotenv' so you can simply create a .env file in the root and set DWOLLA_KEY="your-key" and DWOLLA_SECRET="your-secret" where "your-key" and "your-secret" are the key and secret that you obtain from Dwolla, following the link above.

After following the 3 main steps above, you are good to go. Now you run "npm run seed:dev" to add seed or ‘dummy data’ to our database to use for testing our routes and database functions.
Once you are ready to run the server simply do the command "npm run start:dev" in your terminal.

# Architecture Pattern:
This repo uses the Model View Controller (MVC) design pattern as it's guide. Upon navigating to the src folder, you will notice controllers, models, routes, and utils folders. 

![mvc_source](https://user-images.githubusercontent.com/62577188/148176373-da9e1b28-cf3b-4384-b291-970248f5a27b.png)

In the models folder, all data for either the users or transactions are handled via database queries. In the controllers folder, all logic for the routes themselves are handled in the matching controller. For example, all code that handles the HTTP requests for transactions are in the transactionsController and then exported and passed to the transactionsRouter in the routes folder. In the routers folder, the routers are created for either users or transactions and the http methods (GET, POST, PATCH, DELETE) are attached to each of those routers to then be exported and attached to the app router. The app router is what the server will be running in the index.ts file.

# Expected payload:
Here I will provide examples of what some of the routes will expect as inputs and what it will return to the user. Examples will be images of usage via Postman.

- Register route:
If a user requests to register with Cointrip, the body of the api fetch call must be supplied with their first name, last name, email, and password.
Here is an example of the user object that will be posted to the backend.

![user_object](https://user-images.githubusercontent.com/62577188/148176377-05e3506d-911b-4655-abd1-5bd8c27452bc.png)

An example of a post request to the register endpoint will be:

![register_post](https://user-images.githubusercontent.com/62577188/148176374-7b6a75ca-d698-4ff7-a43b-c8ec78049885.png)

An example of the response:

![register_response](https://user-images.githubusercontent.com/62577188/148176376-9c7bcd74-c838-4d03-8d62-2e9da741eea1.png)

*Note* Although a token is generated, it will not be used at this time. This repo is still a work in progress and I intend to use HTTPOnly Cookies for superior security at a later time.


- Login Route and examples of error handling:
An example of login response when using correct credentials: 
The login route requires a username and password.

![login_success](https://user-images.githubusercontent.com/62577188/148176371-c33d5712-336a-469a-a9bf-9c00741a1c06.png)

An example of login when missing a credential:

![login_missing](https://user-images.githubusercontent.com/62577188/148176370-da951b52-de62-48a2-99e1-42ffd76fae05.png)

An example of incorrect credentials:

![login_credential_error](https://user-images.githubusercontent.com/62577188/148176369-db92386a-8954-4c2a-8d6f-a644f835c1d8.png)

- GET request example:
Here is an example of a user requesting transactions, which will be filtered and displayed on the user's dashboard upon log in.

![get_request_example](https://user-images.githubusercontent.com/62577188/148176367-21fa8c9e-1e20-43ae-ab91-3fbf784f1d83.png)
