import { Component, OnInit } from '@angular/core';
import { BackendApiService } from '../backend-connection/backend-api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  title = 'Dashboard';
  test = "start";

  constructor(private backendApiService: BackendApiService) { }

  async ngOnInit(): Promise<void> {
    //example
    //this.test = JSON.stringify(await this.backendApiService.getCommits("2"));
  }

}
