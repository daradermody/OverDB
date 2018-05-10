import {Component, OnInit} from '@angular/core';
import {PersonSearchService} from '../../services/person-search.service';
import {Subject} from 'rxjs';
import {filter, debounceTime, distinctUntilChanged, map, switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  subject = new Subject<string>();
  // TODO: Remove test data
  peopleFound = [{
    'id': 1461,
    'profile_path': '\/esyiULfB7kSrhgzBkLamjsTTKEg.jpg',
    'name': 'George Clooney',
  }, {
    'id': 1,
    'profile_path': '\/8qxin8urtFE0NqaZNFWOuV537bH.jpg',
    'name': 'George Lucas',
  }, {
    'id': 10167,
    'profile_path': '\/rmrprW2rSKq49nPClGUfrJ2J0U4.jpg',
    'name': 'George Lazenby',
  }, {
    'id': 1752,
    'profile_path': '\/5eBSvAPy6DnWsMX61IlJyjUzCRJ.jpg',
    'name': 'George Takei',
  }, {
    'id': 81487,
    'profile_path': '\/2q7aDXEu5XJD6DTpi5hDD7s579.jpg',
    'name': 'George Michael',
  }];
  followedPeople: Array<{ name: string, profile_path: string, id: number }>;

  constructor(private searchService: PersonSearchService) {
    this.subject
      .pipe(
        filter(person => person.length > 2),
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((person) => this.searchService.searchPerson(person)),
        map(results => results.results)
      )
      .subscribe(
        results => {
          this.peopleFound = results;

          const followedNames = this.followedPeople.map(person => person.name);
          this.peopleFound.forEach(personFound => {
            if (followedNames.includes(personFound.name)) {
              personFound['clicked'] = true;
            }
          });
        },
        error => console.error(error)
      );
  }

  ngOnInit() {
    this.searchService.getFollowedPeople()
      .subscribe(
        people => this.followedPeople = people,
        error => console.error(error)
      );
  }

  togglePerson(person: { name: string, profile_path: string, clicked?: boolean, id: number }) {
    person.clicked = !person.clicked;
    if (person.clicked) {
      this.includePerson(person);
    } else {
      this.removePerson(person);
    }
  }

  includePerson(person: { name: string, profile_path: string, id: number }) {
    this.searchService.includePerson(person)
      .subscribe(
        () => this.followedPeople.push({name: person.name, profile_path: person.profile_path, id: person.id}),
        error => console.error(error)
      );
  }

  removePerson(person: { name: string }) {
    this.searchService.removePerson(person.name)
      .subscribe(
        () => {
          const index = this.followedPeople.findIndex((p) => p.name === person.name);
          if (index !== -1) {
            this.followedPeople.splice(index, 1);
          }
        },
        error => console.error(error)
      );
  }
}
