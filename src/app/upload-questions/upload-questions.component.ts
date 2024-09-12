import { Component } from '@angular/core';
import * as mammoth from 'mammoth';

@Component({
  selector: 'app-upload-questions',
  templateUrl: './upload-questions.component.html',
  styleUrls: ['./upload-questions.component.scss'],
})
export class UploadQuestionsComponent {
  questions: string[] = [];
  selectedQuestionIndex: number = 0;
  selectedQuestion: string = '';

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.readDocxFile(file);
    }
  }

  readDocxFile(file: File): void {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      const arrayBuffer = event.target.result;
      mammoth.extractRawText({ arrayBuffer: arrayBuffer })
        .then((result: any) => {
          this.processDocText(result.value);
        })
        .catch((error: any) => {
          console.error('Error reading docx file:', error);
        });
    };
    reader.readAsArrayBuffer(file);
  }

  processDocText(text: string): void {
    // Assuming each question is separated by a newline
    this.questions = text.split('\n').filter((q) => q.trim().length > 0);
    this.selectQuestion(0);
  }

  selectQuestion(index: number): void {
    this.selectedQuestionIndex = index;
    this.selectedQuestion = this.questions[index];
  }
}
