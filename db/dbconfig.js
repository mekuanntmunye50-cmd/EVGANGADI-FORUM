const mysql2 =require('mysql2');
const dbconnection = mysql2.createPool({
   user: "evangadi-admin" ,
   database: "evangadi_db",
   host: "locallhost",
   password: "mekuMAN@1221",
   connectionlimit:10
})
dbconnection.execute("select 'test'",(err,result)=>{
    if(err){
        console.error("Error executing query:", err);
        return;
    }else{
    console.log("Query result:", result);
}
});