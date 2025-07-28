import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { FeatureCommonServiceService } from '../../../services/feature-common-service.service';
import { LeaveManagementServiceService } from '../../../services/leave-management-service.service';
import { leaveFormObject } from '../../../forms/apply-leave.forms';
import { FormUtilServiceService } from '../../../../shared/services/form-util-service.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-apply-leave',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './apply-leave.component.html',
  styleUrls: ['./apply-leave.component.css'],
})
export class ApplyLeaveComponent implements OnInit {
  @Input() leaveData: any;

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
    if (this.leaveData) {
      this.leaveForm.patchValue(this.leaveData);
    }
  }

  formBuilder() {
    this.leaveForm = this.formUtilServiceService.buildReactiveForm(
      this.leaveFormEnitity
    );
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
          this.leaveForm.get('duration')?.setValue('0');
        } else if (diffHrs >= 4 && diffHrs < 6) {
          this.leaveForm.get('duration')?.setValue('0.5');
        } else {
          this.leaveForm.get('duration')?.setValue('1');
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
    this.leaveForm.get('empCode')?.patchValue('T2506'); // Set empCode FIRST
    if (this.leaveForm.valid) {
      const leaveData = this.leaveForm.value;
      this.leaveManagementService
        .saveEmployeeLeaveRequest(leaveData)
        .subscribe(()=>{
          this.leaveForm.reset();
        });
    } else {
      this.leaveForm.markAllAsTouched();
    }
  }
}

@Component({
  selector: 'app-update-leave',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="modal-header">
      <h5 class="modal-title">Update Leave</h5>
      <button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss('Cross click')"></button>
    </div>
    <div class="modal-body">
      <div class="mt-3">
        <div>
          <form [formGroup]="leaveForm" (ngSubmit)="apply()">
            <div class="leave-form-grid">
              <!-- Leave Type -->
              <div class="mt-2">
                <label for="leaveType" class="form-label">Leave Type</label>
                <select
                  id="leaveType"
                  formControlName="leaveType"
                  class="form-select form-control"
                  required
                >
                  <option value="" disabled>Select Leave Type</option>
                  <option
                    *ngFor="let leaveType of leaveType$ | async"
                    [ngValue]="leaveType.code"
                  >
                    {{ leaveType.screenName }}
                  </option>
                </select>
              </div>

              <!-- From Date -->
              <div class="mt-2">
                <label for="fromDate" class="form-label">From Date</label>
                <input
                  type="date"
                  id="fromDate"
                  class="form-control"
                  formControlName="fromDate"
                />
              </div>

              <!-- To Date -->
              <div class="mt-2">
                <label for="toDate" class="form-label">To Date</label>
                <input
                  type="date"
                  id="toDate"
                  class="form-control"
                  formControlName="toDate"
                  [min]="leaveForm.get('fromDate')?.value"
                />
                <small
                  class="text-danger"
                  *ngIf="
                    leaveForm.get('toDate')?.hasError('dateBeforeFromDate')
                  "
                >
                  To Date cannot be before From Date.
                </small>
              </div>

              <!-- Time Fields (conditionally shown) -->
              <div *ngIf="showTimeFields">
                <label class="form-label mt-2">From Time</label>
                <input
                  type="time"
                  class="form-control"
                  formControlName="fromTime"
                />
              </div>

              <div *ngIf="showTimeFields">
                <label class="form-label mt-2">To Time</label>
                <input
                  type="time"
                  class="form-control"
                  formControlName="toTime"
                />
              </div>

              <div *ngIf="showTimeFields">
                <label class="form-label mt-2">Total Hours</label>
                <input
                  type="number"
                  class="form-control"
                  formControlName="totalHours"
                  readonly
                />
              </div>

              <!-- Duration -->
              <div>
                <label class="form-label mt-2">Duration</label>
                <input
                  type="text"
                  class="form-control"
                  formControlName="duration"
                  readonly
                />
              </div>

              <!-- Reason -->
              <div class="full-width mt-2">
                <label for="reason" class="form-label">Reason</label>
                <textarea
                  id="reason"
                  class="form-control"
                  formControlName="reason"
                  rows="3"
                  maxlength="5000"
                ></textarea>
              </div>
            </div>

            <!-- Submit Button -->
            <!-- <div class="buttons mt-2 justify-content-center">
       
        <button type="submit" class="btn submit" [disabled]="leaveForm.invalid">
          Submit
        </button>
      </div> -->
          </form>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-secondary" (click)="activeModal.close('Close click')">Cancel</button>
      <button type="button" class="btn btn-outline-primary" (click)="update()">Update</button>
    </div>
  `,
  styleUrls: ['./apply-leave.component.css'],
})
export class UpdateLeaveComponent implements OnInit {
  @Input() leaveData: any;
  @Input() header:any;
  @Input() content:any;
  @Output() eventHandler$ = new EventEmitter();

  leaveForm!: FormGroup;
  leaveFormEnitity: any = leaveFormObject;
  leaveType$!: Observable<any>;
  showTimeFields = false;

  constructor(
    private fb: FormBuilder,
    private featureCommonService: FeatureCommonServiceService,
    private formUtilServiceService: FormUtilServiceService,
    private leaveManagementService: LeaveManagementServiceService,
    public activeModal:NgbActiveModal,
  ) {}

  ngOnInit(): void {
    // this.loadDropdowns();
    this.formBuilder();
      this.featureCommonService.getDropdownLists('LEAVETYPE').subscribe(data => {
    this.leaveType$ = of(data);

    // ✅ Now that dropdown values are loaded, patch the form
    if (this.leaveData) {
      this.leaveForm.patchValue(this.leaveData);
    }
  });


    
   
  }

  formBuilder() {
    this.leaveForm = this.formUtilServiceService.buildReactiveForm(
      this.leaveFormEnitity
    );
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
          this.leaveForm.get('duration')?.setValue('0 day');
        } else if (diffHrs >= 4 && diffHrs < 6) {
          this.leaveForm.get('duration')?.setValue('0.5 day');
        } else {
          this.leaveForm.get('duration')?.setValue('1 day');
        }
      } else {
        this.leaveForm.get('duration')?.setValue('');
      }
    } else {
      const diffTime = to.getTime() - from.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
      this.leaveForm.get('duration')?.setValue(`${diffDays.toString()} days`);
    }
  }

  loadDropdowns() {
    this.featureCommonService
      .getDropdownLists('LEAVETYPE')
      .subscribe((data) => (this.leaveType$ = of(data)));
  }

  apply() {
    this.leaveForm.get('empCode')?.patchValue('T2506'); // Set empCode FIRST
    if (this.leaveForm.valid) {
      const leaveData = this.leaveForm.value;
      this.leaveManagementService
        .saveEmployeeLeaveRequest(leaveData)
        .subscribe({
        });
    } else {
      this.leaveForm.markAllAsTouched();
    }
  }
  update(){
   
    const payload = {
      type: 'UPDATE',
      value : this.leaveForm.getRawValue()
    }

    this.eventHandler$.emit(payload);
  }

}
