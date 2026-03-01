import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { User } from '../../interface/user';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  @Input() user: User | undefined;
  
  logOut(): void {

  }
}
