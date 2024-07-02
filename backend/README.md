# Back end
---
This folder contains the backend of the app.
## Important packages we used
- [Express](https://expressjs.com/): Router and middleware for handling requests.
- [Mongoose](https://mongoosejs.com/): Database abstraction layer
- [cors](https://www.npmjs.com/package/cors): Middleware that enables cross-origin resource sharing.
- [Multer](https://www.npmjs.com/package/multer): Middleware for handling file uploads.
## App description
### Four models
- community: Defines the schema of community instances.
- post: Defines the schema of post instances.
- user: Defines the schema of user instances.
- comment: Defines the schema of comment instances.
### Routes
- auth: handle routing for user login/out registration requests
- community: handle routing for community requests
- post: handle routing for listing, creating, viewing posts requests
- VoteRoute: handle routing for voting or unvoting requests

## Install
In the `.../backend/` directory, run the following command to install dependencies:
```
yarn install
```

## Start the server
In the `.../backend/` directory, run the following command to start the server:
```
yarn start
```

If the server starts successfully, you should see the following message in the console:
`App server listening on port 3001!`
(Port number may differ depending on your system or your setting. You can specify this setting in `line:16 ./src/server.js `)

It is recommended to start the server before starting the front end.