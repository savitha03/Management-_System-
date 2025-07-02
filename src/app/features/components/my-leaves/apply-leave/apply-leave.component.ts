import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-apply-leave',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './apply-leave.component.html',
  styleUrls: ['./apply-leave.component.css']
})
export class ApplyLeaveComponent implements OnInit {

  leaveForm!:FormGroup;

  

  constructor(private fb:FormBuilder){
    this.leaveForm=this.fb.group({
      typeName:['',Validators.required],
      startDate:['',Validators.required],
      endDate:['',Validators.required],
      reason:['',Validators.required]
    })
  }

  ngOnInit(): void {
  
  }
  apply() {
    if(this.leaveForm.valid){
    console.log('Leave Application Submitted:', this.leaveForm.value);
    this.leaveForm.reset();
    }
    else{
      this.leaveForm.markAllAsTouched();
    }


  }
}
