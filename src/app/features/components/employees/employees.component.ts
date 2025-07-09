
import { Component } from '@angular/core';
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

  gridApi: any;
  gridColumnApi: any;
  rowSelection = 'single';
  gridOptions: GridOptions = {
    context: {
      componentParent: this,
    },
  };
  newEmployee: any;

  employeeForm!: FormGroup;

  colDefs: ColDef[] = [
    {
      headerName: '',
      field: 'diceId',
      width: 50,
      resizable:false,
      sortable:false,
      filter: false,
      cellRenderer: DiceComponentComponent,
      cellRendererParams: (params: any) => ({
        actionLinks: [],
        item: { ...params.data, index: params.rowIndex },
        hostComponent: 'EmployeesListComponent',
      }),
    },
    { headerName: 'Emp Code', field: 'empCode', width: 120, filter: true },
    {
      headerName: 'Emp Name',
      field: 'empName',
      width: 260,
      resizable: true,
      cellRenderer: (params: any) => {
        const isActive =
          params.data.empStatus === 'Active'
            ? true
            : params.data.empStatus === 'Closed'
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
      empCode: 'ST1176',
      empName: 'Vigneshwaran Thiruselvam',
      empStatus: 'Active',
    },
    {
      empCode: 'T2506',
      empName: 'Savitha',
      empStatus: 'Closed',
    },  {
      empCode: 'T2503',
      empName: 'Ravishankar',
      empStatus: 'Active',
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
    this.initForm();
    this.toggleActiveFilter('all');
  }

  initForm() {
    this.employeeForm = this.fb.group({
      empId: [{ value: '', disabled: true }],
      empName: ['', Validators.required],
      empStatus: ['', Validators.required],
    });
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
    this.employeeForm.patchValue({
      empId: row.empId,
      empName: row.empName,
      empStatus: row.empStatus,
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
        if (this.employeeForm.invalid) {
          console.warn('Form invalid');
          return;
        }
        if (this.employeeForm.dirty && this.employeeForm.valid) {
          console.log('Saving employee...', this.employeeForm.getRawValue());
        }
        this.employeeForm.controls['empId'].enable();
        this.handleAppEvent({
          name: 'NEW_EMPLOYEE',
          component: 'UserInfoComponent',
          value: event.value,
        });
        break;
      }

      case 'NEW_EMPLOYEE': {
        // 1. Create a blank record
        const newRow = {
          empCode: '',
          empName: '',
          empStatus: '',
        };

        // 2. Insert at top
        this.allRowData = [newRow, ...this.allRowData];
        this.toggleActiveFilter(this.filterType); // re-apply filter -> updates this.rowData

        // 3. Tell the list which row we want selected
        this.selectedRow = newRow;

        // 4. Reset & prime the form
        this.employeeForm.reset({
          empId: '',
          empName: '',
          empStatus: '',
        });
        this.employeeForm.controls['empId'].enable();

        break;
      }
    }
  }
}



