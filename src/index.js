const { GraphQLServer } = require('graphql-yoga')
const { prisma } = require('./generated/prisma-client')

const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const User = require('./resolvers/User')
const Link = require('./resolvers/Link')

const resolvers = {
    Query,
    Mutation,
    User,
    Link,
}


// I worked really hard on these resolvers. They're staying!
// const resolvers = {
//     Query: {
//         info: () => 'im not never null',
//         feed: (root, args, context, info) => {
//             return context.prisma.links()
//         },
//     },
//     Mutation: {
//         post: (root, args, context) => {
//            return context.prisma.createLink({
//                url: args.url,
//                description: args.description
//            })
//         },
//         updateLink: (parent, args) => {
//             const matchInd = links.findIndex(link => link.id == `link-${args.id}`)
//             if (matchInd !== (-1)) {
//                 args.id = `link-${args.id}`
//                 links[matchInd] = { ...links[matchInd], ...args }
//                 return links[matchInd]
//             }
//         },
//         deleteLink: (parent, args) => {
//             const matchInd = links.findIndex(link => link.id == `link-${args.id}`)
//             if (matchInd !== (-1)) {links.splice(matchInd, 1)}
//         }
//     },
// }

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: request => {
        return {
            ...request,
            prisma
        }
    },
})


server.start(() => {console.log('server is running on http://localhost:4000')})