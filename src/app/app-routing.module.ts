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
import { CandidatesComponent } from './component/candidates/candidates.component';
import { CandidateDetailsComponent } from './component/candidate-details/candidate-details.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { AdminGuardService } from './admin/admin.guard.service';
import { DepartmentsComponent } from './components/departments/departments.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  // {
  //   path: 'admin',
  //   redirectTo: '/dashboard',
  //   pathMatch: 'full'
  // },
  { path: 'log-in', component: LogInComponent },
  { path: 'admin', component: DashBoardComponent, canActivate: [AdminGuardService]},
  { path: 'job-openings', component: JobopeningComponent, canActivate: [AdminGuardService] },
  { path: 'add-job-opening', component: AddJobopeningComponent, canActivate: [AdminGuardService] },
  { path: 'edit-job-opening', component: AddJobopeningComponent, canActivate: [AdminGuardService] },
  { path: 'question-sets', component: QuestionsetsComponent, canActivate: [AdminGuardService] },
  { path: 'employees', component: EmployeesComponent, canActivate: [AdminGuardService] },
  { path: 'home', component: HomeComponent },
  { path: 'candidates', component: CandidatesComponent, canActivate: [AdminGuardService] },
  { path: 'candidate-details', component: CandidateDetailsComponent, canActivate: [AdminGuardService] },
  { path: 'departments', component: DepartmentsComponent, canActivate: [AdminGuardService] },

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
  AddJobopeningComponent,
  CandidatesComponent,
  CandidateDetailsComponent,
  DepartmentsComponent
  
];
