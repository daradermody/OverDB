import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class MovieServiceService {

  constructor(private http: HttpClient) { }

  getAllMovies() {
    return this.http.get('/api/filmList');
  }
}
