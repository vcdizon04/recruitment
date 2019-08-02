import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DatabaseService } from 'src/app/services/database.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
import { element } from 'protractor';
import { CsvGeneratorService } from 'src/app/services/csv-generator.service';


@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  jobOpenings: Array<any> = [];
  candidates: Array<any> = [];
  stages: Array<any> = [];
  currentTable:string = 'Opening Report';

  constructor(
    private databaseService: DatabaseService,
    private spinner: NgxSpinnerService,
    private csvService: CsvGeneratorService
  ) { }


  ngOnInit() {
    this.spinner.show();
    this.databaseService.connectSocketIo();
    this.databaseService.getInitialJobOpenings(jobOpenings => {
      console.log(jobOpenings);
      this.jobOpenings = jobOpenings;
      
    })
    this.databaseService.getInitialCandidates(candidates => {
      console.log(candidates);
      this.candidates = candidates;
    })
    this.databaseService.getAllStages(stages => {
      console.log(stages);
      this.stages = stages;
      this.dtTrigger.next();
      this.spinner.hide();
    })
  }

  parseJson(string){
    return JSON.parse(string.replace(/\\/g, '\\\\'));
  }

  formatDate(timestamp){
    return moment(timestamp).format('YYYY-MM-DD');
  }
  fromNow(timestamp){
    return moment(timestamp).fromNow();
  }
  downloadCv(){
    console.log('download')
  }
  fixName(filename: string) {
    const split = filename.split('fakepath\\')
    return split[1];
  }

  getTotalCandidate(jobOpeningId) {
    return this.candidates.filter(element => element.job_opening_id == jobOpeningId).length;
  }
  getTotalCandidateByStage(stage, jobOpeningId) {
    const candidates = this.candidates.filter(element => element.job_opening_id == jobOpeningId)
    return candidates.filter(element => element.stage == stage).length;
  }
  downloadCsv() {

    if(this.currentTable == 'Opening Report') {
      const filename = 'Job_opening_report.csv';
      const columnNames = ['Job Opening', 'Created', 'Candidates'];
      this.stages.forEach(element => columnNames.push(element.stage));
      const data = [];
      data.push(columnNames);
      this.jobOpenings.forEach(jobOpening => {
        let row = [
          this.parseJson(jobOpening.job_description).position_title,
          this.formatDate(jobOpening.created_on),
          this.getTotalCandidate(jobOpening.id),
        ];

        this.stages.forEach(stage => {
          row.push(this.getTotalCandidateByStage(stage.stage, jobOpening.id))
        })
        data.push(row);
      })
      console.log(data);
      this.csvService.generateCsv(filename, data);
    } else {
      const filename = 'Candidate_report.csv';
      const columnNames = ['Candidate Name', 'Email', 'Phone', 'Apply Date', 'Status'];
      const data = [];
      data.push(columnNames);
      this.candidates.forEach(candidate => {
        let row = [
          this.parseJson(candidate.details)[0].value,
          this.parseJson(candidate.details)[1].value,
          this.parseJson(candidate.details)[2].value,
          this.formatDate(candidate.created_on),
          candidate.status
        ];
        data.push(row);
      })
      console.log(data);
      this.csvService.generateCsv(filename, data);
    }
    
  }

  changeTable(table) {
    this.currentTable = table;
    this.rerender();
  }

    
  rerender(): void {
    console.log('rerender')
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

}
