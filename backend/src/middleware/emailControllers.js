const nodemailer = require('nodemailer');
const fs = require('fs').promises; 
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: `${process.env.NODEEMAIL_MAIL_NAME}`,
    pass: `${process.env.NODEEMAIL_MAIL_PASSWORD}`     
  }
});

async function sendEmail(data, subject, templateFileName) {
  try {
    const filePath = `src/templates/${templateFileName}.html`;
    let content = await fs.readFile(filePath, 'utf-8');

    switch (templateFileName) {
        case "SignUp":
        content = content.replace('{nombre}', data.Username);    
        switch (data.Role) {
          case "Company":
              content = content.replace('{TextoRoll}', 'We have successfully created your account on our platform. At Working Campusland, we strive to help you find your star programmer.'); 
              content = content.replace('{RolAccess}', `<div style="width: 100%; margin: 0 auto; background-color: #E8F4FD; padding-block: 20px;">
              <div style="text-align: center; padding: 10px;">
                  <a href="" style="color: #000087; text-decoration: none; font-size: 35px; font-family: 'Poppins'; margin: 0 15px;">As a user you can:</a>
              </div>
              <div style="max-width: 100%;">
                  <img style="display:flex; max-width: 200px; background: url('https://i.ibb.co/PM60NdF/fondo2.png') center/contain no-repeat; height: auto; vertical-align: middle; margin: 0 auto; padding: 50px;" src="https://i.ibb.co/HCdTwx5/globe.png" alt="Web">
              </div>
              <div style="max-width: 100%; padding: 20px;">
                  <div style="font-size: 25px; font-family: 'Poppins'; margin-bottom: 5px; text-align: center; color: #000087;">
                      Browse our website.
                  </div>
              </div>
              <div style="max-width: 100%;">
                  <img style="display:flex; max-width: 200px; background: url('https://i.ibb.co/PM60NdF/fondo2.png') center/contain no-repeat; height: auto; vertical-align: middle; margin: 0 auto; padding: 50px;" src="https://i.ibb.co/BLg6rR7/CV.png" alt="cv">
              </div>
              <div style="max-width: 100%; padding: 20px;">
                  <div style="font-size: 25px; font-family: 'Poppins'; margin-bottom: 5px; text-align: center; color: #000087;">
                      Look at the profiles of our campers.
                  </div>
              </div>
              <div style="max-width: 100%;">
                  <img style="display:flex; max-width: 200px; background: url('https://i.ibb.co/PM60NdF/fondo2.png') center/contain no-repeat; height: auto; vertical-align: middle; margin: 0 auto; padding: 50px;" src="https://i.ibb.co/K0jDy11/maletin.png" alt="maletin">
              </div>
              <div style="max-width: 100%; padding: 20px;">
                  <div style="font-size: 25px; font-family: 'Poppins'; margin-bottom: 5px; text-align: center; color: #000087;">
                      Request a Camper to work in your company.
                  </div>
              </div>
          </div>`); 
            break;
        
          default:
              content = content.replace('{TextoRoll}', 'We have successfully created your account on our platform. We are excited to have you as part of our community.');    
              content = content.replace('{RolAccess}', `<div style="width: 100%; margin: 0 auto; background-color: #E8F4FD; padding-block: 20px;">
              <div style="text-align: center; padding: 10px;">
                  <a href="" style="color: #000087; text-decoration: none; font-size: 35px; font-family: 'Poppins'; margin: 0 15px;">As a user you can:</a>
              </div>
              <div style="max-width: 100%;">
                  <img style="display:flex; max-width: 200px; background: url('https://i.ibb.co/PM60NdF/fondo2.png') center/contain no-repeat; height: auto; vertical-align: middle; margin: 0 auto; padding: 50px;" src="https://i.ibb.co/HCdTwx5/globe.png" alt="Web">
              </div>
              <div style="max-width: 100%; padding: 20px;">
                  <div style="font-size: 25px; font-family: 'Poppins'; margin-bottom: 5px; text-align: center; color: #000087;">
                      Browse our website.
                  </div>
              </div>
              <div style="max-width: 100%;">
                  <img style="display:flex; max-width: 200px; background: url('https://i.ibb.co/PM60NdF/fondo2.png') center/contain no-repeat; height: auto; vertical-align: middle; margin: 0 auto; padding: 50px;" src="https://i.ibb.co/BLg6rR7/CV.png" alt="cv">
              </div>
              <div style="max-width: 100%; padding: 20px;">
                  <div style="font-size: 25px; font-family: 'Poppins'; margin-bottom: 5px; text-align: center; color: #000087;">
                      Look at the profiles of our campers.
                  </div>`); 
              break;
        }
        break;
        
        case "RecoveryPassword":
            content = content.replace('{nombre}', data.Username);
            content = content.replace('{code}', data.Recovery_Code); 
            content = content.replace('{date}', data.CreatedAt); 
        break;
        default:
        break;
    }

    const info = await transporter.sendMail({
        from: `"💫"Working Campusland💫" <${process.env.NODEEMAIL_MAIL_NAME}>`,
        to: `${data.Email}`,
        subject: `${subject}: ${data.Username}✔`,
        html: content,
    });

      console.log("Message sent: %s", info.messageId);
  } catch (error) {
      console.error("Error sending email:", error);
  }
}

module.exports = {
  sendEmail
}