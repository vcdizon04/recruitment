import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/env';
import { EmailService } from 'src/app/services/email.service';
import { element } from 'protractor';
declare var $;

@Component({
  selector: 'app-candidate-details',
  templateUrl: './candidate-details.component.html',
  styleUrls: ['./candidate-details.component.scss']
})
export class CandidateDetailsComponent implements OnInit {

  domain = environment.domain;
  fileServer = environment.fileServer;
  employees: Array<any> = [];
  departments: Array<any> = [];
  phoneInterViews = [];
  candidate;
  status = '';
  stage = '';
  comment = '';
  assignor =  {
    name: '',
    id:  undefined,
  };
  rating;
  interview = {
    stage: '',
    detail: '',
    interviewer: '',
    date: '',
    duration: '',
  }
  interviewAction = "Add";
  currentInterviewEditIndex;
  employee = {
    name: '',
    // firstName: '',
    // middleName: '',
    // lastName: '',
    employeeId: '',
    email: '',
    employeeType: '',
    dateOfHire: '',
    designation: '',
    department: '',
    status: ''
    
  }
  stages: Array<any> = [];
  constructor(
    private route: ActivatedRoute,
    private databaseService: DatabaseService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private emailService: EmailService
  ) { }

  ngOnInit() {
    this.spinner.show();

    this.databaseService.connectSocketIo();
    this.route.queryParams.subscribe(params => {
      console.log(params)
      this.databaseService.getCandidateDetails(params.id, data => {
        console.log(data);
        this.candidate = data[0];
        this.databaseService.getJobStages(this.candidate.job_opening_id, stages => {
          this.stages = this.parseJson(stages[0].hiring_workflow).stages;
          console.log(this.stages);
        })
        this.status = this.candidate.status;
        this.stage = this.candidate.stage;
        this.comment = this.candidate.comment;
        this.rating = this.candidate.rating;
        this.assignor.id = this.candidate.asignor;
        this.assignor.name = this.candidate.asignor_name;
        this.phoneInterViews = this.parseJson( this.candidate.interviews );
      })
  
    });

    this.databaseService.getInitialEmployee(res => {
      console.log(res);
      this.employees = res;
      this.spinner.hide();
    })
    this.databaseService.getDepartments( res => {
      console.log(res);
      this.departments = res;
    })
  }
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    $('#datepicker').datepicker({
      uiLibrary: 'bootstrap4'
    });

    $('#datepickerAddEmployee').datepicker({
      uiLibrary: 'bootstrap4'
    });
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
  onRatingChange(ev){
    console.log(ev)
    this.spinner.show();
    this.rating = ev.rating;
    console.log(this.rating);
    const data = {
      id: this.candidate.id,
      rating: this.rating,

    }

    this.databaseService.updateCandidate(data, res => {
      console.log(res);
      this.spinner.hide();
    }, 'rating')
  }

  updateCandidateStatus(){
    this.spinner.show();
    console.log(this.status);
    const data = {
      id: this.candidate.id,
      status: this.status,

    }

    this.databaseService.updateCandidate(data, res => {
      console.log(res);
      this.spinner.hide();
    }, 'status')
    
  }
  updateCandidateAsignor(){
    this.spinner.show();
    const index = this.employees.findIndex(element => element.id == this.assignor.id);
    this.assignor.name = this.employees[index].name;
    console.log(this.assignor);
    const data = {
      id: this.candidate.id,
      asignor: this.assignor.id,
      asignorName: this.assignor.name
    }

    this.databaseService.updateCandidate(data, res => {
      console.log(res);
      this.spinner.hide();
    }, 'asignor')
    
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.databaseService.disConnectSocketIo();
  }

  updateCandidateStage(){
    this.spinner.show();
    console.log(this.status);
    const data = {
      id: this.candidate.id,
      stage: this.stage,
    }
    this.databaseService.updateCandidate(data, res => {
      console.log(res);
      this.spinner.hide();
    }, 'stage')
  }

  updateComment(){
    this.spinner.show();
    console.log(this.comment);
    const data = {
      id: this.candidate.id,
      comment: this.comment,
    }
    this.databaseService.updateCandidate(data, res => {
      console.log(res);
      this.spinner.hide();
    }, 'comment')
  }

  addInterview(){
    this.spinner.show();

    this.interview.date = $('#datepicker').val();
    console.log(this.interview);

    const candidateDetails = this.parseJson(this.candidate.details);
    const candidateEmail = candidateDetails[1].value;
    const candidateName = candidateDetails[0].value;
    let message = `<h1> Hello ${candidateName}, `;
    if(this.interviewAction == 'Add'){
      this.phoneInterViews.push(this.interview)
      message += `You have Phone Interview with the following details: </h1>`
    } else if(this.interviewAction == 'Update'){
      message += `Your Phone Interview was reset to the following details: </h1>`  
      this.phoneInterViews[this.currentInterviewEditIndex] = {...this.interview};
    }
    message += `
    <p>Stage: ${this.interview.stage}</p>
    <p>Interviewer: ${this.interview.interviewer}</p>
    <p>Date: ${this.interview.date}</p>
    <p>Duration: ${this.interview.duration} Minutes</p>
    <p>Detail: ${this.interview.detail}</p>
    `;
    console.log(this.phoneInterViews)
    $('#datepicker').val(undefined);
    this.interview = {
      stage: '',
      detail: '',
      interviewer: '',
      date: '',
      duration: '',
    }

    console.log(this.comment);
    const data = {
      id: this.candidate.id,
      interviews: this.phoneInterViews,
    }
    this.databaseService.updateCandidate(data, res => {
      console.log(res);
      this.emailService.sendEmail(candidateEmail, message).subscribe(res => {
        console.log(res);
      })
    }, 'interviews')
  }

  editInterview(interview, i) {
    this.interviewAction = "Update";
    this.currentInterviewEditIndex = i;
    this.interview = {...interview};
    
  }
  deleteInterview(i){
    this.spinner.show();
    const interviewDeleted =  this.phoneInterViews[i];
    const candidateDetails = this.parseJson(this.candidate.details);
    const candidateEmail = candidateDetails[1].value;
    const candidateName = candidateDetails[0].value;
    let message = `<h1> Hello ${candidateName}, We would like to inform you that your Phone Interview was cancelled with the following details: </h1>
    <p>Stage: ${interviewDeleted.stage}</p>
    <p>Interviewer: ${interviewDeleted.interviewer}</p>
    <p>Date: ${interviewDeleted.date}</p>
    <p>Duration: ${interviewDeleted.duration} Minutes</p>
    <p>Detail: ${interviewDeleted.detail}</p>`;
    this.phoneInterViews.splice(i, 1);
    const data = {
      id: this.candidate.id,
      interviews: this.phoneInterViews,
    }
    this.databaseService.updateCandidate(data, res => {
      console.log(res);
      this.emailService.sendEmail(candidateEmail, message).subscribe( res=> {
        this.spinner.hide();
      })
    }, 'interviews')
  }

  addEmployee(){
    this.spinner.show();
    this.employee.dateOfHire = $('#datepickerAddEmployee').val();
    console.log(this.employee);
    this.databaseService.addEmployee(this.employee, (res) => {
      console.log(res);
      const candidateDetails = this.parseJson(this.candidate.details);
      const candidateEmail = candidateDetails[1].value;
      const candidateName = candidateDetails[0].value;
      const message = `
      <h1>Congratulations! ${candidateName}, You are hired with the details:</h1>
      <p> Name:  ${this.employee.name}</p>
      <p> Employee ID:  ${this.employee.employeeId}</p>
      <p> Email:  ${this.employee.email}</p>
      <p> Employee Type:  ${this.employee.employeeType}</p>
      <p> Date of Hire:  ${this.employee.dateOfHire}</p>
      <p> Designation:  ${this.employee.designation}</p>
      <p> Department:  ${this.employee.department}</p>
      <p> Status:  ${this.employee.status}</p>
      `;
      this.emailService.sendEmail(candidateEmail, message).subscribe(res => {
        console.log(res);
      })
      this.employee = {
        name: '',
        // firstName: '',
        // middleName: '',
        // lastName: '',
        employeeId: '',
        email: '',
        employeeType: '',
        dateOfHire: '',
        designation: '',
        department: '',
        status: '',
      }
      this.databaseService.deleteCandidate(this.candidate.id, res => {
        console.log(res)
        this.spinner.hide();
      })
    })
  }

  downloadAllFiles() {
    this.spinner.show();
    const candidateDetails = this.parseJson(this.candidate.details);
    const files = candidateDetails.filter(element => element.type == 'file' && element.value);
    console.log(files)
    const data = {
      fileName: candidateDetails[0].value,
      files: files
    }
    this.databaseService.downloadAllFiles(data, (directory) => {
      console.log(directory)
      this.spinner.hide();
      window.open(`${this.fileServer}/${directory}`, '_blank');

    })
  }

  followUpFiles() {
    this.spinner.show();
    const candidateDetails = this.parseJson(this.candidate.details);
    const candidateEmail = candidateDetails[1].value;
    const candidateName = candidateDetails[0].value;
    const missingFiles = candidateDetails.filter(element => !element.value);
    console.log(missingFiles, 'missingFiles');
    let message = `<h1>Hello ${candidateName}, Please Complete the following details to process your application: </h1>`;
    missingFiles.forEach(element => {
      message += `<p>${element.text}</p>`
    });
    
  

   if(!this.candidate.uid) {
    this.databaseService.addCandidateUid(this.candidate.id, res => {
      console.log(res);
      this.spinner.hide();

      message += `
        <br>
        <p><strong>Please click this button to complete details:</strong></p>
        <a href="${this.domain}/missing-requirements?uid=${res.uid}" style="color: #fff;
        background-color: #2e59d9;
        border-color: #2653d4; display: inline-block;
        font-weight: 400; text-align: center;
        vertical-align: middle;border: 1px solid transparent;
        padding: .375rem .75rem;
        font-size: 1rem;
        line-height: 1.5;
        border-radius: .35rem;
        text-decoration: none;">Complete Now</a>
      `;
      this.emailService.sendEmail(candidateEmail, message).subscribe(res => {
        console.log(res);
      });  
    })
    
   } else {
    message += `
    <br>
    <p><strong>Please click this button to complete details:</strong></p>
    <a href="${this.domain}/missing-requirements?uid=${this.candidate.uid}" style="color: #fff;
    background-color: #2e59d9;
    border-color: #2653d4; display: inline-block;
    font-weight: 400; text-align: center;
    vertical-align: middle;border: 1px solid transparent;
    padding: .375rem .75rem;
    font-size: 1rem;
    line-height: 1.5;
    border-radius: .35rem;
    text-decoration: none;">Complete Now</a>
  `
  this.emailService.sendEmail(candidateEmail, message).subscribe(res => {
    console.log(res);
    this.spinner.hide();
  })
     
   }

  

  this.toastr.success(undefined, 'Email Sent', {
    timeOut: 2000,
    closeButton: true,
    positionClass: 'toast-top-full-width'
  });
  }
}
