
//import packages that you want to use in this file
const stripe = require('stripe'); // import stripe for event handling
const express = require('express'); // TO create get and post request
require('dotenv').config({ path: '.env' }); //To access secret tokens

const app = express();

// To show this message when website is loading without webhooks endpoint
app.get("/", (req, res) => {
    res.status(200).send("Hello Stripe Webhook");
});

// // This is your Stripe CLI webhook secret for testing your endpoint locally.


const portNumber = process.env.PORT || 3000;
const STRIPE_SECRET = process.env.STRIPE_SECRET;
const endpointSecret = process.env.END_POINT_SECRET;

//Post request for handling events in webhook
app.post('/webhooks', express.raw({ type: 'application/json' }), (request, response) => {
    const sig = request.headers['stripe-signature'];
    let event;
// Construct event for webhook from signature, endPointScret we recieve during event trigger
    try {
        event =
            stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
        //To show when event is not contructed properly
        console.log("errror");
        console.log(err.message);
        response.status(204).send(`Webhook Error: ${err.message}`);
        return;
    }

    // Handle the event
    switch (event.type) {
// Event when checkout session payment failed
        case 'checkout.session.async_payment_failed':
            const checkoutSessionAsyncPaymentFailed = event.data.object;
            // Then define and call a function to handle the event checkout.session.async_payment_failed
            break;
        // Event when checkout session payment success
        case 'checkout.session.async_payment_succeeded':
            const checkoutSessionAsyncPaymentSucceeded = event.data.object;
            // Then define and call a function to handle the event checkout.session.async_payment_succeeded
            break;
        // Event when checkout session payment completed
        case 'checkout.session.completed':
            // Then define and call a function to handle the event checkout.session.completed
            const checkoutSessionCompleted = event.data.object;
            const paymentpl = checkoutSessionCompleted.payment_link;

            const stripeKey = require('stripe')(STRIPE_SECRET);

            stripeKey.paymentLinks.update(
                paymentpl,
                { active: false }
            );

            
            break;
                // Event when checkout session payment expires
        case 'checkout.session.expired':
            const checkoutSessionExpired = event.data.object;
            break;

        // ... handle other event types
        default:
        console.log(`Unhandled event type ${event.type}`);
    }
    // Return a 200 response to acknowledge receipt of the event
    response.send();
});

// Listen to port for recieving events
app.listen(portNumber, () => console.log(`Running on port ${portNumber}`));

