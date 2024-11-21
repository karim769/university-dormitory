const db =require('./db');

// CRUD operations
  function send(parsedData,payload){

        return new Promise((resolve,reject)=>{

            get(payload.email)
            .then( res => {

        if(res.length!==0){

            return resolve({massage:'Already sent request:',request:res});
        
        }


        const query='insert into requests (email, requestDate,roomNumber) values(?,?,?)';

        const requestDate = new Date().toISOString().slice(0, 10); // YYYY-MM-DD format
  
        db.query(query, [payload.email,requestDate, parsedData.roomNumber])
          return resolve({massage:'Data inserted successfully:'});
        
    })

    .catch(err => reject(err));
    }) 

       
}

function get(email){

    const query='select * from requests where email=?';

   return new Promise ((resolve,reject) =>{

    db.query(query,[email])
    .then(res => {

       return resolve(res[0]);

    }).catch (err => {

        return reject(err);

    })

   }) 
}

function deleteReq(email){

   const query= 'DELETE FROM requests WHERE email = ?';

   db.query(query,[email]);


}


function getUnacptRequests(){

return new Promise((resolve,reject)=>{

const query ="select * from requests where status='pending'";

db.query(query)
.then(res =>{

   return resolve(res[0]);


})
.catch(err => reject(err));


})


}

function approveRequest(email){

    const query="UPDATE requests SET status = 'approved' WHERE email=?";

    db.query(query,[email]);

}

module.exports={

send,
get,
deleteReq,
getUnacptRequests,
approveRequest

};