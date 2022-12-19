
async function checktotals(ids) {
  try {
    const cards = JSON.parse(fs.readFileSync('cards.json', 'utf8'))
    let totalScore = 0

    for (const id of ids) {
      const card = cards.find(card => card.id === id)
      if (!card) {
        throw new Error(`Card with ID ${id} not found`)
      }
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
    return totalScore
  } catch (error) {
    console.error(error)
    throw error
  }
}

const ids = [1, 2, 3, 4, 5]
checktotals(ids).then(totalScore => {
  console.log(`Total score: ${totalScore}`)
}).catch(error => {
  console.error(error)
})
