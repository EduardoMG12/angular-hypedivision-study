import { Component, Inject, PLATFORM_ID } from '@angular/core';
import type { OnInit } from '@angular/core';
import { SideBarComponent } from '../../components/side-bar/side-bar.component';
import { BaseChartDirective } from 'ng2-charts';
import type { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import { mockStatisticsData } from '../../common/mock/statistics';
import type { StatisticsData } from '../../common/api/types/statistics';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule, SideBarComponent, BaseChartDirective],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css'],
})
export class StatisticsComponent implements OnInit {
  public statsData: StatisticsData = mockStatisticsData;
  public isBrowser=true;
  public studyStreakDays: number[] = [];

  // Histogram
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#A3A3A9' },
      },
      y: {
        grid: { color: '#2E2E38' },
        ticks: { color: '#A3A3A9', stepSize: 15 },
      },
    },
    plugins: {
      legend: { display: false },
    },
  };
  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{ data: [], backgroundColor: '#BA8FEF', borderWidth: 0 }],
  };

  // Donut Chart
  public donutChartType: ChartType = 'doughnut';
  public donutChartData: ChartData<'doughnut'> = {
    labels: ['Corretas', 'Incorretas'],
    datasets: [{ data: [], backgroundColor: ['#BA8FEF', '#FF4D4D'], borderWidth: 0 }],
  };
  public donutChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
  };

  // constructor(@Inject(PLATFORM_ID) private platformId: unknown) {
  //   this.isBrowser = isPlatformBrowser(this.platformId);
  // }

  ngOnInit() {
    this.loadChartData();
  }

  private loadChartData() {
    // Populate bar chart
    this.barChartData.labels = this.statsData.studyHistory.map((entry) => entry.date);
    this.barChartData.datasets[0].data = this.statsData.studyHistory.map(
      (entry) => entry.cardsStudied
    );

    // Populate donut chart
    this.donutChartData.datasets[0].data = [
      this.statsData.performance.correct,
      this.statsData.performance.incorrect,
    ];

    // Populate study streak dots
    this.studyStreakDays = Array(this.statsData.studyStreak).fill(0);
  }
}