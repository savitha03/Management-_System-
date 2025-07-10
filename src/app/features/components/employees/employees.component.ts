import { Component, EventEmitter, Output } from '@angular/core';
import { EmployeesFormComponent } from '../../components/employees-form/employees-form.component';
import { EmployeesListComponent } from '../../components/employees-list/employees-list.component';
import { ColDef, GridOptions } from 'ag-grid-community';
import { DiceComponentComponent } from '../../../shared/components/dice-component/dice-component.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-employees',
  imports: [EmployeesFormComponent, EmployeesListComponent, FormsModule],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.css',
})
export class EmployeesComponent {
  selectedRow: any = null;
  filterType: 'all' | 'active' | 'closed' = 'all';

  public activeTab = 'personal';

  gridApi: any;
  gridColumnApi: any;
  rowSelection = 'single';
  gridOptions: GridOptions = {
    context: {
      componentParent: this,
    },
  };
  detailsForm!: FormGroup;
  newEmployee: any;

  colDefs: ColDef[] = [
    {
      headerName: '',
      field: 'diceId',
      width: 50,
      resizable: false,
      sortable: false,
      filter: false,
      cellRenderer: DiceComponentComponent,
      cellRendererParams: (params: any) => ({
        actionLinks: [],
        item: { ...params.data, index: params.rowIndex },
        hostComponent: 'EmployeesListComponent',
      }),
    },
    { headerName: 'Emp Code', field: 'employeeId', width: 120, filter: true },
    {
      headerName: 'Emp Name',
      field: 'fullName',
      width: 260,
      resizable: true,
      cellRenderer: (params: any) => {
       
        const isActive =
          params.data.empStatus === 'Active'
            ? true
            : params.data.empStatus === 'Closed'
            ? false
            : null;
        console.log(isActive);

        const icon =
          isActive === true
            ? '<i class="bi bi-bookmark-check-fill text-success me-2"></i>'
            : isActive === false
            ? '<i class="bi bi-bookmark-x-fill text-danger me-2"></i>'
            : '';
        return `${icon}${params.value}`;
      },
    },
  ];

 

  allRowData = [
    {
      employeeId: 'ST1176',
      empStatus: 'Active',
      firstName: 'Vigneshwaran',
      lastName: 'Thiruselvam',
      fullName: 'Vigneshwaran Thiruselvam',
      dob: '1990-05-12',
      gender: 'Male',
      maritalStatus: 'Single',
      nationality: 'Indian',
      phoneNumber: '9876543210',
      alternateNumber: '9123456780',
      email: 'vignesh@example.com',
      streetAddress: '123 Main Street',
      city: 'Chennai',
      state: 'Tamil Nadu',
      zipCode: '600001',
      country: 'India',
      role: 'developer',
      teamManager: 'Manikandan Natarajan',
      projectManager: 'Ramesh Thulasingam',
      teamLead: 'TL1',
      jobTitle: 'Frontend Developer',
      employmentStatus: 'Active',
      joinedDate: '2021-06-15',
      skillset: 'Angular, TypeScript',
      payGrade: 'PG1',
      currency: 'INR',
      basicSalary: '500000',
      payFrequency: 'Monthly',
    },
    {
      employeeId: 'T2506',
      empStatus: 'Closed',
      firstName: 'Savitha',
      lastName: 'S',
      fullName: 'Savitha S',
      dob: '1995-08-20',
      gender: 'Female',
      maritalStatus: 'Married',
      nationality: 'Indian',
      phoneNumber: '9988776655',
      alternateNumber: '9887766554',
      email: 'savitha@example.com',
      streetAddress: '456 Park Avenue',
      city: 'Bangalore',
      state: 'Karnataka',
      zipCode: '560001',
      country: 'India',
      role: 'qa',
      teamManager: 'Krishnakumar Gajain',
      projectManager: 'Dinesh Vidhyasagar',
      teamLead: 'TL2',
      jobTitle: 'QA Engineer',
      employmentStatus: 'Closed',
      joinedDate: '2020-01-10',
      skillset: 'Testing, Selenium',
      payGrade: 'PG2',
      currency: 'INR',
      basicSalary: '450000',
      payFrequency: 'Monthly',
    },
    {
      employeeId: 'T2503',
      empStatus: 'Active',
      firstName: 'Ravishankar',
      lastName: 'R',
      fullName: 'Ravishankar R',
      dob: '1992-03-11',
      gender: 'Male',
      maritalStatus: 'Single',
      nationality: 'Indian',
      phoneNumber: '9012345678',
      alternateNumber: '9090909090',
      email: 'ravi@example.com',
      streetAddress: '789 MG Road',
      city: 'Hyderabad',
      state: 'Telangana',
      zipCode: '500081',
      country: 'India',
      role: 'teamLead',
      teamManager: 'Rajesh Doraiappa',
      projectManager: 'Ganesh Gunasekaran',
      teamLead: 'TL3',
      jobTitle: 'Team Lead',
      employmentStatus: 'Active',
      joinedDate: '2019-07-01',
      skillset: 'React, Node.js',
      payGrade: 'PG3',
      currency: 'INR',
      basicSalary: '700000',
      payFrequency: 'Monthly',
    },
  ];

  rowData = [...this.allRowData];

  defaultColDefs = {
    resizable: true,
    sortable: true,
    filter: true,
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.toggleActiveFilter('all');
    this.formBuilder();
  }

  toggleActiveFilter(status: 'all' | 'active' | 'closed') {
    this.filterType = status;
    if (status === 'active') {
      this.rowData = this.allRowData.filter(
        (emp) => emp.empStatus === 'Active'
      );
    } else if (status === 'closed') {
      this.rowData = this.allRowData.filter(
        (emp) => emp.empStatus === 'Closed'
      );
    } else {
      this.rowData = [...this.allRowData];
    }
    this.selectedRow = null;
  }

  onRowSelected(row: any) {
    this.selectedRow = row;
    this.detailsForm.patchValue(row);
    this.activeTab = 'personal';
  }

  formBuilder() {
    this.detailsForm = this.fb.group({
      employeeId: ['', Validators.required],
      fullName: [''],
      empStatus: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dob: ['', Validators.required],
      gender: [{ value: '' }, Validators.required],
      maritalStatus: [{ value: '' }, Validators.required],
      nationality: [{ value: '' }, Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      alternateNumber: ['', [Validators.pattern(/^\d{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      streetAddress: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required],
      country: ['', Validators.required],
      role: [{ value: '' }, Validators.required],
      teamManager: [{ value: '' }, Validators.required],
      projectManager: [{ value: '' }, Validators.required],
      teamLead: [{ value: '' }, Validators.required],
      jobTitle: ['', Validators.required],
      employmentStatus: [{ value: '' }, Validators.required],
      joinedDate: ['', Validators.required],
      skillset: ['', Validators.required],
      payGrade: ['', Validators.required],
      currency: [{ value: '' }, Validators.required],
      basicSalary: ['', Validators.required],
      payFrequency: [{ value: '' }, Validators.required],
    });
  }

  handleAppEvent(event: any) {
    switch (event.name) {
      case 'ROW_CLICKED': {
        this.onRowSelected(event.value.selectedRow);
        break;
      }
      case 'TOGGLE_ACTIVE': {
        this.toggleActiveFilter(event.value.filterType);
        break;
      }
      case 'VALIDATE_NEW_EMPLOYEE': {
        if (this.detailsForm.invalid) {
          console.warn('Form invalid');
          return;
        }
        if (this.detailsForm.dirty && this.detailsForm.valid) {
          console.log('Saving employee...', this.detailsForm.getRawValue());
        }
        this.detailsForm.controls['empId'].enable();
        this.handleAppEvent({
          name: 'NEW_EMPLOYEE',
          component: 'UserInfoComponent',
          value: event.value,
        });
        break;
      }
      case 'NEW_EMPLOYEE': {
        const newRow = this.getDefaultEmployee();

        this.allRowData = [newRow, ...this.allRowData];
        this.toggleActiveFilter(this.filterType);
        this.selectedRow = newRow;
        this.detailsForm.reset(newRow); // Fill default values
        this.detailsForm.controls['employeeId'].enable();

        if (this.gridApi) {
          setTimeout(() => {
            this.gridApi.forEachNode((node: any) => {
              if (node.rowIndex === 0) {
                node.setSelected(true);
              }
            });
          }, 50);
        }
        break;
      }
    }
  }

  getDefaultEmployee(): any {
    const defaultEmployee: any = {};
    Object.keys(this.detailsForm.controls).forEach((key) => {
      defaultEmployee[key] = '';
    });

    // Optionally set default values
    defaultEmployee.empStatus = '';

    return defaultEmployee;
  }

  activeTabEmit(event: any) {
    this.activeTab = event;
    console.log(this.activeTab);
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }
}
