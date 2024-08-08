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
import duplicate from "express-duplicate-request";
// OR
const duplicate = require("express-duplicate-request").default;

const express = require("express");
const app = express();

const dupReq1 = duplicate({
  expiration: "5ms",
});

app.use(dupReq1);

app.get("/", (req, res) => res.end("Hey!"));

app.listen(9000, () => console.log("Listening!"));
```

### Options

```javascript
{
  expiration: "2h", /* Expiration time of the request in memory
                     * should be an int followed by ms, s, m, h, d, w,
                     */
  property: "id", /* Property which contains the id
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