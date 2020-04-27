export class LevelRequirements {
  level: string;
  requirements: Map<string, number>;
  timeInSeconds: number;

  constructor(name: string, requirements: Map<string, number>, timeInSeconds: number) {
    this.level = name;
    this.requirements = requirements;
    this.timeInSeconds = timeInSeconds;
  }
}
