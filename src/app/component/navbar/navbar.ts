import { Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { User } from '../../interface/user';
import { UserService } from '../../service/user';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  @Input() user: User | undefined;

  constructor(private router: Router, private userService: UserService) {}
  
  logOut(): void {
    this.userService.logOut$();
    this.router.navigate(['/login']);
  }
}
