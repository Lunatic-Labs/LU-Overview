import { OnInit, Component, ElementRef, Input, ViewChild, AfterViewInit } from '@angular/core';
import { Chart, ChartConfiguration, ChartData, ChartOptions } from "chart.js";
import { Observable, Subscription } from 'rxjs';

@Component({
	selector: 'app-graph',
	template: `<canvas #chart></canvas>`,
	styles: [`
		:host {
				display: inline-block;
				position: relative;
		}
	`]
})
export class GraphComponent implements AfterViewInit {
	@ViewChild('chart')
	private chartRef: ElementRef;
	private chart: Chart;
	@Input()
	config: Observable<ChartConfiguration>;
	private subscription: Subscription;

	constructor() {
	}

	ngAfterViewInit(): void {
		if (this.config) {
			Chart.defaults.global.defaultFontFamily = 'Lato';
			Chart.defaults.global.defaultFontSize = 18;
			Chart.defaults.global.defaultFontColor = '#777';

			this.subscription = this.config.subscribe({ next: config => {
				this.chart = new Chart(this.chartRef.nativeElement, config);
				this.subscription.unsubscribe();
			}});
		}
	}
	/*async ngAfterViewInit(): Promise<void> {
		if (this.config) {
			Chart.defaults.global.defaultFontFamily = 'Lato';
			Chart.defaults.global.defaultFontSize = 18;
			Chart.defaults.global.defaultFontColor = '#777';

			this.chart = new Chart(this.chartRef.nativeElement, await this.config);
		}
	}*/
}
