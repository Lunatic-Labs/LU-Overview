# LU-Overview
A dashboard to display various statistics about the members and projects of Lunatic Labs

## Resources
#### APIs
- [Github](https://docs.github.com/en/rest/guides/getting-started-with-the-rest-api) => Version Control
- Jibble => Platform to clock in/out
- [Slack](https://api.slack.com/apis/connections/events-api) => Communication platform

#### Tools
- [Nest](https://docs.nestjs.com/)
- [Nest CLI](https://docs.nestjs.com/cli/overview)
- [Angular](https://angular.io/docs)
- [Angular CLI](https://angular.io/cli)
- [Angular Material](https://material.angular.io/)

## Team Members
Name|Role
----|----
G Diaz|Architect
Nikki|...
Santos|...
Leroy|...
Min|...
Spencer|...

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

Angular: Navigate to `client/`, then run `npm run test`

Nest: Navigate to `server/`, then run `npm run test`

# Documentation

## Server

### Github

#### Commits
/github/commits/{id}/{user}
Returns all commits from the repo specified by the id, optionally by author, limited to 1000.