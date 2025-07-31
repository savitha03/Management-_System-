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
import { FeatureCommonServiceService } from '../../services/feature-common-service.service';
import { SharedService } from '../../../shared/services/shared.service';
import { Observable, of } from 'rxjs';
import { EmployeeDetailsService } from '../../services/employee-details.service';
import { CoreModalComponent } from '../../../shared/modals/core-modal/core-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
  currentMode: 'Edit' | 'View' = 'View';


  //   resetFormState() {
  //   this.isNewEmployee = false;
  //   this.isEdit = false;
  //   this.detailsForm.disable();
  // }

  filterType: 'all' | 'active' | 'closed' = 'all';

  public activeTab = 'personal';

  empStatus$!: Observable<any>;
  genderList$!: Observable<any>;
  maritalStatus$!: Observable<any>;
  emptStatus$!: Observable<any>;
  currency$!: Observable<any>;
  payFrequency$!: Observable<any>;
  role$!: Observable<any>;
  teamHRHead$! : Observable<any>;
  projectManager$! :Observable<any>;
  teamLead$! :Observable<any>;
  cityList$! :Observable<any>;
  stateList$!:Observable<any>;
  countryList$!: Observable<any>;
  


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
    { headerName: 'Emp Code', field: 'empCode', width: 120, filter: true },
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

  allRowData: any[] = [];

  rowData: any[] = [];

  defaultColDefs = {
    resizable: true,
    sortable: true,
    filter: true,
  };
  pageErrors: any[] = [];

  constructor(
    private fb: FormBuilder,
    private formUtilServiceService: FormUtilServiceService,
    private sharedService: SharedService,
    private featureCommonService: FeatureCommonServiceService,
    private employeeDetailsService: EmployeeDetailsService,
    private modalService:NgbModal
  
  ) {}

  ngOnInit(): void {
    this.toggleActiveFilter('all');
    this.formBuilder();
    this.loadDropdowns();
    this.getEmployees();

    if (this.isEdit) {
      this.detailsForm.enable();
    } else {
      this.detailsForm.disable();
    }
  }

  getEmployees() {
    this.employeeDetailsService.getEmployeeDetails().subscribe((data: any) => {
      this.allRowData = data;
      this.rowData = [...this.allRowData];
      console.log(data);
      this.selectFirstRowAndShowDetails();
    });
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
    this.selectFirstRowAndShowDetails();

    const firstNode = this.gridApi?.getDisplayedRowAtIndex(0);
    if (firstNode) {
      firstNode.setSelected(true); // highlights first row
      this.onRowSelected(firstNode.data); // directly trigger
    }
  }

  onRowSelected(row: any) {
  if (this.isEdit && this.detailsForm.dirty && !this.isNewEmployee) {
    const formData = this.detailsForm.getRawValue();

    this.employeeDetailsService.updateEmployeeDetails(formData).subscribe({
      next: (res) => {
        console.log('Auto-saved changes:', res);
        const index = this.allRowData.findIndex(
          (emp) => emp.empCode === res.empCode
        );
        if (index > -1) this.allRowData[index] = res;
      },
      error: (err) => {
        console.error('Auto-save failed:', err);
      },
    });
  }

  this.selectedRow = row;
  const formData = {
    ...this.selectedRow,
    dateOfBirth: this.selectedRow.dateOfBirth
      ? this.selectedRow.dateOfBirth.split('T')[0]
      : '',
    joinedDate: this.selectedRow.joinedDate
      ? this.selectedRow.joinedDate.split('T')[0]
      : '',
  };

  this.detailsForm.patchValue(formData);
  this.activeTab = 'personal';

  if (!this.isNewEmployee) {
    this.isEdit = false;
    this.detailsForm.disable();
  }
}


  formBuilder() {
    this.detailsForm = this.formUtilServiceService.buildReactiveForm(
      this.detailsFormEntity
    );
  }

  handleAppEvent(event: any) {
    switch (event.name) {
      // case 'ROW_CLICKED': {
      //   this.onRowSelected(event.value.selectedRow);
      //   break;
      // }
      case 'ROW_CLICKED': {
      if (this.isNewEmployee && this.detailsForm.invalid) {
    this.detailsForm.markAllAsTouched();

    const validationMessages = this.formUtilServiceService.parseValidationErrors(
      this.detailsForm.controls,
      this.detailsFormEntity
    );

    const uniqueMessages = validationMessages
      .filter((item, index, array) =>
        index === array.findIndex((el) => el.content === item.content)
      )
      .map((err) => err.content);

    this.openValidationSlider(uniqueMessages);
    setTimeout(() => {
      this.gridApi.forEachNode((node: any) => {
        if (node.rowIndex === 0) {
          node.setSelected(true);
        }
      });
    });

    
    return;
  }

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
        this.detailsForm.controls['empCode'].enable();
        this.handleAppEvent({
          name: 'NEW_EMPLOYEE',
          component: 'UserInfoComponent',
          value: event.value,
        });
        break;
      }
      case 'SHOW_ERRORS': {
        this.pageErrors = this.formUtilServiceService.parseValidationErrors(
          event.value.controls,
          event.value.objects
        );

        break;
      }

      // case 'NEW_EMPLOYEE': {
      //   const newRow = this.getDefaultEmployee();

      //   this.isNewEmployee = true;
      //   this.isEdit = true;

      //   this.allRowData = [newRow, ...this.allRowData];
      //   this.toggleActiveFilter(this.filterType);
      //   this.selectedRow = newRow;
      //   this.detailsForm.reset(newRow); // Fill default values
      //   this.detailsForm.enable();

      //   this.detailsForm.markAllAsTouched();

      //   this.detailsForm.get('employeeId')!.setErrors({ required: true });

      //   if (this.gridApi) {
      //     setTimeout(() => {
      //       this.gridApi.forEachNode((node: any) => {
      //         if (node.rowIndex === 0) {
      //           node.setSelected(true);
      //         }
      //       });
      //     }, 50);
      //   }

      //   break;
      // }
      case 'NEW_EMPLOYEE': {
  if (this.isNewEmployee && this.detailsForm.invalid) {
    this.detailsForm.markAllAsTouched();

    const validationMessages = this.formUtilServiceService.parseValidationErrors(
      this.detailsForm.controls,
      this.detailsFormEntity
    );

    const uniqueMessages = validationMessages
      .filter((item, index, array) =>
        index === array.findIndex((el) => el.content === item.content)
      )
      .map((err) => err.content);

    this.openValidationSlider(uniqueMessages);
    return; 
  }

  const newRow = this.getDefaultEmployee();

  this.isNewEmployee = true;
  this.isEdit = true;

  this.allRowData = [newRow, ...this.allRowData];
  this.toggleActiveFilter(this.filterType);
  this.selectedRow = newRow;
  this.detailsForm.reset(newRow);
  this.detailsForm.enable();

  this.detailsForm.markAllAsTouched();
  this.detailsForm.get('empCode')!.setErrors({ required: true });

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

      case 'SAVE': {
        if (this.detailsForm.invalid) {
          this.detailsForm.markAllAsTouched();

          const invalidControls = this.getInvalidControls(this.detailsForm);
          console.warn('Invalid Form Controls');
          invalidControls.forEach((controlName) => {
            const control = this.detailsForm.get(controlName);
            console.warn(
              `Control "${controlName}" is invalid. Value:`,
              control?.value
            );
          });

          this.pageErrors = this.formUtilServiceService.parseValidationErrors(
            this.detailsForm.controls,
            this.detailsFormEntity
          );

          this.pageErrors = this.pageErrors.filter(
            (item, index, array) =>
              index ===
              array.findIndex((element) => element.content === item.content)
          );

          let validationErrors = this.pageErrors.map((error) => error.content);

          if (validationErrors) {
            this.openValidationSlider(validationErrors);
          }

          return;
        }

        const formData = this.detailsForm.getRawValue();
        console.log('Saving Employee Data:', formData);

        if (this.isNewEmployee) {
          // New employee - call save API
          this.employeeDetailsService.saveEmployeeDetails(formData).subscribe({
            next: (res) => {
              console.log('Employee saved:', res);

              this.allRowData = [res, ...this.allRowData];
              this.toggleActiveFilter(this.filterType); // Refresh list
              this.isNewEmployee = false;
              this.isEdit = false;
              this.detailsForm.disable();
              this.getEmployees();
              this.clearValidation();
              
            },
            error: (err) => {
              console.error('Save error:', err);
            },
          });
        } else {
          // Existing employee - call update API
          this.employeeDetailsService
            .updateEmployeeDetails(formData)
            .subscribe({
              next: (res) => {
                console.log('Employee updated:', res);

                const index = this.allRowData.findIndex(
                  (emp) => emp.empCode === res.empCode
                );
                if (index > -1) this.allRowData[index] = res;

                this.toggleActiveFilter(this.filterType);
                this.isEdit = false;
                this.detailsForm.disable();
              },
              error: (err) => {
                console.error('Update error:', err);
              },
            });
        }

        break;
      }

      case'VIEW_OR_EDIT':{
       const { mode, detailsForm } = event.value;
      this.currentMode = mode;

      if (mode === 'View') {
        const editModal = this.modalService.open(CoreModalComponent, {
          backdrop: 'static',
          size: 'lg',
          keyboard: false,
        });

        editModal.componentInstance.header = 'Confirmation';
        editModal.componentInstance.content = `Do you want to edit ${detailsForm.get('fullName')?.value}'s Detail ?`;
        editModal.componentInstance.isYesOrNo = true;

        editModal.componentInstance.eventHandler$.subscribe((data: any) => {
          if (data === 'Proceed') {
            this.isEdit = true;
            this.activeViewOrEdit(this.isEdit);
            editModal.close();
          }
        });
      } else {
        const saveModal = this.modalService.open(CoreModalComponent, {
          backdrop: 'static',
          size: 'lg',
          keyboard: false,
        });
        saveModal.componentInstance.header = 'Confirmation';
        saveModal.componentInstance.content = `Do you want to edit ${detailsForm.get('fullName')?.value}'s Detail ?`;
        saveModal.componentInstance.isYesOrNo = true;


        this.isEdit = mode !== 'Edit';
        this.activeViewOrEdit(this.isEdit)
      }

      break;
    }
    }
  }

  clearValidation() {
    this.sharedService.setValidationSubject(null);
  }

  getInvalidControls(formGroup: FormGroup): string[] {
    const invalidControls: string[] = [];
    Object.keys(formGroup.controls).forEach((controlName) => {
      const control = formGroup.get(controlName);
      if (control && control.invalid) {
        invalidControls.push(controlName);
      }
    });
    return invalidControls;
  }

  getDefaultEmployee(): any {
    const defaultEmployee: any = {};
    Object.keys(this.detailsForm.controls).forEach((key) => {
      defaultEmployee[key] = '';
    });
    defaultEmployee.empStatus = 'ACTIVE';

    return defaultEmployee;
  }

  openValidationSlider(validation: any) {
    this.sharedService.setValidationSliderSubject(true);
    this.sharedService.setValidationSubject(validation);
  }

  activeTabEmit(event: any) {
    this.activeTab = event.activeTab;

    this.pageErrors = this.formUtilServiceService.parseValidationErrors(
      this.detailsForm.controls,
      this.detailsFormEntity
    );
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
    this.isNewEmployee = false;
  }

  loadDropdowns() {
    this.featureCommonService
      .getDropdownLists('EMPSTATUS')
      .subscribe((data) => {
        this.empStatus$ = of(data);
      });
    this.featureCommonService.getDropdownLists('GENDER').subscribe((data) => {
      this.genderList$ = of(data);
    });
    this.featureCommonService
      .getDropdownLists('MARITALSTATUS')
      .subscribe((data) => {
        this.maritalStatus$ = of(data);
      });
    this.featureCommonService
      .getDropdownLists('EMPTSTATUS')
      .subscribe((data) => {
        this.emptStatus$ = of(data);
      });
    this.featureCommonService.getDropdownLists('CITY').subscribe((data)=>{
      this.cityList$ = of(data);
    });
     this.featureCommonService.getDropdownLists('STATE').subscribe((data)=>{
      this.stateList$ = of(data);
    });
     this.featureCommonService.getDropdownLists('COUNTRY').subscribe((data)=>{
      this.countryList$ = of(data);
    });
    this.featureCommonService.getDropdownLists('CURRENCY').subscribe((data) => {
      this.currency$ = of(data);
    });
    this.featureCommonService
      .getDropdownLists('PAYFREQUENCY')
      .subscribe((data) => {
        this.payFrequency$ = of(data);
      });
    this.featureCommonService
      .getDropdownLists('DESIGNATION')
      .subscribe((data) => {
        this.role$ = of(data);
      });
      this.featureCommonService.getTeamDropdownLists('TEAMHRHEAD')
      .subscribe((data)=>{
        this.teamHRHead$ = of(data);
      })
       this.featureCommonService.getTeamDropdownLists('PROJECTMGR')
      .subscribe((data)=>{
        this.projectManager$ = of(data);
      })
       this.featureCommonService.getTeamDropdownLists('TEAMLEADER')
      .subscribe((data)=>{
        this.teamLead$ = of(data);
      })
    
  }

  selectFirstRowAndShowDetails() {
    setTimeout(() => {
      if (this.gridApi && this.rowData.length > 0) {
        const firstNode = this.gridApi.getDisplayedRowAtIndex(0);
        if (firstNode) {
          firstNode.setSelected(true); // Select in grid
          this.onRowSelected(firstNode.data); // Patch form
        }
      }
    }, 100); // Wait for grid and data to render
  }
}
