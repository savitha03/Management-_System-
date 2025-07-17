import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { EmployeesFormComponent } from '../../components/employees-form/employees-form.component';
import { EmployeesListComponent } from '../../components/employees-list/employees-list.component';
import { ColDef, GridOptions } from 'ag-grid-community';
import { DiceComponentComponent } from '../../../shared/components/dice-component/dice-component.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  NgModel,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { detailsFormObject } from '../../forms/employee-details.forms';
import { FormUtilServiceService } from '../../../shared/services/form-util-service.service';

@Component({
  selector: 'app-employees',
  imports: [EmployeesFormComponent, EmployeesListComponent, FormsModule],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.css',
})
export class EmployeesComponent implements OnInit {
  isEdit = false;
  isNewEmployee = false;
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
  detailsFormEntity: any = detailsFormObject;

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
          params.data.empStatus === 'ACTIVE'
            ? true
            : params.data.empStatus === 'CLOSED'
            ? false
            : null;

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
      employeeId: 'T2504',
      empStatus: 'CLOSED',
      firstName: 'Aparna',
      lastName: 'Kumar',
      fullName: 'Aparna Kumar',
      dob: '1993-09-20',
      gender: 'Female',
      maritalStatus: 'Married',
      nationality: 'Indian',
      phoneNumber: '9812345678',
      alternateNumber: '9988776655',
      email: 'aparna.kumar@example.com',
      streetAddress: '45 Green Park Avenue',
      city: 'Bengaluru',
      state: 'Karnataka',
      zipCode: '560001',
      country: 'India',
      role: 'developer',
      teamManager: 'Rahul Menon',
      projectManager: 'Sneha Rajan',
      teamLead: 'TL3',
      jobTitle: 'Backend Developer',
      employmentStatus: 'Active',
      joinedDate: '2022-02-10',
      skillset: 'Node.js, Express, SQL',
      payGrade: 'PG2',
      currency: 'INR',
      basicSalary: '600000',
      payFrequency: 'Monthly',
    },

    {
      employeeId: 'ST1176',
      empStatus: 'ACTIVE',
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
      empStatus: 'CLOSED',
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
      empStatus: 'ACTIVE',
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
  pageErrors: any[]=[];

  constructor(
    private fb: FormBuilder,
    private FormUtilServiceService: FormUtilServiceService
  ) {}

  ngOnInit(): void {
    this.toggleActiveFilter('all');
    this.formBuilder();

    if (this.isEdit) {
      this.detailsForm.enable();
    } else {
      this.detailsForm.disable();
    }
  }

  toggleActiveFilter(status: 'all' | 'active' | 'closed') {
    this.filterType = status;
    if (status === 'active') {
      this.rowData = this.allRowData.filter(
        (emp) => emp.empStatus === 'ACTIVE'
      );
    } else if (status === 'closed') {
      this.rowData = this.allRowData.filter(
        (emp) => emp.empStatus === 'CLOSED'
      );
    } else {
      this.rowData = [...this.allRowData];
    }
    this.selectedRow = null;
    if (this.gridApi) {
      this.gridApi.refreshClientSideRowModel();
      setTimeout(() => {
        const firstNode = this.gridApi?.getDisplayedRowAtIndex(0);
        if (firstNode) {
          firstNode?.setSelected(true); // highlights the row
          // this.emitRowClicked(firstNode.data); // send data upward
          this.onRowSelected(firstNode.data);
        }
      }, 100);
    }
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    const firstNode = this.gridApi?.getDisplayedRowAtIndex(0);
    if (firstNode) {
      firstNode.setSelected(true); // highlights first row
      this.onRowSelected(firstNode.data); // directly trigger
    }
  }

  onRowSelected(row: any) {
    this.selectedRow = row;
    this.detailsForm.patchValue(row);
    this.activeTab = 'personal';

    if (!this.isNewEmployee) {
      this.isEdit = false;
      this.detailsForm.disable();
    }
  }

  formBuilder() {
    this.detailsForm = this.FormUtilServiceService.buildReactiveForm(
      this.detailsFormEntity
    );
    console.log(this.detailsForm);
  }

  // formBuilder() {
  //   this.detailsForm = this.fb.group({
  //     employeeId: ['', Validators.required],
  //     fullName: [''],
  //     empStatus: ['ACTIVE', Validators.required],
  //     firstName: ['', Validators.required],
  //     lastName: ['', Validators.required],
  //     dob: ['', Validators.required],
  //     gender: ['', Validators.required],
  //     maritalStatus: ['', Validators.required],
  //     nationality: ['', Validators.required],
  //     phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
  //     alternateNumber: ['', [Validators.pattern(/^\d{10}$/)]],
  //     email: ['', Validators.required],
  //     streetAddress: ['', Validators.required],
  //     city: ['', Validators.required],
  //     state: ['', Validators.required],
  //     zipCode: ['', Validators.required],
  //     country: ['', Validators.required],
  //     role: ['', Validators.required],
  //     teamManager: ['', Validators.required],
  //     projectManager: ['', Validators.required],
  //     teamLead: ['', Validators.required],
  //     jobTitle: ['', Validators.required],
  //     employmentStatus: ['', Validators.required],
  //     joinedDate: ['', Validators.required],
  //     skillset: ['', Validators.required],
  //     payGrade: ['', Validators.required],
  //     currency: ['', Validators.required],
  //     basicSalary: ['', Validators.required],
  //     payFrequency: ['', Validators.required],
  //   });
  // }

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
          return;
        }
        if (this.detailsForm.dirty && this.detailsForm.valid) {
        }
        this.detailsForm.controls['employeeId'].enable();
        this.handleAppEvent({
          name: 'NEW_EMPLOYEE',
          component: 'UserInfoComponent',
          value: event.value,
        });
        break;
      }
      case 'SHOW_ERRORS': {
            this.pageErrors = this.FormUtilServiceService.parseValidationErrors(
              event.value.controls,
              event.value.objects,
            );
            console.log(this.pageErrors);
            
          break;
        }
      case 'NEW_EMPLOYEE': {
        const newRow = this.getDefaultEmployee();

        this.isNewEmployee = true;
        this.isEdit = true;

        this.allRowData = [newRow, ...this.allRowData];
        this.toggleActiveFilter(this.filterType);
        this.selectedRow = newRow;
        this.detailsForm.reset(newRow); // Fill default values
        this.detailsForm.enable();
        // this.detailsForm.controls['employeeId'].enable();

        this.detailsForm.markAllAsTouched();
        // this.detailsForm.updateValueAndValidity();

        // Object.keys(this.detailsForm.controls).forEach(key=>{
        //   const control=this.detailsForm.controls[key];
        //   control.markAsTouched();
        //   control.updateValueAndValidity();
        // });

        this.detailsForm.get('employeeId')!.setErrors({ required: true });
        // this.detailsForm.get('employeeId')!.markAsTouched();

        if (this.gridApi) {
          setTimeout(() => {
            this.gridApi.forEachNode((node: any) => {
              if (node.rowIndex === 0) {
                node.setSelected(true);
              }
            });
          }, 50);
        }
        console.log(this.detailsForm);
        
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
    defaultEmployee.empStatus = 'ACTIVE';

    return defaultEmployee;
  }

  activeTabEmit(event: any) {
    this.activeTab = event.activeTab;

     this.pageErrors = this.FormUtilServiceService.parseValidationErrors(
              this.detailsForm.controls,
              this.detailsFormEntity,
            );
            console.log(this.pageErrors);
  }

  activeViewOrEdit(event: any) {
    this.isEdit = event;
    if (this.isEdit) {
      this.detailsForm.enable();
    } else {
      this.detailsForm.disable();
    }
  }

  onSumbit() {
    this.isNewEmployee=false;
  }

  //   formBuilder(){
  //     const group:any={};
  //     Object.keys(detailsFormObject).forEach((key) => {
  //     const field = detailsFormObject[key];
  //     const validators = [];

  //     if (field.validations?.includes('required')) {
  //       validators.push(Validators.required);
  //     }

  //     if (field.validations?.some((v:string) => v.startsWith('pattern:'))) {
  //       const pattern = field.validations.find((v:string) => v.startsWith('pattern:'))?.split(':')[1];
  //       validators.push(Validators.pattern(new RegExp(pattern!)));
  //     }

  //     if (field.validations?.includes('email')) {
  //       validators.push(Validators.email);
  //     }

  //     group[key] = this.fb.control({ value: field.value, disabled: field.disabled }, validators);
  //   });

  //   this.detailsForm = this.fb.group(group);
  // }
}
