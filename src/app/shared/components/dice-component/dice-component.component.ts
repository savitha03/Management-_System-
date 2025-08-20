import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { IApplicationEvent, SharedService } from '../../services/shared.service';

export interface IDiceMenu {
  codeCode: string;
  screenName: string;
  actionType: string;
}


@Component({
  selector: 'app-dice-component',
  imports: [NgbModule, CommonModule],
  templateUrl: './dice-component.component.html',
  styleUrl: './dice-component.component.css',
})
export class DiceComponentComponent implements ICellRendererAngularComp {
  position: 'right' | 'left' = 'right';
  @Input() disabled = false;
   @Input() rowNode: any; 
  item: any;
  actionLinks: IDiceMenu[] | any;
  // actionLinks: any[] = [
  //   {
  //     screenName: 'NA',
  //   },
  //   {
  //     screenName: 'Delete',
  //   },
  // ];

  constructor(private sharedService: SharedService) {}

  params: any;

   agInit(params: any): void {
    this.params = params;

    // Access what you passed in cellRendererParams
    this.item = params.item;
    this.actionLinks = params.actionLinks;
  }

  refresh(params: any): boolean {
    this.params = params;
    return true;
  }

  onClick() {
    alert('Dice clicked! ' + this.params.value);
  }

onActionClick(actionLinks: any[]) {
  const event: IApplicationEvent = {
    name: 'DICE_MENU_CLICK',
    component: 'EmployeesComponent',
    value: {
      item: this.item,
      rowNode: this.params?.node, // keep rowNode so delete works
      actionLinks
    }
  };
  this.sharedService.emitAnEvent(event);
}

triggerEvent(link: any) {
  if (link.codeCode === 'DELETE') {
    const event: IApplicationEvent = {
      name: 'DELETE_NEW_ROW',
      component: 'EmployeesComponent',
      value: { item: this.item, rowNode: this.params?.node }
    };
    this.sharedService.emitAnEvent(event);
  }
}


}
