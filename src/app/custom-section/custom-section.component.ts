import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-custom-section',
  templateUrl: './custom-section.component.html',
  styleUrls: ['./custom-section.component.scss']
})
export class CustomSectionComponent {

  constructor(public dialogRef: MatDialogRef<CustomSectionComponent>) {}

  closeDialog(): void {
    this.dialogRef.close(); // Closes the dialog when called
  }
}
