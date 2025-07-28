

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { AllCommunityModule, ColDef, ModuleRegistry } from 'ag-grid-community';
import { ThemeService } from '../../../../shared/services/theme.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, NgModel } from '@angular/forms';
import { Subject } from 'rxjs';
import { LeaveManagementServiceService } from '../../../services/leave-management-service.service';

ModuleRegistry.registerModules([AllCommunityModule]);
@Component({
  selector: 'app-leave-history',
  standalone: true,
  imports: [AgGridModule, CommonModule,NgSelectModule,FormsModule],
  templateUrl: './users-leave-history.component.html',
  styleUrls: ['./users-leave-history.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class UsersLeaveHistoryComponent implements OnInit {
    leaveTypeLabels: { [key: string]: string } = {
    CASUAL: 'Casual Leave',
    LOSSOFPAY: 'Loss Of Pay',
    COMPENSATORYOFF: 'Comp Off',
    OVERTIME: 'OverTime',
  };
  isDarkMode = false;

  dropdownList = [
  { id: 'ST1176', name: 'Vigneshwaran T' },
  { id: 'T2506', name: 'Savitha B' },
  { id: 'T2503', name: 'Ravishankar S' }
];

selectedEmployeeId: string | null = null;

  columnDefs: ColDef[] = [
    { headerName: 'Emp. ID', field: 'empId', width: 110 },
    {headerName:'Emp Name',field:'empName',width:220},
    { headerName: 'Leave Type', field: 'leaveType', width: 140 },
    { headerName: 'From Date', field: 'fromDate', width: 140 },
    { headerName: 'To Date', field: 'toDate', width: 140 },
    { headerName: 'Duration', field: 'duration', width: 130 },
    {
      headerName: 'Leave Status',
      field: 'leaveStatus',
      width: 150,
      cellClass: (params) => {
        if (params.value === 'APPROVED') return 'ag-center status-approved';
        if (params.value === 'PENDING') return 'ag-center status-pending';
        if (params.value === 'REJECTED') return 'ag-center status-rejected';
        return 'ag-center';
      },
      cellRenderer: (params: any) => {
        // Just return plain text, no span needed now
        return params.value==='APPROVED'?'Approved': params.value==='PENDING'?'Pending':params.value==='REJECTED'?'Rejected':''
      },
    },
    {
      headerName: 'Reason',
      field: 'reason',
      width: 260,
      wrapText: true, // optional but recommended for wrapping
      autoHeight: true,
      filter:false,
      cellStyle: { whiteSpace: 'normal', overflowWrap: 'break-word' },
    },
  ];

  defaultColDef = {
    sortable: false,
    filter: true,
    resizable: true,
    wrapText: true,
  };
//  rowData = [
//     {
//       empId: 'ST1176',
//       empName:'Vigneshwaran T',
//       leaveType: 'Sick Leave',
//       fromDate: '2025-06-01',
//       toDate: '2025-06-03',
//       duration: '3 days',
//       status: 'Approved',
//       reason: 'Family trip',
//     },
//     {
//       empId: 'T2506',
//       empName:'Savitha B',
//       leaveType: 'Casual Leave',
//       fromDate: '2025-06-05',
//       toDate: '2025-06-06',
//       duration: '2 days',
//       status: 'Pending',
//       reason: 'Fever',
//     },
//     {
//       empId: 'T2506',
//       empName:'Savitha B',
//       leaveType: 'Loss Of Pay',
//       fromDate: '2025-05-28',
//       toDate: '2025-05-30',
//       duration: '3 days',
//       status: 'Approved',
//       reason: 'Personal work',
//     },
//     {
//       empId: 'T2503',
//       empName:'Ravishankar S',
//       leaveType: 'Casual Leave',
//       fromDate: '2025-06-02',
//       toDate: '2025-06-02',
//       duration: '1 day',
//       status: 'Rejected',
//       reason: 'No reason provided',
//     },
//     {
//       empId: 'ST1176',
//       empName:'Vigneshwaran T',
//       leaveType: 'Casual Leave',
//       fromDate: '2025-06-07',
//       toDate: '2025-06-08',
//       duration: '2 days',
//       status: 'Pending',
//       reason: 'Back pain',
//     },
//   ];


 rowData: any[] = [];
  constructor(private themeService: ThemeService, private leaveManagementService: LeaveManagementServiceService, ) {}

 filteredRowData: {
  empId: string;
  empName: string;
  leaveType: string;
  fromDate: string;
  toDate: string;
  duration: string;
  leaveStatus: string;
  reason: string;
}[] = [];

  employeeInput$ = new Subject<string>();
  filteredEmployees = this.dropdownList;

  ngOnInit(): void {
    // this.leaveManagementService.getUsersLeaveHistory().subscribe((data:any)=>{
    //   console.log(data);
    // })
      // this.loadLeaveHistory();
    this.employeeInput$.subscribe(searchText => {
      this.filteredEmployees = this.dropdownList.filter(emp =>
        (emp.name + ' ' + emp.id).toLowerCase().includes(searchText.toLowerCase())
      );
    });
      this.leaveManagementService.getUsersLeaveHistory().subscribe((data: any[]) => {
    this.rowData = data.map(item => ({
      empId: item.empCode,
      empName: item.fullName,
      leaveType: item.leaveType,
      fromDate: item.fromDate.slice(0, 10),
      toDate: item.toDate.slice(0, 10),
      duration: item.duration,
      leaveStatus: item.leaveStatus,
      reason: item.reason,
    }));

    // Initially show all
    this.filteredRowData = this.rowData;
  });
    
     this.filteredRowData = this.rowData;
    this.themeService.darkMode$.subscribe((isDark: any) => {
      this.isDarkMode = isDark;
    });
  }

  onEmployeeSelect() {
  if (this.selectedEmployeeId) {
    this.filteredRowData = this.rowData.filter(row => row.empId === this.selectedEmployeeId);
  } else {
    this.filteredRowData = this.rowData;
  }
}

customSearchFn(term: string, item: any) {
  term = term.toLowerCase();
  return item.id.toLowerCase().includes(term) || item.name.toLowerCase().includes(term);
}

  editPendingLeave(rowData: any) {
    alert(`Editing pending leave for ${rowData.empId}`);
  }

  deletePendingLeave(rowData: any) {
    const confirmed = confirm(`Delete leave request for ${rowData.empId}?`);
    if (confirmed) {
      alert(`Deleted pending leave for ${rowData.empId}`);
      // You can add logic here to remove the row from rowData and refresh grid if needed
    }
  }


}
