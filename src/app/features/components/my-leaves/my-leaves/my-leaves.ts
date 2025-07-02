import { Component } from '@angular/core';
import { LeaveHistory } from '../leave-history/leave-history';
import { LeaveSummary } from '../leave-summary/leave-summary';
import { LeaveCards } from '../../../../shared/components/leave-cards/leave-cards';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-my-leaves',
  imports: [RouterModule],
  templateUrl: './my-leaves.html',
  styleUrl: './my-leaves.css',
})
export class MyLeaves {}
