# Setting up Cointrip
Cointrip's backend uses JavaScript compiled via TypeScript, PostgreSQL for the database, Node.js/Express.js for the server, and Dwolla.js's client for transactions.
If using windows, you will need Windows Subsystem for Linux (aka WSL) set up on your machine. Navigate to https://docs.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-wsl for the instructions to do so.

To set up start up the database:
- Install and open your ubuntu terminal. *the version recommended for this project is 18.04*
- Enter "sudo service postgresql start" and enter your password.
- Then enter "createdb cointrip".
- Finally type "psql cointrip" and you will have successfully.

# Starting the server:
- Clone this repo
- Open your terminal, WSL ubuntu terminal recommended.
- Navigate to where this repo was cloned, cd in the repo, and finally type "npm install"

# Setting up Dwolla.js:
- Dwolla requires a key and secret to create an instance of their client. This project was built via their sandbox mode, you can go to go https://developers.dwolla.com/guides/sandbox#testing-in-the-sandbox to sign up and obtain the your key and secret codes.
- Once you obtain these 2 codes, I recommend you assign them to environment variables. This repo takes advantage of 'dotenv' so you can simply create a .env file in the root and set DWOLLA_KEY="your-key" and DWOLLA_SECRET="your-secret" where "your-key" and "your-secret" are the key and secret that you obtain from Dwolla, following the link above.

After follow the 3 main steps above, you are good to go. Now you run "npm run seed:dev" to add seed or "dummy data" to our database to use for testing our routes and database functions.
Once you are ready to run the server simply do the command "npm run start:dev" in your terminal.

# Architecture Pattern:
This repo uses the Model View Controller(MVC) design pattern as it's guide. Upon navigate to the src folder, you will notice controllers, models, routes, and utils folders. 
![MVC files example]("https://imgur.com/Z8ofv4P")

In the models folder, all data for either the users or transactions are handled via database queries. In the controllers folder, all logic that for the routes themselves are handled in the matching controller. For example, all the logic for the routes for transactions are in the transactionsController. In the routers folder, the routers are created for either users or transactions and the http methods (GET, POST, PATCH, DELETE) are attached to each of those routers to then be exported and attached to the app router. The app router is what the server will be running in the index.ts file.

# Expected payload:
Here I will provide examples if what some of the routes will expect as inputs and what it will return to the user. Examples will be images of usage via postman.

- Register route:
If a user request to register to Cointrip, the body of the api fetch call must be supplied with their first name, last name, email, and password.
Here is an example of the user object that will be posted to the backend.
{
  firstName, // required
  lastName, // required
  email, // required
  password, // required
  profilePicture, // will be set to 'https://imgur.com/uW4gXnS' by default
  isActive: true, // set to true always upon account creation
  isVerified: false,// The last 4 fields will be changed as the user continues through the register process
  hasBank: false, // 
  customerUrl: null, //
  fundingSource: null //
}

An example of a post request to register will be:
![register post body]("https://imgur.com/xGKJ9Tg")

An example of the response:
![register response]("https://imgur.com/pEmL6rD")
*Note* Although token is generated, it will not be used at this time. This repo is still a work in process and I inted to use HTTPOnly Cookies for superior security.


- Login Route and examples of error handling:
An exmaple of login response when using correct credentials: 
The login route requires a username and password
![successful login example]("https://imgur.com/nPdhaLc")

An example of login when missing a credential:
![missing credentials error]("https://imgur.com/JAhNfR9")

An exmaple of incorrect credentials:
![credentials error example]("https://imgur.com/exGReGr")

- GET request example:
Here is an example of a user requesting transactions, which will be filtered and displayed on the user's dashboard upon log in.
![get request example]("https://imgur.com/4s2bzpA")

