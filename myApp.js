
var express = require('express');
var app = express();

// --> 7)  Mount the Logger middleware here
// Build a simple logger. For every request, it should log to the console a string taking the following format: method path - ip. An example would look like this: GET /json - ::ffff:127.0.0.1. Note that there is a space between method and path and that the dash separating path and ip is surrounded by a space on both sides. You can get the request method (http verb), the relative route path, and the caller’s ip from the request object using req.method, req.path and req.ip. Remember to call next() when you are done, or your server will be stuck forever. Be sure to have the ‘Logs’ opened, and see what happens when some request arrives.
let logger = (req, res, next) => {
  console.log(req.method + ' ' + req.path + ' - ' +  req.ip);
  next();
}

app.use((req, res, next) => logger(req, res, next));

// --> 11)  Mount the body-parser middleware  here
// Note: extended=false is a configuration option that tells the parser to use the classic encoding. When using it, values can be only strings or arrays. The extended version allows more data flexibility, but it is outmatched by JSON.
app.use(bodyParser.urlencoded({extended: false}))
// app.use(bodyParser.json()); // do i need this?


/** 1) Meet the node console. */
console.log("Hello World");

/** 2) A first working Express Server */
app.get('/', (req, res) => res.send('Hello Express'))

/** 3) Serve an HTML file */
app.get("/", (req, res) => res.sendFile(__dirname + '/views/index.html'));

/** 4) Serve static assets  */
// Mount the express.static() middleware for all requests with app.use(). The absolute path to the assets folder is __dirname + /public.
app.use(express.static(__dirname + '/public'));

/** 5) serve JSON on a specific route */
// app.get("/json", (req, res) => res.json({"message": "Hello json"}))

/** 6) Use the .env file to configure the app */
app.get("/json", (req, res) => {
  let message = "Hello json"
  process.env.MESSAGE_STYLE === "uppercase" ? message = message.toUpperCase() : message
  return res.json({"message": message})
})
 
/** 7) Root-level Middleware - A logger */
//  place it before all the routes !

/** 8) Chaining middleware. A Time server */
// In the route app.get('/now', ...) chain a middleware function and the final handler. In the middleware function you should add the current time to the request object in the req.time key. You can use new Date().toString(). In the handler, respond with a JSON object, taking the structure {time: req.time}.

let timeFunction = (req, res, next) => {
  req.time = new Date().toString(); // Hypothetical synchronous operation
  next();
}

let finalHandler = (req, res) => {
  res.json({ time: req.time });
}

app.get(
  "/now", 
  (req, res, next) => timeFunction(req, res, next), 
  (req, res) => finalHandler(req, res)
)

/** 9)  Get input from client - Route parameters */
// Build an echo server, mounted at the route GET /:word/echo. Respond with a JSON object, taking the structure {echo: word}. You can find the word to be repeated at req.params.word. You can test your route from your browser's address bar, visiting some matching routes, e.g. your-app-rootpath/freecodecamp/echo.
app.get("/:word/echo", (req, res) => res.json({"echo": req.params.word}) )

/** 10) Get input from client - Query parameters */
// /name?first=<firstname>&last=<lastname>

// Build an API endpoint, mounted at GET /name. Respond with a JSON document, taking the structure { name: 'firstname lastname'}. The first and last name parameters should be encoded in a query string e.g. ?first=firstname&last=lastname.

// Note: In the following exercise you are going to receive data from a POST request, at the same /name route path. If you want, you can use the method app.route(path).get(handler).post(handler). This syntax allows you to chain different verb handlers on the same path route. You can save a bit of typing, and have cleaner code.

// app.route(path).get(handler).post(handler)

// app.route("/name).get((req, res) => res.json({"name": `${req.query.first} ${req.query.last}`})).post(handler)

app.get("/name", (req, res) => res.json({"name": `${req.query.first} ${req.query.last}`}))


// app.get("/name", (req, res) => {
//   var { first: firstName, last: lastName } = req.query;
//   res.json({ name: `${firstName} ${lastName}`})
// })
  
/** 11) Get ready for POST Requests - the `body-parser` */
// place it before all the routes !


/** 12) Get data form POST  */
// Mount a POST handler at the path /name. It’s the same path as before. We have prepared a form in the html frontpage. It will submit the same data of exercise 10 (Query string). If the body-parser is configured correctly, you should find the parameters in the object req.body. Have a look at the usual library example:
app.post("/name", (req, res) => res.json({"name": `${req.body.first} ${req.body.last}`}));




// This would be part of the basic setup of an Express app
// but to allow FCC to run tests, the server is already active
app.listen((process.env.PORT || 3000), ()=> {
    console.log('Listening on port 3000');
} );

//---------- DO NOT EDIT BELOW THIS LINE --------------------

 module.exports = app;
