import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-personal-details',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.css']
})
export class PersonalDetailsComponent implements OnInit {
  activeTab = 'employee';
  employeeForm!: FormGroup;
  contactForm!: FormGroup;
  teamsForm!:FormGroup;

  constructor(private fb: FormBuilder) {

  }
  ngOnInit(): void {
    this.formBuilder();
      
  }

  switchTab(tab: string) {
    this.activeTab = tab;
  }

  


  // onSubmit() {
  //   if (this.activeTab === 'employee') {
  //     console.log('Employee Details:', this.employeeForm.value);
  //   } else {
  //     console.log('Contact Details:', this.contactForm.value);
  //   }
  // }

  formBuilder(){
    this.employeeForm = this.fb.group({
      employeeId: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dob:['',Validators.required],
      gender:[{ value: '', disabled: true },Validators.required],

      maritalStatus:[{ value: '', disabled: true },Validators.required],
      nationality:[{ value: '', disabled: true },Validators.required]
    });

    // this.employeeForm.disable();

    this.contactForm=this.fb.group({
      employeeId:[null],
      phoneNumber:['',[Validators.required,Validators.pattern(/^\d{10}$/)]],
      alternateNumber:['',[Validators.required,Validators.pattern((/^\d{10}$/))]],
      email:['',[Validators.required,Validators.email]],
      streetAddress:['',Validators.required],
      city:['',Validators.required],
      state:['',Validators.required],
      zipCode:['',Validators.required],
      country:['',Validators.required]
    });

    this.teamsForm=this.fb.group({
      employeeId:[null],
      role:[{ value: '', disabled: true },Validators.required],
      teamManager:[{value:'',disabled:true},Validators.required],
      projectManager:[{value:'',disabled:true},Validators.required],
      teamLead:[{value:'',disabled:true},Validators.required]
    })

  }
}


