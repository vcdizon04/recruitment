import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { DashBoardComponent } from './components/dash-board/dash-board.component';
import { FooterComponent } from './components/footer/footer.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { JobopeningComponent } from './components/jobopening/jobopening.component';
import { QuestionsetsComponent } from './components/questionsets/questionsets.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { HomeComponent } from './components/client-page/home/home.component';
import { SidebarClientComponent } from './components/client-page/sidebar/sidebar.component';
import { ClientNavbarComponent } from './components/client-page/client-navbar/client-navbar.component';
import { AddJobopeningComponent } from './components/add-jobopening/add-jobopening.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'admin',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  { path: 'dashboard', component: DashBoardComponent },
  { path: 'job-opening', component: JobopeningComponent },
  { path: 'add-job-opening', component: AddJobopeningComponent },
  { path: 'question-sets', component: QuestionsetsComponent },
  { path: 'employees', component: EmployeesComponent },
  { path: 'home', component: HomeComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [
  NavBarComponent,
  DashBoardComponent,
  FooterComponent,
  SidebarComponent ,
  JobopeningComponent,
  QuestionsetsComponent,
  EmployeesComponent,
  HomeComponent,
  SidebarClientComponent,
  ClientNavbarComponent,
  AddJobopeningComponent
  
];
