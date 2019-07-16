import { Injectable } from '@angular/core';
declare var AWS;

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  ses;
  constructor() { 

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
