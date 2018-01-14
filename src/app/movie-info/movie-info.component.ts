import {Component} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-movie-info',
  templateUrl: './movie-info.component.html',
  styleUrls: ['./movie-info.component.css']
})
export class MovieInfoComponent {
  film: any;

  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe(params => this.getMovieDetails(params.query));
  }

  getMovieDetails(movieTitle) {
    // Replace with service
    this.film = {
      title: movieTitle,
      description: "A movie about cancer",
      cast: [
        {
          character: "Jorge Cloné",
          actor: "George Clooney"
        }, {
          character: "Bacon McMillon Jr.",
          actor: "Kevin Bacon"
        }
      ],
      crew: [
        {
          director: "Dara Dermody"
        }
      ]
    }
  }
}
