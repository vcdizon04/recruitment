import { Component, OnInit, Input, EventEmitter, Output, Injector } from '@angular/core';
import { SidebarClientComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-client-navbar',
  templateUrl: './client-navbar.component.html',
  styleUrls: ['./client-navbar.component.scss']
})
export class ClientNavbarComponent implements OnInit {
  @Input() searchVal: string;
  @Output() onSearch: EventEmitter<string> =   new EventEmitter();
  
  constructor(
    private injector: Injector
  ) { }

  ngOnInit() {
  }

  onSearchEnter() {
    this.onSearch.emit(this.searchVal);
  }
  toggleSidebar(){
    console.log('toggle');
    const sidebar = this.injector.get(SidebarClientComponent);
    sidebar.toggleSidebar();
  }

}
