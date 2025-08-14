import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { AllCommunityModule, ColDef, ModuleRegistry } from 'ag-grid-community';
import { ThemeService } from '../../../../shared/services/theme.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { Observable, of, Subject } from 'rxjs';
import { LeaveManagementServiceService } from '../../../services/leave-management-service.service';
import { selectAuthUser } from '../../../../auth/store/auth/login.selectors';
import { Store } from '@ngrx/store';
import { FeatureCommonServiceService } from '../../../services/feature-common-service.service';

ModuleRegistry.registerModules([AllCommunityModule]);
interface Employee {
  empCode: string;
  fullName: string;
}
@Component({
  selector: 'app-leave-history',
  standalone: true,
  imports: [AgGridModule, CommonModule, NgSelectModule, FormsModule],
  templateUrl: './users-leave-history.component.html',
  styleUrls: ['./users-leave-history.component.css'],
  encapsulation: ViewEncapsulation.None,
})


export class UsersLeaveHistoryComponent implements OnInit {

  loggedInUser: any;
  rowData: any[] = [];
  filteredRowData: any[] = [];
  selectedEmployeeId: string | null = null;
  isDarkMode = false;
  name$!: Observable<any>;

  leaveTypeLabels: { [key: string]: string } = {
    CASUAL: 'Casual Leave',
    LOSSOFPAY: 'Loss Of Pay',
    COMPENSATORYOFF: 'Comp Off',
    OVERTIME: 'OverTime',
  };

  dropdownList: any[] =[];
  filteredEmployees : any[] =[];
  employeeInput$ = new Subject<string>();

  columnDefs: ColDef[] = [
    { headerName: 'Emp. ID', field: 'empId', width: 110 },
    { headerName: 'Emp Name', field: 'empName', width: 220, filter:false },
    { headerName: 'Leave Type', field: 'leaveType', width: 140 },
    { headerName: 'From Date', 
      field: 'fromDate',
      width: 140 ,
      valueFormatter:(params)=>{
        if(!params.value)return '';
        return new Date(params.value).toLocaleDateString('en-GB',{
          day:'2-digit',
          month:'short',
          year:'numeric'
        });
      }
    },
    { headerName: 'To Date',
      field: 'toDate', 
      width: 140 ,
      valueFormatter:(params)=>{
        if(!params.value)return '';
        return new Date(params.value).toLocaleDateString('en-GB',{
          day:'2-digit',
          month:'short',
          year:'numeric'
        });
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
        return params.value === 'APPROVED'
          ? 'Approved'
          : params.value === 'PENDING'
          ? 'Pending'
          : params.value === 'CANCELLED'
          ? 'Cancelled'
          : '';
      },
    },
    {
      headerName: 'Reason',
      field: 'reason',
      width: 260,
      wrapText: true,
      autoHeight: true,
      filter: false,
      cellStyle: { whiteSpace: 'normal', overflowWrap: 'break-word' },
    },
  ];

  defaultColDef = {
    sortable: false,
    filter: true,
    resizable: true,
    wrapText: true,
  };
 

  constructor(
    private themeService: ThemeService,
    private leaveManagementService: LeaveManagementServiceService,
    private store: Store,
    private featureCommonService: FeatureCommonServiceService,
  ) {
    this.store.select(selectAuthUser).subscribe((user: any) => {
      if (user) {
        this.loggedInUser = user;
        const empCode = this.loggedInUser.empCode;
        this.loadUsersLeaveRequests(empCode);
      }
    });
  }

  ngOnInit(): void {
    this.loadDropdowns();
    this.employeeInput$.subscribe((searchText) => {
      this.filteredEmployees = this.dropdownList.filter((emp) =>
        (emp.fullName + ' ' + emp.empCode)
          .toLowerCase()
          .includes(searchText?.toLowerCase())
      );
    });

    this.themeService.darkMode$.subscribe((isDark: any) => {
      this.isDarkMode = isDark;
    });
  }

  loadUsersLeaveRequests(empCode: string) {
    this.leaveManagementService
      .getUsersLeaveHistory(empCode)
      .subscribe((data: any[]) => {
        this.rowData = data.map((item) => ({
          empId: item.empCode,
          empName: item.fullName,
          leaveType: item.leaveType,
          fromDate: item.fromDate.slice(0, 10),
          toDate: item.toDate.slice(0, 10),
          duration: item.duration,
          leaveStatus: item.leaveStatus,
          reason: item.reason,
        }));

        this.filteredRowData = this.rowData;
      });
  }

  onEmployeeSelect() {
    if (this.selectedEmployeeId) {
      this.filteredRowData = this.rowData.filter(
        (row) => row.empId === this.selectedEmployeeId
      );
    } else {
      this.filteredRowData = this.rowData;
    }
  }

  customSearchFn(term: string, item: any) {
    term = term.toLowerCase();
    return (
      item.empCode.toLowerCase().includes(term) ||
      item.fullName.toLowerCase().includes(term)
    );
  }

  editPendingLeave(rowData: any) {
    alert(`Editing pending leave for ${rowData.empId}`);
  }

  deletePendingLeave(rowData: any) {
    const confirmed = confirm(`Delete leave request for ${rowData.empId}?`);
    if (confirmed) {
      alert(`Deleted pending leave for ${rowData.empId}`);
    }
  }

   
    loadDropdowns(){
     this.featureCommonService.getEmployeeNameDropdownLists().subscribe((data:any)=>{
      this.name$ = of(data);
      this.dropdownList=data;
      this.filteredEmployees = this.dropdownList;
    })
  }
}

  // this.featureCommonService
  //     .getDropdownLists('DESIGNATION')
  //     .subscribe((data) => {
  //       this.role$ = of(data);
  //     });
