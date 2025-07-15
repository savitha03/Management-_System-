import { Injectable } from '@angular/core';
import { FormBuilder, ValidatorFn, Validators } from '@angular/forms';

 interface IFormObject {
  [key: string]: IFormField | any;
}

 interface IFormField {
  id: any;
  label: string | any;
  value: any;
  type:
    | 'FormArray'
    | 'ChildForm'
    | 'InputText'
    | 'ComboBox'
    | 'CheckBox'
    | 'RadioBox'
    | 'TextArea'
    | 'DateField'
    | 'Hidden'
    | string
    | any;
  subForm: any;
  validations: any;
  disabled: boolean | any;
}

@Injectable({
  providedIn: 'root'
})

export class FormUtilServiceService {

  constructor(private formBuilder:FormBuilder) { }

  buildReactiveForm(formObjects:IFormObject){
    const group=this.formBuilder.group({});
    for(const[key,formObject] of Object.entries(formObjects)){
      switch(formObject.type){
        case 'FormGroup':
          group.addControl(key,this.buildFormGroup(formObject.subForm));
          break;
        default:
          group.addControl(
            key,
            this.formBuilder.control(formObject.value, this.buildFormControlValitaion(formObject.validations))
          );
          break;
      }
    }
    return group;
  }
  
  buildFormGroup(formObjects:IFormObject, fval:any=null){
    const group = this.formBuilder.group({});
    for (const[key,object]of Object.entries(formObjects)){
      group.addControl(
        key,
        this.formBuilder.control(
          {
            value:fval===null? object.value:fval[key],
            disabled:object.disabled,
          },
          this.buildFormControlValitaion(object.validations)
        )
      );
    }
    return group;
  }

  buildFormControlValitaion(validations:any[]){
    const controlValidations:ValidatorFn[]=[];
    if(validations!==null){
      validations.forEach(validations=>{
        controlValidations.push(this.setValidator(validations.validator,validations.value))
      });
    }
    return controlValidations;
  }


  private setValidator(type: string, value: any) {
    switch (type) {
      case 'min': {
        return Validators.min(value);
      }
      case 'max': {
        return Validators.max(value);
      }
      case 'required': {
        return Validators.required;
      }
      case 'requiredTrue': {
        return Validators.requiredTrue;
      }
      case 'email': {
        return Validators.email;
      }
      case 'minLength': {
        return Validators.minLength(value);
      }
      case 'maxLength': {
        return Validators.maxLength(value);
      }
      case 'pattern': {
        return Validators.pattern(value);
      }
      default: {
        return Validators.nullValidator;
      }
    }
  }
}
