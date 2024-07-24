var express = require('express');
var cors = require('cors');
const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args));
var bodyParser = require('body-parser');
require('dotenv').config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/getAccessToken', async function (request, response) {
    const code = request.query.code;
    const params = `?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${code}`;

    await fetch("https://github.com/login/oauth/access_token" + params , {
        method: "POST",
        headers: {
            "Accept": "application/json"
        }
    }).then((response) => {
        return response.json();
    }).then((data) => {
        response.json(data);
    }).catch((error) => {
        console.error("Error fetching access token: ", error);
    });
});