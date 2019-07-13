import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.scss']
})
export class DashBoardComponent implements OnInit {

  colors = ['primary', 'info', 'succcess', 'warning'];
  user;
  candidates: Array<any> = [];
  stages: Array<any> = [];
  totalCandidates: number;
  constructor(
    private route: ActivatedRoute,
    private databaseService: DatabaseService,
    private spinner: NgxSpinnerService
  ) { 
    this.spinner.show();
    this.databaseService.connectSocketIo();
    this.databaseService.getInitialCandidates(data => {
      console.log(data);
      this.candidates = data;
      this.totalCandidates = this.candidates.length;
      this.spinner.hide();
    })
    this.databaseService.getAllStages(data => {
      console.log(data);
      this.stages = data;
    })

  }

  getCandidatesByStage(stage) {
    return this.candidates.filter(element => element.stage == stage).length;
  }

  getCandidatesByStatus(status) {
    return this.candidates.filter(element => element.status == status).length;
  }

  getPercentageCandidate(status) {
    return this.getCandidatesByStatus(status)*100/this.totalCandidates;
  }


  ngOnInit() {
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.databaseService.disConnectSocketIo();
  }

}
