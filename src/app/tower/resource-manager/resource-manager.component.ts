import { Component, OnInit, OnDestroy } from '@angular/core';
import { ResourceService } from 'src/app/resource.service';

@Component({
  selector: 'app-resource-manager',
  templateUrl: './resource-manager.component.html',
  styleUrls: ['./resource-manager.component.css']
})
export class ResourceManagerComponent implements OnInit, OnDestroy {

  wood: number;
  stone: number;
  earth: number;

  constructor(private resourceService: ResourceService) {}

  ngOnInit(): void {
    this.resourceService.initResourceMap();
    this.resourceService.resourcesMapSubject.subscribe(value => {
      this.wood = Math.floor(value.get('wood'));
      this.earth = Math.floor(value.get('earth'));
      this.stone = Math.floor(value.get('stone'));
    });
  }

  refreshResourceCount() {
    this.resourceService.updateValues();
    this.wood = Math.floor(this.resourceService.resourcesMap.get('wood'));
    this.earth = Math.floor(this.resourceService.resourcesMap.get('earth'));
    this.stone = Math.floor(this.resourceService.resourcesMap.get('stone'));
  }

  ngOnDestroy(): void {
    this.resourceService.postNewResourceCount();
  }

}
