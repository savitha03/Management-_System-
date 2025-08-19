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

  onActionClick() {
    const event: IApplicationEvent = {
      name: 'DICE_MENU_CLICK',
      component: 'AgencyInfoComponent',
      value: this.item,
    };
    this.sharedService.emitAnEvent(event);
  }

  triggerEvent(link: any) {
    // const event: IApplicationEvent = {
    //   name: link.codeCode,
    //   component: 'DiceMenuComponentNewVersion',
    //   value: { ...this.item, index: this.index, hostComponent: this.hostComponent },
    // };
    // this.applicationEventService.emitAnEvent(event);
  }

}
