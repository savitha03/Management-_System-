import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { FeatureCommonServiceService } from '../../../services/feature-common-service.service';
import { end } from '@popperjs/core';

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
      fromTime: ['',Validators.required],
      toTime: ['',Validators.required],
      totalHours: ['',Validators.required],
      reason:['',Validators.required]
    });

    this.leaveForm.get('startDate')?.valueChanges.subscribe(()=>this.checkDateEquality());
    this.leaveForm.get('endDate')?.valueChanges.subscribe(()=>this.checkDateEquality());
  }
    showTimeFields=false;

    checkDateEquality(){
      const startDate = this.leaveForm.get('startDate')?.value;
      const endDate = this.leaveForm.get('endDate')?.value;

      this.showTimeFields = startDate && endDate && startDate===endDate ;
    }




  ngOnInit(): void {
  this.loadDropdowns();
  }
  apply() {
    if(this.leaveForm.valid){
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
