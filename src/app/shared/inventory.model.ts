import { Item } from './item.model';

export class Inventory {
  inventorySlots: number;
  itemList: Item[];

  constructor(inventory: Item[], inventorySlots: number) {
    this.itemList = inventory;
    this.inventorySlots = inventorySlots;
  }
}
