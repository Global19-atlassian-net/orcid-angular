import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss', 'panel.component.scss-theme.scss'],
})
export class PanelComponent implements OnInit {
  tooltipLabelShowDetails = $localize`:@@shared.showDetails:Show details`
  tooltipLabelHideDetails = $localize`:@@shared.hideDetails:Hide details`
  tooltipLabelEdit = $localize`:@@shared.edit:Edit`
  @Output() edit = new EventEmitter<void>()

  openState = false
  editable = true
  constructor() { }

  ngOnInit(): void { }

  editElement() {
    this.edit.next()
  }
}
