const {createClient} = require("redis");
const client = createClient({
    url: "redis://default:lv2ctfdvcUKLf3iRR3BVavGLYNvM6BuQ@redis-11624.c280.us-central1-2.gce.redns.redis-cloud.com:11624",
});
client.on("error", (error)=>console.log("Redis client error", error));
const connectionRedis = ()=>{
    return client.connect()
        .then(()=>console.log("Redis connected"))
        .catch((error)=>console.log(error));
}
module.exports = {
    connectionRedis,
    redisClient: client,
}
