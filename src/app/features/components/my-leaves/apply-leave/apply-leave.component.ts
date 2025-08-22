import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
  Validators,
  ValidatorFn,
} from '@angular/forms';
import { distinctUntilChanged, Observable, of, Subject, takeUntil } from 'rxjs';
import { FeatureCommonServiceService } from '../../../services/feature-common-service.service';
import { LeaveManagementServiceService } from '../../../services/leave-management-service.service';
import { leaveFormObject } from '../../../forms/apply-leave.forms';
import { FormUtilServiceService } from '../../../../shared/services/form-util-service.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { selectAuthUser } from '../../../../auth/store/auth/login.selectors';
import { UsersLeaveRequestsComponent } from '../users-leave-requests/users-leave-requests.component';
import { RouterModule } from '@angular/router';
import { SharedService } from '../../../../shared/services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { AsyncDetection, NgScrollbar, NgScrollbarModule } from 'ngx-scrollbar';
import { CoreModalComponent } from '../../../../shared/modals/core-modal/core-modal.component';
import { ValidationCoreModelComponent } from '../../../../shared/modals/validation-core-model/validation-core-model.component';

@Component({
  selector: 'app-apply-leave',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NgScrollbarModule],
  templateUrl: './apply-leave.component.html',
  styleUrls: ['./apply-leave.component.css'],
})


export class ApplyLeaveComponent implements OnInit, OnDestroy {
  @Input() leaveData: any;
  @Input() leaveFormObject: any;
  isEditable: boolean = false;
  loggedInUser: any;
  leaveForm!: FormGroup;
  leaveFormEnitity: any = leaveFormObject;
  leaveType$!: Observable<any>;
  showTimeFields = false;
  showSuccessToast = false;
  leaveFormEntity: any = leaveFormObject;

  fromTimeOptions: any[] = [];
  toTimeOptions: any[] = [];

  time$!: Observable<any>;
  public _destroyed$: any = new Subject();

    

  constructor(
    private fb: FormBuilder,
    private featureCommonService: FeatureCommonServiceService,
    private formUtilServiceService: FormUtilServiceService,
    private leaveManagementService: LeaveManagementServiceService,
    private sharedService: SharedService,
    private store: Store,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {
    this.store.select(selectAuthUser).subscribe((user: any) => {
      if (user) {
        this.loggedInUser = user;
      }
    });

    
  }
  
  ngOnInit(): void {
    this.loadDropdowns();
    this.formBuilder();
    this.leaveForm.valueChanges.subscribe(() => {
      this.clearValidation();
    });
    if (this.leaveData) {
      this.leaveForm.patchValue(this.leaveData);
    }
    this.leaveForm.disable();
    this.sharedService.appEvent$.pipe(takeUntil(this._destroyed$), distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr))).subscribe((data: any) => {
      switch (data.name) {
        case 'NAVIGATED_BY_MENU': {
          if (this.leaveForm.invalid) {
            this.sharedService.setIsValidation(true);
            const validationMessages =
              this.formUtilServiceService.parseValidationErrors(
                this.leaveForm.controls,
                this.leaveFormEntity
              );

            const uniqueMessages = validationMessages
              .filter(
                (item, index, array) =>
                  index === array.findIndex((el) => el.content === item.content)
              )
              .map((err) => err.content);

            this.openValidationSlider(uniqueMessages);
          } else {
            this.sharedService.setIsValidation(false);
          }
          return;
        }
      }
    });
  }

  formBuilder() {
    this.buildForm();
    this.leaveForm.setValidators([
      this.toDateAfterFromDateValidator(),
      this.sameTimeNotAllowedValidator()
    ]);
    

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

sameTimeNotAllowedValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const fromDate = group.get('fromDate')?.value;
    const toDate = group.get('toDate')?.value;
    const fromTime = group.get('fromTime')?.value;
    const toTime = group.get('toTime')?.value;

    if (fromDate && toDate && fromDate === toDate) {
      if (fromTime && toTime && fromTime === toTime) {
        group.get('toTime')?.setErrors({ sameTimeNotAllowed: true });
        return { sameTimeNotAllowed: true };
      }
    }

    // Remove error if condition not met
    if (group.get('toTime')?.hasError('sameTimeNotAllowed')) {
      group.get('toTime')?.setErrors(null);
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

        if (diffHrs >0 && diffHrs <=4) {
          this.leaveForm.get('duration')?.setValue('0.5 day');
        } else if(diffHrs >4 && diffHrs <8) {
          this.leaveForm.get('duration')?.setValue('1 day');
        } else if(diffHrs ==0){
          this.leaveForm.get('duration')?.setValue('0 day');
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
    this.featureCommonService
      .getDropdownLists('TIME')
      .subscribe((data) => (this.time$ = of(data)));
    // .subscribe((data:any[])=>())
  }

  apply() {
    this.leaveForm.get('empCode')?.patchValue(this.loggedInUser.empCode);

    if (this.leaveForm.valid) {
      const leaveData = {
        ...this.leaveForm.value,
        name: this.loggedInUser?.name || 'Anonymous',
        designation: this.loggedInUser?.designation || 'Employee',
        profile:
          this.loggedInUser?.profile || 'https://i.pravatar.cc/150?img=8',
      };

      this.leaveManagementService
        .saveEmployeeLeaveRequest(leaveData)
        .subscribe({
          next: () => {
            this.buildForm();
            this.leaveForm.reset();
            this.leaveForm.disable();
            this.sharedService.setIsValidation(false);
            this.isEditable = false;
            this.showTimeFields = false;
            this.toastr.success('Leave Applied Successfully!', 'Success');
          },
          error: (err: any) => {
            const errorMessage =
              err?.error?.message ||
              'Something went wrong while applying leave';
            this.toastr.error(errorMessage, 'Error');
          },
        });
    } else {
      const validationMessages =
        this.formUtilServiceService.parseValidationErrors(
          this.leaveForm.controls,
          this.leaveFormEntity
        );

        const toDateControl = this.leaveForm.get('toDate');
          if (toDateControl?.hasError('dateBeforeFromDate')) {
            validationMessages.push({ content: 'To Date cannot be before From Date.' });
          }
        
           if (this.leaveForm.hasError('sameTimeNotAllowed')) {
            validationMessages.push({ content: 'From Time and To Time cannot be the same' });
          }

      const uniqueMessages = validationMessages
        .filter(
          (item, index, array) =>
            index === array.findIndex((el) => el.content === item.content)
        )
        .map((err) => err.content);

      this.openValidationSlider(uniqueMessages);
    }
  }
  startApplying() {
    this.isEditable = true;
    this.leaveForm.enable();
  }
  cancelApplying() {
    if(this.leaveForm.dirty){
          const modalRef = this.modalService.open(CoreModalComponent, {
      backdrop: 'static',
      size: 'md',
      keyboard: false,
    });
    modalRef.componentInstance.header = 'Cancel Apply';
    modalRef.componentInstance.content =
      'Are you sure you want to cancel applying?';
    modalRef.componentInstance.isYesOrNo = true;

    modalRef.componentInstance.eventHandler$.subscribe((result: string) => {
      if (result === 'Proceed') {
        // this.leaveForm.reset();
        this.formBuilder();
        this.leaveForm.disable();
        this.isEditable = false;
        // this.sharedService.setIsValidation(false);
        this.showTimeFields = false;
        this.clearValidation();
      }
      modalRef.close();
    });
    }else{
       this.formBuilder();
        this.leaveForm.disable();
        this.isEditable = false;
        this.showTimeFields = false;
        this.clearValidation();
    }

  }


  buildForm() {
    this.leaveForm = this.formUtilServiceService.buildReactiveForm(
      this.leaveFormEnitity
    );
  }

  clearValidation() {
    this.sharedService.setValidationSubject(null);
    this.sharedService.setValidationSliderSubject(false);
  }

  openValidationSlider(validation: any) {
    this.sharedService.setValidationSliderSubject(true);
    this.sharedService.setValidationSubject(validation);
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }


}

@Component({
  selector: 'app-update-leave',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="modal-header">
      <h5 class="modal-title">Update Leave</h5>
      <button
        type="button"
        class="btn-close"
        aria-label="Close"
        (click)="close()"
      ></button>
    </div>
    <div class="modal-body">
      <div class="mt-3">
        <div>
<form class="mt-2" [formGroup]="leaveForm" >
  <div class="leave-form-grid">

    <!-- Leave Type -->
    <div class="mt-2">
      <label for="leaveType" class="form-label">Leave Type</label>
      <select id="leaveType" formControlName="leaveType" class="form-select form-control" required
        [ngClass]="{ required: leaveForm.controls['leaveType'].errors && leaveForm.controls['leaveType']}">
        <option value="" disabled>Select Leave Type</option>
        <option *ngFor="let leaveType of leaveType$ | async" [ngValue]="leaveType.code">
          {{ leaveType.screenName }}
        </option>
      </select>
    </div>

    <!-- From Date -->
    <div class="mt-2">
      <label for="fromDate" class="form-label">From Date</label>
      <input type="date" id="fromDate" class="form-control" formControlName="fromDate"
        [ngClass]="{ required: leaveForm.controls['fromDate'].errors && leaveForm.controls['fromDate']}" />
    </div>

    <!-- To Date -->
    <div class="mt-2">
      <label for="toDate" class="form-label">To Date</label>
      <input type="date" id="toDate" class="form-control" formControlName="toDate"
        [min]="leaveForm.get('fromDate')?.value"
        [ngClass]="{ required: leaveForm.controls['toDate'].errors && leaveForm.controls['toDate']}" />
      <!-- <small class="text-danger" *ngIf="leaveForm.get('toDate')?.hasError('dateBeforeFromDate')">
        To Date cannot be before From Date.
      </small> -->
    </div>

    <!-- From Time -->
    <div *ngIf="showTimeFields">
      <label class="form-label mt-2">From Time</label>
      <select class="form-select form-control" formControlName="fromTime"
        [ngClass]="{ required: leaveForm.controls['fromTime'].errors && leaveForm.controls['fromTime']}">
        <option value="" disabled>Select From Time</option>
        <option *ngFor="let time of time$ | async" [ngValue]="time.code">
          {{ time.screenName }}
        </option>
      </select>
    </div>

    <!-- To Time -->
    <div *ngIf="showTimeFields">
      <label class="form-label mt-2">To Time</label>
      <select class="form-select form-control" formControlName="toTime"
        [ngClass]="{ required: leaveForm.controls['toTime'].errors && leaveForm.controls['toTime']}">
        <option value="" disabled>Select To Time</option>
        <option *ngFor="let time of time$ | async" [ngValue]="time.code">
          {{ time.screenName }}
        </option>
      </select>
    </div>

    <!-- Total Hours -->
    <div *ngIf="showTimeFields">
      <label class="form-label mt-2">Total Hours</label>
      <input type="number" class="form-control" formControlName="totalHours" readonly />
    </div>

    <!-- Duration -->
    <div>
      <label class="form-label mt-2">Duration</label>
      <input type="text" class="form-control" formControlName="duration" readonly />
    </div>

    <!-- Reason -->
    <div class="full-width mt-2">
      <label for="reason" class="form-label">Reason</label>
      <textarea id="reason" class="form-control" formControlName="reason" rows="3" maxlength="5000"
        [ngClass]="{ required: leaveForm.controls['reason'].errors && leaveForm.controls['reason']}"></textarea>
    </div>
  </div>

</form>

        </div>
      </div>
    </div>
    <div class="modal-footer d-flex justify-content-evenly">
      <button
        type="button"
        class="btn btn-sm btn-warn"
        (click)="activeModal.close('Close click')"
      >
        Cancel
      </button>
      <button type="button" class="btn btn-sm btn-warn" (click)="update()">
        Update
      </button>
    </div>
  `,
  styleUrls: ['./apply-leave.component.css'],
})
export class UpdateLeaveComponent implements OnInit {
  @Input() leaveData: any;
  @Input() header: any;
  @Input() content: any;
  @Output() eventHandler$ = new EventEmitter();

  public validationErrors$: any;
  loggedInUser: any;
  leaveForm!: FormGroup;
  leaveFormEnitity: any = leaveFormObject;
  leaveType$!: Observable<any>;
  showTimeFields = false;

  time$!: Observable<any>;
  validationErrors: any;

  constructor(
    private fb: FormBuilder,
    private featureCommonService: FeatureCommonServiceService,
    private formUtilServiceService: FormUtilServiceService,
    private leaveManagementService: LeaveManagementServiceService,
    public activeModal: NgbActiveModal,
    private store: Store,
    private sharedService:SharedService,
    private modalService : NgbModal,
  ) {
    this.store.select(selectAuthUser).subscribe((user: any) => {
      if (user) {
        this.loggedInUser = user;
      }
    });
  }

  ngOnInit(): void {
    this.formBuilder();
    this.loadDropdowns()
    // this.featureCommonService
    //   .getDropdownLists('LEAVETYPE')
    //   .subscribe((data) => {
    //     this.leaveType$ = of(data);

    //     //  dropdown values are loaded, patch the form
        if (this.leaveData) {
          this.leaveForm.patchValue(this.leaveData);
        }
    //   });
  }

  formBuilder() {
    this.leaveForm = this.formUtilServiceService.buildReactiveForm(
      this.leaveFormEnitity
    );
    this.leaveForm.setValidators([
      this.toDateAfterFromDateValidator(),
      this.sameTimeNotAllowedValidator()
    ]);

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

  sameTimeNotAllowedValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const fromDate = group.get('fromDate')?.value;
    const toDate = group.get('toDate')?.value;
    const fromTime = group.get('fromTime')?.value;
    const toTime = group.get('toTime')?.value;

    if (fromDate && toDate && fromDate === toDate) {
      if (fromTime && toTime && fromTime === toTime) {
        group.get('toTime')?.setErrors({ sameTimeNotAllowed: true });
        return { sameTimeNotAllowed: true };
      }
    }

    // Remove error if condition not met
    if (group.get('toTime')?.hasError('sameTimeNotAllowed')) {
      group.get('toTime')?.setErrors(null);
    }

    return null;
  };
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

        if (diffHrs >0 && diffHrs <=4) {
          this.leaveForm.get('duration')?.setValue('0.5 day');
        } else if(diffHrs >4 && diffHrs <8) {
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
      this.featureCommonService
      .getDropdownLists('TIME')
      .subscribe((data) => (this.time$ = of(data)));
  }

  apply() {
    this.leaveForm.get('empCode')?.patchValue(this.loggedInUser.empCode); // Set empCode FIRST
    if (this.leaveForm.valid) {
      const leaveData = this.leaveForm.value;
      this.leaveManagementService
        .saveEmployeeLeaveRequest(leaveData)
        .subscribe({});
    } else {
      this.leaveForm.markAllAsTouched();
    }
  }
  update() {
    if(this.leaveForm.invalid){

        const validationMessages =
        this.formUtilServiceService.parseValidationErrors(
          this.leaveForm.controls,
          this.leaveFormEnitity
        );
      
     const toDateControl = this.leaveForm.get('toDate');
          if (toDateControl?.hasError('dateBeforeFromDate')) {
            validationMessages.push({ content: 'To Date cannot be before From Date.' });
          }
          if (this.leaveForm.hasError('sameTimeNotAllowed')) {
            validationMessages.push({ content: 'From Time and To Time cannot be the same' });
          }

      const uniqueMessages = validationMessages
        .filter(
          (item, index, array) =>
            index === array.findIndex((el) => el.content === item.content)
        )
        .map((err) => err.content);

        this.sharedService.setValidationSubject(uniqueMessages);

        this.validationErrors$ = this.sharedService.getValidationSubject();
        this.validationErrors$?.subscribe((data: any) => {
          this.validationErrors = data;
        });


      const validationModal = this.modalService.open(ValidationCoreModelComponent,{
        backdrop:'static',
        keyboard:false
      })

      validationModal.componentInstance.header = "Validations"
      validationModal.componentInstance.errors = this.validationErrors
    }else{
      const payload = {
      type: 'UPDATE',
      value: this.leaveForm.getRawValue(),
    };
    this.eventHandler$.emit(payload);
    }
  }
close() {
    const modalRef = this.modalService.open(CoreModalComponent, {
      backdrop: 'static',
      keyboard: false,
    });

    modalRef.componentInstance.header = 'Cancel Update';
    modalRef.componentInstance.content = 'Do you want to discard unsaved changes?';
    modalRef.componentInstance.isYesOrNo = true;

    modalRef.componentInstance.eventHandler$.subscribe((result: string) => {
      if (result === 'Proceed') {
        this.leaveForm.reset(this.leaveData); 
        this.activeModal.close('Close click'); 
      }
      modalRef.close();
    });
  } 
}


