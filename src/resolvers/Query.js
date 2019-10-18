async function feed(parent, {filter, skip, first}, context, info) {
    // Ternary checks whether filter arg was provided
    const where = filter ? {
        OR: [
            {description_contains: filter},
            {url_contains: filter},
        ],
    } : {}

    const links = await context.prisma.links({
        where,
        skip: skip,
        first: first,
    })
    return links
}


module.exports = {
    feed,
}