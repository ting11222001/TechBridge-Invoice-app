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
export class NavbarComponent {
  @Input() user: User | undefined;

  mobileOpen = false;
  activeDropdown: string | null = null;

  constructor(private router: Router, private userService: UserService) {}

  toggleMobile(): void {
    this.mobileOpen = !this.mobileOpen;
  }

  toggleDropdown(name: string): void {
    this.activeDropdown = this.activeDropdown === name ? null : name;
  }

  logOut(): void {
    this.userService.logOut$();
    this.router.navigate(['/login']);
  }
}
