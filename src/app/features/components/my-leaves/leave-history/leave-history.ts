import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { AllCommunityModule, ColDef, ModuleRegistry } from 'ag-grid-community';
import { ThemeService } from '../../../../shared/services/theme.service';
import { LeaveManagementServiceService } from '../../../services/leave-management-service.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CoreModalComponent } from '../../../../shared/modals/core-modal/core-modal.component';
import { ApplyLeaveComponent, UpdateLeaveComponent } from '../apply-leave/apply-leave.component';
import { selectAuthUser } from '../../../../auth/store/auth/login.selectors';
import { Store } from '@ngrx/store';

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

  loggedInUser:any;

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
    { headerName: 'From Date', 
      field: 'fromDate', 
      width: 140, 
      valueFormatter:(params)=>{
        if(!params.value)return '';
        return new Date(params.value).toLocaleDateString('en-GB',{
          day:'2-digit',
          month:'short',
          year:'numeric'
        })

      }
    },
    { headerName: 'To Date', 
      field: 'toDate', 
      width: 130,
      valueFormatter:(params)=>{
        if(!params.value)return '';
        return new Date (params.value).toLocaleDateString('en-GB',{
          day:'2-digit',
          month:'short',
          year:'numeric'
        })
      }
    
    
    },
    { headerName: 'Duration', field: 'duration', width: 130 },
    {
      headerName: 'Leave Status',
      field: 'leaveStatus',
      width: 150,
      cellClass: (params) => {
        if (params.value === 'APPROVED') return 'ag-center status-approved';
        if (params.value === 'PENDING') return 'ag-center status-pending';
        if (params.value === 'CANCELLED') return 'ag-center status-cancelled';
        return 'ag-center';
      },
      cellRenderer: (params: any) => {
        // Just return plain text, no span needed now
        return params.value ==='APPROVED' ? 'Approved' : params.value==='PENDING'?'Pending' : params.value==='CANCELLED'?'Cancelled' : ''
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


  rowData: any[] = [];

  constructor(
    private themeService: ThemeService,
    private leaveManagementService: LeaveManagementServiceService,
    private modalService:NgbModal,
    private store:Store
  ) {this.store.select(selectAuthUser).subscribe((user:any) => {
        if(user){
          this.loggedInUser= user;
        }
      });}

  ngOnInit(): void {
    this.themeService.darkMode$.subscribe((isDark: any) => {
      this.isDarkMode = isDark;
    });
    this.loadLeaveHistory();
    this.leaveManagementService
      .getEmployeeLeaveHistory(this.loggedInUser.empCode)
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
      empCode:rowData.empCode,
      leaveId:rowData.leaveId,
      leaveType:rowData.leaveType,
      fromDate:rowData.fromDate,
      toDate:rowData.toDate,
      fromTime:rowData.fromTime,
      toTime:rowData.toTime,
      reason:rowData.reason,
      duration:rowData.duration
    };

   editModal.componentInstance.eventHandler$.subscribe((data:any)=>{
    if(data.type ==="UPDATE"){
      const updateUser={
        leaveId:data.value.leaveId,
        empCode:data.value.empCode,
        leaveType:data.value.leaveType,
        fromDate:data.value.fromDate,
        toDate:data.value.toDate,
        fromTime:data.value.fromTime,
        toTime:data.value.toTime,
        reason:data.value.reason,
        duration:data.value.duration
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
      size:"md",
      keyboard:false
    });

    deleteModal.componentInstance.header="Confirmation";
    deleteModal.componentInstance.content="Do You Want To Delete Leave Request ?"
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
      }
    })}

  loadLeaveHistory() {
    this.leaveManagementService
      .getEmployeeLeaveHistory(this.loggedInUser.empCode)
      .subscribe((data: any[]) => {
        this.rowData = data.map((leave) => ({
          empCode: leave.empCode,
          leaveType:leave.leaveType,
          fromTime:leave.fromTime,
          toTime:leave.toTime,
          fromDate: leave.fromDate?.slice(0, 10),
          toDate: leave.toDate?.slice(0, 10),
          duration:
            leave.duration ,
          leaveStatus: leave.leaveStatus,
          reason: leave.reason,
          leaveId:leave.leaveId
        }));
      });
  }
}
