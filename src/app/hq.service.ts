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
  private levelUpReqString = new BehaviorSubject<string>('');
  private initDataSubject = new BehaviorSubject<string>('');

  getInitialHqData() {
    this.http.get<{message: string, _id: string, levelUpInProcess: boolean, levelUpEndTime: number, hqLevel: number}>
      ('http://localhost:3000/hq/initdata').subscribe((initData) => {
        this.currentHqDataId = initData._id;
        this.hqLevel = +initData.hqLevel;
        this.levelUpInProcess = initData.levelUpInProcess;
        if(Date.now() > initData.levelUpEndTime && initData.levelUpInProcess) {
          this.levelUpHq();
        }
        this.levelUpEndTime = initData.levelUpEndTime;
        this.setCurrentLevelUpRequirements();
        this.initDataSubject.next('');
      });
  }

  levelUpHq(): number {
    this.hqLevel += 1;
    console.log('cole');
    this.setCurrentLevelUpRequirements();
    this.levelUpInProcess = false;
    this.saveHqStatus();
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
    this.levelUpReqString.next('wait');
    return true;
  }

  consumeLevelUpResources() {
    for (const key of this.currentLevelUpRequirements.requirements.keys()) {
      this.resourceService.resourcesMap
        .set(key, this.resourceService.resourcesMap.get(key) - this.currentLevelUpRequirements.requirements.get(key));
    }
    this.resourceService.resourcesMapSubject.next(this.resourceService.resourcesMap);
  }

  setLevelUpEndTime(startTime: number) {
    this.levelUpEndTime = startTime + this.currentLevelUpRequirements.timeInSeconds * 1000;
    this.saveHqStatus();
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

  setCurrentLevelUpRequirements() {
    this.currentLevelUpRequirements = this.hqLevelPath[this.hqLevel];
    this.setLevelUpReqString();
  }

  setLevelUpReqString() {
    if (!this.currentLevelUpRequirements) {
      this.levelUpReqString.next('max level');
    } else if (this.levelUpInProcess) {
      this.levelUpReqString.next('wait');
    } else {
      let levelUp = 'requirements: ';
      levelUp = this.currentLevelUpRequirements.timeInSeconds + ' seconds ';
      for (const key of this.currentLevelUpRequirements.requirements.keys()) {
        levelUp = levelUp + ' & ' + this.currentLevelUpRequirements.requirements.get(key) + ' ' + key + ' ';
      }
      this.levelUpReqString.next(levelUp);
    }
  }

  getLevelUpReqString(): Observable<string> {
    return this.levelUpReqString.asObservable();
  }

  getInitDataSubject(): Observable<string> {
    return this.initDataSubject.asObservable();
  }

  saveHqStatus() {
    this.http.delete('http://localhost:3000/hq/initdata/' + this.currentHqDataId)
      .subscribe( () => {
        const postData = {hqLevel: this.hqLevel, levelUpInProcess: this.levelUpInProcess, levelUpEndTime: this.levelUpEndTime};
        this.http.post<{message: string}>('http://localhost:3000/hq/initdata', postData)
          .subscribe((responseData) => {
            this.getInitialHqData();
          });
      });
  }
}
