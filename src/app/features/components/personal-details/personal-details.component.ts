import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DetailsServiceService } from '../../services/details-service.service';
import { a } from '@angular/cdk/bidi-module.d-D-fEBKdS';

@Component({
  selector: 'app-personal-details',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.css'],
})
export class PersonalDetailsComponent implements OnInit {
  activeTab = 'employee';
  employeeForm!: FormGroup;
  contactForm!: FormGroup;
  teamsForm!: FormGroup;
  selectedRow: any = null;

  constructor(
    private fb: FormBuilder,
    private detailsService: DetailsServiceService
  ) {}
  ngOnInit(): void {
    this.formBuilder();
    const employeeId = 'T2506';

    this.loadEmployeeData(employeeId);
  }
  //  const formData = {
  //     ...this.selectedRow,
  //     dateOfBirth: this.selectedRow.dateOfBirth
  //       ? this.selectedRow.dateOfBirth.split('T')[0]
  //       : ''
  //  }

  switchTab(tab: string) {
    this.activeTab = tab;
  }
  // onSubmit() {
  //   if (this.activeTab === 'employee') {
  //   } else {
  //   }
  // }

  formBuilder() {
    this.employeeForm = this.fb.group({
      empCode: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dob: ['', Validators.required],
      gender: ['', Validators.required],
      maritalStatus: ['', Validators.required],
      nationality: ['', Validators.required],
    });

    // this.employeeForm.disable();

    this.contactForm = this.fb.group({
      empCode: [null],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      alternateNumber: [
        '',
        [Validators.required, Validators.pattern(/^\d{10}$/)],
      ],
      email: ['', [Validators.required, Validators.email]],
      streetAddress: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required],
      country: ['', Validators.required],
    });

    this.teamsForm = this.fb.group({
      empCode: [null],
      role: ['', Validators.required],
      teamAndHrHead: ['', Validators.required],
      projectManager: ['', Validators.required],
      teamLead: ['', Validators.required],
    });
  }

  loadEmployeeData(empId: any) {
    this.detailsService
      .getEmployeePersonalDetails(empId)
      .subscribe((data: any) => {
        const formData = {
          ...data,
          dob: data.dob ? data.dob.split('T')[0] : '',
        };
        this.employeeForm.patchValue(formData);
      });
    // this.detailsService.getEmployeePersonalDetails(empId).subscribe((data:any)=>{
    //   this.employeeForm.patchValue(data);
    // });
    this.detailsService
      .getEmployeeContactDetails(empId)
      .subscribe((data: any) => {
        this.contactForm.patchValue(data);
      });
    this.detailsService.getEmployeeTeamDetails(empId).subscribe((data: any) => {
      this.teamsForm.patchValue(data);
    });
  }
}
