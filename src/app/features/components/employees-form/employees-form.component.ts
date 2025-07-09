import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgScrollbarModule } from 'ngx-scrollbar';

@Component({
  selector: 'app-employees-form',
  imports: [ReactiveFormsModule,CommonModule, NgScrollbarModule],
  templateUrl: './employees-form.component.html',
  styleUrl: './employees-form.component.css'
})
export class EmployeesFormComponent implements OnInit{

   activeTab = 'personal';
   detailsForm!:FormGroup;

   constructor(private fb:FormBuilder){}

  ngOnInit(): void {
    this.formBuilder();
  }

   switchTab(tab: string) {
    this.activeTab = tab;
  }

  formBuilder(){
    this.detailsForm=this.fb.group({
      employeeId: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dob:['',Validators.required],
      gender:[{ value: '' },Validators.required],
      maritalStatus:[{ value: '' },Validators.required],
      nationality:[{ value: '' },Validators.required],
      phoneNumber:['',[Validators.required,Validators.pattern(/^\d{10}$/)]],
      alternateNumber:['',[Validators.pattern((/^\d{10}$/))]],
      email:['',[Validators.required,Validators.email]],
      streetAddress:['',Validators.required],
      city:['',Validators.required],
      state:['',Validators.required],
      zipCode:['',Validators.required],
      country:['',Validators.required],
      role:[{ value: '' },Validators.required],
      teamManager:[{value:'',disabled:true},Validators.required],
      projectManager:[{value:'',disabled:true},Validators.required],
      teamLead:[{value:'',disabled:true},Validators.required],
      jobTitle: ['', Validators.required],
      employmentStatus:[{value:'', disabled:true},Validators.required],
      joinedDate: ['', Validators.required],
      skillset: ['', Validators.required],
      payGrade:['',Validators.required],
      currency:[{value:'',disabled:true},Validators.required],
      basicSalary:['',Validators.required],
      payFrequency:[{value:'',disabled:true},Validators.required]
    });
  }
}
