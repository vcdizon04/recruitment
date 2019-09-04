import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
declare var $;

@Component({
  selector: 'app-add-jobopening',
  templateUrl: './add-jobopening.component.html',
  styleUrls: ['./add-jobopening.component.scss']
})
export class AddJobopeningComponent implements OnInit {
  description = '';
  currentStep = 1;
  stageTitle = '';
  field = {
    fieldTitle: '',
    fieldType: 'text',
    isRequired: false
  }
  listStyle = {
    width:'300px', //width of the list defaults to 300,
    height: '250px', //height of the list defaults to 250,
    dropZoneHeight: '50px' // height of the dropzone indicator defaults to 50
    }
  allStages = [];
  stages = [
    {text:'Screening', isChecked: false},
    {text:'Phone Interview', isChecked: false},
    {text:'Face to Face Interview', isChecked: false},
    {text:'Make an Offer', isChecked: false},
  ];

  departments: Array<any> = [
  ];

  fields = [
    {text: 'Name', isChecked: true, isDefault: true, isRequired: true, type: 'text', value: ''},
    {text: 'Email', isChecked: true, isDefault: true, isRequired: true, type: 'text', value: ''},
    {text: 'Phone', isChecked: true, isDefault: true, isRequired: true, type: 'text', value: ''},
    {text: 'Upload CV',  isChecked: true, isDefault: true, isRequired: true, type: 'file', value: ''},
    {text: 'Upload Photo', isChecked: false, isRequired: false, type: 'file', value: ''},
    {text: 'Cover Letter', isChecked: false, isRequired: false, type: 'textArea', value: ''},
    {text: 'Mobile', isChecked: false, isRequired: false, type: 'text', value: ''},
    {text: 'Other Email', isChecked: false, isRequired: false, type: 'text', value: ''},
    {text: 'Nationality', isChecked: false, isRequired: false, type: 'text', value: ''},
    {text: 'Marital Status', isChecked: false, isRequired: false, type: 'text', value: ''},
    {text: 'Hobbies', isChecked: false, isRequired: false, type: 'textArea', value: ''},
    {text: 'Address', isChecked: false, isRequired: false, type: 'textArea', value: ''},
    {text: 'Date of Birth', isChecked: false, isRequired: false, type: 'text', value: ''},
    {text: 'Gender', isChecked: false, isRequired: false, type: 'text', value: ''},
    {text: 'Driving License', isChecked: false, isRequired: false, type: 'file', value: ''},
    {text: 'Website', isChecked: false, isRequired: false, type: 'text', value: ''},
    {text: 'Biography', isChecked: false, isRequired: false, type: 'textArea', value: ''},
  ]

  ///
  
  job = {

    opening_description: '',
    job_description : {
      position_title: '',
    },
    hiring_workflow: {
      stages: []
    },
    job_information: {
      department: '',
      employment_type: '',
      isRemoteOption: false,
      minimum_experience: '',
      submission_deadline: '',
      location: '',
      number_of_vacancy: ''
    },
    basic_information: {
      fields: []
    },
    question_set: {
      isQuestionSet: false,
      questionnaire: '',
    },
    id: undefined,
    created_on: undefined
  }
  isActionUpdate: boolean = false;

  constructor(
    public DatabaseService: DatabaseService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private router: Router,
    private toastr: ToastrService
  ) { 
    this.spinner.show();
    this.DatabaseService.connectSocketIo();

    this.route.queryParams.subscribe(params => {
      console.log(params);
      if(Object.keys(params).length){
        this.isActionUpdate = true;
        this.job = {
          opening_description: params.opening_description,
          basic_information: this.parseJson(params.basic_information),
          hiring_workflow: this.parseJson(params.hiring_workflow),
          job_description: this.parseJson(params.job_description),
          job_information: this.parseJson(params.job_information),
          question_set: this.parseJson(params.question_set),
          id: this.parseJson(params.id),
          created_on: this.parseJson(params.created_on)
        }

        console.log(this.job)
        this.stages = this.job.hiring_workflow.stages;
        this.fields = this.job.basic_information.fields;
        $('#datepicker').val(this.job.job_information.submission_deadline);
      }
   
  });

  this.DatabaseService.getAllStages((data) => {
    console.log(data);
    this.allStages = data;
    this.spinner.hide();
  })

  this.DatabaseService.getDepartments(data => {
    console.log(data);
    this.departments = data;
  })

  }
  parseJson(string){
    return JSON.parse(string);
  }
  ngOnInit() {
  }

  nextStep(){
    this.currentStep++;
  }
  backStep(){
    this.currentStep--;
  }
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    console.log('test');
    const sortable =  $( "#sortable" );
    sortable.sortable();
    $( "#fields" ).sortable();
    $('#datepicker').datepicker({
      uiLibrary: 'bootstrap4'
    });
    sortable.on("sortchange", (data)=> {
      console.log('sortchange', data);
     
    });

  }

  async addStage(){
    this.spinner.show();
    console.log(this.stageTitle);

    const stages  = $( "#sortable" ).children();
    this.stages = [];
    $.each(stages, (i,element) => {
      this.stages.push({text: $(element).text(), isChecked: $(element).find('input').attr('ng-reflect-model') == "true" ? true : false })
    }); 
    this.stages.push({ text: this.stageTitle, isChecked: false});
    if( !(this.allStages.indexOf(this.stageTitle) > -1) ) {
      this.DatabaseService.addStage(this.stageTitle, results => {
        console.log(results);
        this.spinner.hide();
      })
    }
    this.stageTitle = '';
    console.log(this.stages)
  }

  async addField(){
    console.log(this.field);

    const fields   = $( "#fields" ).children();
    this.fields = [];
    $.each(fields, (i,element) => {
      this.fields.push({
        text: $(element).find('#text').text(), 
        isChecked: $(element).find('#isChecked').attr('ng-reflect-model') == "true" ? true : false ,
        isRequired: $(element).find('#isRequired').attr('ng-reflect-model') == "true" ? true : false,
        type:  $(element).find('#type').text(),
        value: undefined
      })
    }); 
    this.fields.push({ text: this.field.fieldTitle, isChecked: false, isRequired: this.field.isRequired, type: this.field.fieldType, value: undefined});
    this.field = {
      fieldTitle: '',
      fieldType: 'text',
      isRequired: false
    }
    console.log(this.fields)
  }

  removeField(index) {
    this.fields.splice(index, 1);
  }

  finish(){
    this.spinner.show();
    this.fixOrderStages();
    this.fixOrderFields();
    this.job.hiring_workflow.stages = this.stages;
    this.job.basic_information.fields = this.fields;
    this.job.job_information.submission_deadline = $('#datepicker').val();
    console.log(this.job);
    if(!this.isActionUpdate){
      this.DatabaseService.addJobOpening(this.job, (res) => {
        console.log(res);
        this.spinner.hide();
        this.toastr.success(undefined, 'Job Opening Added', {
          timeOut: 2000,
          closeButton: true,
          positionClass: 'toast-top-full-width'
        });
        this.router.navigate(['/job-openings']);
      });
    } else {
      this.job
      this.DatabaseService.updateJobOpening(this.job, (res) => {
        console.log(res);
        this.spinner.hide();
        this.toastr.success(undefined, 'Job Opening Updated', {
          timeOut: 2000,
          closeButton: true,
          positionClass: 'toast-top-full-width'
        });
        this.router.navigate(['/job-openings']);
      });
    }
    
  }
  async fixOrderFields(){
    const fields   = $( "#fields" ).children();
    this.fields = [];
    $.each(fields, (i,element) => {
      this.fields.push({
        text: $(element).find('#text').text(), 
        isChecked: $(element).find('#isChecked').attr('ng-reflect-model') == "true" ? true : false ,
        isRequired: $(element).find('#isRequired').attr('ng-reflect-model') == "true" ? true : false,
        type:  $(element).find('#type').text(),
        value: ''
      })
    }); 
  }

  async fixOrderStages(){
    
    const stages  = $( "#sortable" ).children();
    this.stages = [];
    $.each(stages, (i,element) => {
      this.stages.push({text: $(element).text(), isChecked: $(element).find('input').attr('ng-reflect-model') == "true" ? true : false })
    }); 
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.DatabaseService.disConnectSocketIo();
  }
}
