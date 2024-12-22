import { SlugArgs } from "@src/utils/args/slug.args"

export class UserFindByArgsQuery {
  public constructor(public readonly args: SlugArgs) {}
}
