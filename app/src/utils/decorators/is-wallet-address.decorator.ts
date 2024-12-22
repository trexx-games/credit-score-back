import { registerDecorator, ValidationOptions } from "class-validator"
import { ethers } from "ethers"

function IsWalletAddress(validationOptions?: ValidationOptions) {
  // eslint-disable-next-line
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "isWalletAddress",
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: "$property must be a valid wallet address.",
        ...validationOptions,
      },
      validator: {
        validate(walletAddress: string) {
          return ethers.isAddress(walletAddress)
        },
      },
    })
  }
}

export { IsWalletAddress }
