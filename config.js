const config = {
    db: process.env.MONGO_URI,
    secret: process.env.JWT_SECRET,
    expiresPassword: 86400, // expires in 24hours
    saltRounds: 10
}

module.exports = config;