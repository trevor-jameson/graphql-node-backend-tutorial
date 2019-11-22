const request = require('request')
const { prisma } = require('../src/generated/prisma-client')

function convertSpellToGraphqlReq(spell) {
    return {
      api5eId: spell["_id"],
      api5eIndex: spell["index"],
      name: spell["name"],
      description: spell["desc"][0],
      highLevel: spell["higher_level"][0],
      page: spell["page"],
      range: spell["range"],
      components: spell["components"].join(" "),
      concentration: !!(spell["concentration"] == "no"),
      duration: spell["duration"],
      castingTime: spell["casting_time"],
      material: spell["material"],
      level: spell["level"],
      school: spell["school"]["name"],
      klasses: spell["classes"].map(klass => klass.name).join(' ')
    };
}

function getSpells() {
    for (let i = 1; i < 320; i++) {
        // Make requests, interpolate spell number up to 319
    }
    request("http://dnd5eapi.co/api/spells/1", async (err, res, body) => {
        const spellBody = JSON.parse(body)
        const convertedSpell = convertSpellToGraphqlReq(spellBody)
        const result = await prisma.createSpell({SpellCreateInput: convertedSpell})
        console.log(result)
    })
}

getSpells()