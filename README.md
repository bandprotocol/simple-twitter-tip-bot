# Twitter Tip Bot for Bandchain using Pyband and Bandchain.js

The example application that implemented by using Pyband and Bandchain.js

## Features

- Frontend: The web application is to display the `#testbot1151` tweet feed, there is account search function to show balance in different unit.
- Backend: The bot is to pull the `#testbot1151` tweet and send BAND automatically by detecting the keyword on pulled tweets.

## Deployment

You can deploy it by follow these steps below.

First, you have to replace `<YOUR_HOSTNAME>` with your hostname on `nginx/nginx.conf`. It can be `localhost` if you run locally.

```
 server {
    listen              80;
    listen              443;
    server_name  <YOUR_HOSTNAME>;
    ...
```

Second, you have to run both frontend and backend by using docker compose command on right below.

```
docker-compose up
```

## License

This software is created by [Band Protocol](https://bandprotocol.com) and is released under [the MIT License](https://opensource.org/licenses/MIT).

## Contributing

Any and all contributions are welcome! The process is simple: fork this repo, make your changes, and submit a pull request.
