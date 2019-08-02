import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { EmailService } from 'src/app/services/email.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/env';
declare var $;

@Component({
  selector: 'app-missing-requirments',
  templateUrl: './missing-requirments.component.html',
  styleUrls: ['./missing-requirments.component.scss']
})
export class MissingRequirmentsComponent implements OnInit {

  candidate;
  missingFields: Array<any> = [];
  completedFields: Array<any> = [];
  fileServer = environment.fileServer;


  constructor(
    private databaseService: DatabaseService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private emailService: EmailService,
    private toastr: ToastrService,

    ) { 
    this.spinner.show();
    this.databaseService.connectSocketIo();
    this.route.queryParams.subscribe(params => {
      console.log(params)
      this.databaseService.getCandidateDetailsByUid(params.uid, data => {
        console.log(data);
        this.candidate = data[0]
        this.completedFields = this.parseJson(this.candidate.details).filter(element => element.value);
        this.missingFields = this.parseJson(this.candidate.details).filter(element => !element.value);
        console.log(this.missingFields, this.completedFields)
        this.spinner.hide();
      })
    });
  }

  ngOnInit() {
  }

  parseJson(string){
    return string && JSON.parse(string.replace(/\\/g, '\\\\'));
  }

  removeSpaces(text: string){
    return text && text.replace(/ /g, '');
  }
  fixName(filename: string) {
    const split = filename.split('fakepath\\')
    return split[1];
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.databaseService.disConnectSocketIo();
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    $("#detailsModal").modal()
  }

  toArray(fileList) {
    return Array.prototype.slice.call(fileList);
  }

  submit() {
    this.spinner.show();
    let fileList = [];
    this.missingFields.forEach(el => {
      if(el.type == 'file'){
        const fileEl:any =  document.getElementById(this.removeSpaces(el.text))
        console.log(fileEl.files)
        fileList = [...this.toArray(fileList), ...this.toArray(fileEl.files) ];
      }
    });
    this.databaseService.numberFileToUpload = fileList.length;
    console.log(fileList,this.databaseService.numberFileToUpload)
  

    const candidate = {
      missing_fields: this.missingFields,
      candidate_id: this.candidate.id,
      completed_fields: this.completedFields
    }
    console.log('applyNow', candidate); 
    // this.DatabaseService.addCandidate(candidate, (res) => {
    // console.log(res);
 
    // })

    this.databaseService.uploadFileMissing(fileList, candidate).subscribe((response) => {
      console.log('response received is ', response);
      let message = `<h1 style="color:#5a5c69;">You completed missing requirements: </h1>`;
      response.missing_fields.forEach(element => {
        if(element.type == 'file') {
           message += `<p style="color:#5a5c69;">${element.text}:  <a style="color:#15c;" href="${this.fileServer}/${element.value.replace('\\','/')}" >${element.value ? this.fileServer + '/' + element.value : ''}</a></p>`
        } else {
          message += `<p style="color:#5a5c69;">${element.text}:  ${element.value}</p>`
        }
      })
      const applicantEmail = this.completedFields[1].value;
      this.emailService.sendEmail(applicantEmail, message).subscribe( res => {
        this.spinner.hide()
        this.toastr.success(undefined, 'Form Submitted', {
          timeOut: 2000,
          closeButton: true,
          positionClass: 'toast-top-full-width'
        });
      })
    })

  }

}
