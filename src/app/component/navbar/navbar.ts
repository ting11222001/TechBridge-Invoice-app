import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { User } from '../../interface/user';
import { UserService } from '../../service/user';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class NavbarComponent implements OnInit {
  user: User | undefined;

  customersOpen = false;
  invoicesOpen = false;
  profileOpen = false;
  mobileOpen = false;

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit(): void {
    this.userService.profile$().subscribe({
      next: (response) => {
        this.user = response.data?.user;
      },
      error: (error) => {
        console.error('Error fetching user profile:', error);
      }
    });
  }

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
