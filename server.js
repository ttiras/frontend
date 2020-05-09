const express = require("express");
const compression = require("compression");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const serviceAccount = require("./woodcraft-auth-41aa7-firebase-adminsdk-5z0jl-9e2713d9d9.json");
const path = require("path");
const app = express();
const Iyzipay = require("iyzipay");
const { request } = require("graphql-request");


app.use(bodyParser.json());

app.use(compression());
app.use(express.static(path.join(__dirname, "build")));
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS,PUT,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Accept");
  next();
});

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://woodcraft-auth-41aa7.firebaseio.com/",
  });
}

const setFirebaseAuthJWTClaims = (user) => {
  console.log('executed')
    const customClaims = {
      "https://hasura.io/jwt/claims": {
        "x-hasura-default-role": "user",
        "x-hasura-allowed-roles": ["user", "anonymous", "manager"],
        "x-hasura-user-id": user.uid,
      },
    };
    return admin
      .auth()
      .setCustomUserClaims(user.uid, customClaims)
      .then(() => {
        // Update real-time database to notify client to force refresh.
        const metadataRef = admin.database().ref("metadata/" + user.uid);
        // Set the refresh time to the current UTC timestamp.
        // This will be captured on the client to force a token refresh.
        return metadataRef.set({ refreshTime: new Date().getTime() });
        
      })
      .catch((error) => {
        console.log('setCustomClaim ERROR', error);
      });
  };

  app.use(express.static(path.join(__dirname, 'build')));
  app.get('/*', function (req, res) {
     res.sendFile(path.join(__dirname, 'build', 'index.html'));
   });

app.post("/claims", async function (req, res) {
try {
  await setFirebaseAuthJWTClaims(req.body.user);
  res.sendStatus(200);
} catch(err){
  console.log('claimsCall ERROR', err)
  res.sendStatus(500).send(err.message)
}
})

const iyzipay = new Iyzipay({
  apiKey: "sandbox-kItYZYkAbb0hmLBWWC9ZxE9HIEfaLPKl",
  secretKey: "sandbox-MhaWiZK4ACp3ovrBSm3MFfUP5bnnIAKi",
  uri: "https://sandbox-api.iyzipay.com",
});

var token = 1234;
var items ;

app.post("/iyzipay", function (req, res) {
  items = req.body.basketItems
  iyzipay.checkoutFormInitialize.create(req.body, function (err, result) {
    token = result.token;
    res.send(result)
    if(err)res.send(err.message)
  })
});

app.post("/payments", function (req, res) {
  iyzipay.checkoutForm.retrieve(
    {
      locale: Iyzipay.LOCALE.TR,
      token: token,
    },
    function (err, result) {
      if (err) {
        res.redirect(`${process.env.PUBLIC_URL}/failure`);
      }
      if (result.paymentStatus === "SUCCESS") {
        res.redirect(`/success/order/${result.basketId}`)
        const variables = {
          payment: {
            amount: result.price,
            binNumber: result.binNumber,
            installments: result.installment,
            fraudStatus: result.fraudStatus,
            iyziCommissionFee: result.iyziCommissionFee,
            iyziCommissionRateAmount: result.iyziCommissionRateAmount,
            lastFourDigits: result.lastFourDigits,
            mdStatus: result.mdStatus,
            order_id: result.basketId,
            paidPrice: result.paidPrice,
            paymentId:result.paymentId,
            token: result.token,
            itemTransactions: {data: result.itemTransactions.map((item)=>({
              itemId: item.itemId, paidPrice: item.paidPrice, paymentTransactionId: item.paymentTransactionId, price: item.price
            }))
              
          },
        }}
        const gql = `mutation addPayment(
  $payment: [payments_insert_input!]!
) {
  insert_payments(
    objects: $payment
  ) {
    affected_rows
  }
}`;
        request("https://woodcraft.herokuapp.com/v1/graphql", gql, variables)
          .then((res) => {
            items.map((item)=>{
              const mut = `mutation inc_Stock_SaleCount ($id: uuid!, $saleCount: Int!, $stock: Int!) {
                update_products(
                  where: {id: {_eq: $id}},
                  _inc: {saleCount: $saleCount , stock: $stock}
                ) {
                  affected_rows
                }
              }`
             const variables= { 
                id: item.id,
                saleCount: item.qty,
                stock: -item.qty 
          }
              request("https://woodcraft.herokuapp.com/v1/graphql", mut, variables).then(data=>console.log('inc', data)).catch((err)=>console.log('inc', err))
            })
          
        })
          .catch((err) => console.log('paymentMutation', err));
      }
    }
  );
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
