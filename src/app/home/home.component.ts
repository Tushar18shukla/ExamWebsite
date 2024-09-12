import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CustomSectionComponent } from '../custom-section/custom-section.component'; // Adjust path

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const body = document.body;
    const header = document.querySelector('header');
    const signUpBtn = document.querySelector('.sign-up-btn');
    const title = document.querySelector('.title');
    const highlight = document.querySelector('.highlight');
    const featureItems = document.querySelectorAll('.feature-item p');

    themeToggleBtn?.addEventListener('click', function() {
      body.classList.toggle('dark-mode');
      header?.classList.toggle('dark-mode');
      signUpBtn?.classList.toggle('dark-mode');
      title?.classList.toggle('dark-mode');
      highlight?.classList.toggle('dark-mode');
      themeToggleBtn?.classList.toggle('dark-mode');

      featureItems.forEach(item => {
        item.classList.toggle('dark-mode');
      });

      themeToggleBtn.textContent = themeToggleBtn.textContent === 'Dark' ? 'Light' : 'Dark';
    });
  }

  openCustomSection(): void {
    const dialogRef = this.dialog.open(CustomSectionComponent, {
      width: '600px',  // Width of the dialog
      panelClass: 'mat-dialog-container',
      backdropClass: 'custom-backdrop',  // Apply the backdrop blur
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed');
    });
  }
}
