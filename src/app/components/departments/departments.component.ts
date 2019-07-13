import { Component, OnInit, ViewChild } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss']
})
export class DepartmentsComponent implements OnInit {
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  departments: Array<any> = [];
  employees: Array<any> = [];
  departmentTitle:string;
  departmentIdtoDelete: number;
  constructor(
    private DatabaseService: DatabaseService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) { 
    this.spinner.show();
    this.DatabaseService.connectSocketIo();
    this.DatabaseService.getDepartments(data => {
      console.log(data);
      this.departments = data;
      this.dtTrigger.next();
      this.spinner.hide();

    })
    this.DatabaseService.getInitialEmployee(data => {
      console.log(data)
      this.employees = data;
    })


  }

  getNoOfEmployee(department) {
    return this.employees.filter(element => element.department == department).length;
  }

  addDepartment() {
    this.spinner.show();
    console.log(this.departmentTitle);
    this.DatabaseService.addDepartment(this.departmentTitle, results => {
      console.log(results);
      this.departments.push(
        {title: this.departmentTitle, id: results.insertId, no_of_employee: 0 }
      )
      this.departmentTitle = undefined;
      this.spinner.hide();
    })
  }

  doDeleteDepartment(id) {
    this.departmentIdtoDelete = id;
  }
  deleteDepartment() {
    this.spinner.show();
    this.DatabaseService.deleteDepartment(this.departmentIdtoDelete, results => {
      console.log(results);
      const index = this.departments.findIndex(element => element.id == this.departmentIdtoDelete);
      if(index > -1) this.departments.splice(index,1);
      this.departmentIdtoDelete = undefined;
      this.spinner.hide();
    });
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.DatabaseService.disConnectSocketIo();
  }
  

}
