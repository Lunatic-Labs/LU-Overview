import { DtoService } from './../dto.service';
import { RepoCommits } from "./../RepoCommits";
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-data-test',
  templateUrl: './data-test.component.html',
  styleUrls: ['./data-test.component.css']
})
export class DataTestComponent implements OnInit {

  public dto: RepoCommits[] = [];

  constructor(private dtoService: DtoService) { }

  ngOnInit(): void {
    (this.dtoService.getCommits())
        .subscribe(data => this.dto = data);
  }
  //Use *ngFor="let item of dto" in a div tag to iterate through array
}
