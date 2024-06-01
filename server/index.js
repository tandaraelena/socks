const express = require('express');

const app = express();

const server = app.listen(3000, () => {
  console.log("Server up and running")
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_, res) => {
  return res.status(200).send("Success")
})

const sendEmail = async (_) => {
  // Generate a random number between 0 and 1
  const randomNumber = Math.random();

  // Simulating an asynchronous operation, e.g., sending an email
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 95% chance to return true, 5% chance to return false - emails fail
  return randomNumber < 0.95;
}

// the API request that triggers the email
app.post('/emailEvents', async (req,res) => {
  const {eventName, userEmail} = req.body; 

  // I don't want to proceed without these mandatory values
  if (!eventName) {
    return res.status(400).json({
      error: "eventName is required!"
    })
  };
  if (!userEmail) {
    return res.status(400).json({
      error: "userEmail is required!"
    })
  };

  // data structure of the flows 
  const flows = {
    "websiteSignup": {
      actions: [
          sendEmail({
          email: userEmail,
          timer: true,
          subject: "Welcome!",
          text: "Need some socks?"
        }),
      ]
    },
    "socksPurchased": {
      actions: [
        sendEmail({
          email: false,
          timer: 0,
          subject: "Payment received",
          text: "Thank you!"
        }),
        sendEmail({
          email: userEmail,
          timer: true,
          subject: "Socks dispatched!",
          text: "Get ready!"
        })
      ]
    }
  }

  // again, I don't want to proceed without a valid flow trigger
  if(!Object.hasOwn(flows,eventName)) {
    return res.status(400).json({
      error: "A flow for the provided eventName doesn't exist"
    })
  }

  // now I have all the information to fire all the emails
  const currentFlow = flows[eventName];
  return await Promise.all(currentFlow.actions).then((values) => {
    console.log("Return values of the actions", values)
    return res.send(`Emails response: ${values}`);
  });
});

module.exports = {
  server,
  app
};