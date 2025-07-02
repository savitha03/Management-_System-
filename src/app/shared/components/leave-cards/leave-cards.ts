import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-leave-cards',
  imports: [CommonModule],
  templateUrl: './leave-cards.html',
  styleUrl: './leave-cards.css',
})
export class LeaveCards {
  @Input() count: number = 0;
  @Input() label: string = '';
  @Input() gradient: string = 'linear-gradient(135deg, #42a5f5, #7e57c2)';
  @Input() iconClass: string = 'bi bi-award'; // Bootstrap Icons
}
