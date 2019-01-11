import { Component, OnInit } from '@angular/core'

import { rotateAnimation, heightAnimation } from 'src/app/animations'

@Component({
  selector: 'app-profile-records-card',
  templateUrl: './profile-records-card.component.html',
  styleUrls: ['./profile-records-card.component.scss'],
  animations: [rotateAnimation, heightAnimation],
})
export class ProfileRecordsCardComponent implements OnInit {
  state = 'close'
  detailShowLoader = 'close'
  detailShowData = 'close'
  constructor() {}

  ngOnInit() {}

  toggle(btn) {
    this.state = this.state === 'close' ? 'open' : 'close'

    if (this.state === 'open') {
      this.detailShowLoader = 'open'
      this.detailShowData = 'close'
      setTimeout(() => {
        this.detailShowLoader = 'close-with-none-opacity'
        this.detailShowData = 'open'
      }, 600)
    } else {
      this.detailShowLoader = 'close'
      this.detailShowData = 'close'
    }
  }
}