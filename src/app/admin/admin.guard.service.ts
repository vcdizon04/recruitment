import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import { DatabaseService } from '../services/database.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuardService implements CanActivate {

  constructor( 
    private router: Router,
    private databaseService: DatabaseService) { }

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
    try {
      return !!await this.databaseService.isAuthenticated();
    } catch {
      // navigate to login page
      this.router.navigate(['/log-in'], {queryParams: {returnUrl: state.url}});
      // you can save redirect url so after authing we can move them back to the page they requested
      return false;
    }
  }
}
