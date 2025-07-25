import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { AllCommunityModule, ColDef, ModuleRegistry } from 'ag-grid-community';
import { ThemeService } from '../../../../shared/services/theme.service';
import { LeaveManagementServiceService } from '../../../services/leave-management-service.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CoreModalComponent } from '../../../../shared/modals/core-modal/core-modal.component';
import { ApplyLeaveComponent, UpdateLeaveComponent } from '../apply-leave/apply-leave.component';

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
  leaveTypeLabels: { [key: string]: string } = {
    CASUAL: 'Casual Leave',
    LOSSOFPAY: 'Loss Of Pay',
    COMPENSATORYOFF: 'Comp Off',
    OVERTIME: 'OverTime',
  };

  isDarkMode = false;

  columnDefs: ColDef[] = [
    { headerName: 'Emp Code', field: 'empCode', width: 120 },
    { headerName: 'Leave Type', field: 'leaveType', width: 140 },
    { headerName: 'From Date', field: 'fromDate', width: 140 },
    { headerName: 'To Date', field: 'toDate', width: 130 },
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
        return params.value ==='APPROVED' ? 'Approved' : params.value==='PENDING'?'Pending' : params.value==='REJECTED'?'Rejected' : ''
      },
    },
    {
      headerName: 'Reason',
      field: 'reason',
      width: 300,
      wrapText: true, // optional but recommended for wrapping
      autoHeight: true,
      filter: false,
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

        if (params.data.leaveStatus === 'PENDING') {
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

  // rowData = [
  //   {
  //     empId: 'ST1176',
  //     leaveType: 'Casual Leave',
  //     fromDate: '2025-06-01',
  //     toDate: '2025-06-03',
  //     duration: '3 days',
  //     status: 'Approved',
  //     reason: 'Family trip',
  //   },
  //   {
  //     empId: 'ST1176',
  //     leaveType: 'Casual Leave',
  //     fromDate: '2025-06-05',
  //     toDate: '2025-06-06',
  //     duration: '2 days',
  //     status: 'Pending',
  //     reason: 'Fever',
  //   },
  //   {
  //     empId: 'ST1176',
  //     leaveType: 'Casual Leave',
  //     fromDate: '2025-05-28',
  //     toDate: '2025-05-30',
  //     duration: '3 days',
  //     status: 'Approved',
  //     reason: 'Personal work',
  //   },
  //   {
  //     empId: 'ST1176',
  //     leaveType: 'Overtime',
  //     fromDate: '2025-06-02',
  //     toDate: '2025-06-02',
  //     duration: '1 day',
  //     status: 'Rejected',
  //     reason: 'No reason provided',
  //   },
  //   {
  //     empId: 'ST1176',
  //     leaveType: 'Casual Leave',
  //     fromDate: '2025-06-07',
  //     toDate: '2025-06-08',
  //     duration: '2 days',
  //     status: 'Pending',
  //     reason: 'Back pain',
  //   },
  // ];

  rowData: any[] = [];

  constructor(
    private themeService: ThemeService,
    private leaveManagementService: LeaveManagementServiceService,
    private modalService:NgbModal,
  ) {}

  ngOnInit(): void {
    this.themeService.darkMode$.subscribe((isDark: any) => {
      this.isDarkMode = isDark;
    });
    this.loadLeaveHistory();
    this.leaveManagementService
      .getEmployeeLeaveHistory('T2506')
      .subscribe((data: any[]) => {
        // console.log('Raw API Data:', data);
      });
  }

  editPendingLeave(rowData: any) {
    // alert(`Editing pending leave for ${rowData.empCode}`);
    const editModal=this.modalService.open(UpdateLeaveComponent,{
      backdrop:"static",
      size:"xl",
      keyboard:false
    });
    editModal.componentInstance.leaveData={
      leaveType:rowData.leaveType,
      fromDate:rowData.fromDate,
      toDate:rowData.toDate,
      fromTime:rowData.fromTime,
      toTime:rowData.toTime,
      reason:rowData.reason
    };

   editModal.componentInstance.eventHandler$.subscribe((data:any)=>{
    if(data==="Update"){
      const updateUser={
        leaveId:rowData.leaveId,
        empCode:rowData.empCode,
        leaveType:rowData.leaveType,
        fromDate:rowData.fromDate,
        toDate:rowData.toDate,
        fromTime:rowData.fromTime,
        toTime:rowData.toTime,
        reason:rowData.reason
      }
       this.leaveManagementService.UpdateEmployeeLeaveRequest(updateUser).subscribe((data)=>{
          if(data){
            this.loadLeaveHistory();
            editModal.close();
          }
        }
   )}
   })
  }

  deletePendingLeave(rowData: any) {
    // console.log(rowData);
    
    const deleteModal = this.modalService.open(CoreModalComponent,{
      backdrop:"static",
      size:"lg",
      keyboard:false
    });

    deleteModal.componentInstance.header="Confirmation";
    deleteModal.componentInstance.content="Do You Want To Delete Leave Request ?"
    deleteModal.result.then((result)=>{
      console.log(result);
      
    })
    deleteModal.componentInstance.eventHandler$.subscribe((data:any)=>{
      if(data==="Proceed"){

        const deleteUser ={
          leaveId:rowData.leaveId,
          empCode:rowData.empCode
        }
        this.leaveManagementService.DeleteEmployeeLeaveRequest(deleteUser).subscribe((data)=>{
          if(data){
            this.loadLeaveHistory();
            deleteModal.close();
          }
        }
      );
       
        
        // this.leaveManagementService.DeleteEmployeeLeaveRequest(rowData.leaveId).subscribe(() => {
        // this.rowData = this.rowData.filter(row => row.leaveId !== rowData.leaveId);
        // });

      }
    })



  }

  loadLeaveHistory() {
    this.leaveManagementService
      .getEmployeeLeaveHistory('T2506')
      .subscribe((data: any[]) => {
        this.rowData = data.map((leave) => ({
          empCode: leave.empCode,
          leaveType: this.leaveTypeLabels[leave.leaveType] || leave.leaveType,
          fromDate: leave.fromDate?.slice(0, 10),
          toDate: leave.toDate?.slice(0, 10),
          duration:
            leave.duration + ' ' + (leave.duration === '1' ? 'day' : 'days'),
          leaveStatus: leave.leaveStatus,
          reason: leave.reason,
          leaveId:leave.leaveId
        }));
      });
  }
}
