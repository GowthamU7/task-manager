const sgmail=require('@sendgrid/mail')
const sendgrid="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"

sgmail.setApiKey(sendgrid)

sgmail.send({
    to:'gowthammdb7@gmail.com',
    from:'gowthammdb7@gmail.com',
    subject:"this is y first creation",
    text:"i hope you are safe"
})