# Getting started with Twitter Tip Bot FrontEnd

The web application is to display the transaction feed that is happening on Twitter tip bot including the account search function.
This web app is created from create-react-app and it's also using bandchain.js

## Installation

```
yarn install
```

## Deployment

### Running the server

#### Docker

```
docker build . --tag tw-bot-frontend
docker run -p 3001:3001 tw-bot-frontend
```

or

#### Yarn

```
yarn start
```
