import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent implements OnInit {
  user = {
    email: undefined,
    password: undefined
  }

  constructor(
    private databaseService: DatabaseService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) { }

  ngOnInit() {
    this.databaseService.connectSocketIo();
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.databaseService.disConnectSocketIo();
  }

  logIn(){
    this.spinner.show();
    console.log(this.user);
    this.databaseService.logIn(this.user,res => {
      console.log(res);
      this.spinner.hide();
      if(res.error){
        alert('Error Please try again');
      } else {
        this.databaseService.setUser(res[0])
        this.router.navigate(['/admin'],);
      }
    })
  }

}
