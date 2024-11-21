const pool = require('./db');
const bcrypt=require('bcrypt');

 async function signUp(parsedData) {

  return new Promise( (resolve,reject)=>{

    pool.query("select * from students where email=?",[parsedData.email])
    .then(async result=>{

        if(result[0].length>0){

           return resolve('You already sign up');
        }

        const insertQuery = "INSERT INTO students ( firstName, lastName,email,phone,password) VALUES (?, ?, ?, ?, ?)";
        const hashPassword=await bcrypt.hash(parsedData.password,10);
         pool.query(insertQuery, [parsedData.firstName, parsedData.lastName, parsedData.email, parsedData.phone,hashPassword]);
         return resolve('Success sign up');

    }).catch (err => {

        if(err) return reject(err);

  })
   

})

 }


function logIn(parsedData) {

    const query = "SELECT * FROM students WHERE email = ?";
    return new Promise(  (resolve, reject) => {

           pool.query(query, [parsedData.email])
           .then(async res => {

            if(res[0].length===0){
        
                return resolve('You do not sign up yet,please sign up ');
            
            }

            const hashPassword= res[0][0].password;
            const match= await bcrypt.compare(parsedData.password,hashPassword);
            if(match){

             return resolve('Success log in'); // Return the token on success

            }else {

                resolve('Invalid credentials');

            }
          })
          .catch (err => { 

           return  reject(err);
        }) 
    });
  }
  

module.exports = { signUp,logIn };
