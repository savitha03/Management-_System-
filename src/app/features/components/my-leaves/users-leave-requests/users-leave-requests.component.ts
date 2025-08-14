import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsyncDetection, NgScrollbar } from "ngx-scrollbar";
import { LeaveManagementServiceService } from '../../../services/leave-management-service.service';
import { selectAuthUser } from '../../../../auth/store/auth/login.selectors';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-users-leave-requests',
  imports: [CommonModule, NgScrollbar],
  templateUrl: './users-leave-requests.component.html',
  styleUrl: './users-leave-requests.component.css',
})
export class UsersLeaveRequestsComponent implements OnInit {
 
  leaveRequests: any[] = [];
  activeTab: string = 'requestPending';
  requestPending!: any[];
  requestCompleted!: any[];
  loggedInUser:any;

  @ViewChild('popover') popover!: ElementRef;
  activePopover: any = null;


  constructor(private leaveManagementService: LeaveManagementServiceService, private store: Store) {
     this.store.select(selectAuthUser).subscribe((user:any) => {
              if(user){
                this.loggedInUser= user;
                const empCode = this.loggedInUser.empCode;
                this.loadUsersLeaveRequests(empCode);
              }
            });
  }

  ngOnInit(): void {
    
    // this.loadUsersLeaveRequests();
  }

  loadUsersLeaveRequests(empCode: string) {
    this.leaveManagementService
      .getUsersLeaveRequestHistory(empCode)
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
          leaveStatus: item.leaveStatus,
          updatedUser:item.updatedUser
        }));

        this.requestPending = this.leaveRequests.filter(request => request.leaveStatus === 'PENDING');
        
        this.requestCompleted = this.leaveRequests.filter(request => request.leaveStatus==='APPROVED' || request.leaveStatus === 'CANCELLED');
      });
  }

  switchTab(tab: string) {
    this.activeTab = tab;
  }

  onLeaveAction(leavePK: number, action:'APPROVED'|'CANCELLED') {
    const payload = {
      LeavePK: leavePK,
      Action: action,
      EmpCode:this.loggedInUser.empCode
    };

    this.leaveManagementService
      .userLeaveRequestActionUpdate(payload)
      .subscribe({
        next: (res) => {
          console.log('Leave action successful:', res);
          this.loadUsersLeaveRequests(this.loggedInUser.empCode); // Refresh the list
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

 @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.activePopover && this.popover && !this.popover.nativeElement.contains(event.target)) {
      this.closePopover();
    }
  }

  togglePopover(request:any){
    this.activePopover= this.activePopover ===request? null : request;
  }

  closePopover(){
    this.activePopover = null;
  }

  changeStatus(request:any, newStatus:'APPROVED'|'CANCELLED'|'PENDING'){
    const payload={
      LeavePK:request.LeavePK,
      Action: newStatus,
      EmpCode:this.loggedInUser.empCode
    };

  this.leaveManagementService.userLeaveRequestActionUpdate(payload).subscribe({
    next:(res)=>{
      console.log('Status updated:', res);
      this.activePopover = null;
      this.loadUsersLeaveRequests(this.loggedInUser.empCode);
    },
    error: (err) => {
      console.error('Status update failed:', err);
    },
  });
  }
// get requestPending(){
//   return this.leaveRequests.filter(request => request.status === 'PENDING');
// }

// get requestCompleted(){
//   return this.leaveRequests.filter(request => request.status==='APPROVED' || request.status === 'CANCELLED');
// }

}




