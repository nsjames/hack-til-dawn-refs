import config from './util/config'
import express from 'express';
const url = require('url');
import bodyParser from 'body-parser';
import cors from 'cors';
import * as Eos from 'eosjs';
const ecc = require('eosjs-ecc');

console.log('booting');

const app = express();
app.use(cors());


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const router = express.Router();

const eosNetwork = {
    host:config('EOS_HOST'),
    port:config('EOS_PORT')
};

const appname = config('APP_NAME');
const code = 'hackathon';
const host = () => `http://${eosNetwork.host}:${eosNetwork.port}`;
console.log('app key', config('APP_KEY'));
const signProvider = signargs => signargs.sign(signargs.buf, config('APP_KEY'));
const getEos = () => Eos.Localnet({httpEndpoint:host(), signProvider});

const write = () => getEos().contract(code);

const addClick = async (res, req) => {
    const userid = req.params.userid;
    if(!userid) return;
    const ip = req.ip;
    if(!ip) return;

    const iphash = ecc.sha256(ip);

    const appauth = {authorization:[appname]};
    (await write()).share(userid, iphash, appauth)
};

router.route('/:userid').get(async (req, res) => {
    await addClick(res, req);
    res.redirect('https://hack-til-dawn.com');
});


const port = config('PORT', 6543);
const listenHost = config('HOST', 'localhost');

app.use('/', router);
app.listen(port, listenHost);
console.log('Running on port: ' + port);