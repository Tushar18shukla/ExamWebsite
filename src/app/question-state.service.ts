import { Injectable } from '@angular/core';
import questionsData from '../assets/questions.json';

interface Question {
  id: number;
  question: string;
  options: string[];
  selectedOption: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class QuestionStateService {
  private questions: Question[] = questionsData;

  constructor() {}

  getQuestions(): Question[] {
    return this.questions;
  }

  selectOption(questionId: number, optionIndex: number): void {
    const question = this.questions.find(q => q.id === questionId);
    if (question) {
      question.selectedOption = optionIndex;
    }
  }

  getSelectedOption(questionId: number): number | null {
    const question = this.questions.find(q => q.id === questionId);
    return question ? question.selectedOption : null;
  }
}
