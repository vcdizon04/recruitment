import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/env';
// declare var AWS;

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  // ses;
  fileUploadServer: string = environment.fileUploadServer;
  constructor(
    private http: HttpClient
  ) { 

  }
  // loadConfig() {
  // // Configure the credentials provider to use your identity pool
  // AWS.config.region = 'us-east-1'; // Region
  // AWS.config.update({
  //    accessKeyId: 'AKIAYIGKVFHSDACCJS57',
  //    secretAccessKey: 'b2J9FpN3O1Ij4Kbu5Q2gC+Tv4/AX4mKr8ahBjavU',
  //    region: 'us-east-1'
  //  });
  // this.ses = new AWS.SES();
  // }
  
  // sendEmail(email, message, callback: Function) {
  //   const params = {
  //     Destination: {
  //      ToAddresses: [
  //         email
  //      ]
  //     }, 
  //     Message: {
  //      Body: {
  //       Html: {
  //        Charset: "UTF-8", 
  //        Data: message
  //       }, 
  //      }, 
  //      Subject: {
  //       Charset: "UTF-8", 
  //       Data: "Recruitment"
  //      }
  //     }, 
  //     Source: "vcdizon04@gmail.com", 
  //    };

  //    this.ses.sendEmail(params, callback);
  // }

  sendEmail (email, message) { 
    const body = {
      email: email,
      message: message
    }
    return this.http.post(`${this.fileUploadServer}/mailer`, body);
  }
}
