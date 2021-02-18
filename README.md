# LU-Overview
A dashboard to display various statistics about the members and projects of Lunatic Labs

## Resource
#### APIs
- [Github](https://docs.github.com/en/rest/guides/getting-started-with-the-rest-api) => Version Control
- Jibble => Platform to clock in/out
- [Slack](https://api.slack.com/apis/connections/events-api) => Communication platform

#### Tools
- [Nest](https://docs.nestjs.com/)
- [Nest CLI](https://docs.nestjs.com/cli/overview)
- [Angular](https://angular.io/docs)
- [Angular CLI](https://angular.io/cli)

## Technologies
- Frontend => Angular

  Angular:
    This framework is used for building single-page client applications using HTML and TypeScript. Angular will be able to give us the tools as well as design patterns to build our project. It helps with structuring code conveniently and helps with time management and code readability as you won’t have to spend much time going through and figuring out what a piece of code does with properly crafted code. This will be essential with creating our frontend.

- Backend => Node.js

  Node.JS:
    Node.JS is a run-time environment that allows us to execute a program written in JavaScript. Node JS is helpful in building fast, scalable network applications, this is because of its ability to handle a large number of connections at the same time with high throughput. This makes it so that the adaptation of JavaScript is easier for the machine language to execute which makes the execution of the code much faster. This will be essential with the creation our backend of our dashboard.

- Database => MongoDB

  MongoDB:
    MongoDB is a document-oriented NoSQL database that is helpful because it provides scalability and flexibility for what you are querying or indexing and can store a high volume of data. And instead of using tables and rows as in traditional relational databases, MongoDB uses documents which are basically equivalent to relational database tables. Overall, this application is easier to use than a traditional relational database. And so, we plan on using this application for the backend of our dashboard.

## Team Members
Name|Role
----|----
G Diaz|Architect
Nikki|...
Santos|...
Leroy|...
Min|...
Spencer|...

## What MVP is?

Add a description of what mvp means for this product.

1. Do we need auth for each user? Yes/No
1. Do we need reactive graphs at this moment? Yes/No
1. Do we need to render detail information about each user at this moment? Yes/No

# Installation

1. Follow the instructions to install an node version manager for [Windows](https://github.com/coreybutler/nvm-windows) or [Mac/Linux](https://github.com/nvm-sh/nvm).
2. Run 
	```sh
	nvm install 14.15.4
	nvm use 14.15.4
	``` 
	Nvm for windows will not automatically switch versions
3. Run 
	```sh
	npm install -g @nestjs/cli
	npm install -g @angular/cli
	```
4. Clone the project
5. Navigate to the `server/` folder in the project and run `npm install`, then do the same for the `client/` folder.

# Running

Angular: Navigate to `client/`, then run `ng serve`. Open <http://localhost:4200/>

Nest: Navigate to `server/`, then run `npm run start:dev`. Open <http://localhost:3000/>

Both of the apps will automatically reload if you change any of the source files.

To run tests:

Angular: Navigate to `server/`, then run `npm run test`

Nest: Navigate to `server/`, then run `npm run test`