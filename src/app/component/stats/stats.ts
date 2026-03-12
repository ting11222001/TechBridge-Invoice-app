import { Component, Input } from '@angular/core';
import { Stats } from '../../interface/stats';

@Component({
  selector: 'app-stats',
  imports: [],
  templateUrl: './stats.html',
  styleUrl: './stats.css',
})
export class StatsComponent {
  @Input() stats: Stats | undefined;
}
