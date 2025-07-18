import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { FeatureCommonServiceService } from '../../../services/feature-common-service.service';

@Component({
  selector: 'app-apply-leave',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './apply-leave.component.html',
  styleUrls: ['./apply-leave.component.css']
})
export class ApplyLeaveComponent implements OnInit {

  leaveForm!:FormGroup;

  leaveType$!:Observable<any>;

  constructor(private fb:FormBuilder , private featureCommonService:FeatureCommonServiceService){
    this.leaveForm=this.fb.group({
      typeName:['',Validators.required],
      startDate:['',Validators.required],
      endDate:['',Validators.required],
      reason:['',Validators.required]
    })
  }

  ngOnInit(): void {
  this.loadDropdowns();
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

  loadDropdowns(){
     this.featureCommonService
      .getDropdownLists('LEAVETYPE')
      .subscribe((data) => {
         this.leaveType$ = of(data);
      });
  }
}
