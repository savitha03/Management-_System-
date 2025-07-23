import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DetailsServiceService } from '../../services/details-service.service';

@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-details.component.html',
  styleUrl: './employee-details.component.css'
})
export class EmployeeDetailsComponent implements OnInit {
  personalForm!: FormGroup;
  contactForm!: FormGroup;
  isAdmin: boolean = false;
  loading: boolean = false;
  activeTab: string = 'personal'; // default tab

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.activeTab = 'personal';  // ensure default tab always set
    this.buildForm();

   
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  onSubmitPersonal() {
    if (this.personalForm.valid) {
     
    } else {
      this.personalForm.markAllAsTouched();
    }
  }

  onSubmitContact() {
    if (this.contactForm.valid) {
    
    } else {
      this.contactForm.markAllAsTouched();
    }
  }

  buildForm() {
    this.personalForm = this.fb.group({
      employeeId: ['', Validators.required],
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      dob: ['', Validators.required],
      gender: ['', Validators.required],
      maritalStatus: ['', Validators.required],
      nationality: ['', Validators.required]
    });

    this.contactForm = this.fb.group({
      employeeId: [null],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      alternateNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipcode: ['', Validators.required],
      country: ['', Validators.required]
    });
  }


}
