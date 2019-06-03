import { Component, OnInit } from '@angular/core';
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
  listStyle = {
    width:'300px', //width of the list defaults to 300,
    height: '250px', //height of the list defaults to 250,
    dropZoneHeight: '50px' // height of the dropzone indicator defaults to 50
    }
  stages = [
    {text:'Screening', isChecked: false},
    {text:'Phone Interview', isChecked: false},
    {text:'Face to Face Interview', isChecked: false},
    {text:'Make an Offer', isChecked: false},
  ];

  departments = [
    {text: 'Administration'},
    {text: 'Engineering'},
    {text: 'Design'},
    {text: 'Marketing'},
    {text: 'Sales'},
    {text: 'Report'},
  ];

  fields = [
    {text: 'Upload Photo', isChecked: false}
  ]
  constructor() { }

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
    console.log(this.stageTitle);

    const stages  = $( "#sortable" ).children();
    this.stages = [];
    $.each(stages, (i,element) => {
      this.stages.push({text: $(element).text(), isChecked: $(element).find('input').attr('ng-reflect-model') == "true" ? true : false })
    }); 
    this.stages.push({ text: this.stageTitle, isChecked: false});
    this.stageTitle = '';
    console.log(this.stages)
  }
}
