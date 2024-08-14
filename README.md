# express-duplicate-request

This middleware to Limit each IP duplicated requests per `window` made the client, due to lack of network, or nervous and frustrated endless cliking.

Inspiration from **romch007** [duplicate-requests](https://github.com/romch007/duplicate-requests)

## Install

```sh
$ npm install express-duplicate-request
# OR
$ yarn add express-duplicate-request
```

## Usage

```javascript
import { duplicateRequest } from "express-duplicate-request";
// OR
const { duplicateRequest } = require("express-duplicate-request");

const express = require("express");
const app = express();

const mySlow = duplicateRequest({
  expiration: 500, // One Request for Slow down 5 milliseconds each IP requests per `window`
});

// Apply the duplicate request middleware to all requests.
app.use(mySlow);

app.get("/", (req, res) => res.end("Hey!"));

app.listen(9000, () => console.log("Listening!"));
```

### Options

```javascript
{
  expiration: 500 , /* Expiration time of the request in memory
                     * should be Number [1000 = 1 seconds]
                     */

  property: "id",   /* Property which contains the id
                     * should be a string or a function 
                     * with a req paramater which returns a string
                     */

  prefix: "article.add", // Prefix to group requests in storage

  errorHandling: {
    statusCode: 429, // The status code to send if request is duplicated
    json: {} // Javascript plain object to send if request is duplicated
  },

  connectionUri: "" // Leave empty to store object in memory, or use redis:// or mongodb://
}
```

### Specific your Endpoint
```javascript
// Declare Specific 1
const specificSlow1 = duplicateRequest({
  expiration: 500, // Slow down 5 milliseconds
});

// Declare Specific 1
const specificSlow2 = duplicateRequest({
  expiration: 1000, // Slow down 1 seconds
});

app.get("/", specificSlow1, (req, res) => res.end("Hey! 5 milliseconds"));
app.get("/", specificSlow2, (req, res) => res.end("Hey! 1 seconds"))
```
