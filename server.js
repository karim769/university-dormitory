const http = require('http');
require("dotenv").config();
const { logIn, signUp } = require('./controller/registerController');
const { sendRequest, getRequest, deleteRequest, getUnacceptableRequests, approvedRequest } = require('./controller/requestsController');
const path = require('path');
const PORT = process.env.PORT || 5000;

function extractEmailMiddleware(req,res,next){

    const pathSegments = req.url.split('/').filter(Boolean); // Split the path into segments

    // Expect the path to be `/api/approvedrequest/:email`
    if (pathSegments[0] === 'api' && pathSegments[1] === 'approvedrequest' && pathSegments[2]) {
        req.email = pathSegments[2]; // Extract the Email (third segment)
        next(); // Call the next handler
    } else {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid path or missing ID' }));
    }

}


const requestListener = (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.method === 'POST' && req.url === '/api/login') {
        logIn(req, res);
    } else if (req.method === 'POST' && req.url === '/api/signup') {
        signUp(req, res);
    } else if (req.method === 'POST' && req.url === '/api/sendrequest') {
        sendRequest(req, res);
    } else if (req.method === 'GET' && req.url==='/api/getrequest') {
            getRequest(req, res);
    } else if (req.method === 'GET' && req.url === '/api/getunacceptablerequests') {
        getUnacceptableRequests(req, res);
    } else if (req.method === 'DELETE' && req.url === '/api/deleterequest') {

     deleteRequest(req, res);

    } else if (req.method === 'PUT' && req.url.startsWith('/api/approvedrequest')) {

        extractEmailMiddleware(req,res,() => {
            
            approvedRequest(req, res);
        });
   
    }  else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Not Found' }));
    }
};

const server = http.createServer(requestListener);

server.listen(PORT, 'localhost', () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

