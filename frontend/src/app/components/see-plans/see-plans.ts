import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PlansService } from '../../services/plans-service';
import { Plan } from '../../interfaces/plan';

@Component({
  selector: 'app-see-plans',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './see-plans.html',
  styleUrl: './see-plans.css',
})
export class SeePlans implements OnInit {
  plans: Plan[] = [];

  constructor(
    private plansService: PlansService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.plansService.getPlans().subscribe({
      next: (data) => {
        this.plans = data;
        this.changeDetectorRef.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching plans:', error);
      },
    });
  }
}
