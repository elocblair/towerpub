import { Component, OnInit, OnDestroy } from '@angular/core';
import { HqService } from 'src/app/hq.service';
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-hq',
  templateUrl: './hq.component.html',
  styleUrls: ['./hq.component.css'],
})
export class HqComponent implements OnInit, OnDestroy {

  showCountdown = false;
  countdown: number;
  countSubscription: Subscription;
  intervalId: any;
  hqLevel: number;
  levelUpRequirementsSubscription: Subscription;
  initDataSubscription: Subscription;
  levelUpRequirementsString: string;

  constructor(private hqService: HqService) { }

  ngOnInit(): void {
    this.hqService.getInitialHqData();
    this.initDataSubscription = this.hqService.getInitDataSubject().subscribe( () => {
      this.hqLevel = this.hqService.hqLevel;
      this.hqService.getLevelPath();
      if (this.hqService.levelUpInProcess) {
        this.startTimer((this.hqService.levelUpEndTime - Date.now()) / 1000);
      }
      this.levelUpRequirementsSubscription = this.hqService.getLevelUpReqString().subscribe( value => {
        this.levelUpRequirementsString = value + '';
      });
    });

  }

  levelUpHQ() {
    if (!this.hqService.levelUpInProcess) {
      if (this.hqService.meetsRequirementsToLevelUp()) {
        this.hqService.consumeLevelUpResources();
        this.hqService.setLevelUpEndTime(Date.now());
        this.startTimer(this.hqService.currentLevelUpRequirements.timeInSeconds);
      } else {
        alert('not enough resources');
      }
    }
  }

  startTimer(timeLeft: number) {
    const customObservable = new Observable(observer => {
      let count = timeLeft;
      this.intervalId = setInterval(() => {
        observer.next(count);
        this.showCountdown = true;
        if (count === 0 || count < 0) {
          observer.complete();
        }
        count--;
      }, 1000);
    });

    this.countSubscription = customObservable.subscribe(data => {
      this.countdown = +data;
    }, error => {
      alert(error.message);
    }, () => {
      this.showCountdown = false;
      this.hqLevel = this.hqService.levelUpHq();
      clearInterval(this.intervalId);
    });
  }

  constructNew() {
  }

  ngOnDestroy() {
    if (this.countSubscription != null) {
      this.countSubscription.unsubscribe();
      clearInterval(this.intervalId);
    }
    //this.hqService.saveHqStatus();
  }
}
