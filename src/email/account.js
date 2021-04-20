const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SEND_GRID_ACCESS_KEY)

const sendWelcomeEmail=(email,name)=>{
    const msg = {
        to: email, // Change to your recipient
        from: 'benfranklin619@gmail.com', // Change to your verified sender
        subject: 'Welcome to task manager',
        text: `Hi ${name}, ben's team welcomes you `,
      }
      sgMail
        .send(msg)
     
}
const sendCancellationEmail=(email,name)=>{
    const msg = {
        to: email, // Change to your recipient
        from: 'benfranklin619@gmail.com', // Change to your verified sender
        subject: 'Missing you from task manager',
        text: `Hi ${name}, we are gonna miss you 😔 `,
      }
      sgMail
        .send(msg)
      
}
module.exports={
    sendWelcomeEmail,
    sendCancellationEmail
}