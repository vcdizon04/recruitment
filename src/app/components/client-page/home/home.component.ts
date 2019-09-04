import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';

import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { EmailService } from 'src/app/services/email.service';
import { environment } from 'src/environments/env';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
declare var $;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  fileServer = environment.fileServer;
  jobOpenings: Array<any> = [];
  origJobOpenings: Array<any> = [];
  jobOpening;
  fields: Array<any> = [];
  searchVal = '';

  registerForm: FormGroup;
  submitted = false;
  
  constructor(
    private DatabaseService: DatabaseService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private emailService: EmailService,
    private formBuilder: FormBuilder
    ) {
    
    this.spinner.show();

    this.DatabaseService.connectSocketIo();
    this.DatabaseService.getUserConnected((data) => {
      console.log(data)
    })
    this.DatabaseService.getInitialJobOpenings(data => {
      console.log(data)
      const openings = data.reverse();
      this.jobOpenings = openings;
      this.origJobOpenings = [...openings];
      this.spinner.hide();
    })
    this.DatabaseService.getNewJobOpeningsRealTime(data => {
      console.log(data);
      this.jobOpenings.unshift(data);
    })
    this.DatabaseService.getNewEditedJobOpeningsRealTime(data => {
      console.log(data);
      const editedIndex = this.jobOpenings.findIndex(element => element.id == data.id);
      this.jobOpenings[editedIndex] = data;
      console.log(this.jobOpenings)
      // this.rerender();
    })
    this.DatabaseService.getNewDeletedJobOpeningsRealTime(id => {
      console.log(id);
      const deletedIndex = this.jobOpenings.findIndex(element => element.id == id);
      this.jobOpenings.splice(deletedIndex, 1);
    })
    this.DatabaseService.getNewCandidateRealTime(data => {
      console.log(data)
    })
    this.DatabaseService.connectSocketFile();
    
   }

   parseJson(string){
    return JSON.parse(string);
  }

  formatDate(timestamp){
    return moment(timestamp).format('YYYY-MM-DD');
  }
  fromNow(timestamp){
    return moment(timestamp).fromNow();
  }

  getCurrentTimeStamp(){
    return new Date().getTime();
  }

  getDeadlineTimeStamp(deadline){
    return new Date(deadline).getTime();
  }
  applyNow(){ 
    this.submitted = true;
    console.log(this.registerForm.invalid);
    if(!this.registerForm.invalid) {
      $('#applyNowModal').modal('hide');
      this.spinner.show();
    let fileList = [];
    this.fields.forEach(el => {
      if(el.type == 'file'){
        const fileEl:any =  document.getElementById(this.removeSpaces(el.text))
        console.log(fileEl.files)
        fileList = [...this.toArray(fileList), ...this.toArray(fileEl.files) ];
      }
    });
    this.DatabaseService.numberFileToUpload = fileList.length;
    console.log(fileList,this.DatabaseService.numberFileToUpload)
  

    const candidate = {
      details: this.fields,
      job_opening_id: this.jobOpening.id,
      job_title: this.parseJson(this.jobOpening.job_description).position_title,
      stage: this.parseJson(this.jobOpening.hiring_workflow).stages[0].text
      
    }
    console.log('applyNow', candidate); 
    // this.DatabaseService.addCandidate(candidate, (res) => {
    // console.log(res);
 
    // })

    this.DatabaseService.uploadFile(fileList, candidate).subscribe((response) => {
      console.log('response received is ', response);
      let message = `<h1 style="color:#5a5c69;">You applied for postion: <span style="color:#4e73df;">${this.parseJson(this.jobOpening.job_description).position_title} </span></h1>`;
      response.details.forEach(element => {
        if(element.type == 'file') {
           message += `<p style="color:#5a5c69;">${element.text}:  <a style="color:#15c;" href="${this.fileServer}/${element.value.replace('\\','/')}" >${element.value ? this.fileServer + '/' + element.value : ''}</a></p>`
        } else {
          message += `<p style="color:#5a5c69;">${element.text}:  ${element.value}</p>`
        }
      })
      const applicantEmail = this.fields[1].value;
      this.emailService.sendEmail(applicantEmail, message).subscribe(res => {
        this.spinner.hide()
        this.toastr.success(undefined, 'Application Submitted', {
          timeOut: 2000,
          closeButton: true,
          positionClass: 'toast-top-full-width'
        });
      })
    })
    }

  }
  doApplyNow(jobOpening){
    this.jobOpening = jobOpening
    this.fields = this.parseJson(jobOpening.basic_information).fields;
    const validation = {};
    this.fields.forEach(element => {
      validation[this.removeSpaces(element.text)] = ['', element.isRequired ? Validators.required : Validators.nullValidator];
    })
    console.log(validation);
    this.registerForm = this.formBuilder.group(validation);
    this.submitted = false;
    console.log(this.jobOpening);
  }

  get f() { return this.registerForm.controls; }

  ngOnInit() {

  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.DatabaseService.disConnectSocketIo();
  }

  fixName(filename: string) {
    const split = filename.split('fakepath\\')
    return split[1];
  }

  removeSpaces(text: string){
    return text.replace(/ /g, '');
  }

  toArray(fileList) {
    return Array.prototype.slice.call(fileList);
  }

  onSearch(e){
    console.log(e)
    this.jobOpenings = [...this.origJobOpenings];
    if (e && e.trim() != ''){
      this.jobOpenings = this.jobOpenings.filter(el => this.parseJson(el.job_description).position_title.toLowerCase().indexOf(e.toLowerCase()) > -1);
      console.log(this.jobOpenings);
    }
  }

  
}
