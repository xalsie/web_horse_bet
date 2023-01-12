// ###################################################################################
// ## START IMPORT
// ## Library
import compression from "compression";
import express from 'express';
import session from 'express-session';
import moment from 'moment';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import FSDB from 'file-system-db';
// import { exit } from "process";

// import { exec } from 'child_process';

const raceList = new FSDB("./db/raceList.json", false);
const authList = new FSDB("./db/authpass.json", false);
const listBet = new FSDB("./db/listBet.json", false);

// ################
// ## START SOCKET.IO
// ## 

import http from 'http';
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// ################

// import { refreshByWeb } from './comptaHome.js';
// import * as webhookDiscord from './www/html/assets/js/webhook_func.js';

// ## END IMPORT
// ###################################################################################

const urlApp = '/horse';
const port = 20038;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const shouldCompress = (req, res) => {
    if (req.headers['x-no-compression']) {
        return false;
    }
    return compression.filter(req, res);
};

app.use(session({
	secret: '001/011100110110010101100011011100100110010101110100',
	resave: true,
	saveUninitialized: true
}));
app.use(compression({ // Compress all HTTP responses
    filter: shouldCompress,
    threshold: 0
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(haltOnTimedout);

server.listen(port, () => {
    console.log("<!--~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
    console.log("#  Horse Racing Bet")
    console.log(`#  URL Web listening at http://http://localhost/:${port}${urlApp}`)
    console.log("")
    console.log("#  Developed by    : 🐻｜LeGrizzly#0341")
    console.log(" _                _____          _               _")
    console.log("| |              / ____|        (_)             | |")
    console.log("| |        ___  | |  __   _ __   _   ____  ____ | |  _   _")
    console.log("| |       / _ \\ | | |_ | | \\__| | | |_  / |_  / | | | | | |")
    console.log("| |____  |  __/ | |__| | | |    | |  / /   / /  | | | |_| |")
    console.log("|______|  \\___|  \\_____| |_|    |_| /___| /___| |_|  \\__, |")
    console.log("                                                      __/ |")
    console.log("                                                     |___/")
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~_Update: 03/01/2022_~~-->")

    test()
})
// import { readFile } from 'fs/promises';
async function test() {
    console.log("Not test.")


    // const {bot_2, reddit} = JSON.parse(
    //     await readFile(
    //         new URL('./config.json', import.meta.url)
    //     )
    // );
    
    // console.log(bot_2)
    // console.log(reddit)

    // const {prefix, prefix2, releasePub, token} = bot_2;

    // var data = await raceList.get("raceList");

    // data.raceList[value][0].isEnd

    // raceList.set("raceList.102173176.0.isEnd", 1);

    // listBet.set("betting.102173176", '{"id_user":"0", "date_create":"0", "date_modif":"0", "listbet":"[\"1\",\"10\",\"2\"]"}')
}


function uuidGen(count) {
    var _sym = 'abcdefghijklmnopqrstuvwxyz1234567890';
    var str = '';

    for(var i = 0; i < count; i++)
        str += _sym[parseInt(Math.random() * (_sym.length))];

    return str;
}

var timeoutSession = [];

function haltOnTimedout(req, res, next) {
    if (req.session.loggedin) {
        if (!req.session.uuid) req.session.uuid = "$1/"+uuidGen(3)+"."+uuidGen(11);

        clearTimeout(timeoutSession[req.session.uuid]);

        console.log(req.session.fname+" "+req.session.lname);

        timeoutSession[req.session.uuid] = setTimeout(function() {
            // webhookDiscord.authOut(req.session.fname+" "+req.session.lname);
            req.session.destroy();
            return;
        }, 300000); // 5 minutes = 300000 ms
    }
    next();
}

// ###################################################################################
// ## START GET REQUEST
app.get(urlApp+'/auth', async (req, res) => {
    if (req.session.loggedin)
		res.redirect(urlApp+'/');

    var data = fs.readFileSync(__dirname + "/www/html/horse/login.html", { encoding: 'utf8' });

    res.setHeader("Content-Type", "text/html");
    res.writeHead(200);
    res.end(data);
})

app.get(urlApp+'/', async (req, res) => {
    if (req.session.loggedin) {
        var data = fs.readFileSync(__dirname + "/www/html/horse/index.html", { encoding: 'utf8' });

		res.setHeader("Content-Type", "text/html");
        res.writeHead(200);
        res.end(data);
	} else {
		res.redirect(urlApp+'/auth');
	}
})

app.get(urlApp+'/race', async (req, res) => {
    if (req.session.loggedin) {
        var data = fs.readFileSync(__dirname + "/www/html/horse/pages/race.html", { encoding: 'utf8' });

		res.setHeader("Content-Type", "text/html");
        res.writeHead(200);
        res.end(data);
	} else {
		res.redirect(urlApp+'/auth');
	}
})

app.get(urlApp+'/userManagement', async (req, res) => {
    if (req.session.loggedin) {
        var data = fs.readFileSync(__dirname + "/www/html/horse/pages/gestion_users.html", { encoding: 'utf8' });

		res.setHeader("Content-Type", "text/html");
        res.writeHead(200);
        res.end(data);
	} else {
		res.redirect(urlApp+'/auth');
	}
})

app.get(urlApp+'/raceManagement', async (req, res) => {
    if (req.session.loggedin) {
        var data = fs.readFileSync(__dirname + "/www/html/horse/pages/gestion_races.html", { encoding: 'utf8' });

		res.setHeader("Content-Type", "text/html");
        res.writeHead(200);
        res.end(data);
	} else {
		res.redirect(urlApp+'/auth');
	}
})

app.get(urlApp+'/changelog', async (req, res) => {
    var data = fs.readFileSync(__dirname + "/www/html/horse/changelog.html", { encoding: 'utf8' });

    res.setHeader("Content-Type", "text/html");
    res.writeHead(200);
    res.end(data);
})

app.get(urlApp+'/favicon.ico', async (req, res) => {
    var data = fs.readFileSync(__dirname + "/www/html/horse/favicon.ico");

    res.setHeader("Content-Type", "image/x-icon");
    res.writeHead(200);
    res.end(data);
})

app.get(urlApp+'/assets/pictures/logo_horse_racing_dark.png', async (req, res) => {
    var data = fs.readFileSync(__dirname + "/www/html/horse/assets/pictures/logo_horse_racing_dark.png");

    res.setHeader("Content-Type", "image/png");
    res.writeHead(200);
    res.end(data);
})

app.get(urlApp+'/assets/pictures/logo_horse_racing_white.png', async (req, res) => {
    var data = fs.readFileSync(__dirname + "/www/html/horse/assets/pictures/logo_horse_racing_white.png");

    res.setHeader("Content-Type", "image/png");
    res.writeHead(200);
    res.end(data);
})

app.get(urlApp+'/assets/css/style.css', async (req, res) => {
    var data = fs.readFileSync(__dirname + "/www/html/horse/assets/css/style.css");

    res.setHeader("Content-Type", "text/css");
    res.writeHead(200);
    res.end(data);
})

app.get(urlApp+'/assets/css/style.login.css', async (req, res) => {
    var data = fs.readFileSync(__dirname + "/www/html/horse/assets/css/style.login.css");

    res.setHeader("Content-Type", "text/css");
    res.writeHead(200);
    res.end(data);
})

app.get(urlApp+'/assets/js/app-angular.js', async (req, res) => {
    var data = fs.readFileSync(__dirname + "/www/html/horse/assets/js/app-angular.js");

    res.setHeader("Content-Type", "application/javascript");
    res.writeHead(200);
    res.end(data);
})

app.get(urlApp+'/logout', async (req, res) => {
    if (req.session.loggedin) {
		// webhookDiscord.authOut(req.session.fname+" "+req.session.lname);

        req.session.destroy(function(err) {
            res.redirect(urlApp+'/auth');
        })
	} else {
		res.redirect(urlApp+'/');
	}
})

app.get(urlApp+'/test', async (req, res) => {
    if (req.session.loggedin) {
		// webhookDiscord.authOut(req.session.fname+" "+req.session.lname);

        io.emit('toUpdateListRace');

        res.setHeader("Content-Type", "text/html");
        res.writeHead(200);
        res.end("toUpdateListRace() -> test");
	} else {
		res.redirect(urlApp+'/');
	}
})

// ## END GET REQUEST
// ###################################################################################

// ###################################################################################
// ## START POST REQUEST

// app.post(urlApp+'/savejson', async (req, res) => {
//     try {
//         let myObj = JSON.parse(req.body.action);

//         // webhookDiscord.toLogs(req.body.logs, req.body.section, req.session.fname+" "+req.session.lname);

//         for (let i = 1; i <= Object.keys(myObj.list[req.body.section]).length-2; i++) {
//             delete myObj.list[req.body.section][i].tmp;
//         }

//         fs.writeFileSync(__dirname + "/compta.json", JSON.stringify(myObj), { encoding: 'utf8' })
//         .then(contents => {
//             // refreshByWeb();
//         });

//         res.setHeader("Content-Type", "text/html");
//         res.writeHead(200);
//         res.end("success");
//     } catch (error) {
//         res.setHeader("Content-Type", "text/html");
//         res.writeHead(500);
//         res.end(error);
//     }
// })

// app.post(urlApp+'/saveprofile', async (req, res) => {
//     try {
//         let myPostObj = JSON.parse(req.body.action);

//         webhookDiscord.toLogsProfile(myPostObj, req.session.fname+" "+req.session.lname);

//         const data = JSON.parse(fs.readFileSync(__dirname + "/authPass.db", { encoding: 'utf8' }));
        
//         for (let i = 0; i < data.authList.length; i++) {
//             if (data.authList[i].id == myPostObj.id) {
                
//                 data.authList[i].date_modif = moment().add(2, "Hours").unix();
//                 data.authList[i].modif_name = myPostObj.pseudo;
//                 data.authList[i].firstname = myPostObj.firstname;
//                 data.authList[i].lastname = myPostObj.lastname;
//                 data.authList[i].pseudo = myPostObj.pseudo;
//                 data.authList[i].permission = myPostObj.permission;
//                 data.authList[i].grade = myPostObj.grade;
//                 data.authList[i].group = myPostObj.group;
//             }
//         }

//         req.session.fname = myPostObj.firstname;
//         req.session.lname = myPostObj.lastname;
//         req.session.pseudo = myPostObj.pseudo;
//         req.session.group = myPostObj.group;
//         req.session.grade = myPostObj.grade;
//         req.session.permission = myPostObj.permission;

//         fs.writeFileSync(__dirname + "/authPass.db", JSON.stringify(data), { encoding: 'utf8' });

//         res.setHeader("Content-Type", "text/html");
//         res.writeHead(200);
//         res.end("success");
//     } catch (error) {
//         res.setHeader("Content-Type", "text/html");
//         res.writeHead(500);
//         res.end(error);
//     }
// })

app.post(urlApp+'/auth', async (req, res) => {
    var floatingCode = String(req.body.floatingCode).toLowerCase();

	if (floatingCode) {
        var myObj = await authList.get("authList");

        var _return,
            _returnId,
            _returnFName,
            _returnLName,
            _returnPseudo,
            _returnGroup,
            _returnGrade,
            _returnCash,
            _returnPerm = false;

        for (let i=0; i < myObj.length; i++) {
            if (myObj[i]["pwd"] == floatingCode) {
                _return = true;
                _returnId = myObj[i]["id"].toString();
                _returnFName = myObj[i]["firstname"];
                _returnLName = myObj[i]["lastname"];
                _returnPseudo = myObj[i]["pseudo"];
                _returnGroup = myObj[i]["group"];
                _returnGrade = myObj[i]["grade"].toString();
                _returnCash = myObj[i]["cash"];
                _returnPerm = myObj[i]["permission"].toString();
            }
        }

        if (_return) {
            // webhookDiscord.auth(_returnFName+" "+_returnLName);

            req.session.loggedin = true;
            req.session.iduser = _returnId;
            req.session.fname = _returnFName;
            req.session.lname = _returnLName;
            req.session.pseudo = _returnPseudo;
            req.session.group = _returnGroup;
            req.session.grade = _returnGrade;
            req.session.cash = _returnCash;
            req.session.permission = _returnPerm;

            req.session.timeout = 0;

            io.on('connection', (socket) => {
                console.log(req.session.fname, req.session.lname, 'Connected');

                socket.on('chat message', msg => {
                    // io.emit('chat message', msg);
                    console.log("Message received", msg)
                })

                socket.on('disconnect', () => {
                  console.log(req.session.fname, req.session.lname, 'Disconnected');
                })
            })

            // return request POST
            res.setHeader("Content-Type", "text/html");
            res.writeHead(200);
            res.end('true');
        } else {
            res.setHeader("Content-Type", "text/html");
            res.writeHead(203);
            res.end('Incorrect Username and/or Password!');
        }
	} else {
        res.setHeader("Content-Type", "text/html");
        res.writeHead(203);
		res.end("Connexion user in progress!");
	}
})

app.post(urlApp+'/userManagement', async (req, res) => {
    var action = String(req.body.action);

    if (!req.session.loggedin || req.session.permission == "0") {
        action = false;

        res.setHeader("Content-Type", "text/html");
        res.writeHead(203);
        res.end("Permission non approuvé");
        return;
	}
    // ///////////////////////////////////////////////////////////////////////////////////////
    // A Vérifié

    switch (action) {
        case "getlist":
            // var data = fs.readFileSync(__dirname + "/authPass.db", { encoding: 'utf8' });
            var data = await authList.get("authList");

            // try {
                // let myObj = JSON.parse(data);

                res.setHeader("Content-Type", "text/json");
                res.writeHead(202);
                // res.end(JSON.stringify(myObj.authList));
                res.end(JSON.stringify(data));
            // } catch (err) {
                // res.setHeader("Content-Type", "text/json");
                // res.writeHead(204);
                // res.end("{}");
            // }
            break;
        case "deleteuser":
            var data = fs.readFileSync(__dirname + "/authPass.db", { encoding: 'utf8' });

            webhookDiscord.toLogsDeleteProfile(req.body.id, req.session.fname+" "+req.session.lname);

            try {
                let myObj = JSON.parse(data);
                delete myObj.authList[req.body.id];

                let i = 0;
                for (let key of Object.keys(myObj.authList)) {
                    myObj.authList[key].id = i;
                    myObj.authList[i] = myObj.authList[key];
                    i++;
                }
                myObj.authList.pop();

                // fs.writeFileSync(__dirname + "/authPass.db", JSON.stringify(myObj), { encoding: 'utf8' })
                // .then(contents => {
                    res.setHeader("Content-Type", "text/html");
                    res.writeHead(201);
                    res.end("OK");
                // });
            } catch (err) {
                res.setHeader("Content-Type", "text/html");
                res.writeHead(203);
                res.end(err);
            }

            break;
        case "edituser":
            var data = fs.readFileSync(__dirname + "/authPass.db", { encoding: 'utf8' });

            webhookDiscord.toLogsEditProfile({"id": req.body.id, "firstname": req.body.firstname, "lastname": req.body.lastname, "pseudo": req.body.pseudo, "group": req.body.group, "grade": req.body.grade, "permission": ((req.body.permission == "true")? 1:0)}, req.session.fname+" "+req.session.lname);

            try {
                let myObj = JSON.parse(data);

                myObj.authList[req.body.id].date_modif      = moment().add(2, "Hours").unix();
                myObj.authList[req.body.id].modif_id        = req.session.iduser;
                myObj.authList[req.body.id].pwd             = req.body.pwd;
                myObj.authList[req.body.id].firstname       = req.body.firstname;
                myObj.authList[req.body.id].lastname        = req.body.lastname;
                myObj.authList[req.body.id].pseudo          = req.body.pseudo;
                myObj.authList[req.body.id].group           = req.body.group;
                myObj.authList[req.body.id].grade           = req.body.grade;
                myObj.authList[req.body.id].permission      = req.body.permission;

                // fs.writeFileSync(__dirname + "/authPass.db", JSON.stringify(myObj), { encoding: 'utf8' })
                // .then(contents => {
                    res.setHeader("Content-Type", "text/html");
                    res.writeHead(201);
                    res.end("OK");
                // });
            } catch (err) {
                res.setHeader("Content-Type", "text/html");
                res.writeHead(204);
                res.end(err);
            }

            break;
        case "addUser":
            var data = fs.readFileSync(__dirname + "/authPass.db", { encoding: 'utf8' });

            webhookDiscord.toLogsAddProfile({"firstname": req.body.firstname, "lastname": req.body.lastname, "pseudo": req.body.pseudo, "group": req.body.group, "grade": req.body.grade, "permission": ((req.body.permission == "true")? 1:0)}, req.session.fname+" "+req.session.lname);

            try {
                let myObj = JSON.parse(data);

                let sizeObj = myObj.authList.length;

                myObj.authList[sizeObj]                = {};
                myObj.authList[sizeObj].id             = sizeObj;
                myObj.authList[sizeObj].date_create    = moment().add(2, "Hours").unix();
                myObj.authList[sizeObj].date_modif     = moment().add(2, "Hours").unix();
                myObj.authList[sizeObj].modif_id       = req.session.iduser;
                myObj.authList[sizeObj].pwd            = req.body.pwd;
                myObj.authList[sizeObj].firstname      = req.body.firstname;
                myObj.authList[sizeObj].lastname       = req.body.lastname;
                myObj.authList[sizeObj].pseudo         = req.body.pseudo;
                myObj.authList[sizeObj].group          = req.body.group;
                myObj.authList[sizeObj].grade          = req.body.grade;
                myObj.authList[sizeObj].permission     = req.body.permission;

                // fs.writeFileSync(__dirname + "/authPass.db", JSON.stringify(myObj), { encoding: 'utf8' })
                // .then(contents => {
                    res.setHeader("Content-Type", "text/html");
                    res.writeHead(201);
                    res.end("OK");
                // });
            } catch (err) {
                res.setHeader("Content-Type", "text/html");
                res.writeHead(203);
                res.end(err);
            }
            break;
        default:
            res.setHeader("Content-Type", "text/html");
            res.writeHead(203);
            res.end("Command not found.");
            break;
    }
})

app.post(urlApp+'/raceManagement', async (req, res) => {
    var action = String(req.body.action);

    if (!req.session.loggedin || req.session.permission == "0") {
        action = false;

        res.setHeader("Content-Type", "text/html");
        res.writeHead(203);
        res.end("Permission non approuvé");
        return;
	}

    switch (action) {
        case "getlist":
            var data = await raceList.get("raceList");

            var _rtn = [];

            for await (const [key, value] of Object.entries(data)) {
                _rtn.push(value[0])
            }

            res.setHeader("Content-Type", "text/json")
                .writeHead(202)
                .end(JSON.stringify(_rtn))
        break;
        case "getlistrunner":
            var id = String(req.body.id);
            var dataGrid = await raceList.get("raceGrid."+id);
            var dataVictory = await raceList.get("raceVictory."+id);

            var _rtnGrid = [];
            var _rtnVictory = [];

            // for await (const [key, value] of Object.entries(dataGrid)) {
            //     _rtnGrid.push(value[0])
            // }
            // for await (const [key, value] of Object.entries(dataVictory)) {
            //     _rtnVictory.push(value[0])
            // }

            res.setHeader("Content-Type", "text/json")
                .writeHead(202)
                .end(JSON.stringify({dataGrid, dataVictory}))
        break;
        case "race-delete":
            var id = String(req.body.id);

            try {
                if (raceList.has('raceList.'+id))
                    raceList.delete('raceList.'+id);

                if (raceList.has('raceGrid.'+id))
                    raceList.delete('raceGrid.'+id);

                if (raceList.has('raceVictory.'+id))
                    raceList.delete('raceVictory.'+id);

                io.emit('toUpdateListRace');

                res.setHeader("Content-Type", "text/html")
                    .writeHead(201)
                    .end("OK")
            } catch (err) {
                res.setHeader("Content-Type", "text/html")
                .writeHead(203)
                .end(err)
            }
            break;
        case "race-edit":
            var { id, checked, name, type, extent, terrain, date, time } = req.body;
            var statut = 0;
            
            if (checked == '1')
                statut = 'false'
            else if (checked == '2')
                statut = '2'
            else if (checked == '3')
                statut = 'true'

            try {
                if (raceList.has('raceList.'+String(id)))
                    raceList.set('raceList.'+String(id), [{"uuid": ("$1/"+uuidGen(3)+"."+uuidGen(11)), "id": String(id), "name": String(name), "type": String(type), "terrain": String(terrain), "extent": String(extent), "starters":"0", "img":"0", "isEnd": String(statut), "date": String(date), "time": String(time)}])

                io.emit('toUpdateListRace');

                res.setHeader("Content-Type", "text/html")
                    .writeHead(201)
                    .end("OK")
            } catch (err) {
                res.setHeader("Content-Type", "text/html")
                .writeHead(203)
                .end(err)
            }
            break;
        case "race-add":
            var { id, checked, name, type, extent, terrain, date, time } = req.body;
            var statut = 0;
            
            if (checked == '1')
                statut = 'false'
            else if (checked == '2')
                statut = '2'
            else if (checked == '3')
                statut = 'true'

            try {
                raceList.set('raceList.'+String(id), [{"uuid": ("$1/"+uuidGen(3)+"."+uuidGen(11)), "id": String(id), "name": String(name), "type": String(type), "terrain": String(terrain), "extent": String(extent), "starters":"0", "img":"0", "isEnd": String(statut), "date": String(date), "time": String(time)}])
                raceList.set('raceGrid.'+String(id), [])
                raceList.set('raceVictory.'+String(id)+'.podium', [])

                io.emit('toUpdateListRace');

                res.setHeader("Content-Type", "text/html")
                    .writeHead(201)
                    .end("OK")
            } catch (err) {
                res.setHeader("Content-Type", "text/html")
                .writeHead(203)
                .end(err)
            }
            break;
        case "race-edit-statut":
            // var data = await raceList.get("raceList");
            
            var id = String(req.body.id);
            var value = String(req.body.value);
            var statut = 0;
            
            if (value == '1')
                statut = 'false'
            else if (value == '2')
                statut = '2'
            else if (value == '3')
                statut = 'true'

            try {
                if (raceList.has('raceList.'+id))
                    raceList.set('raceList.'+id+'.0.isEnd', statut);

                io.emit('toUpdateListRace');

                res.setHeader("Content-Type", "text/html")
                    .writeHead(201)
                    .end("OK")
            } catch (err) {
                res.setHeader("Content-Type", "text/html")
                .writeHead(203)
                .end(err)
            }

            break;
        default:
            res.setHeader("Content-Type", "text/html");
            res.writeHead(203);
            res.end("Command not found.");
            break;
    }
})

app.post(urlApp+'/getSession', (req, res) => {
    if (!req.session.loggedin)
		res.redirect(urlApp+'/');

    res.setHeader('Content-Type', 'text/json');
    res.writeHead(202);
    res.end(JSON.stringify(req.session));
})

app.post(urlApp+'/getListRace', async (req, res) => {
    if (!req.session.loggedin) {
		res.setHeader('Content-Type', 'text/html');
        res.setHeader('Content-Length', 0);
        res.writeHead(500);
        res.end("Not Login!");
    } else {
        var list = await raceList.get("raceList");
        var raceVictory = await raceList.get("raceVictory");
    
        var _raceList = [];
        var _rV = new Array();
    
        var dateRequest = moment.unix(req.body.timestamp).format("YYYY-MM-DD");
    
        for (var listKey of Object.keys(list)) {
            if (dateRequest == moment.unix(list[listKey][0].date).format("YYYY-MM-DD")) {
                _raceList.push(list[listKey])
                if (list[listKey][0].isEnd == "true") { // fix
                    let _id = list[listKey][0].id;
                    _rV.push({'id': _id, 'podium': raceVictory[_id].podium});
                }
            }
        }
    
        var _arrStringReturn = JSON.stringify([_raceList, _rV]);
    
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Length', Buffer.byteLength(_arrStringReturn));
        res.writeHead(202);
        res.end(_arrStringReturn);
    }
})

app.post(urlApp+'/getPartant', async (req, res) => {
    if (!req.session.loggedin) {
		res.setHeader('Content-Type', 'text/html');
        res.setHeader('Content-Length', 0);
        res.writeHead(500);
        res.end("Not Login!");
    } else {
        var _idRace = req.body.idRace;
        var _race = await raceList.get(String("raceList."+_idRace));
        var _partant = await raceList.get(String("raceGrid."+_idRace));

        res.setHeader('Content-Type', 'text/json');
        res.writeHead(202);
        res.end(JSON.stringify([_race, _partant]));
    }
})

app.post(urlApp+'/podium', async (req, res) => {
    if (!req.session.loggedin) {
		res.setHeader('Content-Type', 'text/html');
        res.setHeader('Content-Length', 0);
        res.writeHead(500);
        res.end("Not Login!");
    } else {
        var _idRace = req.body.idRace;
        var _race = await raceList.get(String("raceList."+_idRace));
        var _partant = await raceList.get(String("raceGrid."+_idRace));

        var raceVictory = await raceList.get("raceVictory");

        res.setHeader('Content-Type', 'text/json');
        res.writeHead(202);
        res.end(JSON.stringify([_race, _partant]));
    }
})

app.post(urlApp+'/tovalidate', async (req, res) => {
    if (!req.session.loggedin)
		res.redirect(urlApp+'/');
    // var bet = JSON.parse(req.body);

    // if (bet.data[1]) // vérif if race terminé

    console.log(req.body)

    // save paris
    // listBet.set("betting.102173176", '{"id_user":"0", "date_create":"0", "date_modif":"0", "listbet":"[\"1\",\"10\",\"2\"]"}')

    // déduire le cash des paris de son compte puis save db

    res.setHeader('Content-Type', 'text/json')
        .writeHead(202)
        .end(JSON.stringify("true"))
})

// app.post(urlApp+'/getProfile', async (req, res) => {
//     const data = fs.readFileSync(__dirname + "/authPass.db", { encoding: 'utf8' });

//     var myObj = JSON.parse(data);

//     var remIndex = false;
//     for (let i = 0; i < myObj.authList.length; i++) {
//         if (myObj.authList[i].id == req.session.iduser) {
//             remIndex = i;

//             myObj.authList[i].pwd = "*****";
//             myObj.authList[i].modif_name = (myObj.authList[i].pseudo)? myObj.authList[i].pseudo:myObj.authList[i].firstname+" "+myObj.authList[i].lastname;

//             res.setHeader('Content-Type', 'text/json');
//             res.writeHead(202);
//             res.end(JSON.stringify(myObj.authList[i]));

//             break;
//         }
//     }
// })

// ## END POST REQUEST
// ###################################################################################

// /////////////////////////
// This route for Code 404
// file Not Found
app.all('*', (req, res) => {
    res.status(404).send('<h1>404! Page not found</h1>');
});

export default app;