const { send, get, deleteReq, getUnacptRequests, approveRequest } = require("../models/requests");
 
const jwt= require('jsonwebtoken');
require('dotenv').config();


function getTokenFromHeader(req) {
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.split(' ')[1]; // Extract the token after 'Bearer '
    }
    return null;
  }
  
// CRUD operations
async function sendRequest(req,res){

    let body='';

    const token=getTokenFromHeader(req);

    const payload =await jwt.verify(token,process.env.SUCRETS_KEY); // Verify the token

    req.on('data',(chunk => {
        body+=chunk.toString();
    }));

    req.on('end',(() => {
        
        const parsedData=JSON.parse(body);
        send(parsedData,payload)
        .then((result)=>{

        res.writeHead(200,{"content-type":"applications/json"});
        res.end(JSON.stringify(result));

        })
        .catch(err =>{

            res.writeHead(500,{"content-type":"applications/json"});
            res.end(JSON.stringify(err));

        })

        

    }))



}

async function getRequest(req, res) {
  
  const token=getTokenFromHeader(req);

  const payload =await jwt.verify(token,process.env.SUCRETS_KEY); // Verify the token

    get(payload.email)
      .then(result => {
        res.writeHead(200, { "Content-Type": "application/json" }); // Fixed Content-Type
        res.end(JSON.stringify(result));
      })
      .catch(err => {
        res.writeHead(500, { "Content-Type": "application/json" }); // Use proper error status code
        res.end(JSON.stringify({ message: err.message || "An error occurred" })); // Fixed message
      });
  }

  function getUnacceptableRequests(req,res){

    getUnacptRequests()
    .then(result => {

      res.writeHead(200,{"content-type":"application/json"});
      res.end(JSON.stringify(result));

    }).catch ( err => {

      res.writeHead(500, { "Content-Type": "application/json" }); // Use proper error status code
      res.end(JSON.stringify({ message: err.message || "An error occurred" }));

    })

  }
  

async function deleteRequest(req,res){

    const token=getTokenFromHeader(req);

    const payload = await jwt.verify(token, process.env.SUCRETS_KEY);

    deleteReq(payload.email);

    res.writeHead(200,{'content-type':'application/json'});

    res.end(JSON.stringify({massage:'Request deleted successfully'}));
}

function approvedRequest(req,res){

approveRequest(req.email);

res.writeHead(200,{"content-type":"application/json"});
res.end(JSON.stringify({massage:'approved request'}));


}


module.exports={

sendRequest,
getRequest,
deleteRequest,
getUnacceptableRequests,
approvedRequest

};