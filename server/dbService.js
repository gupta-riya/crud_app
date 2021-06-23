
const mysql = require('mysql');
const dotenv = require('dotenv');
let instance = null;

dotenv.config();


const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER , 
    password: process.env.PASSWORD ,
    database: process.env.DATABASE ,
    port: process.env.DB_PORT 

});

connection.connect((err)=>{
    if(err)
    {
        console.log(err.message);
    }
    // console.log('db ' + connection.state);
});


class DbService{
    static getDbServiceInstance(){
        return instance ? instance : new DbService();
    }

    async getAllData(){
        try{
            const response = await new Promise((resolve,reject)=>
            {
                const query = "SELECT * FROM users;";
                connection.query(query, (err,results)=>{
                    if(err) reject(new Error(err.message));
                    resolve(results);
                })
            });

            console.log(response);
            return response;
        }
        catch (error) {
            console.log(error);
        }
    }


    async insertNewName(name){
        try{

            const dateAdded = new Date();
            const insertId = await new Promise((resolve,reject)=>
            {
                const query = "INSERT INTO users (Name,DateAdded) VALUES(? , ?) ;";

                connection.query(query, [name,dateAdded] ,(err,result)=>{
                    if(err) reject(new Error(err.message));
                    resolve(result.insertId);
                })
            });

            return{

                Id : insertId,
                Name : name,
                DateAdded: dateAdded
            };
            // return response;

        }catch(err){
            console.log(err);
        }
    }

    async deleteRowById(id)
    {
        try{
            
           
            id = parseInt(id, 10);
           
            const response = await new Promise((resolve,reject)=>
                {
                    const query = "DELETE FROM users WHERE Id = ?";

                    connection.query(query, [id] ,(err,result)=>{
                        if(err) reject(new Error(err.message));
                        resolve(result.affectedRows);
                    })
                });


                return response===1? true:false;

        }catch(err)
        {
            console.log(err);
            return false;
        }


    }


    async updateNameById(id, name)
    {
        try{
            
           
            id = parseInt(id, 10);
           
            const response = await new Promise((resolve,reject)=>
                {
                    const query = "UPDATE users SET Name = ? WHERE Id = ?";

                    connection.query(query, [name,id] ,(err,result)=>{
                        if(err) reject(new Error(err.message));
                        resolve(result.affectedRows);
                    })
                });


                return response===1? true:false;

        }catch(err)
        {
            console.log(err);
            return false;
        }
    }


    async searchByName(name)
    {
        try{
           
            
            const response = await new Promise((resolve,reject)=>
                {
                    const query = "SELECT * FROM users WHERE Name = ?";

                    connection.query(query, [name] ,(err,result)=>{
                        if(err) reject(new Error(err.message));
                        resolve(result);
                    })
                });


                return response;

        }catch(err)
        {
            console.log(err);
            return false;
        } 
    }

}

module.exports = DbService;


