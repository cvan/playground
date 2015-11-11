# playground

A playground for experimenting with web services.


## Local Installation

Get started locally:

```
# Clone the git repository from GitHub
git clone git@github.com:cvan/playground.git

# Open the working directory
cd etherworld

# Install the Node dependencies
npm install

# Install and set up Redis (if used)
brew install redis
brew info redis
```


## Local Development

To start the WebSocket server and serve all files from the `public` directory:

    npm run dev

Then launch it from your favourite browser:

[__http://localhost:3000/__](http://localhost:3000/)

To run the server from a different port:

    PORT=8000 npm run dev


## Deployment

In production, the server is run like so:

    npm run prod

To run the server à la Heroku:

    foreman start web


## Licence

[MIT License](LICENSE)
