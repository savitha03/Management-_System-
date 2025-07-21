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
  //   } else {
  //   }
  // }

  formBuilder(){
    this.employeeForm = this.fb.group({
      employeeId: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dob:['',Validators.required],
      gender:['',Validators.required],

      maritalStatus:['',Validators.required],
      nationality:['',Validators.required]
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
      role:['',Validators.required],
      teamManager:['',Validators.required],
      projectManager:['',Validators.required],
      teamLead:['',Validators.required]
    })

  }
}


