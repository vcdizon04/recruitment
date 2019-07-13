import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  isToggled = false;
  constructor(
    private databaseService: DatabaseService
  ) { }

  ngOnInit() {
  }
  toggleSidebar(){
 
    this.isToggled = !this.isToggled;
    console.log('toggle', this.isToggled);
  }
}
