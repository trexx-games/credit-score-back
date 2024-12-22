import { Injectable } from "@nestjs/common"
import * as bcrypt from "bcrypt"

@Injectable()
export class CryptographyService {
  public async hash(value: string) {
    const hash = await bcrypt.hash(value, 10)
    return hash
  }

  public async compare(value: string, hash: string) {
    const isValid = await bcrypt.compare(value, hash)
    return isValid
  }
}
