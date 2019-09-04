import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
declare var $;

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  
  employees: Array<any> = [];
  originalEmployees: Array<any> = [];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  action: String = 'addEmployee';
  currentIndexEdit: number;
  employee = {
    // firstName: '',
    // middleName: '',
    // lastName: '',
    name: '',
    employeeId: '',
    email: '',
    employeeType: '',
    dateOfHire: '',
    designation: '',
    department: '',
    status: ''
    
  }
  departments: Array<any> = [];
  currentFilter = 'All';
  constructor(
    private DatabaseService: DatabaseService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.spinner.show();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true
    };
    this.DatabaseService.connectSocketIo();
    this.DatabaseService.getInitialEmployee(res => {
      console.log(res);
      this.employees = res;
      this.originalEmployees = [...res];
      this.dtTrigger.next();
      this.spinner.hide();
    })
    this.DatabaseService.getNewEmployeeRealTime(data => {
      console.log(data);
      this.employees.push(data);
    })
    this.DatabaseService.getDepartments(data => {
      console.log(data);
      this.departments = data;
    })
   
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.DatabaseService.disConnectSocketIo();
  }

  doAddEmployee() {
    this.action = 'addEmployee';
    this.employee = {
      // firstName: '',
      // middleName: '',
      // lastName: '',
      name: '',
      employeeId: '',
      email: '',
      employeeType: '',
      dateOfHire: '',
      designation: '',
      department: '',
      status: '',
    }
  }

  addEmployee(){
    this.spinner.show();
    this.employee.dateOfHire = $('#datepicker').val();
    console.log(this.employee);
    this.DatabaseService.addEmployee(this.employee, (res) => {
      console.log(res);
      this.employee = {
        // firstName: '',
        // middleName: '',
        // lastName: '',
        name: '',
        employeeId: '',
        email: '',
        employeeType: '',
        dateOfHire: '',
        designation: '',
        department: '',
        status: '',
      }
      this.spinner.hide();
    })
  }

  updateEmployee() {
    this.spinner.show();
    this.DatabaseService.updateEmployee(this.employee, (res) => {
      console.log(res);
      this.employees[this.currentIndexEdit] = this.employee;
      this.spinner.hide();
    })
  }

  doUpdateEmployee(employee, index) {
    this.action = 'updateEmployee';
    this.currentIndexEdit = index;
    this.employee = {...employee};
    this.employee.employeeType = employee.employment_type;
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    $('#datepicker').datepicker({
      uiLibrary: 'bootstrap4'
    });
  }

  filter(type){
    console.log(type)
    this.currentFilter = type;
    this.employees = [...this.originalEmployees];
    
    if(type !== 'All') this.employees = this.employees.filter(el => el.status == type);
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
