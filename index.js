// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
const admin1 = require('firebase-admin');
var serviceAccount = require("./location.json");

admin.initializeApp();
var other = admin1.initializeApp({
    credential: admin1.credential.cert(serviceAccount),

    databaseURL: "https://location-88963.firebaseio.com/"

}, "other");
var db1 = other.database();
var ref1 = db1.ref("/");



exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
    console.log('Request headers: ' + JSON.stringify(request.headers));
    //console.log(ref1);
    console.log("hello");
    //console.log(db1);

    console.log('Request body: ' + JSON.stringify(request.body));
    // An action is a string used to identify what needs to be done in fulfillment
    let action = request.body.result.action; // https://dialogflow.com/docs/actions-and-parameters
    console.log('Actions = ' + JSON.stringify(action));

    let query = request.body.result.resolvedQuery;

    // Parameters are any entites that Dialogflow has extracted from the request.
    const parameters = request.body.result.parameters; // https://dialogflow.com/docs/actions-and-parameters
    //console.log(parameters);

    // Contexts are objects used to track and store conversation state
    const inputContexts = request.body.result.contexts; // https://dialogflow.com/docs/contexts

    if (action === 'is_available') {
        console.log(parameters['items-entities']);
        item_name = parameters['items-entities'];


        //
        // Check if the user is in our DB
        admin.firestore().collection('items').where('item_name', '==', item_name).limit(1).get()
            .then(snapshot => {

                let item = snapshot.docs[0]
                //console.log(item);

                //console.log(item['id']);
                //console.log(item.data());
                //console.log((item.data()).item_price);


                if (!item) {
                    // Add the user to DB

                    sendResponse('I am sorry.We donot stock ' + item_name);


                } else {
                    // User in DB
                    if ((item.data()).is_available === 'no') {
                        sendResponse('We are out of ' + item_name);

                    } else {
                        //console.log(ref1);


                        var p1 = item.data().p1;
                        var p2 = item.data().p2;
                        p1 = p1 + "";
                        p2 = p2 + "";
                        ref1.set({
                            p1: p1,
                            p2: p2

                        }, function(error) {
                            if (error) {

                                console.log("Data could not be saved." + error);
                            } else {
                                sendResponse(item_name + '  costs ' + (item.data()).price + ".Please follow me.");

                                console.log("Data saved successfully.");
                            }
                        });



                    }
                }
            });
    }

    // Function to send correctly formatted responses to Dialogflow which are then sent to the user
    function sendResponse(responseToUser) {
        // if the response is a string send it as a response to the user
        if (typeof responseToUser === 'string') {
            let responseJson = {};
            responseJson.speech = responseToUser; // spoken response
            responseJson.displayText = responseToUser; // displayed response
            response.json(responseJson); // Send response to Dialogflow
        } else {
            // If the response to the user includes rich responses or contexts send them to Dialogflow
            let responseJson = {};

            // If speech or displayText is defined, use it to respond (if one isn't defined use the other's value)
            responseJson.speech = responseToUser.speech || responseToUser.displayText;
            responseJson.displayText = responseToUser.displayText || responseToUser.speech;

            // Optional: add rich messages for integrations (https://dialogflow.com/docs/rich-messages)
            responseJson.data = responseToUser.richResponses;

            // Optional: add contexts (https://dialogflow.com/docs/contexts)
            responseJson.contextOut = responseToUser.outputContexts;

            response.json(responseJson); // Send response to Dialogflow
        }
    }
});
