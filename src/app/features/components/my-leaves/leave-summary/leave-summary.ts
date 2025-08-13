import { Component, OnInit } from '@angular/core';
import { LeaveCards } from '../../../../shared/components/leave-cards/leave-cards';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { LeaveManagementServiceService } from '../../../services/leave-management-service.service';
import { selectAuthUser } from '../../../../auth/store/auth/login.selectors';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-leave-summary',
  standalone: true,
  imports: [LeaveCards, CommonModule, RouterModule],
  templateUrl: './leave-summary.html',
  styleUrl: './leave-summary.css',
})
export class LeaveSummary implements OnInit {
  selectedIndex: number | null = null;
  leaveSummary: any[] = [];
  selectedLeave: any;
  loggedInUser: any;
  rowData: any[] = [];

  constructor(
    private modalService: NgbModal,
    private leaveManagementService: LeaveManagementServiceService,
    private store :Store
  ) {
    
  }

  ngOnInit(): void {
    this.selectedIndex = 0;
    this.store.select(selectAuthUser).subscribe((user: any) => {
          if (user) {
            this.loggedInUser = user;
            const empCode = this.loggedInUser.empCode;
            this.loadUsersLeaveSummary(empCode);
          }
        });
  }

loadUsersLeaveSummary(empCode: string) {
  this.leaveManagementService.getMyLeaveSummary(empCode).subscribe({
    next: (data: any[]) => {
      this.leaveSummary = data.map((item: any) => {
        const leaveRemaining = Number(item.leaveRemaining);
        const leaveTaken = Number(item.leaveTaken);
        const leaveScheduled = Number(item.leaveScheduled);
        const leaveType = String(item.leaveType);

        return {
          // For top card
          count: leaveRemaining,
          label: item.leaveType,
          lightGradient: 'linear-gradient(to right, #109CF1, #6BCBFF)',
          icon: this.getIcon(item.leaveType),

          // For details section
          leaveType,
          leaveRemaining,
          leaveTaken,
          leaveScheduled
        };
      });

      if (this.leaveSummary.length > 0) {
        this.selectedLeave = this.leaveSummary[0];
      }
    },
    error: (err) => console.error('Error fetching leave summary:', err),
  });
}


  selectCard(index: number) {
    this.selectedIndex = index;
    this.selectedLeave = this.leaveSummary[index];
  }

  openModal(content: any, leave: any) {
    this.selectedLeave = leave;
    this.modalService.open(content, { centered: true });
  }
 

  private getIcon(type: string): string {
    switch (type.toLowerCase()) {
      case 'casual leaves': return 'bi bi-calendar-check';
      case 'compensatory off': return 'bi bi-arrow-repeat';
      case 'loss of pay': return 'bi bi-exclamation-octagon';
      case 'overtime logged': return 'bi bi-clock-history';
      default: return 'bi bi-calendar-event';
    }
  }
}
