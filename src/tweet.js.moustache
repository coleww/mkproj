var Twit = require('twit')
var T = new Twit({
  consumer_key: 'SPIDERS!!!!',
  consumer_secret: 'SPIDERS!!!!',
  access_token: 'SPIDERS!!!!',
  access_token_secret: 'SPIDERS!!!!'
})

module.exports = function (text) {
  T.post('statuses/update', {status: text}, function (err, data, response) {
    console.log(err)
    console.log(data)
    console.log(response)
  })
}
