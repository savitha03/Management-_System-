
import { v4 as uuidv4 } from 'uuid';

export const detailsFormObject: any = {
  employeeId: {
    id: uuidv4(),
    label: 'Employee ID',
    value: '',
    type: 'InputText',
    validations: [
      {
        validator: 'required',
        value: true,
        message: 'Employee Code should not be blank',
      }
    ],
    disabled: false,
  },
  fullName: {
    id: uuidv4(),
    label: 'Full Name',
    value: '',
    type: 'InputText',
    validations: [
      {
        validator: 'required',
        value: true,
        message: 'Employee Name should not be blank',
      }
    ],
    disabled: false,
  },
  empStatus: {
    id: uuidv4(),
    label: 'Employment Status',
    value: 'ACTIVE',
    type: 'InputText',
    validations: [],
    disabled: false,
  },
  firstName: {
    id: uuidv4(),
    label: 'First Name',
    value: '',
    type: 'InputText',
    validations: [ {
        validator: 'required',
        value: true,
        message: 'Employee First Name should not be blank',
      }],
    disabled: false,
  },
  lastName: {
    id: uuidv4(),
    label: 'Last Name',
    value: '',
    type: 'InputText',
    validations: [ {
        validator: 'required',
        value: true,
        message: 'Employee Last Name should not be blank',
      }],
    disabled: false,
  },
  dob: {
    id: uuidv4(),
    label: 'Date of Birth',
    value: '',
    type: 'Date',
    validations: [{
        validator: 'required',
        value: true,
        message: 'Employee Date Of Birth should not be blank',
      }],
    disabled: false,
  },
  gender: {
    id: uuidv4(),
    label: 'Gender',
    value: '',
    type: 'InputText',
    validations: [{
        validator: 'required',
        value: true,
        message: 'Employee Gender should be selected',
      }],
    disabled: false,
  },
  maritalStatus: {
    id: uuidv4(),
    label: 'Marital Status',
    value: '',
    type: 'InputText',
    validations: [{
        validator: 'required',
        value: true,
        message: 'Employee Marital Status should be selected',
      }],
    disabled: false,
  },
  nationality: {
    id: uuidv4(),
    label: 'Nationality',
    value: '',
    type: 'InputText',
    validations: [{
        validator: 'required',
        value: true,
        message: 'Employee Nationality should be selected',
      }],
    disabled: false,
  },
  phoneNumber: {
    id: uuidv4(),
    label: 'Phone Number',
    value: '',
    type: 'InputText',
    validations: [{
        validator: 'required',
        value: true,
        message: 'Employee Phone number should not be blank',
      }],
    disabled: false,
  },
  alternateNumber: {
    id: uuidv4(),
    label: 'Alternate Number',
    value: '',
    type: 'InputText',
    validations: [],
    disabled: false,
  },
  email: {
    id: uuidv4(),
    label: 'Email',
    value: '',
    type: 'InputText',
    validations: [{
        validator: 'required',
        value: true,
        message: 'Employee email should not be blank',
      }],
    disabled: false,
  },
  streetAddress: {
    id: uuidv4(),
    label: 'Street Address',
    value: '',
    type: 'InputText',
    validations: [{
        validator: 'required',
        value: true,
        message: 'Employee Street Address should not be blank',
      }],
    disabled: false,
  },
  city: {
    id: uuidv4(),
    label: 'City',
    value: '',
    type: 'InputText',
    validations: [
      {
        validator: 'required',
        value: true,
        message: 'Employee City should not be blank',
      },
    ],
    disabled: false,
  },
  state: {
    id: uuidv4(),
    label: 'State',
    value: '',
    type: 'InputText',
    validations: [
      {
        validator: 'required',
        value: true,
        message: 'Employee State should not be blank',
      },
    ],
    disabled: false,
  },
  zipCode: {
    id: uuidv4(),
    label: 'Zip Code',
    value: '',
    type: 'InputText',
    validations: [
      {
        validator: 'required',
        value: true,
        message: 'Employee Zip Code should not be blank',
      },
    ],
    disabled: false,
  },
  country: {
    id: uuidv4(),
    label: 'Country',
    value: '',
    type: 'InputText',
    validations: [
      {
        validator: 'required',
        value: true,
        message: 'Employee Country should not be blank',
      },
    ],
    disabled: false,
  },
  role: {
    id: uuidv4(),
    label: 'Role',
    value: '',
    type: 'InputText',
    validations: [
      {
        validator: 'required',
        value: true,
        message: 'Employee Role should be selected',
      },
    ],
    disabled: false,
  },
  teamManager: {
    id: uuidv4(),
    label: 'Team Manager',
    value: '',
    type: 'InputText',
    validations: [
      {
        validator: 'required',
        value: true,
        message: 'Employee Team Manager should be selected',
      },
    ],
    disabled: false,
  },
  projectManager: {
    id: uuidv4(),
    label: 'Project Manager',
    value: '',
    type: 'InputText',
    validations: [
      {
        validator: 'required',
        value: true,
        message: 'Employee Project Manager should be selected',
      },
    ],
    disabled: false,
  },
  teamLead: {
    id: uuidv4(),
    label: 'Team Lead',
    value: '',
    type: 'InputText',
    validations: [
      {
        validator: 'required',
        value: true,
        message: 'Employee Team Lead should be selected',
      },
    ],
    disabled: false,
  },
  jobTitle: {
    id: uuidv4(),
    label: 'Job Title',
    value: '',
    type: 'InputText',
    validations: [
      {
        validator: 'required',
        value: true,
        message: 'Employee Job Title should not be blank',
      },
    ],
    disabled: false,
  },
  employmentStatus: {
    id: uuidv4(),
    label: 'Employment Status',
    value: '',
    type: 'InputText',
    validations: [
      {
        validator: 'required',
        value: true,
        message: 'Employee Employment Status should not be blank',
      },
    ],
    disabled: false,
  },
  joinedDate: {
    id: uuidv4(),
    label: 'Joined Date',
    value: '',
    type: 'Date',
    validations: [
      {
        validator: 'required',
        value: true,
        message: 'Employee Joined Date should not be blank',
      },
    ],
    disabled: false,
  },
  skillset: {
    id: uuidv4(),
    label: 'Skillset',
    value: '',
    type: 'InputText',
    validations: [
      {
        validator: 'required',
        value: true,
        message: 'Employee Skillset should not be blank',
      },
    ],
    disabled: false,
  },
  payGrade: {
    id: uuidv4(),
    label: 'Pay Grade',
    value: '',
    type: 'InputText',
    validations: [
      {
        validator: 'required',
        value: true,
        message: 'Employee Pay Grade should not be blank',
      },
    ],
    disabled: false,
  },
  currency: {
    id: uuidv4(),
    label: 'Currency',
    value: '',
    type: 'InputText',
    validations: [
      {
        validator: 'required',
        value: true,
        message: 'Employee Currency should be selected',
      },
    ],
    disabled: false,
  },
  basicSalary: {
    id: uuidv4(),
    label: 'Basic Salary',
    value: '',
    type: 'InputText',
    validations: [
      {
        validator: 'required',
        value: true,
        message: 'Employee Basic Salary should be selected',
      },
    ],
    disabled: false,
  },
  payFrequency: {
    id: uuidv4(),
    label: 'Pay Frequency',
    value: '',
    type: 'InputText',
    validations: [
      {
        validator: 'required',
        value: true,
        message: 'Employee Pay Frequency should be selected',
      },
    ],
    disabled: false,
  },
 };
