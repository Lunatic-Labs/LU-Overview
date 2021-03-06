import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartData, ChartDataSets } from 'chart.js';
import { Observable, Subscriber } from 'rxjs';
import { BackendApiService } from '../backend-connection/backend-api.service';
import { CommitResponse } from '../backend-connection/backend-api.type';
import { days, months } from "../../common/constants/time.type";
import { ActivatedRoute } from '@angular/router';


@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

	title = 'Dashboard';
	configs: { //each one of these is a different graph
		githubMonths: Observable<ChartConfiguration>,
		githubPerDays: Observable<ChartConfiguration>,
		githubLastDays: Observable<ChartConfiguration>
	};
	totalCommits = 0;

	constructor(private backendApiService: BackendApiService, private route: ActivatedRoute) { }


	async ngOnInit(): Promise<void> {
		this.initGraphs();
	}

	// initialize all the graphs
	private async initGraphs(): Promise<void> {
		// here, I am making several observables for the graph component to pick up
		// then later giving it the data b/c of the delay
		let githubMonthsO: Subscriber<ChartConfiguration> | undefined;
		let githubPerDaysO: Subscriber<ChartConfiguration> | undefined;
		let githubLastDaysO: Subscriber<ChartConfiguration> | undefined;
		this.configs = {
			githubMonths: new Observable<ChartConfiguration>((observer) => {
				githubMonthsO = observer;
			}),
			githubPerDays: new Observable<ChartConfiguration>((observer) => {
				githubPerDaysO = observer;
			}),
			githubLastDays: new Observable<ChartConfiguration>((observer) => {
				githubLastDaysO = observer;
			})
		};

		let data = await this.getData(); //get the commits

		this.totalCommits = data.length;

		let now = new Date();
		let today = now.getDay();
		let weekAgo = new Date();
		weekAgo.setDate(weekAgo.getDate() - 6);
		weekAgo.setHours(0, 0, 0, 0);

		//initalizing arrays with 0s
		let eachMonth: Array<number> = [];
		for (let i = 0; i < 12; i++) {
			eachMonth[i] = 0;
		}
		let perDay: Array<number> = [];
		let last7Days: Array<number> = [];
		for (let i = 0; i < 7; i++) {
			perDay[i] = 0;
			last7Days[i] = 0;
		}

		let maxM = 0, minM = 12; //max and min for month
		data.forEach(commit => {
			let date = new Date(commit.date);
			let month = date.getMonth();
			let day = date.getDay();

			maxM = maxM < month ? month : maxM;
			minM = minM > month ? month : minM;
			eachMonth[month]++;
			perDay[day]++;

			if (date.getTime() > weekAgo.getTime()) {
				last7Days[(day + (6 - today)) % 7]++; //shift array so today is the last element of the array
			}
		});

		let shiftedDays: Array<string> = [];
		for (let i = 0; i < 7; i++) { //shift array so today is the last element of the array
			shiftedDays[(i + (6 - today)) % 7] = days[i];
		}

		let monthLabels: Array<string> = [];
		let monthData: Array<number> = [];
		months.forEach((name, i) => {
			if (i >= minM && i <= maxM) { //minimize the month array to only the months that have commits and the months between those
				monthLabels.push(name);
				monthData.push(eachMonth[i]);
			}
		});

		githubMonthsO?.next(this.createGithubChartConfig(monthLabels, monthData, "Commits", "Commits Per Month"));
		githubMonthsO?.complete();

		githubPerDaysO?.next(this.createGithubChartConfig(days, perDay, "Commits", "Commits On Day"));
		githubPerDaysO?.complete();

		githubLastDaysO?.next(this.createGithubChartConfig(shiftedDays, last7Days, "Commits", "Commits On Last 7 Days"));
		githubLastDaysO?.complete();
	}

	getData(): Promise<CommitResponse> {
		console.log(this.route.snapshot.paramMap.get('id'));
		return this.backendApiService.getCommits(this.route.snapshot.paramMap.get('id') || "2");
	}

	createGithubChartConfig(labels: ChartData["labels"], data: ChartDataSets["data"], label: string, title: string): ChartConfiguration {
		return {
			type: 'bar',
			data: {
				labels: labels,
				datasets: [{
					label: label,
					backgroundColor: "rgba(130,130,130,0.6)", //darkish grey
					data: data
				}]
			},
			options: {
				title: {
					display: true,
					text: title,
					fontSize: 25
				},
				tooltips: {
					mode: 'label',
				},
				responsive: true,
				scales: {
					xAxes: [{
						stacked: true,
					}],
					yAxes: [{
						stacked: true,
					}]
				}
			}
		}
	}

	// old hardcoded graphs to copy from later
	/*createChartOld(id: string): void {
		let temp: any = document.getElementById('myChart');
		let temp1: any = document.getElementById('myChart1');
		let temp2: any = document.getElementById('myChart2');
		let temp3: any = document.getElementById('myChart3');
		let myChart = temp.getContext('2d');
		let myChart1 = temp1.getContext('2d');
		let myChart2 = temp2.getContext('2d');
		let myChart3 = temp3.getContext('2d');
	
		// Start of "Github / Slack Chart"
		Chart.defaults.global.defaultFontFamily = 'Lato';
		Chart.defaults.global.defaultFontSize = 18;
		Chart.defaults.global.defaultFontColor = '#777';
	
		let massPopChart = new Chart(myChart, {
			type: 'line', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
			data: {
				labels: ['January', 'February', 'March', 'April', 'May'],
				datasets: [{
					label: 'Github Commits',
					data: [0, 20, 15, 25, 10],
					//backgroundColor:'green',
					//fill: false,
					backgroundColor: [
						'rgba(75, 192, 192, 0.6)',
						'rgba(75, 192, 192, 0.6)',
					],
					borderWidth: 1,
					borderColor: 'rgb(0, 99, 132',
					hoverBorderWidth: 3,
					hoverBorderColor: '#000'
				},
				{
					label: 'Slack Messages',
					data: [10, 30, 20, 15, 20],
					//backgroundColor:'green',
					//fill: false,
					backgroundColor: [
						'rgba(153, 102, 255, 0.6)',
					],
					borderWidth: 1,
					borderColor: 'rgb(0, 200, 0)',
					hoverBorderWidth: 3,
					hoverBorderColor: '#000'
				},
				]
			},
			options: {
				title: {
					display: true,
					text: 'Github / Slack',
					fontSize: 25
				},
				legend: {
					display: true,
					position: 'right',
					labels: {
						fontColor: '#000'
					}
				},
				layout: {
					padding: {
						left: 50,
						right: 0,
						bottom: 0,
						top: 0
					}
				},
				tooltips: {
					enabled: true
				}
			}
		});
		// END of "Total Productivity Chart"
	
		// Start of Jibble
	
	
		// Global Options
		Chart.defaults.global.defaultFontFamily = 'Lato';
		Chart.defaults.global.defaultFontSize = 18;
		Chart.defaults.global.defaultFontColor = '#777';
	
		let massPopChart1 = new Chart(myChart1, {
			type: 'bar', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
			data: {
				labels: ["January", "February", "March", "April", "May"],
				datasets: [{
					label: 'Commits',
					backgroundColor: "rgba(220,220,220,0.5)",
					data: [5, 4, 2, 8, 7]
				}
					// , {
					//		 label: 'Merges',
					//		 backgroundColor: "rgba(151,187,205,0.5)",
					//		 data: [3, 4, 8, 3, 5]
					// }, {
					//		 label: 'Pulls',
					//		 backgroundColor: "rgba(82,154,190,0.5)",
					//		 data: [5, 6, 8, 2, 4]
					// }
				]
			},
			options: {
				title: {
					display: true,
					text: "Github Data"
				},
				tooltips: {
					mode: 'label',
					// callbacks: {
					//		 label: function(tooltipItem, data) {
					//				 var github = data.datasets[tooltipItem.datasetIndex].label;
					//				 var valor = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
					//				 var total = 0;
					//				 for (var i = 0; i < data.datasets.length; i++)
					//						 total += data.datasets[i].data[tooltipItem.index];
					//				 if (tooltipItem.datasetIndex != data.datasets.length - 1) {
					//						 return github + " : " + valor.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g);
					//				 } else {
					//						 return [github + " : " + valor.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g), "Total : "+ total];
					//				 }
					//		 }
					// }
				},
				responsive: true,
				scales: {
					xAxes: [{
						stacked: true,
					}],
					yAxes: [{
						stacked: true,
					}]
				}
			}
		});
		// End of JIbble chart
	
		// Start of Example
		// Global Options
		Chart.defaults.global.defaultFontFamily = 'Lato';
		Chart.defaults.global.defaultFontSize = 18;
		Chart.defaults.global.defaultFontColor = '#777';
	
		let massPopChart2 = new Chart(myChart2, {
			type: 'horizontalBar', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
			data: {
				labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
				datasets: [{
					label: 'Hours',
					data: [
						2.15,
						3,
						0,
						1.45,
						4.2,
						1.3,
						1
					],
					//backgroundColor:'black',
					backgroundColor: [
						'rgba(255, 99, 132, 0.6)',
						'rgba(255, 99, 132, 0.6)',
						'rgba(255, 99, 132, 0.6)',
						'rgba(255, 99, 132, 0.6)',
						'rgba(255, 99, 132, 0.6)',
						'rgba(255, 99, 132, 0.6)',
						'rgba(255, 99, 132, 0.6)'
	
					],
	
					borderWidth: 1,
					borderColor: '#777',
					hoverBorderWidth: 3,
					hoverBorderColor: '#000'
				}]
			},
			options: {
				title: {
					display: true,
					text: 'Jibble Time',
					fontSize: 25
				},
				legend: {
					display: true,
					position: 'right',
					labels: {
						fontColor: '#000'
					}
				},
				layout: {
					padding: {
						left: 50,
						right: 0,
						bottom: 0,
						top: 0
					}
				},
				scales: {
					xAxes: [{
						scaleLabel: {
							display: true,
							labelString: 'Hours'
						}
					}]
				}
			}
		});
		// End of example
	
		// Start of myChart3
		Chart.defaults.global.defaultFontFamily = 'Lato';
		Chart.defaults.global.defaultFontSize = 18;
		Chart.defaults.global.defaultFontColor = '#777';
	
		let massPopChart3 = new Chart(myChart3, {
			type: 'horizontalBar', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
			data: {
				labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
				datasets: [{
					label: 'Messages',
					data: [5, 3, 7, 5, 8, 4, 3],
					//backgroundColor:'black',
					backgroundColor: [
						'rgba(153, 102, 255, 0.6)',
						'rgba(153, 102, 255, 0.6)',
						'rgba(153, 102, 255, 0.6)',
						'rgba(153, 102, 255, 0.6)',
						'rgba(153, 102, 255, 0.6)',
						'rgba(153, 102, 255, 0.6)',
						'rgba(153, 102, 255, 0.6)'
	
					],
					borderWidth: 1,
					borderColor: '#777',
					hoverBorderWidth: 3,
					hoverBorderColor: '#000'
				},
				{
					label: 'Calls',
					data: [1, 2, 3, 4, 5, 6, 7],
					//backgroundColor:'black',
					backgroundColor: [
						'rgba(54, 162, 235, 0.6)',
						'rgba(54, 162, 235, 0.6)',
						'rgba(54, 162, 235, 0.6)',
						'rgba(54, 162, 235, 0.6)',
						'rgba(54, 162, 235, 0.6)',
						'rgba(54, 162, 235, 0.6)',
						'rgba(54, 162, 235, 0.6)'
	
					],
					borderWidth: 1,
					borderColor: '#777',
					hoverBorderWidth: 3,
					hoverBorderColor: '#000'
				}
				]
			},
			options: {
				title: {
					display: true,
					text: 'Slack Data',
					fontSize: 25
				},
				legend: {
					display: true,
					position: 'right',
					labels: {
						fontColor: '#000'
					}
				},
				layout: {
					padding: {
						left: 50,
						right: 0,
						bottom: 0,
						top: 0
					}
				},
			}
		});
		// End of myChart3
	
	}*/

}
