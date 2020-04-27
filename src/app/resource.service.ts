import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {

  resourcesMap = new Map<string, number>();
  lastUpdated = Date.now();
  resourcesMapSubject = new BehaviorSubject<Map<string, number>>(this.resourcesMap);

  constructor() { }

  initResourceMap() {
    if (this.resourcesMap.keys().next().done) {
      this.resourcesMap.set('wood', 30);
      this.resourcesMap.set('stone', 0);
      this.resourcesMap.set('earth', 0);
    }
    this.resourcesMapSubject.next(this.resourcesMap);
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

}
