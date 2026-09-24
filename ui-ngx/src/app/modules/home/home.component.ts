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

import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild
} from '@angular/core';
import { Renderer2 } from '@angular/core';
import { skip, startWith, Subject } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { debounceTime, distinctUntilChanged, take, takeUntil } from 'rxjs/operators';

import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { OverlayContainer } from '@angular/cdk/overlay';
import { PageComponent } from '@shared/components/page.component';
import { AppState } from '@core/core.state';
import { getCurrentAuthState, selectUserSettingsProperty } from '@core/auth/auth.selectors';
import { MediaBreakpoints } from '@shared/models/constants';
import screenfull from 'screenfull';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthState } from '@core/auth/auth.models';
import { WINDOW } from '@core/services/window.service';
import { instanceOfSearchableComponent, ISearchableComponent } from '@home/models/searchable-component.models';
import { ActiveComponentService } from '@core/services/active-component.service';
import { FormBuilder } from '@angular/forms';
import { ActionPreferencesPutUserSettings } from '@core/auth/auth.actions';
import { HomeService } from '@core/services/home.service';

// NovaEdge dark-mode preference. Stored as a plain 'true'/'false' string via
// direct localStorage access (NOT via LocalStorageService, which JSON-encodes
// and prefixes keys with 'NE-'). Upstream ThingsBoard used 'tb-dark-mode';
// NovaEdge uses 'ne-dark-mode'. The legacy key is only consulted once for
// migration and is never the source of truth afterwards.
const DARK_MODE_KEY = 'ne-dark-mode';
const LEGACY_DARK_MODE_KEY = 'tb-dark-mode';

function readDarkModePreference(): boolean {
  try {
    const current = localStorage.getItem(DARK_MODE_KEY);
    if (current !== null) {
      // Canonical key wins; drop any stale legacy key so only one source remains.
      try {
        if (localStorage.getItem(LEGACY_DARK_MODE_KEY) !== null) {
          localStorage.removeItem(LEGACY_DARK_MODE_KEY);
        }
      } catch {
        // ignore cleanup errors
      }
      return current === 'true';
    }
    // One-time migration from upstream key; then canonicalize to the new key
    // so there are never two conflicting sources.
    const legacy = localStorage.getItem(LEGACY_DARK_MODE_KEY);
    if (legacy !== null) {
      const migrated = legacy === 'true';
      try {
        localStorage.setItem(DARK_MODE_KEY, migrated ? 'true' : 'false');
        localStorage.removeItem(LEGACY_DARK_MODE_KEY);
      } catch {
        // ignore quota / privacy-mode errors; caller still gets correct value
      }
      return migrated;
    }
  } catch {
    // localStorage unavailable (e.g. privacy mode) -> fall back to light mode
  }
  return false;
}

@Component({
    selector: 'tb-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: false
})
export class HomeComponent extends PageComponent implements AfterViewInit, OnInit, OnDestroy {

  authState: AuthState = getCurrentAuthState(this.store);

  forceFullscreen = this.authState.forceFullscreen;

  activeComponent: any;
  searchableComponent: ISearchableComponent;

  sidenavMode: 'over' | 'push' | 'side' = 'side';
  sidenavOpened = true;

  sidenavDesktop = signal(true);
  sidenavCollapsed = signal(false);
  menuCollapsed= computed(() => this.sidenavDesktop() && this.sidenavCollapsed());

  darkMode = signal(false);

  logo = 'assets/logo_title_black.png';
  collapsedLogo =  'assets/small_logo_title_black.png';

  @ViewChild('sidenav')
  sidenav: MatSidenav;

  @ViewChild('mainContent', { static: true }) mainContent: ElementRef<HTMLElement>;

  @ViewChild('searchInput') searchInputField: ElementRef;

  fullscreenEnabled = screenfull.isEnabled;

  searchEnabled = false;
  showSearch = false;
  textSearch = this.fb.control('', {nonNullable: true});

  private destroy$ = new Subject<void>();

  constructor(protected store: Store<AppState>,
              @Inject(WINDOW) private window: Window,
              private activeComponentService: ActiveComponentService,
              private fb: FormBuilder,
              public breakpointObserver: BreakpointObserver,
              public homeService: HomeService,
              private renderer: Renderer2,
              private overlayContainer: OverlayContainer) {
    super(store);
  }

  ngOnInit() {

    const savedDarkMode = readDarkModePreference();
    this.darkMode.set(savedDarkMode);
    this.applyTheme(savedDarkMode);

    const isGtSm = this.breakpointObserver.isMatched(MediaBreakpoints['gt-sm']);
    this.sidenavMode = isGtSm ? 'side' : 'over';
    this.sidenavOpened = isGtSm;
    this.sidenavDesktop.set(isGtSm);
    this.store.pipe(select(selectUserSettingsProperty('menuCollapsed'))).pipe(
      take(1)
    ).subscribe((collapsed: boolean) => {
      this.sidenavCollapsed.set(collapsed);
    });

    this.breakpointObserver
      .observe(MediaBreakpoints['gt-sm'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((state: BreakpointState) => {
          if (state.matches) {
            this.sidenavMode = 'side';
            this.sidenavOpened = true;
            this.sidenavDesktop.set(true);
          } else {
            this.sidenavMode = 'over';
            this.sidenavOpened = false;
            this.sidenavDesktop.set(false);
          }
        }
      );

    this.homeService.toggleSideBar.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.sidenav.toggle();
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewInit() {
    this.textSearch.valueChanges.pipe(
      debounceTime(150),
      startWith(''),
      distinctUntilChanged((a: string, b: string) => a.trim() === b.trim()),
      skip(1),
      takeUntil(this.destroy$)
    ).subscribe(value => this.searchTextUpdated(value.trim()));
  }

  sidenavClicked() {
    if (this.sidenavMode === 'over') {
      this.sidenav.toggle();
    }
  }

  toggleSidenav() {
    this.sidenavCollapsed.update(state => !state);
    this.store.dispatch(new ActionPreferencesPutUserSettings({ menuCollapsed: this.sidenavCollapsed() }));
  }

  toggleFullscreen() {
    if (screenfull.isEnabled) {
      screenfull.toggle();
    }
  }

  isFullscreen() {
    return screenfull.isFullscreen;
  }

  toggleTheme() {
    const dark = !this.darkMode();
    this.darkMode.set(dark);
    localStorage.setItem(DARK_MODE_KEY, dark ? 'true' : 'false');
    this.applyTheme(dark);
  }

  private applyTheme(dark: boolean) {
    const body = this.window.document.body;
    // Material + Tailwind theme is scoped to ".tb-default" (see tailwind.config.js
    // `important: ".tb-default"` and theme.scss `.tb-default` / `.tb-dark`).
    // Keep tb-default always so layout utilities (flex, etc) continue to work in dark mode,
    // and toggle tb-dark as an additional theme layer.
    // NOTE: do NOT rename these to ne-* — no `.ne-default`/`.ne-dark` rules exist,
    // so doing so silently disables the dark theme even when storage says true.
    this.renderer.addClass(body, 'tb-default');
    if (dark) {
      this.renderer.addClass(body, 'tb-dark');
    } else {
      this.renderer.removeClass(body, 'tb-dark');
    }
    const overlayEl = this.overlayContainer.getContainerElement();
    this.renderer.addClass(overlayEl, 'tb-default');
    if (dark) {
      this.renderer.addClass(overlayEl, 'tb-dark');
    } else {
      this.renderer.removeClass(overlayEl, 'tb-dark');
    }
  }

  goBack() {
    this.window.history.back();
  }

  activeComponentChanged(activeComponent: any) {
    this.activeComponentService.setCurrentActiveComponent(activeComponent);
    this.mainContent?.nativeElement?.scrollTo({ top: 0, left: 0 });
    if (!this.activeComponent) {
      setTimeout(() => {
        this.updateActiveComponent(activeComponent);
      }, 0);
    } else {
      this.updateActiveComponent(activeComponent);
    }
  }

  private updateActiveComponent(activeComponent: any) {
    this.showSearch = false;
    this.textSearch.reset('', {emitEvent: false});
    this.activeComponent = activeComponent;

    if (this.activeComponent && instanceOfSearchableComponent(this.activeComponent)) {
      this.searchEnabled = true;
      this.searchableComponent = this.activeComponent;
    } else {
      this.searchEnabled = false;
      this.searchableComponent = null;
    }
  }

  displaySearchMode(): boolean {
    return this.searchEnabled && this.showSearch;
  }

  openSearch() {
    if (this.searchEnabled) {
      this.showSearch = true;
      setTimeout(() => {
        this.searchInputField.nativeElement.focus();
        this.searchInputField.nativeElement.setSelectionRange(0, 0);
      }, 10);
    }
  }

  closeSearch() {
    if (this.searchEnabled) {
      this.showSearch = false;
      if (this.textSearch.value.length) {
        this.textSearch.reset();
      }
    }
  }

  private searchTextUpdated(searchText: string) {
    if (this.searchableComponent) {
      this.searchableComponent.onSearchTextUpdated(searchText);
    }
  }
}
