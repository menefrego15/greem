const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fetch = require("node-fetch");

admin.initializeApp(functions.config().firebase);
exports.sendMessageTo = functions.firestore
  .document("users/{uid}/messages/lastMessage")
  .onWrite(async (event) => {
    const uid = event.after.get("userUid");
    const contactUid = event.after.get("contactUid");
    const title = event.after.get("sender");
    const pic = event.after.get("pic");
    const content = event.after.get("message");
    let userDoc = await admin.firestore().doc(`users/${uid}`).get();
    let Token = userDoc.get("token");
    console.log(Token);

    console.log("function before message inside on write");

    let response = fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        host: "exp.host",
        Accept: "application/json",
        "accept-encoding": "gzip, deflate",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        to: Token,
        title: title,
        body: content,
      }),
    });
    console.log(response);
  });
