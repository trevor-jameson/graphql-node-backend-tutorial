const JWT_SECRET = require('./.secrets.js')
const jwt = require('jsonwebtoken')

function getUserId(context) {
    const Authorization = context.request.get('Authorization')
    if (Authorization) {
        const token = Authorization.replace('Bearer', "")
        const { userId } = jwt.verify(token, JWT_SECRET)
        return userId
    }

    throw new Error('Not Authenticated')
}

module.exports = {
    JWT_SECRET,
    getUserId
}