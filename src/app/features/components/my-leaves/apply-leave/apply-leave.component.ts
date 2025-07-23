import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { FeatureCommonServiceService } from '../../../services/feature-common-service.service';
import { end } from '@popperjs/core';
import { LeaveManagementServiceService } from '../../../services/leave-management-service.service';
import { leaveFormObject } from '../../../forms/apply-leave.forms';
import { FormUtilServiceService } from '../../../../shared/services/form-util-service.service';

@Component({
  selector: 'app-apply-leave',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './apply-leave.component.html',
  styleUrls: ['./apply-leave.component.css'],
})
export class ApplyLeaveComponent implements OnInit {
  leaveForm!: FormGroup;
  leaveFormEnitity:any = leaveFormObject;

  leaveType$!: Observable<any>;

  constructor(
    private fb: FormBuilder,
    private featureCommonService: FeatureCommonServiceService,
    private formUtilServiceService: FormUtilServiceService,
    private leaveManagementService: LeaveManagementServiceService
  ) {
    // this.leaveForm = this.fb.group({
    //   leaveType: ['', Validators.required],
    //   fromDate: ['', Validators.required],
    //   toDate: ['', Validators.required],
    //   fromTime: ['', Validators.required],
    //   toTime: ['', Validators.required],
    //   totalHours: ['', Validators.required],
    //   reason: ['', Validators.required],
    // });
    
    
  }
  showTimeFields = false;

  checkDateEquality() {
    const fromDate = this.leaveForm.get('fromDate')?.value;
    const toDate = this.leaveForm.get('toDate')?.value;

    this.showTimeFields = fromDate && toDate && fromDate === toDate;
  }

  
 

  ngOnInit(): void {
    this.loadDropdowns();
    this.formBuilder();

    
  }

  
  // apply() {
  //   if(this.leaveForm.valid){
  //   this.leaveForm.reset();
  //   }
  //   else{
  //     this.leaveForm.markAllAsTouched();
  //   }

  // }

   formBuilder() {
    this.leaveForm = this.formUtilServiceService.buildReactiveForm(
      this.leaveFormEnitity
    );
    this.leaveForm
      .get('fromDate')
      ?.valueChanges.subscribe(() => this.checkDateEquality());
    this.leaveForm
      .get('toDate')
      ?.valueChanges.subscribe(() => this.checkDateEquality());
    
  }

  loadDropdowns() {
    this.featureCommonService
      .getDropdownLists('LEAVETYPE')
      .subscribe((data) => {
        this.leaveType$ = of(data);
      });
  }

  apply() {
    if (this.leaveForm.valid) {
      const leaveData = this.leaveForm.value;

       
      this.leaveManagementService
        .saveEmployeeLeaveRequest(leaveData)
        .subscribe({
          next: (response) => {
            console.log('Leave request submitted successfully', response);
            this.leaveForm.reset();
          },
          error: (err) => {
            console.error('Error submitting leave request', err);
          },
        });
    } else {
      this.leaveForm.markAllAsTouched();
    }
  }



}
