'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hello world! I know lots of Taylor Swift Lyrics. Ask me for one.')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'codebot') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

app.post('/webhook/', function (req, res) {
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
        let event = req.body.entry[0].messaging[i]
        let sender = event.sender.id
        if (event.message && event.message.text) {
            let text = event.message.text
            decideMessage(sender);
        }
    }
    res.sendStatus(200)
})

const token = "EAADk7mvTLxEBACgR50UQmZA8ERQL3EIBN9ZCD5F4wqGlx5XVjolaDZBBAHE6UCXo6rxHvt45TLmD5SupKuLHfh2oECpfmzPnIqvNEnNXH0v2qT8a6sqLVTvObSxZCv9uIdCJWPbPkkeITDnRO3axn7oCY7CEpxZBmS8ZBc4rEU8AZDZD"

const taylorquotes = [
"I could show you incredible things.",
"People are people and sometimes we change our minds.",
"Nice to meet you, where you been?",
"I hope you remember that today is never too late to be brand-new.",
"Taxi cabs and busy streets that never bring you back to me.",
"Screaming, crying, perfect storms.",
"Darling, I'm a nightmare dressed like a daydream.",
"I could dance to this beat forevermore.",
"This is the golden age of something good and right and real.",
"Nothing safe is worth the drive.",
"I got that red lip, classic thing that you like.",
"I make the moves up as I go.",
"When I was drowning, that's when I could finally breathe.",
"I'm dying to know: Is it killing you like it's killing me?",
"We play dumb but we know exactly what we're doing.",
"Because you know I love the players and you love the game.",
"Still all over me like a wine-stained dress I can't wear anymore.",
"I like the way you're everything I've ever wanted.",
"All I know is we said hello and your eyes looked like coming home.",
"I don't wanna dance if I'm not dancing with you.",
"Baby, I know places we won't be found.",
"I know your favorite songs and you tell me about your dreams.",
"You'll see me in hindsight tangled up in you all night.",
"We found wonderland — you and I got lost in it.",
"The best people in life are free.",
"Long live all the walls we crashed through — all the kingdom lights shined just for me and you.",
"The rest of the world was black and white but we were in screaming color.",
"We're happy, free, confused, and lonely at the same time.",
"Too busy dancing to get knocked off our feet.",
"Well, I don't know how it gets better than this.",
"We had this big, wide city all to ourselves.",
"Just because you're clean don't mean you don't miss it.",
"Time won't fly — it's like I'm paralyzed by it.",
"I've found time can heal most anything.",
"For the first time, what's past is past.",
"Wasn't it beautiful when you believed in everything?",
"I think when it's all over, it just comes back in flashes, you know?",
"I've found time can heal most anything.",
"My mind forgets to remind me you're a bad idea.",
"If you come my way, just don't.",
"Words, how little they mean when you're a little too late.",
"People like me are gone forever when you say goodbye.",
"Wondered how many girls he had loved and left haunted, but if he’s a ghost then I can be a phantom.",
"And he can be my jailer, Burton to this Taylor.",
"Baby, let the games begin.",
"And I bury hatchets but I keep maps of where I put ‘em.",
"I swear I don’t love the drama, it loves me.",
"I can’t let you go, your handprints on my soul.",
"…For every lie I tell them, they tell me three.",
"This is how the world works, you gotta leave before you get left.",
"They’re burning all the witches even if you aren’t one.",
"Love made me crazy. If it doesn’t, you ain’t doin’ it right.",
"For you, I would cross the line. I would waste my time. I would lose my mind.",
"My reputation’s never been worse, so you must like me for me.",
"Handsome, you’re a mansion with a view.",
"Honey, I rose up from the dead. I do it all the time.",
"I don’t trust nobody and nobody trusts me.",
"All eyes on us, you make everyone disappear.",
"You did a number on me, but honestly… who’s counting?",
"You make me so happy it turns back to sad.",
"We were jet set Bonnie and Clyde.",
"It hit you like a shotgun shot in the heart.",
"Say you fancy me not fancy stuff",
"We love without reason.",
"I’m a mess, but I’m the mess that you wanted.",
"And if I get burned at least we were electrified.",
"Even in my worst lies, you saw the truth in me.",
"I want your midnights."
]

function decideMessage(sender) {
    var randomQuoteIndex = Math.random % taylorquotes.length
    sendTextMessage(sender, taylorquotes[randomQuoteIndex])
}

function sendTextMessage(sender, text) {
    let messageData = { text:text }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})

