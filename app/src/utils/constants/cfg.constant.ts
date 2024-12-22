import { BullQueueEvent } from "@nestjs/bull"

export const cfg = {
  queues: {
    creditScore: "creditScore",
  },
  jobs: {
    start: "start",
    eventWallet: "eventWallet",
    eventLog: "eventLog",
  },
  listeners: {
    completed: "completed" as unknown as BullQueueEvent,
    failed: "failed" as unknown as BullQueueEvent,
    progress: "progress" as unknown as BullQueueEvent,
  },
}
