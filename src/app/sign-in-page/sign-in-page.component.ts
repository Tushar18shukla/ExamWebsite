import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in-page',
  templateUrl: './sign-in-page.component.html',
  styleUrls: ['./sign-in-page.component.scss']
})
export class SignInPageComponent {
  email: string = '';
  password: string = '';
  emailError: boolean = false;
  passwordError: boolean = false;

  constructor(private auth: AngularFireAuth, private router: Router) {}

  signIn() {
    this.emailError = false;
    this.passwordError = false;

    if (!this.email || !this.password) {
      if (!this.email) this.emailError = true;
      if (!this.password) this.passwordError = true;
      return;
    }

    this.auth.signInWithEmailAndPassword(this.email, this.password)
      .then(userCredential => {
        console.log('Signed in successfully:', userCredential.user);
        alert('Sign in successful!');
        this.router.navigate(['/']);  // Redirect to Plan-Test page after sign-in
      })
      .catch(error => {
        console.error('Error signing in:', error);
        if (error.code === 'auth/invalid-email') {
          this.emailError = true;
        } else if (error.code === 'auth/wrong-password') {
          this.passwordError = true;
        } else {
          alert('Invalid Username or Password');
        }
      });
  }

  onSignUpClick() {
    this.router.navigate(['/sign-up']);
  }
}
