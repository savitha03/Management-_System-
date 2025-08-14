import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-dice-component',
  imports: [NgbModule, CommonModule],
  templateUrl: './dice-component.component.html',
  styleUrl: './dice-component.component.css',
})
export class DiceComponentComponent implements ICellRendererAngularComp {
  position: 'right' | 'left' = 'right';
  actionLinks: any[] = [
    {
      screenName: 'NA',
    },
    {
      screenName: 'Delete',
    },
  ];

  params: any;

  agInit(params: any): void {
    this.params = params;
  }

  refresh(params: any): boolean {
    this.params = params;
    return true;
  }

  onClick() {
    alert('Dice clicked! ' + this.params.value);
  }

  onActionClick(link: any) {
  if (link.screenName === 'Delete') {
    this.params.context.componentParent.deleteNewEmployeeRow(this.params.data);
  }
}

}
