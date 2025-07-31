import { Component, Input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ColDef } from 'ag-grid-community';
import { AgGridAngular } from "ag-grid-angular";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users-leave-requests',
  imports: [ CommonModule],
  templateUrl: './users-leave-requests.component.html',
  styleUrl: './users-leave-requests.component.css',
})
export class UsersLeaveRequestsComponent {
  // columnDefs: ColDef[] = [
  //   {
  //     headerName: 'Employee',
  //     field: 'name',
  //     // cellRenderer
  //     width: 200,
  //   },
  //   {field: 'reason',headerName: 'Reason',width: 180,},
  //   {field: 'type',headerName: 'Type',width: 180,},
  //   {field: 'days',headerName: 'Days',width: 180,},
  //   {field: 'dateRange',headerName: 'Date Range',width: 180,},
  //   {
  //     headerName:'Actions',
  //     cellRenderer:this.actionsCellRenderer,
  //     width:180
  //   }
  // ];
  // rowData=[
  //    {
  //     name: 'Jenny Wilson',
  //     role: 'UI/UX designer',
  //     // avatar: 'assets/avatar.png',
  //     reason: 'Friend’s Wedding Celebration',
  //     type: 'Casual',
  //     days: '2 Days',
  //     dateRange: '10 Apr 2020 - 11 Apr 2020'
  //   },
  //   {
  //     name: 'Courtney Henry',
  //     role: 'UI/UX designer',
  //     // avatar: 'assets/avatar.png',
  //     reason: 'Personal work',
  //     type: 'Casual',
  //     days: '2 Days',
  //     dateRange: '10 Apr 2020 - 11 Apr 2020'
  //   },
  //   {
  //     name: 'Brooklyn Simmons',
  //     role: 'UX Researcher',
  //     // avatar: 'assets/avatar.png',
  //     reason: 'Vacation',
  //     type: 'Casual',
  //     days: '4 Days',
  //     dateRange: '10 Apr 2020 - 11 Apr 2020'
  //   }
  // ]
  // actionsCellRenderer(params:any){
  //   return`
  //   <div style="display:flex; gap:10px;">
  //   <button style="color:#f00; border:none;background:none">Deny</button>
  //    <button style="background-color: #eef; border: none; color: #3366cc; padding: 4px 8px; border-radius: 4px;">
  //     Approve
  //    </button>
  //   </div>
  //   `
  // }
   leaveRequests = [
    {
      name: 'Jenny Wilson',
      role: 'UI/UX designer',
      reason: "Friend's Wedding Celebration",
      leaveType: 'Casual',
      days: '2 Days',
      from: '10 Apr 2020',
      to: '11 Apr 2020',
      imageUrl: 'assets/avatar.png',

    },
    {
      name: 'Courtney Henry',
      role: 'UI/UX designer',
      reason: 'Personal work',
      leaveType: 'Casual',
      days: '2 Days',
      from: '10 Apr 2020',
      to: '11 Apr 2020',
      imageUrl: 'assets/avatar.png',
     
    },
    {
      name: 'Brooklyn Simmons',
      role: 'UX Researcher',
      reason: 'Vacation',
      leaveType: 'Casual',
      days: '4 Days',
      from: '10 Apr 2020',
      to: '11 Apr 2020',
      imageUrl: 'assets/avatar.png',
  
    },
  ];
}


