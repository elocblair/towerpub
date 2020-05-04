import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { stringify } from 'querystring';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {

  resourcesMap = new Map<string, number>();
  lastUpdated = Date.now();
  resourcesMapSubject = new BehaviorSubject<Map<string, number>>(this.resourcesMap);
  showResources = false;

  constructor(private http: HttpClient) { }

  initResourceMap() {
    this.resourcesMap = new Map<string, number>();
    this.getResourcesMap();
  }

  updateValues() {
    const newLastUpdated = Date.now();
    const secondsSinceLastUpdate = (newLastUpdated - this.lastUpdated) / 1000;
    this.lastUpdated = newLastUpdated;
    for (const key of this.resourcesMap.keys()) {
      this.resourcesMap.set(key, this.resourcesMap.get(key) + secondsSinceLastUpdate);
    }
    this.resourcesMapSubject.next(this.resourcesMap);
  }

  getResourcesMap() {
    this.http.get<{message: string, resourcesArray: string[]}>('http://localhost:3000/resources/array')
      .subscribe((responseData) => {
        for ( let i = 0; i < responseData.resourcesArray.length; i = i + 2 ) {
          this.resourcesMap.set(responseData.resourcesArray[i], +responseData.resourcesArray[i+1]);
        }
        this.resourcesMapSubject.next(this.resourcesMap);
      });
  }

  postNewResourceCount() {
    const resourcesArray = [];
    for(const key of this.resourcesMap.keys()) {
      resourcesArray.push(key, this.resourcesMap.get(key).toString());
    }
    this.http.post<{message: string}>('http://localhost:3000/resources/array', resourcesArray)
      .subscribe((responseData) => {
        // console.log(responseData.message);
      });
  }
}
