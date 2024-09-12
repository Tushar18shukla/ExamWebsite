import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.afAuth.authState.pipe(
      map(user => !!user),  // User must be logged in to proceed
      tap(loggedIn => {
        if (!loggedIn) {
          alert('You must sign in to access the Plan-Test page.');  // Pop-up alert
          this.router.navigate(['/']);  // Redirect to sign-in page
        }
      })
    );
  }
}
