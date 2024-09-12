import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-test-id',
  templateUrl: './test-id.component.html',
  styleUrls: ['./test-id.component.scss']
})
export class TestIdComponent implements OnInit {
  testId: string = '';
  password: string = '';
  quizData: any[] = [];

  constructor(
    private db: AngularFireDatabase, 
    private auth: AngularFireAuth, 
    private route: ActivatedRoute, 
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.quizData = JSON.parse(params['quizData'] || '[]');
      if (this.quizData.length === 0) {
        console.error('No quiz data found. Redirecting to Plan-Test page.');
        this.router.navigate(['/plan-test']);
      }
    });
  }

  saveTestId() {
    if (!this.testId || !this.password) {
      console.error('Test-ID and password are required');
      return;
    }

    const formattedEmail = `${this.testId.trim()}@test.com`;

    const quiz = {
      testId: this.testId,
      password: this.password,
      questions: this.quizData
    };

    console.log('Saving quiz to Realtime Database:', quiz);

    // Save Test-ID and password to Firebase Realtime Database
    this.db.object(`quizzes/${this.testId}`).set(quiz).then(() => {
      console.log('Quiz saved successfully with Test-ID:', this.testId);

      // Save Test-ID and password to Firebase Authentication
      this.auth.createUserWithEmailAndPassword(formattedEmail, this.password).then(() => {
        console.log('User created successfully in Firebase Authentication');
        this.router.navigate(['/plan-test']);  // Redirect back to Plan-Test page or show success message
      }).catch(error => {
        console.error('Error creating user in Firebase Authentication:', error);
      });

    }).catch(error => {
      console.error('Error saving quiz to Realtime Database:', error);
    });
  }
}
