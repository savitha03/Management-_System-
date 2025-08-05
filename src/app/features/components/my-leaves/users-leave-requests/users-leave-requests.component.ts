import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsyncDetection, NgScrollbar } from "ngx-scrollbar";
import { LeaveManagementServiceService } from '../../../services/leave-management-service.service';

@Component({
  selector: 'app-users-leave-requests',
  imports: [CommonModule, NgScrollbar],
  templateUrl: './users-leave-requests.component.html',
  styleUrl: './users-leave-requests.component.css',
})
export class UsersLeaveRequestsComponent implements OnInit {
  //  leaveRequests = [
  //   {
  //     fullName: 'Jenny Wilson',
  //     designation: 'UI/UX designer',
  //     Reason: "Friend's Wedding Celebration",
  //     leaveType: 'Casual',
  //     duration: '2 Days',
  //     fromDate: '10 Apr 2020',
  //     toDate: '11 Apr 2020',
  //     imageUrl: 'assets/avatar.png',

  //   },
  //   {
  //     name: 'Courtney Henry',
  //     designation: 'UI/UX designer',
  //     Reason: 'Personal work',
  //     leaveType: 'Casual',
  //     duration: '2 Days',
  //     fromDate: '10 Apr 2020',
  //     toDate: '11 Apr 2020',
  //     imageUrl: 'assets/avatar.png',

  //   },
  //   {
  //     name: 'Brooklyn Simmons',
  //     designation: 'UX Researcher',
  //     Reason: 'Vacation',
  //     leaveType: 'Casual',
  //     duration: '4 Days',
  //     fromDate: '10 Apr 2020',
  //     toDate: '11 Apr 2020',
  //     imageUrl: 'assets/avatar.png',

  //   },
  //     {
  //   name: 'Ralph Edwards',
  //   designation: 'Frontend Developer',
  //   Reason: 'Medical Appointment',
  //   leaveType: 'Sick',
  //   duration: '1 Day',
  //   fromDate: '15 Apr 2020',
  //   toDate: '15 Apr 2020',
  //   imageUrl: 'assets/avatar.png',
  // },
  // {
  //   name: 'Savannah Nguyen',
  //   designation: 'Product Designer',
  //   Reason: 'Family Event',
  //   leaveType: 'Casual',
  //   duration: '2 Days',
  //   fromDate: '18 Apr 2020',
  //   toDate: '19 Apr 2020',
  //   imageUrl: 'assets/avatar.png',
  // },
  // {
  //   name: 'Wade Warren',
  //   designation: 'QA Analyst',
  //   Reason: 'Fever and fatigue',
  //   leaveType: 'Sick',
  //   duration: '2 Days',
  //   fromDate: '20 Apr 2020',
  //   toDate: '21 Apr 2020',
  //   imageUrl: 'assets/avatar.png',
  // },

  // ];
  leaveRequests: any[] = [];
  // filteredRequests:any[]=[];
  activeTab: string = 'requestPending';

  constructor(private leaveManagementService: LeaveManagementServiceService) {}

  ngOnInit(): void {
    this.loadUsersLeaveRequests();
  }

  loadUsersLeaveRequests() {
    this.leaveManagementService
      .getUsersLeaveRequestHistory()
      .subscribe((data) => {
        this.leaveRequests = data.map((item: any) => ({
          LeavePK: item.leavePK,
          fullName: item.fullName,
          designation: item.designation,
          leaveType: item.leaveType,
          duration: item.duration,
          reason: item.reason,
          fromDate: item.fromDate,
          toDate: item.toDate,
          imageUrl: 'assets/avatar.png',
          status: item.status,
        }));
      });
  }

  switchTab(tab: string) {
    this.activeTab = tab;
  }

  onLeaveAction(leavePK: number, action:'APPROVED'|'CANCELLED') {
    const payload = {
      LeavePK: leavePK,
      Action: action,
    };

    this.leaveManagementService
      .userLeaveRequestActionUpdate(payload)
      .subscribe({
        next: (res) => {
          console.log('Leave action successful:', res);
          this.loadUsersLeaveRequests(); // Refresh the list
        },
        error: (err) => {
          console.error('Leave action failed:', err);
        },
      });
  }

 get filteredRequests(): any[] {
  return this.activeTab === 'requestPending'
      ? this.requestPending
      : this.requestCompleted;
}

get requestPending(){
  return this.leaveRequests.filter(request => request.status === 'PENDING');
}

get requestCompleted(){
  return this.leaveRequests.filter(request => request.status==='APPROVED' || request.status === 'CANCELLED');
}

}




