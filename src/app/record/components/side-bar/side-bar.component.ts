import { Component, OnInit, OnDestroy } from '@angular/core'
import { UserService } from 'src/app/core'
import { Observable, Subject } from 'rxjs'
import { UserInfo, NameForm, RequestInfoForm } from 'src/app/types'
import { takeUntil } from 'rxjs/operators'
import { RecordService } from 'src/app/core/record/record.service'
import { UserRecord } from 'src/app/types/record.local'
import { MatDialog } from '@angular/material/dialog'
import { DialogFormComponent } from 'src/app/cdk/dialog-form/dialog-form/dialog-form.component'
import { PlatformInfoService } from 'src/app/cdk/platform-info'

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: [
    './side-bar.component.scss-theme.scss',
    './side-bar.component.scss',
  ],
})
export class SideBarComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>()
  userSession: {
    userInfo: UserInfo
    nameForm: NameForm
    oauthSession: RequestInfoForm
    displayName: string
    orcidUrl: string
    loggedIn: boolean
  }
  userRecord: UserRecord
  constructor(
    private _user: UserService,
    private _record: RecordService,
    private _dialog: MatDialog,
    private _platform: PlatformInfoService
  ) {}

  ngOnInit(): void {
    this._user
      .getUserSession()
      .pipe(takeUntil(this.destroy$))
      .subscribe((userSession) => {
        this.userSession = userSession

        // TODO @amontenegro
        // AVOID requiring the orcid url to getPerson to call all the record data on parallel
        this._record
          .getRecord(this.userSession.userInfo.EFFECTIVE_USER_ORCID)
          .pipe(takeUntil(this.destroy$))
          .subscribe((userRecord) => {
            this.userRecord = userRecord
          })
      })
  }

  ngOnDestroy() {
    this.destroy$.next(true)
    this.destroy$.unsubscribe()
  }

  edit(event) {
    const dialogParams = {
      width: `1078px`,
      height: `600px`,
      maxWidth: `90vw`,
    }

    this._platform.get().subscribe((platform) => {
      {
        if (platform.tabletOrHandset) {
          dialogParams['maxWidth'] = '95vw'
          dialogParams['maxHeight'] = '95vh'
        }

        const dialogRef = this._dialog.open(DialogFormComponent, dialogParams)
      }
    })
  }
}
