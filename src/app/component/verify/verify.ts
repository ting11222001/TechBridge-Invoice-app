import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-verify',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './verify.html',
  styleUrl: './verify.css',
})
export class Verify {
}
