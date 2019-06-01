import { Component, OnInit, Injector } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
  providers: [SidebarComponent]
})
export class NavBarComponent implements OnInit {

  constructor(public injector: Injector) { }

  ngOnInit() {
  }

  toggleSidebar(){
    console.log('toggle');
    const sidebar = this.injector.get(SidebarComponent);
    sidebar.toggleSidebar();
  }

}
