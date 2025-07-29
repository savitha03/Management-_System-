import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DetailsServiceService } from '../../services/details-service.service';
import { Observable, of } from 'rxjs';
import { FeatureCommonServiceService } from '../../services/feature-common-service.service';
import { Store } from '@ngrx/store';
import { selectAuthUser } from '../../../auth/store/auth/login.selectors';

@Component({
  selector: 'app-employment-details',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './employment-details.component.html',
  styleUrl: './employment-details.component.css',
})
export class EmploymentDetailsComponent implements OnInit {
  activeTab = 'job';
  jobForm!: FormGroup;
  salaryForm!: FormGroup;
  loggedInUser:any;

  // @Input() detailsForm: any;

  emptStatus$!: Observable<any>;
  currency$!: Observable<any>;
  payFrequency$!: Observable<any>;

  constructor(
    private fb: FormBuilder,
    private detailsService: DetailsServiceService,
    private featureCommonService: FeatureCommonServiceService,
    private store:Store
  ) {
    this.store.select(selectAuthUser).subscribe((user:any) => {
            if(user){
              this.loggedInUser= user;
            }
          });
  }

  ngOnInit(): void {
    this.formBuilder();
    this.loadEmployeeData(this.loggedInUser.empCode);
    this.loadDropdowns();
  }

  switchTab(tab: string) {
    this.activeTab = tab;
  }

  onSubmit() {}

  formBuilder() {
    this.jobForm = this.fb.group({
      empCode: [''],
      jobTitle: ['', Validators.required],
      employmentStatus: ['', Validators.required],
      joinedDate: ['', Validators.required],
      skillset: ['', Validators.required],
    });

    this.salaryForm = this.fb.group({
      empCode: [''],
      payGrade: ['', Validators.required],
      currency: ['', Validators.required],
      basicSalary: ['', Validators.required],
      payFrequency: ['', Validators.required],
    });
  }

  loadEmployeeData(empId: any) {
    this.detailsService.getEmployeeJobDetails(empId).subscribe((data: any) => {
      const formData = {
        ...data,
        joinedDate: data.joinedDate
          ? this.formatDateString(data.joinedDate)
          : '',
      };
      this.jobForm.patchValue(formData);
    });

    this.detailsService
      .getEmployeeSalaryDetails(empId)
      .subscribe((data: any) => {
        this.salaryForm.patchValue(data);
      });
  }

  // Helper method
  formatDateString(dateStr: string): string {
    const [month, day, year] = dateStr.split(' ')[0].split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  loadDropdowns() {
    this.featureCommonService
      .getDropdownLists('EMPTSTATUS')
      .subscribe((data) => {
        this.emptStatus$ = of(data);
      });
    this.featureCommonService.getDropdownLists('CURRENCY').subscribe((data) => {
      this.currency$ = of(data);
    });
    this.featureCommonService
      .getDropdownLists('PAYFREQUENCY')
      .subscribe((data) => {
        this.payFrequency$ = of(data);
      });
      
  }
}
