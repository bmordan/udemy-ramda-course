/* global test describe */

const R = require('ramda')
const http = require('popsicle')

const getDeck = () => http
  .get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1&cards=KH')
  .use(http.plugins.parse('json'))

const getDeckId = (res) => {
  return Promise.resolve(R.path(['body', 'deck_id'], res))
}

const drawCard = (deck_id) => http
  .get(`https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=1`)
  .use(http.plugins.parse('json'))

const getCardImage = (res) => {
  const cardImage = R.pipe(
    R.path(['body', 'cards']),
    R.head,
    R.path(['images', 'png']),
    R.identity
  )
  return Promise.resolve(cardImage(res))
}

describe.skip('working asynchronously', () => {
  test('draw a card', () => {
    const drawACard = R.pipeP(
      getDeck,
      getDeckId,
      drawCard,
      getCardImage
    )
    return expect(drawACard()).resolves.toEqual('http://deckofcardsapi.com/static/img/KH.png')
  })
})
