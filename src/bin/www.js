const app=require("../app/app");
const config =require("config");
const server=app.listen((port=config.get("app.port")),()=>{
    console.log(`Server is running on port ${port}`);
    
})