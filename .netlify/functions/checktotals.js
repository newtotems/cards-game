const faunadb = require('faunadb')

exports.handler = async (event, context) => {
  const q = faunadb.query
  const client = new faunadb.Client({ secret: process.env.FAUNADB_SERVER_SECRET })

  const ids = event.queryStringParameters.ids.split(',')
  let totalScore = 0

  try {
    for (const id of ids) {
      const card = await client.query(q.Get(q.Ref(q.Collection('cards'), id)))
      totalScore += card.score
      for (const rule of card.rules) {
        if (rule.condition === 'if_more_than_n_of_type') {
          // count the number of cards in the set that match the specified type
          const count = ids.filter(i => i !== id && card.type === rule.condition_value.type).length
          if (count > rule.condition_value.count) {
            totalScore += rule.value
          }
        }
          // handle other rule conditions
  }
}
  return {
    statusCode: 200,
    body: JSON.stringify({ totalScore })
  }
} catch (error) {
  return {
    statusCode: 400,
    body: JSON.stringify({ error: error.message })
  }
}
}

// Done

   
