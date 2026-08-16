import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
  inject,
  signal,
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { Chart, ChartConfiguration, registerables } from 'chart.js';

import { DashboardService } from '../../services/admin-dashboard-service';

import { DashboardStatistics, LowStockBook } from '../../interface/admin-dashboard';

Chart.register(...registerables);

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit, AfterViewInit {
  private readonly dashboardService = inject(DashboardService);

  // Signals

  dashboardStatistics = signal<DashboardStatistics | null>(null);

  lowStockBooks = signal<LowStockBook[]>([]);

  isLoading = signal(false);

  errorMessage = signal('');

  // Chart Canvas References

  @ViewChild('revenueChart')
  revenueChart!: ElementRef;

  @ViewChild('ordersChart')
  ordersChart!: ElementRef;

  private revenueChartInstance?: Chart;

  private ordersChartInstance?: Chart;

  // Lifecycle

  ngOnInit(): void {
    this.loadDashboardStatistics();
  }

  ngAfterViewInit(): void {
    // Charts are created after dashboard data loads.
  }

  // Dashboard API

  loadDashboardStatistics(): void {
    this.isLoading.set(true);

    this.errorMessage.set('');

    this.dashboardService.getDashboardStatistics().subscribe({
      next: (response) => {
        this.dashboardStatistics.set(response.data);

        this.lowStockBooks.set(response.data.low_stock_books || []);

        this.isLoading.set(false);

        // Charts are created asynchronously
        // after the view is available.
        setTimeout(() => {
          this.createRevenueChart();

          this.createOrdersChart();
        });
      },

      error: (error) => {
        const message =
          error?.message ||
          error?.error?.message ||
          error?.error?.detail ||
          'Unable to load dashboard data';

        this.errorMessage.set(message);

        this.isLoading.set(false);
      },
    });
  }

  // Refresh

  refreshDashboard(): void {
    this.loadDashboardStatistics();
  }

  // Revenue Chart

  private createRevenueChart(): void {
    if (!this.revenueChart) {
      return;
    }

    this.revenueChartInstance?.destroy();

    const config: ChartConfiguration<'line'> = {
      type: 'line',

      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],

        datasets: [
          {
            label: 'Revenue',

            data: [
              15000,
              22000,
              28000,
              36000,
              43000,

              this.dashboardStatistics()?.total_revenue ?? 52000,
            ],

            borderColor: '#8B5E3C',

            backgroundColor: 'rgba(139,94,60,.15)',

            fill: true,

            tension: 0.4,

            borderWidth: 3,

            pointRadius: 5,

            pointHoverRadius: 7,
          },
        ],
      },

      options: {
        responsive: true,

        maintainAspectRatio: false,

        plugins: {
          legend: {
            display: true,
          },
        },

        scales: {
          x: {
            grid: {
              display: false,
            },
          },

          y: {
            beginAtZero: true,

            ticks: {
              callback(value) {
                return '₹' + value;
              },
            },
          },
        },
      },
    };

    this.revenueChartInstance = new Chart(this.revenueChart.nativeElement, config);
  }

  // Orders Chart

  private createOrdersChart(): void {
    if (!this.ordersChart) {
      return;
    }

    this.ordersChartInstance?.destroy();

    const config: ChartConfiguration<'bar'> = {
      type: 'bar',

      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],

        datasets: [
          {
            label: 'Orders',

            data: [12, 18, 16, 25, 32, 28, 20],

            backgroundColor: [
              '#8B5E3C',
              '#A06C45',
              '#B07A53',
              '#C28B63',
              '#D39C73',
              '#E3AD82',
              '#F0BE92',
            ],

            borderRadius: 12,

            borderSkipped: false,
          },
        ],
      },

      options: {
        responsive: true,

        maintainAspectRatio: false,

        plugins: {
          legend: {
            display: false,
          },
        },

        scales: {
          x: {
            grid: {
              display: false,
            },
          },

          y: {
            beginAtZero: true,

            ticks: {
              stepSize: 5,
            },
          },
        },
      },
    };

    this.ordersChartInstance = new Chart(this.ordersChart.nativeElement, config);
  }
}
