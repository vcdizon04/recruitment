import { Component, OnInit, Injector, Input } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { Router } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
  providers: [SidebarComponent]
})
export class NavBarComponent implements OnInit {

  constructor(
    public injector: Injector,
    private router: Router,
    private databaseService: DatabaseService
    ) {
      console.log(this.databaseService.user)
     }

  ngOnInit() {
  }

  toggleSidebar(){
    console.log('toggle');
    const sidebar = this.injector.get(SidebarComponent);
    sidebar.toggleSidebar();
  }

  logOut(){
    this.databaseService.logOut();
    this.router.navigate(['/log-in']);
  }

}
