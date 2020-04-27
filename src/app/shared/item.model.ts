export class Item {
  name: string;
  stats: Map<string, number>;
  type: string;

  constructor(name: string, type: string, stats: Map<string, number>) {
    this.name = name;
    this.stats = stats;
    this.type = type;
  }
}
