import mysql from "mysql2/promise";

const db=mysql.createPool({
    host:"localhost",
    user:"root",
    password:"password",
    database:"ProductsApp",
    port:3306
});


export default db;
const $ = s => document.querySelector(s)
