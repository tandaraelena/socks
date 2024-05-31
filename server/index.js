const express = require('express');
const cors = require('cors')

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use((_,res,next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/", (_, res) => {
  return res.status(200).send("Success")
})

const sendEmail = async (emailData) => {
  // Generate a random number between 0 and 1
  const randomNumber = Math.random();

  // console.log('emailData in send email', emailData)

  // Simulating an asynchronous operation, e.g., sending an email
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 95% chance to return true, 5% chance to return false - emails fail
  return randomNumber < 0.95;
}

app.post('/emailEvents', async (req,res) => {
  const {eventName, userEmail} = req.body; 

  // few examples of events:
  // {
  //   eventName: "websiteSignup"
  //   userEmail: "pete@healthtech1.uk"
  // }
  // {
  //   eventName: "socksPurchased"
  //   userEmail: "pete@healthtech1.uk"
  // }
  // {
  //   eventName: "emailVerified"
  //   userEmail: "pete@healthtech1.uk"
  // }

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

  if(!Object.hasOwn(flows,eventName)) {
    return res.send("A flow for the provided eventName doesn't exist")
  }

  const currentFlow = flows[eventName];
  return await Promise.all(currentFlow.actions).then((values) => {
    console.log("Return values of the actions", values)
    return res.send(`Emails response: ${values}`);
  });
});

app.listen(3000, () => {
  console.log("Server up and running")
});

process.on('exit', (code) => {
  console.log("process exit event with code: ", code)
})