import { Component } from '@angular/core';
import { LeaveCards } from '../../../../shared/components/leave-cards/leave-cards';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-leave-summary',
  standalone: true,
  imports: [LeaveCards, CommonModule,RouterModule],
  templateUrl: './leave-summary.html',
  styleUrl: './leave-summary.css',
})
export class LeaveSummary {
  // leaveSummary = [
  //   {
  //     count: 16,
  //     label: 'Casual Leaves',
  //     color: '#7367f0',
  //     taken: 8,
  //     scheduled: 5,
  //   },
  //   { count: 12, label: 'Overtime', color: '#28c76f', taken: 7, scheduled: 3 },
  //   { count: 2, label: 'Comp Off', color: '#00cfe8', taken: 1, scheduled: 1 },
  //   {
  //     count: 12,
  //     label: 'Loss of Pay',
  //     color: '#ea5455',
  //     taken: 12,
  //     scheduled: 0,
  //   },
  // ];

  leaveSummary = [
    {
      count: 16,
      label: 'Available Leaves',
      gradient: 'linear-gradient(to right, #7367f0, #9d79f9)',
      icon: 'bi bi-calendar-check',
      taken: 8,
      scheduled: 5,
    },
    {
      count: 12,
      label: 'Overtime Logged',
      gradient: 'linear-gradient(to right, #28c76f, #60f19d)',
      icon: 'bi bi-clock-history',
      taken: 7,
      scheduled: 3,
    },
    {
      count: 2,
      label: 'Compensatory Off',
      gradient: 'linear-gradient(to right, #00cfe8, #80f0fc)',
      icon: 'bi bi-arrow-repeat',
      taken: 1,
      scheduled: 1,
    },
    {
      count: 2,
      label: 'Loss of Pay',
      gradient: 'linear-gradient(to right, #ea5455, #f88588)',
      icon: 'bi bi-exclamation-octagon',
      taken: 12,
      scheduled: 0,
    },
  ];

  selectedLeave: any;

  constructor(private modalService: NgbModal) {}

  openModal(content: any, leave: any) {
    this.selectedLeave = leave;
    this.modalService.open(content, { centered: true });
  }
}
