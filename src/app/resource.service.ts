import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { stringify } from 'querystring';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {

  resourcesMap = new Map<string, number>();
  lastUpdated: number;
  resourcesMapSubject = new BehaviorSubject<Map<string, number>>(this.resourcesMap);
  currentResourceDataId: string;
  resourcesArray: string[];

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
      console.log('here');
      const resourceCount = +this.resourcesMap.get(key);
      this.resourcesMap.set(key, resourceCount + secondsSinceLastUpdate);
    }
    this.resourcesMapSubject.next(this.resourcesMap);
    this.postNewResourceCount();
  }

  getResourcesMap() {
    this.http.get<{message: string, _id: string, resourcesArray: string[], lastUpdated: number}>('http://localhost:3000/resources')
      .subscribe((responseData) => {
        for ( let i = 0; i < responseData.resourcesArray.length; i = i + 2 ) {
          this.resourcesMap.set(responseData.resourcesArray[i], +responseData.resourcesArray[i+1]);
        }
        console.log(responseData);
        this.currentResourceDataId = responseData._id;
        this.lastUpdated = responseData.lastUpdated;
        this.resourcesMapSubject.next(this.resourcesMap);
      });
  }

  postNewResourceCount() {
    this.resourcesArray = [];
    this.http.delete('http://localhost:3000/resources/' + this.currentResourceDataId)
      .subscribe(() => {
        for(const key of this.resourcesMap.keys()) {
          this.resourcesArray.push(key, this.resourcesMap.get(key).toString());
        }
        const postData = {resourcesArray: this.resourcesArray, lastUpdated: this.lastUpdated};
        this.http.post<{message: string, _id: string}>('http://localhost:3000/resources', postData)
          .subscribe((responseData) => {
            console.log(responseData.message);
            this.currentResourceDataId = responseData._id;
          });
      });
  }
}
