# Getting started with Twitter Tip Bot FrontEnd

This is the web application for displaying the transaction feed that is happening on Twitter tip bot. You can search the twitter account to see the balance in different unit.
This web application is created from create-react-app and using bandchain.js

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
