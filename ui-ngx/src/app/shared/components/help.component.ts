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

import { Component, Input } from '@angular/core';
import { HELP_PAGE_URL } from '@shared/models/constants';

@Component({
    selector: '[tb-help]',
    templateUrl: './help.component.html',
    standalone: false
})
export class HelpComponent {

  @Input('tb-help') helpLinkId: string;

  gotoHelpPage(): void {
    // Centralized Help page navigation - always open the exact base URL in a new tab
    // Do not append current route, path, query or hash. Leave current page unchanged.
    // HELP_PAGE_URL is the single source of truth (defined in @shared/models/constants)
    window.open(HELP_PAGE_URL, '_blank');
  }

}
