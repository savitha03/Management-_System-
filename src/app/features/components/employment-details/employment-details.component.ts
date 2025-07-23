import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DetailsServiceService } from '../../services/details-service.service';

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
  

  
  constructor(private fb:FormBuilder, private detailsService:DetailsServiceService){}

  ngOnInit(): void { 
    this.formBuilder();
    const employeeId = "T2506"
    this.loadEmployeeData(employeeId);
  }

   switchTab(tab: string) {
    this.activeTab = tab;
  }

  onSubmit(){ 
  }


  formBuilder(){
     this.jobForm = this.fb.group({
      empCode: [''],
      jobTitle: ['', Validators.required],
      employmentStatus:['',Validators.required],
      joinedDate: ['', Validators.required],
      skillset: ['', Validators.required]
    });

    this.salaryForm=this.fb.group({
      empCode:[''],
      payGrade:['',Validators.required],
      currency:['',Validators.required],
      basicSalary:['',Validators.required],
      payFrequency:['',Validators.required]
    })
  }

 loadEmployeeData(empId: any) {
  this.detailsService.getEmployeeJobDetails(empId).subscribe((data: any) => {
    const formData = {
      ...data,
      joinedDate: data.joinedDate ? this.formatDateString(data.joinedDate) : ''
    };
    this.jobForm.patchValue(formData);
  });

  this.detailsService.getEmployeeSalaryDetails(empId).subscribe((data: any) => {
    this.salaryForm.patchValue(data);
  });
}

// Helper method
formatDateString(dateStr: string): string {
  const [month, day, year] = dateStr.split(' ')[0].split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

}
