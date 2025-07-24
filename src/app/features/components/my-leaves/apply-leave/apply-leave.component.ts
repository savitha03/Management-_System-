import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { FeatureCommonServiceService } from '../../../services/feature-common-service.service';
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
  leaveFormEnitity: any = leaveFormObject;
  leaveType$!: Observable<any>;
  showTimeFields = false;

  constructor(
    private fb: FormBuilder,
    private featureCommonService: FeatureCommonServiceService,
    private formUtilServiceService: FormUtilServiceService,
    private leaveManagementService: LeaveManagementServiceService
  ) {}

  ngOnInit(): void {
    this.loadDropdowns();
    this.formBuilder();
    
  }

  formBuilder() {
    this.leaveForm = this.formUtilServiceService.buildReactiveForm(this.leaveFormEnitity);
    this.leaveForm.setValidators(this.toDateAfterFromDateValidator());

    this.leaveForm.get('fromDate')?.valueChanges.subscribe(() => {
      this.checkDateEquality();
      this.calculateDuration();
    });

    this.leaveForm.get('toDate')?.valueChanges.subscribe(() => {
      this.checkDateEquality();
      this.calculateDuration();
    });

    this.leaveForm.get('fromTime')?.valueChanges.subscribe(() => {
      this.calculateTotalHours();
      this.calculateDuration();
    });

    this.leaveForm.get('toTime')?.valueChanges.subscribe(() => {
      this.calculateTotalHours();
      this.calculateDuration();
    });
  }

  toDateAfterFromDateValidator() {
    return (group: AbstractControl): ValidationErrors | null => {
      const from = group.get('fromDate')?.value;
      const to = group.get('toDate')?.value;

      if (from && to && new Date(to) < new Date(from)) {
        group.get('toDate')?.setErrors({ dateBeforeFromDate: true });
        return { dateBeforeFromDate: true };
      }
      return null;
    };
  }

 checkDateEquality() {
  const fromDate = this.leaveForm.get('fromDate')?.value;
  const toDate = this.leaveForm.get('toDate')?.value;
  const sameDay = fromDate && toDate && fromDate === toDate;

  this.showTimeFields = sameDay;

  const fromTimeCtrl = this.leaveForm.get('fromTime');
  const toTimeCtrl = this.leaveForm.get('toTime');
  const totalHoursCtrl = this.leaveForm.get('totalHours');

  if (sameDay) {
    fromTimeCtrl?.setValidators(Validators.required);
    toTimeCtrl?.setValidators(Validators.required);
    totalHoursCtrl?.setValidators(Validators.required);
  } else {
    fromTimeCtrl?.clearValidators();
    toTimeCtrl?.clearValidators();
    totalHoursCtrl?.clearValidators();

    fromTimeCtrl?.setValue('');
    toTimeCtrl?.setValue('');
    totalHoursCtrl?.setValue('');
  }

  fromTimeCtrl?.updateValueAndValidity();
  toTimeCtrl?.updateValueAndValidity();
  totalHoursCtrl?.updateValueAndValidity();
}


  parseTimeToDate(timeStr: string): Date {
    const [hh, mm] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hh, mm, 0, 0);
    return date;
  }

  calculateTotalHours() {
    const fromTime = this.leaveForm.get('fromTime')?.value;
    const toTime = this.leaveForm.get('toTime')?.value;

    if (fromTime && toTime) {
      const from = this.parseTimeToDate(fromTime);
      const to = this.parseTimeToDate(toTime);

      if (to > from) {
        const diff = (to.getTime() - from.getTime()) / (1000 * 60 * 60);
        this.leaveForm.get('totalHours')?.setValue(diff.toFixed(2));
      } else {
        this.leaveForm.get('totalHours')?.setValue('');
      }
    }
  }

  calculateDuration() {
    const fromDate = this.leaveForm.get('fromDate')?.value;
    const toDate = this.leaveForm.get('toDate')?.value;

    if (!fromDate || !toDate) return;

    const from = new Date(fromDate);
    const to = new Date(toDate);

    if (to < from) {
      this.leaveForm.get('duration')?.setValue('');
      return;
    }

    if (from.toDateString() === to.toDateString()) {
      const fromTime = this.leaveForm.get('fromTime')?.value;
      const toTime = this.leaveForm.get('toTime')?.value;

      if (fromTime && toTime) {
        const fromT = this.parseTimeToDate(fromTime);
        const toT = this.parseTimeToDate(toTime);
        const diffHrs = (toT.getTime() - fromT.getTime()) / (1000 * 60 * 60);

        if (diffHrs < 4) {
          this.leaveForm.get('duration')?.setValue("0");
        } else if (diffHrs >= 4 && diffHrs < 6) {
          this.leaveForm.get('duration')?.setValue("0.5");
        } else {
          this.leaveForm.get('duration')?.setValue("1");
        }
      } else {
        this.leaveForm.get('duration')?.setValue('');
      }
    } else {
      const diffTime = to.getTime() - from.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
      this.leaveForm.get('duration')?.setValue(diffDays.toString());
    }
  }

  loadDropdowns() {
    this.featureCommonService
      .getDropdownLists('LEAVETYPE')
      .subscribe((data) => (this.leaveType$ = of(data)));
  }

  apply() {
    if (this.leaveForm.valid) {
      this.leaveForm.get('empCode')?.patchValue('T2506');
      const leaveData = this.leaveForm.value;

      this.leaveManagementService.saveEmployeeLeaveRequest(leaveData).subscribe({
        next: (res) => {
          console.log('Leave request submitted', res);
          this.leaveForm.reset();
        },
        error: (err) => {
          console.error('Submission failed', err);
        },
      });
    } else {
      this.leaveForm.markAllAsTouched();
    }
  }
}
