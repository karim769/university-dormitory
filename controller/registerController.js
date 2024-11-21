const { response } = require('express');
const register =require('../models/register');
require('dotenv').config();
const jwt=require('jsonwebtoken');


async function generateJWT(parsedData){

  const {email} = parsedData;

  const token = await jwt.sign({ email }, process.env.SUCRETS_KEY);

  return token;
}



function logIn(req, res) {
    let body = '';
  
    req.on('data', chunk => {
      body += chunk.toString();
    });
  
    req.on('end', () => {
     
        const parsedData = body ? JSON.parse(body) : {};
  
        register.logIn(parsedData)
          .then( async response => {

            if(response==='Success log in'){
                   
              const token=  await generateJWT(parsedData);
            // Success: send token
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ massage:response,token }));
            }else {             
              res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ massage:response}));
            }
          })
          .catch(err => {
            // Failure: handle error   
         const statusCode = err.message === 'Invalid credentials' ? 401 : 500;
            res.writeHead(statusCode, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: err.message || 'Internal Server Error' }));
          });
     
    });
  
   
  }
  

function signUp(req,res){
    
        let body='';
           req.on('data',chunk => {
            body+=chunk.toString();

           })

           req.on('end',()=>{

            try{

             const parsedData = body ? JSON.parse(body) : {};
            register.signUp(parsedData)
            .then(async response =>{

              if(response==='Success sign up'){

                const token=await generateJWT(parsedData);
              res.writeHead(200,{ 'Content-Type': 'application/json' });
              res.end(JSON.stringify(
                {
                  massage:response,
                  token:token
                }

                ));
  
                  return;

              }else if(response === 'You already sign up'){

                res.writeHead(201,{ 'Content-Type': 'application/json' });
                res.end(JSON.stringify(
                  {
                    massage:'You already sign up',
                  }
  
                  ));

                  return ;

              }

                
            })
           } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid JSON format' }));
        }
        
    })
    
    }

module.exports={

logIn,
signUp

};