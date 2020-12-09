# Twitter Tip Bot

The example application that implemented by using Pyband and Bandchain.js

## Feature

- Frontend: The web application is to display the `#testbot1151` tweet feed
- Backend: The bot is to pull the `#testbot1151` tweet and send BAND automatically by detecting the keyword on pulled tweets

## Deployment

### Nginx config

First, you have to replace `<YOUR_HOSTNAME>` with your hostname on `nginx/nginx.conf` to the domain name that you're using.
It can be `localhost` if you run locally.

```
 server {
    listen              80;
    listen              443;
    server_name  <YOUR_HOSTNAME>;
    ...
```

### Docker

```
docker-compose up
```
