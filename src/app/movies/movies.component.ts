import { Component, OnInit } from '@angular/core';
import {MovieServiceService} from "../movie-service.service";

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css']
})
export class MoviesComponent implements OnInit {
  filmList: any = [];
  errorMessage: string;

  constructor(private movieService: MovieServiceService) { }

  ngOnInit() {
    this.movieService.getAllMovies().subscribe(
      data => this.filmList = data,
      error => this.errorMessage = error["userMessage"])
  }

}
