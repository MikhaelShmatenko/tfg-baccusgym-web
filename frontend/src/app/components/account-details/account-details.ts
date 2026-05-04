import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user-service';
import { UserDetails } from '../../interfaces/user-details';

@Component({
  selector: 'app-account-details',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './account-details.html',
  styleUrl: './account-details.css',
})
export class AccountDetails implements OnInit {
  userDetails: UserDetails | null = null;
  calculatedRemainingDays: number | string = 0;

  constructor(
    private userService: UserService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.userService.getUserDetails().subscribe({
      next: (data) => {
        this.userDetails = data;
        this.calculateRemainingDays();
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching user details:', err);
      },
    });
  }

  calculateRemainingDays(): void {
    if (!this.userDetails) {
      return;
    }

    if (this.userDetails.end_date) {
      const endDate = new Date(this.userDetails.end_date);
      const today = new Date();
      const timeDiff = endDate.getTime() - today.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      this.calculatedRemainingDays = daysDiff >= 0 ? daysDiff : 0;
    } else if (this.userDetails.remaining_days !== null) {
      this.calculatedRemainingDays = this.userDetails.remaining_days;
    } else {
      this.calculatedRemainingDays = 'N/A';
    }
  }
}
