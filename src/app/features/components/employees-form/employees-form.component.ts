import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgScrollbarModule } from 'ngx-scrollbar';

@Component({
  selector: 'app-employees-form',
  imports: [ReactiveFormsModule, CommonModule, NgScrollbarModule],
  templateUrl: './employees-form.component.html',
  styleUrl: './employees-form.component.css',
})
export class EmployeesFormComponent implements OnInit {
  @Input() detailsForm: any;
  @Input() activeTab: any;
  @Input() isEdit:any;
  @Output() activeTabEmit = new EventEmitter();

  // personalForm!:FormGroup;
  // employeeForm!:FormGroup;

  employmentTabEnabled: boolean = false;

  constructor() {}

  ngOnInit(): void {
    this.detailsForm.get('employeeId').setErrors(true);
    console.log(this.detailsForm);
  }
  navButtons(value: any) {
    if (value === 'next') {
      this.activeTab = 'employment';
    } else if (value === 'previous') {
      this.activeTab = 'personal';
    } else {
    }
    this.activeTabEmitter();
  }

  activeTabEmitter() {
    this.activeTabEmit.emit(this.activeTab);
  }

  activatePersonalTab() {
    this.activeTab = 'personal';
  }

  // get isPersonalDetailsValid():boolean{
  //   const personalControls=[
  //   'employeeId', 'empStatus', 'firstName', 'lastName',
  //   'dob', 'gender', 'maritalStatus', 'nationality',
  //   'phoneNumber', 'alternateNumber', 'email',
  //   'streetAddress', 'city', 'state', 'zipCode', 'country',
  //   'role', 'teamManager', 'projectManager', 'teamLead'
  //   ];
  //   return personalControls.every(field=>this.detailsForm.controls[field]?.valid);
  // }

  // get isEmployeeDetailsValid():boolean{
  //   const employeeControls=[
  //     'jobTitle','employmentStatus','joinedDate','skillset',
  //     'payGrade','currency','basicSalary','payFrequency'
  //   ];
  //   return employeeControls.every(field=>this.detailsForm.controls[field]?.valid);
  // }

  // next() {
  //   if (this.detailsForm.valid) {
  //     console.log('Leave Application Submitted:', this.detailsForm.value);
  //     this.detailsForm.reset();
  //   } else {
  //     this.detailsForm.markAllAsTouched();
  //   }
  // }


}
