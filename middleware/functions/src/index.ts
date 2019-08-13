import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as firebaseHelper from 'firebase-functions-helper';
import * as express from 'express';
import * as bodyParser from "body-parser";

admin.initializeApp(functions.config().firebase);

const db = admin.firestore();

const cors = require('cors');
const app = express();
const main = express();
const axios = require('axios');
const CircularJSON = require('circular-json');

//const querystring = require('querystring');

main.use('/api/v1', app);
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({ extended: false }));

const allowedOrigins = ['http://localhost:8110',
                      'http://devil.com',
                      'http://localhost:8100',
                      'http://localhost'];

app.use(cors({

  origin: function(origin, callback){
    // allow requests with no origin
    // (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

main.use(cors({

  origin: function(origin, callback){
    // allow requests with no origin
    // (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

const banksCollection = 'banks';
const usersCollection = 'users';

//This contains all the Constants for API End Points
const  AUTHENTICATION = "authentication";
const  REGISTRATION = "registration";
const  CLIENTS = "clients";
const  USER = "users";
const  DATATABLES = "datatables";
const  BENEFICIARIES = "beneficiaries";

/*
//Gender Codes as per Mifos Configuration Module
const MALE = 15;
const FEMALE = 53;
const LGBTTI = 54;

//Occupation Codes as per Mifos Configuration Module
const WAGE_EARNER= 55;
const PUBLIC_SERVANT= 56;
const ENTERPRENEUR= 57;
const INDEPENDENT	= 58;
const ASSOCIATION = 59;
const STUDENT = 60;
const OTHER = 61;
*/

const  MOBILE_NUMBER = "0123456789";
//IDs Office
const OFFICE_ID =1;
const WALLET_SAVINGS_PRODUCT_ID = 1; //165
const STAFF_ID = 2;//MOBILE ASSISTANT

const user: {
  status: string,
  user: {
    authentication: any,
    user: any,
    client: any,
    accounts : any
  },
  message: string
} = {
  status: "",
  user: {
    authentication: [],
    user: [],
    client: [],
    accounts : []
  },
  message: ""
};

const  ACCOUNT_TRANSFER = "accounttransfers";
const  SAVINGS_ACCOUNTS = "savingsaccounts";
/*const  RECURRING_ACCOUNTS = "recurringdepositaccounts";
const  SEARCH = "search";
const  DOCUMENTS = "documents";
const  TWOFACTOR = "twofactor";
const  RUN_REPORT = "runreports";*/

//BASE API PATH
const instance = axios.create({
  baseURL: 'https://mobile.openmf.org:443/fineract-provider/api/v1/',
  timeout: 10000,
  headers: {'Fineract-Platform-TenantId': 'mobile','Content-Type': 'application/json'}  ,
  proxy: false,
  auth: {
    username: 'mifos',
    password: 'password'
  }
});

//SELF SERVICE API PATH
const instanceSelf = axios.create({
  baseURL: 'https://mobile.openmf.org:443/fineract-provider/api/v1/self/',
  timeout: 10000,
  headers: {'Fineract-Platform-TenantId': 'mobile','Content-Type': 'application/json'}  ,
  proxy: false
});

export const webApi = functions.https.onRequest(main);
/*
// Signup new users
app.post('/signup', (req, res) => {
    firebaseHelper.firestore
    .createNewDocument(db, usersCollection, req.body);
    res.json({"status": "success"});
})
*/
 
/*interface clientObj {
  officeId: number;
  firstname: string;
  lastname: string;
  externalId: string;
  dateFormat: string;
  locale: string;
  active: boolean;
  submittedOnDate: string;
  savingsProductId: number;
}*/

function pad(num:number, size:number): string {
  let s = num+"";
  while (s.length < size) s = "0" + s;
  return s;
}

// Create a new Mifos Client
app.post('/create', (req, res) => {  
  console.log("CREANDO AL CLIENTE");
  const month_names =["January","February","March",
                    "April","May","June",
                    "July","August","September",
                    "October","November","December"];
  
  const day = new Date().getDate();
  const month_index = new Date().getMonth();
  const year = new Date().getFullYear();  
  const dateActual = "" + day + " " + month_names[month_index] + " " + year;
  const data = '{"officeId": '+OFFICE_ID+', "staffId": "'+STAFF_ID+'", "firstname": "MOBILE_NAME", "lastname":"MOBILE_LASTNAME","externalId":"'+req.body.email+'","dateFormat": "dd MMMM yyyy","locale": "en","active": false,"submittedOnDate":"'+dateActual+'", "savingsProductId": '+WALLET_SAVINGS_PRODUCT_ID+' }';
  console.log("SE ENVIA LA DATA PARA CREAR AL CLIENTE", data);
  instance.post(CLIENTS, data)
  .then(function (response) {
    //res.json(CircularJSON.stringify(response.data)).send();    
    const dataSelf = '{"accountNumber": "'+pad(CircularJSON.stringify(response.data.resourceId),9)+'", "firstName": "MOBILE_NAME", "lastName":"MOBILE_LASTNAME","mobileNumber":"'+MOBILE_NUMBER+'","username": "'+req.body.email+'","email": "'+req.body.email+'","password": "'+req.body.password+'","authenticationMode":"email" }';
    instanceSelf.post(REGISTRATION, dataSelf)
    .then(function (responseSelf) {
      user.status = "success";
      user.message = responseSelf.data;
      //res.json(CircularJSON.stringify(responseSelf.data)).send();
      res.json(user).send();

    })
    .catch(function (errorSelf) {
      console.log("ERROR SELF SERVICE CREATION ",errorSelf);
      res.json(CircularJSON.stringify(errorSelf)).send();
    });
  })
  .catch(function (error) {
    console.log("ERROR CLIENT CREATION ",error);
    res.json(CircularJSON.stringify(error)).send();
  });
})

// ACTIVATE an existing Mifos User
app.post('/activate', (req, res) => {
  const data = '{"requestId": "'+req.body.requestId+'", "authenticationToken": "'+req.body.authenticationToken+'"}';  
  instanceSelf.post(REGISTRATION+'/user',data)
  .then(function (response) {
    user.status = "success";
    user.message = response.data;
    //res.json(CircularJSON.stringify(response.data)).send();
    res.json(user).send();
  })
  .catch(function (error) {
    console.log(error);
    res.json(error).send();
  });
})

// ACTIVATE an existing Mifos User
app.post('/activateLevel1', (req, res) => {
  console.log("ACTIVANDO AL CLIENTE");
  const month_names =["January","February","March",
                    "April","May","June",
                    "July","August","September",
                    "October","November","December"];  
  const day = new Date().getDate();
  const month_index = new Date().getMonth();
  const year = new Date().getFullYear();  
  const dateActual = "" + day + " " + month_names[month_index] + " " + year;
  console.log("ACTIVATION DATA ", req.body);
  const data = '{"firstname": "'+req.body.firstname+'", "middlename": "'+req.body.middlename+'", "lastname": "'+req.body.lastname+'","mobileNo":"'+req.body.cellphone+'", "dateFormat":"dd MMMM yyyy","locale":"en","active": '+true+',"activationDate": "'+dateActual+'", "dateOfBirth": "'+req.body.dateofbirth+'", "genderId": "'+req.body.gender+'" }';
  console.log("SE ENVIA AL API DE CLIENTES", CircularJSON.stringify(data));
  console.log("Update Client Information");
  instance.put(CLIENTS+'/'+req.body.clientId, data)
  .then(function (response) {    
    console.log("Update DataTable Country of Birth");
    const dataCountryOfBirth = '{"Country": "'+req.body.country+'", "City": "'+req.body.state+'"}';
    console.log("SE ENVIA AL API DE DATATABLE COUNTRY", dataCountryOfBirth);
    instance.post(DATATABLES+'/Country of Birth/'+req.body.clientId, dataCountryOfBirth)
    .then(function (responseCountryOfBirth) {
      user.status = "success";
      user.message = responseCountryOfBirth.data;      
      console.log("Update DataTable Occupation");
      const dataOccupation = '{"Occupation_cd_Occupation": "'+req.body.occupation+'"}';
      console.log("SE ENVIA AL API DE DATATABLE OCCUPATION", dataOccupation);
      instance.post(DATATABLES+'/Occupation/'+req.body.clientId, dataOccupation)
      .then(function (responseOccupation) {
        user.status = "success";
        user.message = responseOccupation.data;
        const dataActivation = '{"locale": "en","dateFormat": "dd MMMM yyyy","activationDate": "'+dateActual+'"}';
        console.log("SE ENVIA AL API DE ACTIVATION COMMAND", dataActivation);
        instance.post(CLIENTS+'/'+req.body.clientId+'?command=activate', dataActivation)
        .then(function (responseActivation) {
          user.status = "success";
          user.message = responseActivation.data;
          res.json(user).send();
        })
        .catch(function (errorActivation) {
          console.log("ERROR errorActivation",errorActivation);
          res.json(CircularJSON.stringify(errorActivation)).send();
        });
      })
      .catch(function (errorOccupation) {
        console.log("ERROR errorOccupation",errorOccupation);
        res.json(CircularJSON.stringify(errorOccupation)).send();
      });
    })
    .catch(function (errorCountryOfBirth) {
      console.log("ERROR errorCountryOfBirth ",errorCountryOfBirth);
      res.json(CircularJSON.stringify(errorCountryOfBirth)).send();
    });    
  })  
  .catch(function (error) {
    console.log("ERROR ACTIVATE ",error);
    res.json(CircularJSON.stringify(error)).send();
  });
})

// Login an existing Mifos User
app.post('/login', (req, res) => { 
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log("LA IP ES ",ip);
  //console.log("username ",req.body.username);
  //console.log("password ",req.body.password);
  instanceSelf.post(AUTHENTICATION+'?username='+req.body.username+'&password='+req.body.password+'')
  .then(function (response) {
    //BEGIN USER GET DETAILS
    //console.log("LOGIN USER GET DETAILS");
    //console.log("LOGIN USER GET DETAILS ID ",response.data.userId);        
    //Se setean los valores que regresa la authenticacion
    user.user.authentication = response.data;
    instance.get(USER+"/"+response.data.userId)
      .then(function (responseUser) {
        //console.log("LOG COMPLETO GET DETAILS ",responseUser);
        //console.log("LOG DATA GET DETAILS ",responseUser.data);
        //Se setean los valores que regresa el user
        user.user.user = responseUser.data;
        //BEGIN CLIENT AUTH
        //console.log("LOGIN AUTH");      
        //console.log("LOGIN AUTH TOKEN ",response.data.base64EncodedAuthenticationKey);
        // `headers` are custom headers to be sent        
        instanceSelf.defaults.headers.get['Authorization'] = 'Basic '+response.data.base64EncodedAuthenticationKey;
        instanceSelf.get(CLIENTS+"/"+responseUser.data.clients[0].id)
          .then(function (responseSelf) {
            //console.log("LOG COMPLETO AUTH",responseSelf);
            //console.log("LOG DATA AUTH",responseSelf.data);
            //Se setean los valores que regresa el user
            user.user.client = responseSelf.data;
            console.log("ES USUARIO ACTIVO? ",responseSelf.data.active);
            if (responseSelf.data.active === "true"){
              console.log("SE TRAEN LOS DATOS DE LAS CUENTAS DE PRODUCTOS Y LOS SALDOS");
              instanceSelf.get(CLIENTS+"/"+responseUser.data.clients[0].id)
              .then(function (responseSelfAccounts) {
                //console.log("LOG COMPLETO AUTH",responseSelf);
                console.log("LOG DATA ACCOUNTS ",responseSelfAccounts.data);                
                //Se setean los valores que regresa el user
                user.user.accounts = responseSelfAccounts.data;
                //Se establece la respuesta de exito
                user.status = "success";
                //res.json(user).send();
              })
              .catch(function (errorSelf) {
                console.log("ERROR AUTH ", errorSelf);
                res.json(errorSelf).send();
              });
            };            
            //Se establece la respuesta de exito
            user.status = "success";
            res.json(user).send();
          })
          .catch(function (errorSelf) {
            console.log("ERROR AUTH ", errorSelf);
            res.json(errorSelf).send();
          });
        //END CLIENT AUTH
        //res.json(responseUser.data).send();
      })
      .catch(function (errorUser) {
        console.log(errorUser);
        res.json(errorUser).send();
      });
    //END USER GET DETAILS    
    //console.log("LOG COMPLETO LOGIN ",response);
    //console.log("LOG DATA LOGIN ",response.data);
    //res.json(response.data).send();
  })
  .catch(function (error) {
    console.log("LOGIN ERROR ",error);
    res.json(error).send();
  });
})


/*
ADD IN THIS SECTION ANY CALL TO THE FINERACT API REST 
*/
app.post('/transfertemplate', (req, res) => {
  instanceSelf.defaults.headers.common["Authorization"] = 'Basic '+req.body.key;
  instanceSelf.get(ACCOUNT_TRANSFER+"/"+"template")
  .then(function (response) {
    res.json({"data": response.data}).send();
    //console.log('Trying to get transfer template');
    //console.log(response.data);   
  })})

app.post('/getsatransactions', (req, res) => {
  instanceSelf.defaults.headers.common["Authorization"] = 'Basic '+req.body.key;
  instanceSelf.get(SAVINGS_ACCOUNTS+'/'+ req.body.id + '?'+'associations=transactions')
  .then(function (response) {
    res.json({"data": response.data}).send();
  })
})

app.post('/getsacharges' , (req, res) =>{
  instanceSelf.defaults.headers.common['Authorization'] = 'Basic '+req.body.key;
  instanceSelf.get(SAVINGS_ACCOUNTS+'/'+req.body.id + '/'+ 'charges')
  .then( function(response) {
    res.json({"data": response.data}).send();
  } )
} )


app.post('/gettpttemplate', (req, res) => {
  instanceSelf.defaults.headers.common['Authorization'] = 'Basic '+req.body.key;
  instanceSelf.get(SAVINGS_ACCOUNTS + '/template?type=tpt')
  .then( function(response) {
    res.json({"data": response.data}).send();
  } )
} )

app.post('/getptbeneficiary', (req, res) => {
  instanceSelf.defaults.headers.common['Authorization'] = 'Basic '+req.body.key;
  instanceSelf.get(BENEFICIARIES+'/tpt')
  .then( function(response) {
    res.json({"data": response.data}).send();
  })
} )

app.post('/maketransfer', (req, res) => {
  instanceSelf.defaults.headers.common['Authorization'] = 'Basic '+req.body.key;
  instanceSelf.post(ACCOUNT_TRANSFER, req.body.data)
  .then( function(response) {
    res.json({"data": response.data}).send();
  })
} )

app.post('/maketpttransfer', (req, res)=> {
  instanceSelf.defaults.headers.common['Authorization'] = 'Basic '+req.body.key;
  instanceSelf.post(ACCOUNT_TRANSFER+'?type=tpt', req.body.data)
  .then( function(response) {
    res.json({"data": response.data}).send();
  })
} )

app.post('/addbenefeciary', (req, res) => {
  instanceSelf.defaults.headers.common['Authorization'] = 'Basic '+ req.body.key;
  instanceSelf.post(BENEFICIARIES+'/tpt', req.body.data)
  .then( function(response) {
    res.json({"data": response.data}).send();
  })
})
/*
// Login an existing User
app.post('/login', (req, res) => {
  console.log("email ",req.body.email);
  const queryArray = ['email', '==', req.body.email];
  firebaseHelper.firestore
    .queryData(db, usersCollection, queryArray)    
    .then(doc => res.json({"status": "success"}).send(doc));
})
*/

// View all users
app.get('/users', (req, res) => {
    firebaseHelper.firestore
        .backup(db, usersCollection)
        .then(data => res.status(200).send(data))
})

// Add new bank
// tslint:disable-next-line: no-shadowed-variable
app.post('/banks', (req, res) => {
    firebaseHelper.firestore
    .createNewDocument(db, banksCollection, req.body);
    res.send('Create a new Bank');
})

// Update new bank
app.patch('/banks/:bankId', (req, res) => {
    firebaseHelper.firestore
        .updateDocument(db, banksCollection, req.params.bankId, req.body);
    res.send('Update a new Bank');
})

// View a bank
app.get('/banks/:bankId', (req, res) => {
    firebaseHelper.firestore
        .getDocument(db, banksCollection, req.params.bankId)
        .then(doc => res.status(200).send(doc));
})

// View all bank
app.get('/banks', (req, res) => {
    firebaseHelper.firestore
        .backup(db, banksCollection)
        .then(data => res.status(200).send(data))
})

// Delete a bank 
// tslint:disable-next-line: no-shadowed-variable
app.delete('/banks/:bankId', (req, res) => {
    firebaseHelper.firestore
        .deleteDocument(db, banksCollection, req.params.bankId);
    res.send('Bank is deleted');
})
