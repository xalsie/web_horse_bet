// ###################################################################################
// ## START IMPORT
// ## Library
import bodyParser from "body-parser";
import express from 'express';
import session from 'express-session';
import moment from 'moment';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import FSDB from 'file-system-db';
import { exit } from "process";
const raceList = new FSDB("./db/raceList.json", false);
// const listStart = new FSDB("./db/listStart.json", false);
// const listGrid = new FSDB("./db/listGrid.json", false);

const authList = new FSDB("./db/authpass.json", false);

// ################

// import { refreshByWeb } from './comptaHome.js';
// import * as webhookDiscord from './www/html/assets/js/webhook_func.js';

// ## END IMPORT
// ###################################################################################

const app = express();
const urlApp = '/horse';
const port = 20038;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(session({
	secret: '001/011100110110010101100011011100100110010101110100',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(haltOnTimedout);

app.listen(port, () => {
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
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~_Update: 06/12/2022_~~-->")
})

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
        }, 3000); // 5 minutes = 300000 ms
    }
    next();
}

// ###################################################################################
// ## START GET REQUEST
app.get(urlApp+'/auth', async (req, res) => {
    var data = fs.readFileSync(__dirname + "/www/html/login.html", { encoding: 'utf8' });

    res.setHeader("Content-Type", "text/html");
    res.writeHead(200);
    res.end(data);
})

app.get(urlApp+'/', async (req, res) => {
    if (req.session.loggedin) {
        var data = fs.readFileSync(__dirname + "/www/html/index.html", { encoding: 'utf8' });

		res.setHeader("Content-Type", "text/html");
        res.writeHead(200);
        res.end(data);
	} else {
		res.redirect(urlApp+'/auth');
	}
})

app.get(urlApp+'/race', async (req, res) => {
    if (req.session.loggedin) {
        var data = fs.readFileSync(__dirname + "/www/html/pages/race.html", { encoding: 'utf8' });

		res.setHeader("Content-Type", "text/html");
        res.writeHead(200);
        res.end(data);
	} else {
		res.redirect(urlApp+'/auth');
	}
})

app.get(urlApp+'/changelog', async (req, res) => {
    var data = fs.readFileSync(__dirname + "/www/html/changelog.html", { encoding: 'utf8' });

    res.setHeader("Content-Type", "text/html");
    res.writeHead(200);
    res.end(data);
})

// app.get(urlApp+'/inventaire', async (req, res) => {
//     var data = fs.readFileSync(__dirname + "/compta.json", { encoding: 'utf8' });

//     res.setHeader("Content-Type", "text/json");
//     res.writeHead(200);
//     res.end(data);
// })

// app.get(urlApp+'/getPseudoById', async (req, res) => {
//     var data = fs.readFileSync(__dirname + "/authPass.db", { encoding: 'utf8' });

//     try {
//         let myObj = JSON.parse(data);

//         let _rtn = (myObj.authList[req.query.id].pseudo)? myObj.authList[req.query.id].pseudo:myObj.authList[req.query.id].firstname+" "+myObj.authList[req.query.id].lastname;

//         res.setHeader("Content-Type", "text/html");
//         res.writeHead(202);
//         res.end(_rtn);
//     } catch (err) {
//         res.setHeader("Content-Type", "text/html");
//         res.writeHead(204);
//         res.end("{user supprimé}");
//     }
// })

app.get(urlApp+'/favicon.ico', async (req, res) => {
    var data = fs.readFileSync(__dirname + "/www/html/favicon.ico");
    
    res.setHeader("Content-Type", "image/x-icon");
    res.writeHead(200);
    res.end(data);
})

app.get(urlApp+'/assets/pictures/logo_horse_racing_dark.png', async (req, res) => {
    var data = fs.readFileSync(__dirname + "/www/html/assets/pictures/logo_horse_racing_dark.png");
    
    res.setHeader("Content-Type", "image/png");
    res.writeHead(200);
    res.end(data);
})

app.get(urlApp+'/assets/pictures/logo_horse_racing_white.png', async (req, res) => {
    var data = fs.readFileSync(__dirname + "/www/html/assets/pictures/logo_horse_racing_white.png");
    
    res.setHeader("Content-Type", "image/png");
    res.writeHead(200);
    res.end(data);
})

app.get(urlApp+'/assets/css/style.css', async (req, res) => {
    var data = fs.readFileSync(__dirname + "/www/html/assets/css/style.css");
    
    res.setHeader("Content-Type", "text/css");
    res.writeHead(200);
    res.end(data);
})

app.get(urlApp+'/assets/css/style.login.css', async (req, res) => {
    var data = fs.readFileSync(__dirname + "/www/html/assets/css/style.login.css");

    res.setHeader("Content-Type", "text/css");
    res.writeHead(200);
    res.end(data);
})

app.get(urlApp+'/assets/css/sb-admin-2.min.css', async (req, res) => {
    var data = fs.readFileSync(__dirname + "/www/html/assets/css/sb-admin-2.min.css");

    res.setHeader("Content-Type", "text/css");
    res.writeHead(200);
    res.end(data);
})

app.get(urlApp+'/assets/js/app-angular.js', async (req, res) => {
    var data = fs.readFileSync(__dirname + "/www/html/assets/js/app-angular.js");

    res.setHeader("Content-Type", "application/javascript");
    res.writeHead(200);
    res.end(data);
})

app.get(urlApp+'/assets/js/sb-admin-2.min.js', async (req, res) => {
    var data = fs.readFileSync(__dirname + "/www/html/assets/js/sb-admin-2.min.js");

    res.setHeader("Content-Type", "application/javascript");
    res.writeHead(200);
    res.end(data);
})

app.get(urlApp+'/assets/js/Chart.min.js', async (req, res) => {
    var data = fs.readFileSync(__dirname + "/www/html/assets/js/Chart.min.js");

    res.setHeader("Content-Type", "application/javascript");
    res.writeHead(200);
    res.end(data);
})

app.get(urlApp+'/assets/js/chart-area-demo.js', async (req, res) => {
    var data = fs.readFileSync(__dirname + "/www/html/assets/js/chart-area-demo.js");

    res.setHeader("Content-Type", "application/javascript");
    res.writeHead(200);
    res.end(data);
})

app.get(urlApp+'/assets/js/chart-pie-demo.js', async (req, res) => {
    var data = fs.readFileSync(__dirname + "/www/html/assets/js/chart-pie-demo.js");

    res.setHeader("Content-Type", "application/javascript");
    res.writeHead(200);
    res.end(data);
})

app.get(urlApp+'/logout', async (req, res) => {
    if (req.session.loggedin) {
		webhookDiscord.authOut(req.session.fname+" "+req.session.lname);

        req.session.destroy(function(err) {
            res.redirect('/auth');
        })
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
            req.session.permission = _returnPerm;

            req.session.timeout = 0;
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

// app.post(urlApp+'/userManagement', async (req, res) => {
//     var action = String(req.body.action);

//     if (!req.session.loggedin || req.session.permission == "0") {
//         action = false;

//         res.setHeader("Content-Type", "text/html");
//         res.writeHead(203);
//         res.end("Permission non approuvé");
//         return;
// 	}
    // ///////////////////////////////////////////////////////////////////////////////////////
    // A Vérifié
    
//     switch (action) {
//         case "getlist":
//             var data = fs.readFileSync(__dirname + "/authPass.db", { encoding: 'utf8' });

//             try {
//                 let myObj = JSON.parse(data);

//                 res.setHeader("Content-Type", "text/json");
//                 res.writeHead(202);
//                 res.end(JSON.stringify(myObj.authList));
//             } catch (err) {
//                 res.setHeader("Content-Type", "text/json");
//                 res.writeHead(204);
//                 res.end("{}");
//             }
//             break;
//         case "deleteuser":
//             var data = fs.readFileSync(__dirname + "/authPass.db", { encoding: 'utf8' });

//             webhookDiscord.toLogsDeleteProfile(req.body.id, req.session.fname+" "+req.session.lname);

//             try {
//                 let myObj = JSON.parse(data);
//                 delete myObj.authList[req.body.id];

//                 let i = 0;
//                 for (let key of Object.keys(myObj.authList)) {
//                     myObj.authList[key].id = i;
//                     myObj.authList[i] = myObj.authList[key];
//                     i++;
//                 }
//                 myObj.authList.pop();

//                 fs.writeFileSync(__dirname + "/authPass.db", JSON.stringify(myObj), { encoding: 'utf8' })
//                 .then(contents => {
//                     res.setHeader("Content-Type", "text/html");
//                     res.writeHead(201);
//                     res.end("OK");
//                 });
//             } catch (err) {
//                 res.setHeader("Content-Type", "text/html");
//                 res.writeHead(203);
//                 res.end(err);
//             }

//             break;
//         case "edituser":
//             var data = fs.readFileSync(__dirname + "/authPass.db", { encoding: 'utf8' });

//             webhookDiscord.toLogsEditProfile({"id": req.body.id, "firstname": req.body.firstname, "lastname": req.body.lastname, "pseudo": req.body.pseudo, "group": req.body.group, "grade": req.body.grade, "permission": ((req.body.permission == "true")? 1:0)}, req.session.fname+" "+req.session.lname);

//             try {
//                 let myObj = JSON.parse(data);

//                 myObj.authList[req.body.id].date_modif      = moment().add(2, "Hours").unix();
//                 myObj.authList[req.body.id].modif_id        = req.session.iduser;
//                 myObj.authList[req.body.id].pwd             = req.body.pwd;
//                 myObj.authList[req.body.id].firstname       = req.body.firstname;
//                 myObj.authList[req.body.id].lastname        = req.body.lastname;
//                 myObj.authList[req.body.id].pseudo          = req.body.pseudo;
//                 myObj.authList[req.body.id].group           = req.body.group;
//                 myObj.authList[req.body.id].grade           = req.body.grade;
//                 myObj.authList[req.body.id].permission      = req.body.permission;

//                 fs.writeFileSync(__dirname + "/authPass.db", JSON.stringify(myObj), { encoding: 'utf8' })
//                 .then(contents => {
//                     res.setHeader("Content-Type", "text/html");
//                     res.writeHead(201);
//                     res.end("OK");
//                 });
//             } catch (err) {
//                 res.setHeader("Content-Type", "text/html");
//                 res.writeHead(204);
//                 res.end(err);
//             }

//             break;
//         case "addUser":
//             var data = fs.readFileSync(__dirname + "/authPass.db", { encoding: 'utf8' });

//             webhookDiscord.toLogsAddProfile({"firstname": req.body.firstname, "lastname": req.body.lastname, "pseudo": req.body.pseudo, "group": req.body.group, "grade": req.body.grade, "permission": ((req.body.permission == "true")? 1:0)}, req.session.fname+" "+req.session.lname);

//             try {
//                 let myObj = JSON.parse(data);

//                 let sizeObj = myObj.authList.length;

//                 myObj.authList[sizeObj]                = {};
//                 myObj.authList[sizeObj].id             = sizeObj;
//                 myObj.authList[sizeObj].date_create    = moment().add(2, "Hours").unix();
//                 myObj.authList[sizeObj].date_modif     = moment().add(2, "Hours").unix();
//                 myObj.authList[sizeObj].modif_id       = req.session.iduser;
//                 myObj.authList[sizeObj].pwd            = req.body.pwd;
//                 myObj.authList[sizeObj].firstname      = req.body.firstname;
//                 myObj.authList[sizeObj].lastname       = req.body.lastname;
//                 myObj.authList[sizeObj].pseudo         = req.body.pseudo;
//                 myObj.authList[sizeObj].group          = req.body.group;
//                 myObj.authList[sizeObj].grade          = req.body.grade;
//                 myObj.authList[sizeObj].permission     = req.body.permission;

//                 fs.writeFileSync(__dirname + "/authPass.db", JSON.stringify(myObj), { encoding: 'utf8' })
//                 .then(contents => {
//                     res.setHeader("Content-Type", "text/html");
//                     res.writeHead(201);
//                     res.end("OK");
//                 });
//             } catch (err) {
//                 res.setHeader("Content-Type", "text/html");
//                 res.writeHead(203);
//                 res.end(err);
//             }
//             break;
//         default:
//             res.setHeader("Content-Type", "text/html");
//             res.writeHead(203);
//             res.end("Command not found.");
//             break;
//     }
// })

app.post(urlApp+'/getSession', (req, res) => {
    res.setHeader('Content-Type', 'text/json');
    res.writeHead(202);
    res.end(JSON.stringify(req.session));
})

app.post(urlApp+'/getListRace', async (req, res) => {
    var list = await raceList.get("raceList");
    var raceVictory = await raceList.get("raceVictory");

    var _raceList = [];
    var _raceVictory = [];
    // _rtn["raceList"] = [];
    // _rtn["raceVictory"] = [];
    // console.log(_rtn);

    // res.setHeader('Content-Type', 'text/json');
    // res.writeHead(202);
    // res.end(JSON.stringify([_raceList, _raceVictory]));

    var now = moment.unix(req.body.timestamp).format("YYYY-MM-DD");

    try {
        for (let listKey of Object.keys(list)) {
            if (now == moment.unix(list[listKey].date).format("YYYY-MM-DD")) {
                _raceList.push(list[listKey])

                if (list[listKey].isEnd == "true") {
                    for (let key of Object.keys(raceVictory)) {
                        if (list[listKey].id == raceVictory[key].id) {
                            _raceVictory.push(raceVictory[key])
                        }
                    }
                }
            }
        }
    } catch(e) {
        console.log("error :", e);
    }

    res.setHeader('Content-Type', 'text/json');
    res.writeHead(202);
    res.end(JSON.stringify([_raceList, _raceVictory]));
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

export default app;

(function(){
    if (typeof Object.defineProperty === 'function'){
      try{Object.defineProperty(Array.prototype,'sortBy',{value:sb}); }catch(e){}
    }
    if (!Array.prototype.sortBy) Array.prototype.sortBy = sb;
  
    function sb(f){
      for (var i=this.length;i;){
        var o = this[--i];
        this[i] = [].concat(f.call(o,o,i),o);
      }
      this.sort(function(a,b){
        for (var i=0,len=a.length;i<len;++i){
          if (a[i]!=b[i]) return a[i]<b[i]?-1:1;
        }
        return 0;
      });
      for (var i=this.length;i;){
        this[--i]=this[i][this[i].length-1];
      }
      return this;
    }
})();