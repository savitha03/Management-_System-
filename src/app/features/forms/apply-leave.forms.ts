import { v4 as uuidv4 } from 'uuid';

export const leaveFormObject: any = {

    empCode: {
    id: uuidv4(),
    label: 'Employee Code',
    value: '',
    type: 'Hidden Field',
    validations: null,
    disabled: false,
  },
    leaveType: {
    id: uuidv4(),
    label: 'Leave Type',
    value: '',
    type: 'InputText',
    validations: [
      {
        validator: 'required',
        value: true,
        message: 'Leave Type should be selected',
      }
    ],
    disabled: false,
  },
    fromDate: {
    id: uuidv4(),
    label: 'From Date',
    value: '',
    type: 'Date',
    validations: [
      {
        validator: 'required',
        value: true,
        message: 'From Date should be selected',
      }
    ],
    disabled: false,
  },
    toDate: {
    id: uuidv4(),
    label: 'To Date',
    value: '',
    type: 'Date',
    validations: [
      {
        validator: 'required',
        value: true,
        message: 'To Date should be selected',
      }
    ],
    disabled: false,
  },
    fromTime: {
    id: uuidv4(),
    label: 'From Time',
    value: '',
    type: 'InputText',
    validations: [],
    disabled: false,
  },
  toTime: {
    id: uuidv4(),
    label: 'To Time',
    value: '',
    type: 'InputText',
    validations: [],
    disabled: false,
  },
  totalHours: {
    id: uuidv4(),
    label: 'Total Hours',
    value: '',
    type: 'InputText',
    validations:[],
    disabled: false,
  },
  duration: {
    id: uuidv4(),
    label: 'Duration',
    value: '',
    type: 'InputText',
    validations: [
      {
        validator: 'required',
        value: true,
        message: 'Duration should not be blank',
      }
    ],
    disabled: false,
  },
    reason: {
    id: uuidv4(),
    label: 'Reason',
    value: '',
    type: 'InputText',
    validations: [
      {
        validator: 'required',
        value: true,
        message: 'Reason should be mentioned',
      }
    ],
    disabled: false,
  },
  
};
