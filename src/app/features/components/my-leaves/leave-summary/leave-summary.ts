import { Component, OnInit } from '@angular/core';
import { LeaveCards } from '../../../../shared/components/leave-cards/leave-cards';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-leave-summary',
  standalone: true,
  imports: [LeaveCards, CommonModule, RouterModule],
  templateUrl: './leave-summary.html',
  styleUrl: './leave-summary.css',
})
export class LeaveSummary implements OnInit{
  selectedIndex: number | null = null;



  leaveSummary = [
    {
      count: 16,
      label: 'Casual Leaves',
      gradient: 'linear-gradient(to right, #7367f0, #9d79f9)',
      lightGradient: 'linear-gradient(to right, #109CF1, #6BCBFF)',
      icon: 'bi bi-calendar-check',
      taken: 8,
      scheduled: 5,
    },
    {
      count: 2,
      label: 'Compensatory Off',
      gradient: 'linear-gradient(to right, #00cfe8, #80f0fc)',
      lightGradient: 'linear-gradient(to right, #109CF1, #6BCBFF)',
      icon: 'bi bi-arrow-repeat',
      taken: 1,
      scheduled: 1,
    },
    {
      count: 2,
      label: 'Loss of Pay',
      gradient: 'linear-gradient(to right, #ea5455, #f88588)',
      lightGradient: 'linear-gradient(to right, #109CF1, #6BCBFF)',
      icon: 'bi bi-exclamation-octagon',
      taken: 12,
      scheduled: 0,
    },
    {
      count: 12,
      label: 'Overtime Logged',
      gradient: 'linear-gradient(to right, #28c76f, #60f19d)',
      lightGradient: 'linear-gradient(to right, #109CF1, #6BCBFF)',
      icon: 'bi bi-clock-history',
      taken: 7,
      scheduled: 3,
    },
  ];

  ngOnInit(): void {
    this.selectedIndex=0;
  }

  selectedLeave = this.leaveSummary[0];
  

  selectCard(index: number) {
    this.selectedIndex = index;
    this.selectedLeave = this.leaveSummary[index];
  }

  constructor(private modalService: NgbModal) {}

  openModal(content: any, leave: any) {
    this.selectedLeave = leave;
    this.modalService.open(content, { centered: true });
  }
}
