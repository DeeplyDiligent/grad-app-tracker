const functions = require('firebase-functions');
const fetch = require("node-fetch");

exports.fetch = functions.https.onRequest((request, response) => {
    console.log(request.query.url)
    fetch(request.query.url).then(page=>page.text()).then(page => {
        console.log(page)
        response.set("Access-Control-Allow-Origin", "*");
        response.status(200).send(page);
        return true
    }).catch(e=>response.status(400).send())
});
