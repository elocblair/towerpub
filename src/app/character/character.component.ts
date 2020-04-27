import { Component, OnInit } from '@angular/core';
import { Item } from '../shared/item.model';
import { InventoryService } from '../inventory.service';

@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.css']
})
export class CharacterComponent implements OnInit {

  showItem = false;
  selectedItem: Item;
  playerItemList: Item[] = [];

  constructor(private inventoryService: InventoryService) { }

  ngOnInit() {
    this.playerItemList = this.inventoryService.getPlayerItemList();
  }

  seeItemDetails(item: Item) {
    this.showItem = true;
    this.selectedItem = item;
  }

  moveItemFromPlayer(item: Item) {
    if (this.inventoryService.addToTowerInventory(item)) {
      this.inventoryService.removeFromPlayerInventory(item);
      this.playerItemList = this.inventoryService.getPlayerItemList();
      if (item === this.selectedItem) {
        this.showItem = false;
      }
    }
  }

  removeItem(item: Item) {
    this.inventoryService.removeFromPlayerInventory(item);
    this.playerItemList = this.inventoryService.getPlayerItemList();
    if (item === this.selectedItem) {
      this.showItem = false;
    }
  }

  getSelectedItemStatKeys() {
    return Array.from(this.selectedItem.stats.keys());
  }

  addHelmet() {
    const dentedHelmetStats = new Map<string, number>();
    dentedHelmetStats.set('defense', 1);
    const helmetItem = new Item('dented helmet', 'wearable', dentedHelmetStats);
    this.inventoryService.addToPlayerInventory(helmetItem);
    this.playerItemList = this.inventoryService.getPlayerItemList();
  }
}
