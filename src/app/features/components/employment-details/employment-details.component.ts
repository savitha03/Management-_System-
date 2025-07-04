import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-employment-details',
  imports: [ReactiveFormsModule,CommonModule,FormsModule],
  templateUrl: './employment-details.component.html',
  styleUrl: './employment-details.component.css'
})
export class EmploymentDetailsComponent implements OnInit {

  activeTab='job';
  jobForm!: FormGroup;
  salaryForm!: FormGroup;
  

  
  constructor(private fb:FormBuilder){}

  ngOnInit(): void { 
    this.formBuilder();
  }

   switchTab(tab: string) {
    this.activeTab = tab;
  }

  onSubmit(){ 
  }


  formBuilder(){
     this.jobForm = this.fb.group({
      empId: [''],
      jobTitle: ['', Validators.required],
      employmentStatus:[{value:'', disabled:true},Validators.required],
      joinedDate: ['', Validators.required],
      skillset: ['', Validators.required]
    });

    this.salaryForm=this.fb.group({
      empId:[''],
      payGrade:['',Validators.required],
      currency:[{value:'',disabled:true},Validators.required],
      basicSalary:['',Validators.required],
      payFrequency:[{value:'',disabled:true},Validators.required]
    })
  }

}
