import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { DatabaseService } from 'src/app/services/database.service';
import { Router, NavigationExtras } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { environment } from 'src/environments/env';

@Component({
  selector: 'app-candidates',
  templateUrl: './candidates.component.html',
  styleUrls: ['./candidates.component.scss']
})
export class CandidatesComponent implements OnInit {
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  fileServer = environment.fileServer;
  candidates: Array<any> = [];
  originalCandidates: Array<any> = [];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  stages: Array<any> = [];
  currentFilter: string = 'All';

  constructor(
    private DatabaseService: DatabaseService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) { 
    this.spinner.show();
    this.DatabaseService.connectSocketIo();
    this.DatabaseService.getInitialCandidates(data => {
      console.log(data);
      this.candidates = data;
      if(this.DatabaseService.user.level == 1) this.candidates = this.candidates.filter(element => element.interviews.indexOf(DatabaseService.user.name) > -1 )
      this.originalCandidates = [...this.candidates];
      this.dtTrigger.next();
      this.spinner.hide();
    })
    this.DatabaseService.getAllStages(data => {
      this.stages = data;
      console.log(this.stages)
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
  viewCandidate(candidate){
    console.log(candidate);
    let navigationExtras: NavigationExtras = {
      queryParams: {id : candidate.id}
    }
    this.router.navigate(['/candidate-details'],navigationExtras)
  }

  removeSpaces(text: string){
    return text.replace(/ /g, '');
  }

  filter(type){
    console.log(type)
    this.currentFilter = type;
    this.candidates = [...this.originalCandidates];
    
    if(type !== 'All') this.candidates = this.candidates.filter(el => el.stage == type);
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

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true
    };

    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.DatabaseService.disConnectSocketIo();
  }

}
