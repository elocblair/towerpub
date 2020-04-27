import { Injectable } from '@angular/core';
import { Inventory } from './shared/inventory.model';
import { Item } from './shared/item.model';

@Injectable()
export class InventoryService {

  playerInventory = new Inventory([], 3);
  towerInventory = new Inventory([], 5);

  addToPlayerInventory(item: Item) {
    if (this.playerInventory.itemList.length === this.playerInventory.inventorySlots) {
      return false;
    }
    this.playerInventory.itemList.push(item);
    return true;
  }

  addToTowerInventory(item: Item) {
    if (this.towerInventory.itemList.length === this.towerInventory.inventorySlots) {
      return false;
    }
    this.towerInventory.itemList.push(item);
    return true;
  }

  removeFromTowerInventory(item: Item) {
    this.towerInventory.itemList.splice(this.towerInventory.itemList.indexOf(item), 1);
  }

  removeFromPlayerInventory(item: Item) {
    this.playerInventory.itemList.splice(this.playerInventory.itemList.indexOf(item), 1);
  }

  getPlayerItemList() {
    return this.playerInventory.itemList.slice();
  }

  getTowerItemList() {
    return this.towerInventory.itemList.slice();
  }
}
