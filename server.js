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

app.get('/getUserRepos', async function (request, response) {
    const authHeader = request.get("Authorization");

    if (!authHeader) {
        return response.status(401).json({ error: "Authorization header missing" });
    }

    await fetch("https://api.github.com/user/repos", {
        method: "GET",
        headers: {
            "Authorization": authHeader
        }
    }).then((response) => {
        return response.json();
    }).then((data) => {
        response.json(data);
    }).catch((error) => {
        console.error("Error fetching user repositories: ", error);
        response.status(500).json({ error: "Internal server error" });
    });
});

app.listen(4000, function () {
    console.log("CORS server running on port 4000");
});