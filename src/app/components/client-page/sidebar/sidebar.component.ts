import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-client-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarClientComponent implements OnInit {
  isToggled = false;
  constructor() { }

  ngOnInit() {
  }
  toggleSidebar(){  
 
    this.isToggled = !this.isToggled;
    console.log('toggle', this.isToggled);
  }

}
