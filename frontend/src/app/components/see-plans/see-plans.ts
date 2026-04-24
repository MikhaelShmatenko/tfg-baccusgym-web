import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { PlansService } from '../../services/plans-service';
import { Plan } from '../../interfaces/plan';

@Component({
  selector: 'app-see-plans',
  standalone: true,
  imports: [],
  templateUrl: './see-plans.html',
  styleUrl: './see-plans.css',
})
export class SeePlans implements OnInit {
  plans: Plan[] = [];
  private changeDetectorRef = inject(ChangeDetectorRef);

  constructor(private plansService: PlansService) {}

  ngOnInit(): void {
    this.plansService.getPlans().subscribe({
      next: (data) => {
        this.plans = data;
        console.log('Datos recibidos:', this.plans);
        this.changeDetectorRef.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching plans:', error);
      },
    });
  }
}
