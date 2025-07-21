import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { AllCommunityModule, ColDef, ModuleRegistry } from 'ag-grid-community';
import { ThemeService } from '../../../../shared/services/theme.service';

ModuleRegistry.registerModules([AllCommunityModule]);
@Component({
  selector: 'app-leave-history',
  standalone: true,
  imports: [AgGridModule, CommonModule],
  templateUrl: './leave-history.html',
  styleUrls: ['./leave-history.css'],
  encapsulation: ViewEncapsulation.None,
})
export class LeaveHistory implements OnInit {
  isDarkMode = false;

  columnDefs: ColDef[] = [
    { headerName: 'Emp. ID', field: 'empId', width: 110 },
    { headerName: 'Leave Type', field: 'leaveType', width: 140 },
    { headerName: 'From Date', field: 'fromDate', width: 140 },
    { headerName: 'To Date', field: 'toDate', width: 140 },
    { headerName: 'Duration', field: 'duration', width: 130 },
    {
      headerName: 'Leave Status',
      field: 'status',
      width: 150,
      cellClass: (params) => {
        if (params.value === 'Approved') return 'ag-center status-approved';
        if (params.value === 'Pending') return 'ag-center status-pending';
        if (params.value === 'Rejected') return 'ag-center status-rejected';
        return 'ag-center';
      },
      cellRenderer: (params: any) => {
        // Just return plain text, no span needed now
        return params.value;
      },
    },
    {
      headerName: 'Reason',
      field: 'reason',
      width: 300,
      wrapText: true, // optional but recommended for wrapping
      autoHeight: true,
      filter:false,
      cellStyle: { whiteSpace: 'normal', overflowWrap: 'break-word' },
    },
    {
      headerName: 'Actions',
      field: 'actions',
      width: 120,
      cellClass: 'ag-center',
      cellRenderer: (params: any) => {
        const container = document.createElement('div');
        container.style.textAlign = 'center';

        if (params.data.status === 'Pending') {
          const editBtn = document.createElement('button');
          editBtn.className = 'btn btn-outline-success btn-sm me-3';
          editBtn.title = 'Edit';
          editBtn.innerHTML = '<i class="bi bi-pencil"></i>';
          editBtn.addEventListener('click', () =>
            this.editPendingLeave(params.data)
          );

          const deleteBtn = document.createElement('button');
          deleteBtn.className = 'btn btn-outline-danger btn-sm';
          deleteBtn.title = 'Delete';
          deleteBtn.innerHTML = '<i class="bi bi-trash"></i>';
          deleteBtn.addEventListener('click', () =>
            this.deletePendingLeave(params.data)
          );

          container.appendChild(editBtn);
          container.appendChild(deleteBtn);
        }

        return container;
      },
    },
  ];

  defaultColDef = {
    sortable: false,
    filter: true,
    resizable: true,
    wrapText: true,
  };

  rowData = [
    {
      empId: 'ST1176',
      leaveType: 'Casual Leave',
      fromDate: '2025-06-01',
      toDate: '2025-06-03',
      duration: '3 days',
      status: 'Approved',
      reason: 'Family trip',
    },
    {
      empId: 'ST1176',
      leaveType: 'Casual Leave',
      fromDate: '2025-06-05',
      toDate: '2025-06-06',
      duration: '2 days',
      status: 'Pending',
      reason: 'Fever',
    },
    {
      empId: 'ST1176',
      leaveType: 'Casual Leave',
      fromDate: '2025-05-28',
      toDate: '2025-05-30',
      duration: '3 days',
      status: 'Approved',
      reason: 'Personal work',
    },
    {
      empId: 'ST1176',
      leaveType: 'Overtime',
      fromDate: '2025-06-02',
      toDate: '2025-06-02',
      duration: '1 day',
      status: 'Rejected',
      reason: 'No reason provided',
    },
    {
      empId: 'ST1176',
      leaveType: 'Casual Leave',
      fromDate: '2025-06-07',
      toDate: '2025-06-08',
      duration: '2 days',
      status: 'Pending',
      reason: 'Back pain',
    },
  ];

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeService.darkMode$.subscribe((isDark: any) => {
      this.isDarkMode = isDark;
    });
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
