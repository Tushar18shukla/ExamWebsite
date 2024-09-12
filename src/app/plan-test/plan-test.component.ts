import { Component } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Router } from '@angular/router';
import * as mammoth from 'mammoth'; // Import mammoth to handle Word file

@Component({
  selector: 'app-plan-test',
  templateUrl: './plan-test.component.html',
  styleUrls: ['./plan-test.component.scss']
})
export class PlanTestComponent {
  questionText: string = '';
  options: string[] = ['', '', '', ''];
  quizData: any[] = [];  // Array to hold multiple questions

  constructor(private db: AngularFireDatabase, private router: Router) {}

  saveAndNext() {
    if (this.isValidInput()) {
      this.quizData.push({
        question: this.questionText,
        options: [...this.options]  // Ensure options are copied
      });
      console.log('Question added:', this.quizData);

      // Clear the form for the next question
      this.questionText = '';
      this.options = ['', '', '', ''];
    } else {
      console.error('Invalid input: Question or options are empty.');
    }
  }

  save() {
    // First, add the current question if it's not already added
    this.saveAndNext();

    if (this.quizData.length > 0) {
      // Redirect to Test-ID page with quizData passed as query params
      this.router.navigate(['/test-id'], {
        queryParams: { quizData: JSON.stringify(this.quizData) }
      });
    } else {
      console.error('No questions to save.');
    }
  }

  private isValidInput(): boolean {
    return this.questionText.trim() !== '' && this.options.some(option => option.trim() !== '');
  }

  // Method to handle file upload and extract text from Word file
  onFileUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e: any) => {
        const arrayBuffer = e.target.result;
        try {
          const result = await mammoth.extractRawText({ arrayBuffer });
          const text = result.value; // Extracted text from Word file
          this.parseWordContent(text); // Parse the extracted text
        } catch (error) {
          console.error('Error reading Word file:', error);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  }

  // Method to parse the extracted text and populate question and options
  private parseWordContent(text: string) {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);

    // Clear existing quiz data
    this.quizData = [];

    let currentQuestion: string = '';
    let currentOptions: string[] = [];

    lines.forEach(line => {
      if (/^\d+\.\s/.test(line)) { // Detect if line starts with a number followed by a period and space (e.g., "1. ")
        if (currentQuestion) {
          // Push the previous question and options into quizData
          this.quizData.push({
            question: currentQuestion,
            options: [...currentOptions]
          });
        }
        // Start a new question, separating the question from any attached options
        const parts = line.split(/(?=\s[A-D]\)\s)/); // Split at the beginning of any option (e.g., " A) ")
        currentQuestion = parts[0]; // First part is the question
        currentOptions = parts.slice(1); // Remaining parts are options (if any on the same line)
      } else if (/^[A-D]\)\s/.test(line)) { // Detect if line starts with A-D followed by closing parenthesis and space (e.g., "A) ")
        currentOptions.push(line); // Store the option
      }
    });

    // Add the last question and its options
    if (currentQuestion) {
      this.quizData.push({
        question: currentQuestion,
        options: [...currentOptions]
      });
    }

    console.log('Parsed quiz data:', this.quizData);

    // After parsing, redirect to Test-ID page for user to input Test-ID and password
    this.router.navigate(['/test-id'], {
      queryParams: { quizData: JSON.stringify(this.quizData) }
    });
  }
}
