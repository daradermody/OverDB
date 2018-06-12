import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

export interface Person {
  id: number;
  name: string;
  profile_path: string;
}

@Injectable()
export class PersonSearchService {
  private apiKey;

  constructor(private http: HttpClient) {
    this.http.get('/api/getTmdbApiKey', {responseType: 'text'}).subscribe(key => this.apiKey = key);
  }

  searchPerson(name: string): Observable<{ results: Array<{ name: string, id: number, profile_path: string }> }> {
    console.log('searching for ' + name);
    const options = {
      params: {
        language: 'en-US',
        query: name,
        api_key: this.apiKey
      }
    };

    return this.http.get<{ results: Array<Person> }>('https://api.themoviedb.org/3/search/person', options);
  }

  includePerson(person: Person): Observable<void> {
    return this.http.post<void>('/api/person/add', {name: person.name, profile_path: person.profile_path, id: person.id});
  }

  removePerson(name: string): Observable<void> {
    return this.http.post<void>('/api/person/remove', {name: name});
  }

  getFollowedPeople(): Observable<Person[]> {
    return this.http.get<Person[]>('/api/person');
  }
}
