import { Injectable } from '@angular/core';
import { ResourceService } from './resource.service';
import { LevelRequirements } from './shared/level-requirements.model';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { stringify } from 'querystring';

@Injectable({
  providedIn: 'root'
})
export class HqService {

  constructor(private resourceService: ResourceService, private http: HttpClient) {}

  hqLevel: number;
  hqLevelPath: LevelRequirements[] = [];
  currentLevelUpRequirements: LevelRequirements;
  levelUpEndTime: number;
  levelUpInProcess = false;
  currentHqDataId: string;
  private levelUpReqSubject = new BehaviorSubject<string>('');
  private hqStatusSubject = new BehaviorSubject<string>('');

  getHqStatus() {
    console.log('getHqStatus');
    this.http.get<{message: string, _id: string, levelUpInProcess: boolean, levelUpEndTime: number, hqLevel: number}>
      ('http://localhost:3000/hq/status').subscribe((hqStatus) => {
        this.currentHqDataId = hqStatus._id;
        this.hqLevel = +hqStatus.hqLevel;
        this.levelUpInProcess = hqStatus.levelUpInProcess;
        if(Date.now() > hqStatus.levelUpEndTime && hqStatus.levelUpInProcess) {
          this.levelUpHq();
        }
        this.levelUpEndTime = hqStatus.levelUpEndTime;
        this.setCurrentLevelUpRequirements();
        this.hqStatusSubject.next('');
      });
  }

  getLevelPath() {
    if(this.hqLevelPath.length === 0){
      this.http.get<{message: string, levelRequirements}>('http://localhost:3000/hq/levels')
      .subscribe((levelPathData) => {
        for (const levelRequirement of levelPathData.levelRequirements) {
          const req = new Map<string, number>();
          for (let i = 0; i < levelRequirement.requirements.length; i = i + 2) {
            req.set(levelRequirement.requirements[i], levelRequirement.requirements[i + 1]);
          }
          const lvl = new LevelRequirements(levelRequirement.level, req, levelRequirement.timeInSeconds);
          this.hqLevelPath.push(lvl);
        }
      });
    }
  }

  levelUpHq(): number {
    this.levelUpInProcess = false;
    this.hqLevel += 1;
    this.setCurrentLevelUpRequirements();
    this.replaceHqStatus();
    return this.hqLevel;
  }

  meetsRequirementsToLevelUp(): boolean {
    if (!this.currentLevelUpRequirements) {
      return false;
    }
    for (const key of this.currentLevelUpRequirements.requirements.keys()) {
      if (this.resourceService.resourcesMap.get(key) < this.currentLevelUpRequirements.requirements.get(key)) {
        return false;
      }
    }
    return true;
  }

  consumeLevelUpResources() {
    for (const key of this.currentLevelUpRequirements.requirements.keys()) {
      const resourceCount = +this.resourceService.resourcesMap.get(key);
      const resourceToConsume = +this.currentLevelUpRequirements.requirements.get(key);
      console.log(resourceCount);
      console.log(resourceToConsume);
      this.resourceService.resourcesMap.delete(key);
      this.resourceService.resourcesMap.set(key, resourceCount - resourceToConsume);
    }
    this.resourceService.postNewResourceCount();
    this.resourceService.resourcesMapSubject.next(this.resourceService.resourcesMap);
  }

  setLevelUpEndTime(startTime: number) {
    this.levelUpEndTime = startTime + this.currentLevelUpRequirements.timeInSeconds * 1000;
    this.replaceHqStatus();
  }

  setCurrentLevelUpRequirements() {
    this.currentLevelUpRequirements = this.hqLevelPath[this.hqLevel];
    this.setLevelUpReqSubject();
  }

  setLevelUpReqSubject() {
    console.log(this.levelUpInProcess);
    if (!this.currentLevelUpRequirements) {
      this.levelUpReqSubject.next('max level');
    } else if (this.levelUpInProcess) {
      this.levelUpReqSubject.next('wait');
    } else {
      let levelUp = 'requirements: ';
      levelUp = this.currentLevelUpRequirements.timeInSeconds + ' seconds ';
      for (const key of this.currentLevelUpRequirements.requirements.keys()) {
        levelUp = levelUp + ' & ' + this.currentLevelUpRequirements.requirements.get(key) + ' ' + key + ' ';
      }
      console.log('update level up string');
      this.levelUpReqSubject.next(levelUp);
    }
  }

  getLevelUpReqString(): Observable<string> {
    return this.levelUpReqSubject.asObservable();
  }

  getHqStatusSubject(): Observable<string> {
    return this.hqStatusSubject.asObservable();
  }

  replaceHqStatus() {
    console.log('replaceHqStatus');
    this.http.delete('http://localhost:3000/hq/status/' + this.currentHqDataId)
      .subscribe( () => {
        const postData = {hqLevel: this.hqLevel, levelUpInProcess: this.levelUpInProcess, levelUpEndTime: this.levelUpEndTime};
        this.http.post<{message: string, _id: string}>('http://localhost:3000/hq/status', postData)
          .subscribe((responseData) => {
            this.currentHqDataId = responseData._id;
          });
      });
  }
}
