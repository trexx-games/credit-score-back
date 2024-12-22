import { Injectable } from "@nestjs/common"
import { IEvent, ofType, Saga } from "@nestjs/cqrs"
import { ProcessEventsFinished } from "@src/processor/events/process-events-fnished.event"
import { CreditScoreSaveOnBlockchainByProcessEventsFinishCommand } from "@src/public-credit-score/commands/credit-score-save-on-blockchain-by-process-events-finished.command"
import { map, Observable } from "rxjs"

@Injectable()
export class CreditScoreSaga {
  @Saga()
  public CreditScoreSaveOnBlockchainByProcessEventsFinishSaga = (
    event: Observable<IEvent>,
  ): Observable<CreditScoreSaveOnBlockchainByProcessEventsFinishCommand> => {
    return event.pipe(
      ofType(ProcessEventsFinished),
      map(({ wallets }) => new CreditScoreSaveOnBlockchainByProcessEventsFinishCommand(wallets)),
    )
  }
}
