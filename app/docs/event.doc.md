## Ethereum

### Lido

```sol
Submitted(address sender, uint256 amount, address referral)
WithdrawalClaimed(uint256 requestId, address owner, address receiver, uint256 amountOfETH)
```

### Curve

```sol
AddLiquidity(address provider, uint256[3] token_amounts, uint256[3] fees, uint256 invariant, uint256 token_supply)
TokenExchange(address buyer, int128 sold_id, uint256 tokens_sold, int128 bought_id, uint256 tokens_bought)
RemoveLiquidityOne(address provider, uint256 token_amount, uint256 coin_amount)
RemoveLiquidity(address provider, uint256[3] token_amounts, uint256[3] fees, uint256 token_supply)
```

### Compound

```sol
Withdraw(address src, address to, uint256 amount)
Supply(address from, address dst, uint256 amount)
SupplyCollateral(address from, address dst, address asset, uint256 amount)
WithdrawCollateral(address src, address to, address asset, uint256 amount)
```

### Aave

```sol
Supply(address reserve, address user, address onBehalfOf, uint256 amount, uint16 referralCode)
Withdraw(address reserve, address user, address to, uint256 amount)
Borrow(address reserve, address user, address onBehalfOf, uint256 amount, uint8 interestRateMode, uint256 borrowRate, uint16 referralCode)
FlashLoan(address target, address initiator, address asset, uint256 amount, uint8 interestRateMode, uint256 premium, uint16 referralCode)
Repay(address reserve, address user, address repayer, uint256 amount, bool useATokens)
```

### Uniswap

```sol
IncreaseLiquidity(uint256 tokenId, uint128 liquidity, uint256 amount0, uint256 amount1)
DecreaseLiquidity(uint256 tokenId, uint128 liquidity, uint256 amount0, uint256 amount1)
Collect(uint256 tokenId, address recipient, uint256 amount0, uint256 amount1)
```

## Polygon

### Compound

```sol
Withdraw(address src, address to, uint256 amount)
Supply(address from, address dst, uint256 amount)
SupplyCollateral(address from, address dst, address asset, uint256 amount)
WithdrawCollateral(address src, address to, address asset, uint256 amount)
```

### Aave

```sol
Supply(address reserve, address user, address onBehalfOf, uint256 amount, uint16 referralCode)
Withdraw(address reserve, address user, address to, uint256 amount)
Borrow(address reserve, address user, address onBehalfOf, uint256 amount, uint8 interestRateMode, uint256 borrowRate, uint16 referralCode)
FlashLoan(address target, address initiator, address asset, uint256 amount, uint8 interestRateMode, uint256 premium, uint16 referralCode)
Repay(address reserve, address user, address repayer, uint256 amount, bool useATokens)
```

### Uniswap

```sol
IncreaseLiquidity(uint256 tokenId, uint128 liquidity, uint256 amount0, uint256 amount1)
DecreaseLiquidity(uint256 tokenId, uint128 liquidity, uint256 amount0, uint256 amount1)
Collect(uint256 tokenId, address recipient, uint256 amount0, uint256 amount1)
```

### The Sandbox

```sol
Transfer(address from, address to, uint256 tokenId)
Staked(address account, uint256 stakeAmount)
Withdrawn(address account, uint256 stakeAmount)
```

## Ronin

### Katana

```sol
Swap(address _sender, uint256 _amount0In, uint256 _amount1In, uint256 _amount0Out, uint256 _amount1Out, address _to)
```

### Axie Inifnity

```sol
Staked(address user, address token, uint256 amount)
Unstaked(address user, address token, uint256 amount)
AgreementTerminated(address submitter, bytes32 agreementHash, uint256 terminatedAt)
AgreementSubmitted(address submitter, bytes32 agreementHash, uint256 terminatedAt, (address, uint8, uint8, uint8, (uint8, uint256)[], uint256, uint256, address, address, uint256[], address[], uint64, string) agreement)
AgreementExtended(address submitter, bytes32 agreementHash, uint256 depositAmount, uint256 terminatedAt)
Transfer(address from, address to, uint256 tokenId)
```

### Pixels

```sol
DailyLogDone(address userAddress, uint256 blockTimestamp, string uuid)
Transfer(address from, address to, uint256 tokenId)
```
