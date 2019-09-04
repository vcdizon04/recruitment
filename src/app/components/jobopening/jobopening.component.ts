import { Component, OnInit, ViewChild } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';

import * as moment from 'moment';
import { element } from 'protractor';
import { Router, NavigationExtras } from '@angular/router';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
declare var $;


@Component({
  selector: 'app-jobopening',
  templateUrl: './jobopening.component.html',
  styleUrls: ['./jobopening.component.scss']
})
export class JobopeningComponent implements OnInit {
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  currentDeleteId;
  
  jobOpenings: Array<any> = [];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  
  constructor(
    private DatabaseService: DatabaseService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {
    this.spinner.show();
    this.DatabaseService.connectSocketIo();
    this.DatabaseService.getUserConnected((data) => {
      console.log(data)
    })
    this.DatabaseService.getInitialJobOpenings(data => {
      console.log(data)
      this.jobOpenings = data;
      this.dtTrigger.next();
      this.spinner.hide();
    })
    this.DatabaseService.getNewJobOpeningsRealTime(data => {
      console.log(data);
      this.jobOpenings.push(data);
      // this.rerender();
    })
    this.DatabaseService.getNewEditedJobOpeningsRealTime(data => {
      console.log(data);
      const editedIndex = this.jobOpenings.findIndex(element => element.id == data.id);
      this.jobOpenings[editedIndex] = data;
      // this.rerender();
    })
    this.DatabaseService.getNewDeletedJobOpeningsRealTime(id => {
      console.log(id);
      const deletedIndex = this.jobOpenings.findIndex(element => element.id == id);
      this.jobOpenings.splice(deletedIndex, 1);
      // this.rerender();
    })
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
  }

  parseJson(string){
    return JSON.parse(string);
  }

  formatDate(timestamp){
    return moment(timestamp).format('YYYY-MM-DD');
  }

  getCurrentTimeStamp(){
    return new Date().getTime();
  }

  getDeadlineTimeStamp(deadline){
    return new Date(deadline).getTime();
  }

  doDeleteJobOpening(id){
    this.currentDeleteId = id;
  }
  deleteJobOpening(){
    this.DatabaseService.deleteJobOpening(this.currentDeleteId, () => {
      this.currentDeleteId = undefined;
      this.toastr.info(undefined, 'Job Opening Deleted', {
        timeOut: 2000,
        closeButton: true,
        positionClass: 'toast-top-full-width'
      });
    });
  }
  async editJobOpening(jobOpening){
    let navigationExtras: NavigationExtras = {
      queryParams: jobOpening
    }
    this.router.navigate(['/edit-job-opening'],navigationExtras)
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    console.log('onDestroy');
    this.DatabaseService.disConnectSocketIo();
    this.dtTrigger.unsubscribe();
  }
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    // $('#dataTable').DataTable();
  }
}
