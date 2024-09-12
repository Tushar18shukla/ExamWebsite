import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/compat/database';

interface Question {
  id: number;
  question: string;
  options: string[];
  selectedOption: number | null;
}

@Component({
  selector: 'app-chat-screen',
  templateUrl: './chat-screen.component.html',
  styleUrls: ['./chat-screen.component.scss']
})
export class ChatScreenComponent implements OnInit {
  contacts: any[] = [];
  sidebarVisible: boolean = true;
  chatAvatar: string = '';
  chatName: string = '';
  messages: any[] = [];
  searchTerm: string = '';
  settingsVisible: boolean = false;
  questions: Question[] = [];
  currentQuestionIndex: number = 0;
  heldQuestions: number[] = [];
  questionAnswered: boolean = false;

  currentPage: number = 0;
  questionsPerPage: number = 10; // Display 10 questions per page

  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(private route: ActivatedRoute, private db: AngularFireDatabase) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const testId = params['testId'] || '';
      if (testId) {
        this.fetchQuizData(testId);
      } else {
        console.error('No Test-ID provided.');
      }
    });
  }

  fetchQuizData(testId: string): void {
    this.db.object(`quizzes/${testId}/questions`).valueChanges().subscribe((questions: any) => {
      if (questions) {
        this.questions = questions.map((q: any, index: number) => ({
          id: index,
          question: q.question,
          options: q.options,
          selectedOption: this.getSavedAnswer(index)
        }));

        this.updateQuestionAnsweredState();
        this.updateUI(); // Ensure the UI reflects loaded answers
        this.populateSidebarContacts(); // Ensure the sidebar is populated
        console.log('Quiz data fetched:', this.questions);
      } else {
        console.error('No quiz data found for the provided Test-ID.');
      }
    }, error => {
      console.error('Error fetching quiz data:', error);
    });
  }

  Math = Math; // Exposing Math to the template

  get paginatedQuestions(): Question[] {
    const startIndex = this.currentPage * this.questionsPerPage;
    const endIndex = startIndex + this.questionsPerPage;
    return this.questions.slice(startIndex, endIndex);
  }

  nextPage(): void {
    const totalPages = Math.ceil(this.questions.length / this.questionsPerPage);
    if (this.currentPage < totalPages - 1) {
      this.currentPage++;
      this.currentQuestionIndex = this.currentPage * this.questionsPerPage; // Show the first question of the new batch
      this.updateUI();
      console.log(`Moved to page ${this.currentPage + 1}`);
    } else {
      console.warn('No more questions to display.');
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.currentQuestionIndex = this.currentPage * this.questionsPerPage; // Show the first question of the previous batch
      this.updateUI();
      console.log(`Moved back to page ${this.currentPage + 1}`);
    } else {
      console.warn('You are on the first page.');
    }
  }

  populateSidebarContacts(): void {
    // Populating contacts to be displayed in the sidebar
    this.contacts = this.questions.map((question) => ({
      id: question.id,
      name: `Question ${question.id + 1}`,
      message: question.question,
      img: '', // Provide an image URL or leave empty if not needed
      chat: [] // Initialize empty chat
    }));

    console.log('Contacts populated:', this.contacts);
  }

  get currentQuestion(): Question | undefined {
    return this.questions[this.currentQuestionIndex];
  }

  

  selectOption(index: number): void {
    if (this.currentQuestion) {
      this.currentQuestion.selectedOption = index;
      this.questionAnswered = true;

      // Save the selected answer in sessionStorage
      sessionStorage.setItem(`question_${this.currentQuestion.id}`, index.toString());
      console.log(`Option ${index} selected for question ${this.currentQuestion.id}`);
      
      // Update the UI to reflect the newly selected option
      this.updateUI();
    }
  }

  nextQuestion(): void {
    if (this.questionAnswered) {
      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++;
        this.loadSavedAnswer();  // Load the answer for the next question
        this.updateQuestionAnsweredState();
        this.updateUI(); // Ensure the UI reflects loaded answers
        console.log(`Moved to next question ${this.currentQuestionIndex}`);
      } else {
        console.warn('This is the last question.');
      }
    } else {
      console.warn('Please select an option before proceeding.');
    }
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--; // Move to the previous question

      // Load the saved answer for the current question
      this.loadSavedAnswer(); 

      // Ensure that `questionAnswered` reflects whether an answer is selected
      this.updateQuestionAnsweredState();
      this.updateUI(); // Ensure the UI reflects loaded answers
      console.log(`Moved back to question ${this.currentQuestionIndex}`);
    }
  }

  loadSavedAnswer(): void {
    if (this.currentQuestion) {
      const savedAnswer = sessionStorage.getItem(`question_${this.currentQuestion.id}`);
      if (savedAnswer !== null) {
        this.currentQuestion.selectedOption = parseInt(savedAnswer, 10);
        this.questionAnswered = true;
        console.log(`Loaded saved answer ${savedAnswer} for question ${this.currentQuestion.id}`);
      } else {
        this.currentQuestion.selectedOption = null;
        this.questionAnswered = false;
        console.log(`No saved answer found for question ${this.currentQuestion.id}`);
      }
    }

    // Trigger UI update to reflect the loaded answer
    this.updateUI();
  }

  getSavedAnswer(questionIndex: number): number | null {
    const savedAnswer = sessionStorage.getItem(`question_${questionIndex}`);
    return savedAnswer !== null ? parseInt(savedAnswer, 10) : null;
  }

  updateQuestionAnsweredState(): void {
    this.questionAnswered = this.currentQuestion?.selectedOption !== null;
    console.log(`Question answered state updated: ${this.questionAnswered}`);
  }

  updateUI(): void {
    if (this.currentQuestion) {
      console.log(`Updating UI for question ${this.currentQuestion.id}`);

      // Clear all radio buttons for the current question first
      const allOptions = document.querySelectorAll(`input[name="option_${this.currentQuestion.id}"]`);
      allOptions.forEach(option => (option as HTMLInputElement).checked = false);

      // Now set the selected option
      const selectedOption = this.currentQuestion.selectedOption;
      if (selectedOption !== null) {
        const optionElement = document.querySelector(`input[name="option_${this.currentQuestion.id}"][value="${selectedOption}"]`) as HTMLInputElement;
        if (optionElement) {
          optionElement.checked = true;  // Ensure the option is selected
          console.log(`Option ${selectedOption} is now checked for question ${this.currentQuestion.id}`);
        }
      }
    }
  }

  holdQuestion(): void {
    if (!this.heldQuestions.includes(this.currentQuestionIndex)) {
      this.heldQuestions.push(this.currentQuestionIndex);
    }
    this.currentQuestionIndex++; // Move to the next question regardless of the current state
  
    if (this.currentQuestionIndex >= this.questions.length) {
      this.currentQuestionIndex = this.questions.length - 1; // Ensure the index doesn't exceed the number of questions
      console.warn('This is the last question.');
    }
  
    this.loadSavedAnswer(); // Load the answer for the next question
    this.updateQuestionAnsweredState();
    this.updateUI(); // Ensure the UI reflects the new question
    console.log(`Moved to next question ${this.currentQuestionIndex} after holding the current one.`);
  }

  goToQuestion(index: number): void {
    if (index >= 0 && index < this.questions.length) {
      this.currentQuestionIndex = index;
      this.loadSavedAnswer();
      this.updateQuestionAnsweredState();
      this.updateUI();  // Ensure the UI reflects loaded answers
      console.log(`Jumped to question ${index}`);
    }
  }

  getTimelineItemClass(index: number): string {
    if (this.heldQuestions.includes(index)) {
      return 'timeline-item held';
    } else if (this.currentQuestionIndex === index) {
      return 'timeline-item active';
    } else if (index < this.currentQuestionIndex) {
      return 'timeline-item completed';
    } else {
      return 'timeline-item';
    }
  }

  renderContacts(contactArray: any[]): void {
    console.log('Contacts rendered:', contactArray);
  }

  toggleSidebar(): void {
    if (window.innerWidth <= 768) {
      this.sidebarVisible = !this.sidebarVisible;
    } else {
      this.sidebarVisible = true;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.updateLayout();
  }

  updateLayout(): void {
    if (window.innerWidth <= 768) {
      this.sidebarVisible = false;
    } else {
      this.sidebarVisible = true;
    }
  }

  selectContact(contact: any): void {
    this.chatAvatar = contact.img;
    this.chatName = contact.name;
    this.messages = contact.chat;

    const questionIndex = this.questions.findIndex(q => q.id === contact.id);
    if (questionIndex !== -1) {
      this.goToQuestion(questionIndex);
    }
  }

  filterContacts(): void {
    const filteredContacts = this.contacts.filter(contact =>
      contact.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.renderContacts(filteredContacts);
  }

  sendMessage(content: string): void {
    if (content.trim()) {
      this.messages.push({ type: 'sent', content });
      setTimeout(() => {
        this.receiveMessage("Can't talk right now, sorry.");
      }, 1000);
    }
  }

  receiveMessage(content: string): void {
    this.messages.push({ type: 'received', content });
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  uploadFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files ? input.files[0] : null;
    if (file) {
      this.messages.push({
        type: 'sent',
        content: `File uploaded: ${file.name}`
      });
    }
  }

  toggleSettings(): void {
    this.settingsVisible = !this.settingsVisible;
  }

  closeSettings(): void {
    this.settingsVisible = false;
  }

  activateMenuItem(section: string): void {
    const sections = document.querySelectorAll('.settings-content > div');
    sections.forEach((section) => {
      (section as HTMLElement).classList.remove('active');
    });

    const selectedSection = document.getElementById(section);
    if (selectedSection) {
      selectedSection.classList.add('active');
    }
  }
}
