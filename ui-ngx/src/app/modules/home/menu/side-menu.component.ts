///
/// Copyright © 2016-2026 The Thingsboard Authors
///
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
///
///     http://www.apache.org/licenses/LICENSE-2.0
///
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MenuService } from '@core/services/menu.service';
import { MenuSection } from '@core/services/menu.models';
import { coerceBoolean } from '@shared/decorators/coercion';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * One floating navigation card in the Modern Card Sidebar.
 *
 * - `toggle` cards wrap exactly one expandable menu section (Monitor,
 *   Devices & Assets, …). Open state lives on the section itself, so the
 *   existing persisted expand/collapse behavior is preserved.
 * - `links` cards group plain links under a synthetic translated header
 *   (General, OTA & Access). Their open state is local to this component.
 */
export interface NavCard {
  id: string;
  titleKey: string;
  kind: 'toggle' | 'links';
  toggle?: MenuSection;
  sections?: MenuSection[];
}

@Component({
    selector: 'tb-side-menu',
    templateUrl: './side-menu.component.html',
    styleUrls: ['./side-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class SideMenuComponent {

  @Input()
  @coerceBoolean()
  collapsed = false;

  menuSections$ = this.menuService.menuSections();

  navCards$: Observable<NavCard[]> = this.menuSections$.pipe(
    map((sections) => this.buildNavCards(sections || []))
  );

  private readonly localOpenCards = new Set<string>(['general', 'ota-access']);

  constructor(private menuService: MenuService) {
  }

  isCardOpen(card: NavCard): boolean {
    if (card.kind === 'toggle') {
      return !!card.toggle?.opened;
    }
    return this.localOpenCards.has(card.id);
  }

  toggleLocalCard(card: NavCard, event: MouseEvent): void {
    event.stopPropagation();
    if (this.localOpenCards.has(card.id)) {
      this.localOpenCards.delete(card.id);
    } else {
      this.localOpenCards.add(card.id);
    }
  }

  private buildNavCards(sections: MenuSection[]): NavCard[] {
    const generalLinks: MenuSection[] = [];
    const otaAccessLinks: MenuSection[] = [];
    let monitor: MenuSection | null = null;
    let entities: MenuSection | null = null;
    const extraToggles: MenuSection[] = [];

    for (const section of sections) {
      if (!section || section.type === 'divider') {
        continue;
      }
      if (section.type === 'toggle') {
        if (section.id === 'monitor' && !monitor) {
          monitor = section;
        } else if (section.id === 'entities' && !entities) {
          entities = section;
        } else {
          extraToggles.push(section);
        }
      } else {
        if ((section.id === 'otaUpdates' || section.id === 'customers_and_users')) {
          otaAccessLinks.push(section);
        } else {
          generalLinks.push(section);
        }
      }
    }

    const cards: NavCard[] = [];
    if (generalLinks.length) {
      cards.push({id: 'general', titleKey: 'sidebar.general', kind: 'links', sections: generalLinks});
    }
    if (monitor) {
      cards.push({id: 'monitor', titleKey: '', kind: 'toggle', toggle: monitor});
    }
    if (entities) {
      cards.push({id: 'entities', titleKey: '', kind: 'toggle', toggle: entities});
    }
    if (otaAccessLinks.length) {
      cards.push({id: 'ota-access', titleKey: 'sidebar.ota-access', kind: 'links', sections: otaAccessLinks});
    }
    for (const toggle of extraToggles) {
      cards.push({id: `section-${String(toggle.id)}`, titleKey: '', kind: 'toggle', toggle});
    }
    return cards;
  }

}
