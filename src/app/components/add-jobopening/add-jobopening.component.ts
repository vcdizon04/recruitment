import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-jobopening',
  templateUrl: './add-jobopening.component.html',
  styleUrls: ['./add-jobopening.component.scss']
})
export class AddJobopeningComponent implements OnInit {
  description = '';
  currentStep = 1;
  listStyle = {
    width:'300px', //width of the list defaults to 300,
    height: '250px', //height of the list defaults to 250,
    dropZoneHeight: '50px' // height of the dropzone indicator defaults to 50
    }
  items = ['Screening', 'Phone Interview', 'Face to Face Interview', 'Make an Offer'];
  constructor() { }

  ngOnInit() {
  }

  nextStep(){
    this.currentStep++;
  }
}
