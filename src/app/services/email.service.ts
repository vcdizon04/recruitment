import { Injectable } from '@angular/core';
declare var AWS;

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  ses;
  constructor() { 

  }
  loadConfig() {
  // Configure the credentials provider to use your identity pool
  AWS.config.region = 'us-east-1'; // Region
  AWS.config.update({
     accessKeyId: 'AKIAYIGKVFHSKJNA5VH6',
     secretAccessKey: '3Vz1UH5uuFyPS7A32fK/RmMX+NKePBdRxb7Ded8z',
     region: 'us-east-1'
   });
  this.ses = new AWS.SES();
  }

  sendEmail(email, message, callback: Function) {
    const params = {
      Destination: {
       ToAddresses: [
          email
       ]
      }, 
      Message: {
       Body: {
        Html: {
         Charset: "UTF-8", 
         Data: message
        }, 
       }, 
       Subject: {
        Charset: "UTF-8", 
        Data: "Recruitment"
       }
      }, 
      Source: "vcdizon04@gmail.com", 
     };

     this.ses.sendEmail(params, callback);
  }
}
