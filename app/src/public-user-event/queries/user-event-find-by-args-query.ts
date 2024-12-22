import { SlugArgs } from "@src/utils/args/slug.args"

export class UserEventFindByArgsQuery {
  public constructor(public readonly args: SlugArgs) {}
}
