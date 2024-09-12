import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  email: string = '';
  password: string = '';

  constructor(
    private auth: AngularFireAuth, 
    private router: Router
  ) {}

  ngOnInit(): void {
    const closeButton = document.getElementById('closeButton');
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        this.router.navigate(['/']);  // Redirect to home or another page
      });
    }
  }

  signUpUser() {
    if (!this.email || !this.password) {
      console.error('Email and password are required');
      return;
    }

    this.auth.createUserWithEmailAndPassword(this.email, this.password)
      .then(() => {
        console.log('User created successfully in Firebase Authentication');
        alert('Sign up successful!');
        this.auth.signOut();  // Immediately sign out after sign-up to enforce sign-in
        this.router.navigate(['/']);  // Redirect to home or any other non-protected page
      })
      .catch(error => {
        console.error('Error creating user in Firebase Authentication:', error);
        alert('Error: check email and password(contain 6 digits)');
      });
  }
}
