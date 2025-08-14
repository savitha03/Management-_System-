import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { Observable } from 'rxjs';
import { CoreModalComponent } from '../../../shared/modals/core-modal/core-modal.component';
import { selectAuthUser } from '../../../auth/store/auth/login.selectors';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-employees-form',
  imports: [ReactiveFormsModule, CommonModule, NgScrollbarModule],
  templateUrl: './employees-form.component.html',
  styleUrl: './employees-form.component.css',
})
export class EmployeesFormComponent implements OnInit {
  @Input() detailsForm: any;
  @Input() activeTab!: string;
  @Input() isEdit: any;

  @Input() genderList$!: Observable<any>;
  @Input() empStatus$!: Observable<any>;
  @Input() maritalStatus$!: Observable<any>;
  @Input() emptStatus$!: Observable<any>;
  @Input() currency$!: Observable<any>;
  @Input() payFrequency$!: Observable<any>;
  @Input() role$!: Observable<any>;
  @Input() teamHRHead$!: Observable<any>;
  @Input() projectManager$!: Observable<any>;
  @Input() teamLead$!: Observable<any>;
  @Input() cityList$!: Observable<any>;
  @Input() stateList$!: Observable<any>;
  @Input() countryList$!: Observable<any>;

  @Output() activeTabEmit = new EventEmitter<any>();
  @Output() activeViewOrEdit = new EventEmitter<any>();
  @Output() handleAppEvent = new EventEmitter<any>();

  employmentTabEnabled: boolean = false;
  currentMode: 'Edit' | 'View' = 'View';
  form!: FormGroup
  



  constructor(private modalService: NgbModal, private store: Store,private fb: FormBuilder) {}

  ngOnInit(): void {}
  navButtons(value: any) {
    if (value === 'next') {
      this.activeTab = 'employment';
    } else if (value === 'previous') {
      this.activeTab = 'personal';
    } else if (value === 'save') {
      const event: any = {
        name: 'SAVE',
        component: 'EmployeesFormComponent',
        value: null,
      };
      this.handleAppEvent.emit(event);
    } else {
    }
    this.activeTabEmitter(value);
  }

  activeTabEmitter(value: any) {
    const payload = {
      btnValue: value,
      activeTab: this.activeTab,
    };
    this.activeTabEmit.emit(payload);
  }

  activatePersonalTab() {
    this.activeTab = 'personal';
  }

  viewOrEdit(mode: 'Edit' | 'View'): void {
    this.currentMode = mode;

    const event = {
      name: 'VIEW_OR_EDIT',
      component: 'EmployeesFormComponent',
      value: {
        mode: this.currentMode,
        detailsForm: this.detailsForm,
      },
    };

    this.handleAppEvent.emit(event);
  }
  
  unsavedChanges(callback: () => void): void {
  if (this.detailsForm?.dirty) {
    const saveChangesModal = this.modalService.open(CoreModalComponent, {
      backdrop: 'static',
      size: 'md',
      keyboard: false,
    });

    saveChangesModal.componentInstance.header = 'Confirmation';
    saveChangesModal.componentInstance.content = `You have unsaved changes. Do you want to discard them?`;
    saveChangesModal.componentInstance.isYesOrNo = true;

    saveChangesModal.componentInstance.eventHandler$.subscribe((data: any) => {
      if (data === 'Proceed') {
        this.detailsForm.reset(); // optionally reset form
        this.detailsForm.markAsPristine(); // clear dirty state
        callback(); // proceed with the action (e.g., navigate)
        saveChangesModal.close();
      }
    });
  } else {
    callback(); // no unsaved changes — proceed directly
  }
}

onSave() {
  // Save logic here
  this.handleAppEvent.emit({ type: 'EMPLOYEE_SAVED' });
}

}
