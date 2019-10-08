const { GraphQLServer } = require('graphql-yoga')

let links = [{
    id: 'link-0',
    url: 'www.howtographql.com',
    description: 'Fullstack tutorial for GraphQL'
}]

let idCount = links.length

const resolvers = {
    Query: {
        info: () => 'im not never null',
        feed: () => links,
        link: (parent, args) => {
            return links.find(link => link.id == `link-${args.id}`)
        }
    },
    Mutation: {
        post: (parent, args) => {
            const link = {
                id: `link-${idCount++}`,
                description: args.description,
                url: args.url,
            }
            links.push(link)
            return link
        },
        updateLink: (parent, args) => {
            const matchInd = links.findIndex(link => link.id == `link-${args.id}`)
            if (matchInd !== (-1)) {
                args.id = `link-${args.id}`
                links[matchInd] = { ...links[matchInd], ...args }
                return links[matchInd]
            }
        },
        deleteLink: (parent, args) => {
            const matchInd = links.findIndex(link => link.id == `link-${args.id}`)
            if (matchInd !== (-1)) {links.splice(matchInd, 1)}
        }
    },
}

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers
})


server.start(() => {console.log('server is running on http://localhost:4000')})