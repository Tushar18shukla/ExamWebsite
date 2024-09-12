import { Component } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Router } from '@angular/router';

@Component({
  selector: 'app-join-test',
  templateUrl: './join-test.component.html',
  styleUrls: ['./join-test.component.scss']
})
export class JoinTestComponent {
  testId: string = '';
  password: string = '';
  name: string = '';  // Keeping the name field for future use

  constructor(private db: AngularFireDatabase, private router: Router) {}

  joinTest() {
    if (this.validateInputs()) {
      // Check if the Test-ID and password match in Firebase
      this.db.object(`quizzes/${this.testId}`).valueChanges().subscribe((quiz: any) => {
        if (quiz && quiz.password === this.password) {
          alert('Test-ID and password are correct. Redirecting to chat-screen.');
          // Redirect to chat-screen with the quiz data and the user's name
          this.router.navigate(['/chat-screen'], {
            queryParams: { 
              testId: this.testId,
              name: this.name  // Passing the name as a query parameter
            }
          });
        } else {
          alert('Invalid Test-ID or password.');
          this.showErrorMessage('test-id-error', true);
          this.showErrorMessage('password-error', true);
        }
      });
    }
  }

  validateInputs(): boolean {
    let isValid = true;

    // Validate Test-ID
    if (!this.testId.trim()) {
      this.showErrorMessage('test-id-error', true);
      isValid = false;
    } else {
      this.showErrorMessage('test-id-error', false);
    }

    // Validate Password
    if (!this.password.trim()) {
      this.showErrorMessage('password-error', true);
      isValid = false;
    } else {
      this.showErrorMessage('password-error', false);
    }

    return isValid;
  }

  showErrorMessage(elementId: string, show: boolean): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.style.display = show ? 'block' : 'none';
    }
  }
}
