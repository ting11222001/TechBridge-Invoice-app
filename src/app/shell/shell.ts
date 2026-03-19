import { Component } from '@angular/core';
import { NavbarComponent } from '../component/navbar/navbar';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-shell',
  imports: [NavbarComponent, RouterModule],
  templateUrl: './shell.html',
  styleUrl: './shell.css',
})
export class ShellComponent {}
