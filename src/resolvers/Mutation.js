const { getUserId } = require('../utils.js')
const { JWT_SECRET } = require('../.secrets.js')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

async function signup(parent, args, context, info) {
    // Each await block receives a promise and pauses execution until it resolves
    const password = await bcrypt.hash(args.password, 10)
    const user = await context.prisma.createUser({ ...args, password })

    // JWT is being signed using the newly created user ID and secret key.
    // Note: How does #sign handle failure to create a user?
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: 86400 // expires in 24 hours
    })

    return {
        token,
        user,
    }
}

async function login(parent, args, context, info) {
    const user = await context.prisma.user({ email: args.email })
    if (!user) {
        throw new Error('No such user found')
    }

    const valid = await bcrypt.compare(args.password, user.password)
    if (!valid) {
        throw new Error('Invalid Password')
    }

    const token = jwt.sign({ userId: user.id}, JWT_SECRET, {
        expiresIn: 86400 // expires in 24 hours
    })

    return {
        token,
        user,
    }
}

function post(parent, args, context, info) {
    // This only posts for the current user. Will allow link creation for other users (no varying userId param)
    const userId = getUserId(context)
    return context.prisma.createLink({
        url: args.url,
        description: args.description,
        postedBy: { connect: { id: userId }},
    })
}

async function vote(parent, args, context, info) {
    const userId = getUserId(context)

    const linkExists = await context.prisma.$exists.vote({
        user: {id: userId},
        link: {id: args.linkId},
    })

    if (linkExists) {
        throw new Error('Already voted for link: ' + args.linkId)
    }

    return context.prisma.createVote({
        user: { connect: { id: userId }},
        link: { connect: { id: args.linkId }}
    })
}

module.exports = {
    signup,
    login,
    post,
    vote,
}