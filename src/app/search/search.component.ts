import {Component} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  errorMessage: string;
  filmList: any;

  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe(params => this.search(params.query));
  }

  search(query) {
    console.log("Query was: " + query);
    //TODO: Call service with this.query
    this.filmList = [
      {
        title: query,
        tagline: "tagline1",
        released: "released1"
      },
      {
        title: "title2",
        tagline: "tagline2",
        released: "released2"
      },
      {
        title: "title3",
        tagline: "tagline3",
        released: "released3"
      },
      {
        title: "title4",
        tagline: "tagline4",
        released: "released4"
      },
    ]
  }

  error() {
    this.errorMessage = "errored!"
  }

}
