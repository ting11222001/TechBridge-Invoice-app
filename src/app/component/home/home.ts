import { Component } from '@angular/core';
import { Stats } from '../stats/stats';
import { Navbar } from '../navbar/navbar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [Navbar, Stats, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  customers = [{
    id: 0,
    name: 'Tiffany',
    email: 'tiffany@gmail.com',
    imageUrl: '',
    phone: '123456',
    status: 'ACTIVE',
    type: 'INDIVIDUAL'
  },
  {
    id: 1,
    name: 'liting',
    email: 'liting@gmail.com',
    imageUrl: '',
    phone: '234567',
    status: 'ACTIVE',
    type: 'INDIVIDUAL'
  }]
}
