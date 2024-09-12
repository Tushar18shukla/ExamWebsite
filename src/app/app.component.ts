import { Component } from '@angular/core'; // Make sure this is included
import { MatDialog } from '@angular/material/dialog'; // Import MatDialog for popup functionality
import { CustomSectionComponent } from './custom-section/custom-section.component'; // Adjust the path if needed

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public dialog: MatDialog) {}

  openCustomSection() {
    this.dialog.open(CustomSectionComponent, {
      width: '80%', // Adjust the size as needed
      height: '80%'
    });
  }
}

