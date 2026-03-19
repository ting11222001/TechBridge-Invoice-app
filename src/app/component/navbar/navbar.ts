import { Component, ElementRef, HostListener, Input } from '@angular/core';
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

  customersOpen = false;
  invoicesOpen = false;
  profileOpen = false;
  mobileOpen = false;

  constructor(private router: Router, private userService: UserService) {}

  logOut(): void {
    this.userService.logOut$();
    this.router.navigate(['/login']);
  }

  toggleCustomers(): void {
    this.customersOpen = !this.customersOpen;
    this.invoicesOpen = false;
    this.profileOpen = false;
  }

  toggleInvoices(): void {
    this.invoicesOpen = !this.invoicesOpen;
    this.customersOpen = false;
    this.profileOpen = false;
  }

  toggleProfile(): void {
    this.profileOpen = !this.profileOpen;
    this.customersOpen = false;
    this.invoicesOpen = false;
  }
}
