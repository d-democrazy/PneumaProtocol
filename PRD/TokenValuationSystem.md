# Token Valuation System

## Executive Summary

The Pneuma Protocol's token valuation system establishes a mathematical framework for determining token values based on smart contract activity and collateralization levels. This system ensures that the total ecosystem valuation never exceeds 2.1 billion PNEUMA tokens while providing mechanisms for token value appreciation through genuine utility and strategic collateralization.

## 1. Core Valuation Principles

### 1.1 Base Weight Limitation

Smart contracts in the Pneuma Protocol can only receive gas fees through `TxnFeeInvolved` transactions, as they cannot initiate transactions or pay gas fees directly. This creates a fundamental weight limitation:

$$W_{\text{base}} = 0.25$$

where $W_{\text{base}}$ represents the base weight applied to all contract-related gas consumption.

### 1.2 PNEUMA as Value Anchor

PNEUMA tokens serve as the universal value reference parameter for the entire ecosystem. With a fixed supply matching the blockchain's native coin supply:

$$S_{\text{PNEUMA}} = 2{,}100{,}000{,}000 \text{ tokens}$$

This creates a natural ceiling for ecosystem valuation while providing mathematical stability for token valuations.

## 2. Score Amplification Mechanism

### 2.1 Collateralization Ratio

For any token contract $c$, the collateralization ratio is defined as:

$$r_c = \frac{P_c}{S_{\text{PNEUMA}}}$$

where:
- $P_c$ = amount of PNEUMA tokens collateralized for contract $c$
- $S_{\text{PNEUMA}}$ = total PNEUMA supply (2.1B)

### 2.2 Amplified Weight Calculation

The amplified weight for contract $c$ becomes:

$$W_c = W_{\text{base}} + (r_c \times (1 - W_{\text{base}}))$$

$$W_c = 0.25 + (r_c \times 0.75)$$

This ensures that:
- Minimum weight: $W_c = 0.25$ (when $r_c = 0$, no collateralization)
- Maximum weight: $W_c = 1.0$ (when $r_c = 1$, entire PNEUMA supply collateralized)

### 2.3 Amplification Factor

The amplification factor represents the multiplier applied to the base scoring:

$$A_c = \frac{W_c}{W_{\text{base}}} = \frac{0.25 + (r_c \times 0.75)}{0.25} = 1 + 3r_c$$

This creates a linear relationship between collateralization and score amplification:
- No collateralization: $A_c = 1$ (no amplification)
- Full collateralization: $A_c = 4$ (4x amplification)

## 3. Contract Score Calculation

### 3.1 Raw Contract Score

For contract $c$ in epoch $i$, the raw score is calculated as:
```math
\text{RawScore}_{c,i} = \text{TxnFeeInvolved}_{c,i} \times W_{\text{base}}
```
```math
\text{RawScore}_{c,i} = \text{TxnFeeInvolved}_{c,i} \times 0.25
```
### 3.2 Amplified Contract Score

The amplified score incorporates the collateralization effect:
```math
\text{AmplifiedScore}_{c,i} = \text{TxnFeeInvolved}_{c,i} \times W_c
```
```math
\text{AmplifiedScore}_{c,i} = \text{TxnFeeInvolved}_{c,i} \times (0.25 + (r_c \times 0.75))
```
### 3.3 Cumulative Contract Score

The cumulative score for contract $c$ through epoch $i$ is:
```math
\text{CumulativeScore}_{c,i} = \sum_{k=1}^{i} \text{AmplifiedScore}_{c,k}
```
```math
\text{CumulativeScore}_{c,i} = \sum_{k=1}^{i} \left[\text{TxnFeeInvolved}_{c,k} \times (0.25 + (r_{c,k} \times 0.75))\right]
```
Note: $r_{c,k}$ allows for collateralization changes between epochs.

## 4. Token Valuation Framework

### 4.1 Individual Token Valuation

The valuation of token $t$ associated with contract $c$ in epoch $i$ is:

$$V_{t,i} = \text{CumulativeScore}_{c,i}$$

This creates a direct relationship between contract utility and token value, measured in PNEUMA terms.

### 4.2 Token Supply Consideration

For tokens with defined supply $S_t$, the per-token value becomes:

$$V_{\text{per-token},t,i} = \frac{\text{CumulativeScore}_{c,i}}{S_t}$$

### 4.3 Ecosystem Valuation Constraint

The total ecosystem valuation is constrained by:

$$\sum_{t=1}^{N} V_{t,i} \leq S_{\text{PNEUMA}} = 2{,}100{,}000{,}000$$

where $N$ is the total number of tokens in the ecosystem.

## 5. Collateralization Mechanics

### 5.1 PNEUMA Lock Function

The PNEUMA token implements a lock function:

```solidity
function lockFor(address contractAddress, uint256 amount) external
```

This function:
- Locks PNEUMA tokens in the caller's wallet
- Associates locked tokens with a specific contract address
- Implements one-way collateralization (no withdrawal mechanism)

### 5.2 Collateral Tracking

For each contract $c$, the system tracks:

$$P_c = \sum_{j=1}^{M} \text{LockedAmount}_{j,c}$$

where $M$ is the number of addresses that have locked PNEUMA for contract $c$.

### 5.3 Dynamic Collateralization

The collateralization ratio can change over time as more PNEUMA is locked:

$$r_{c,i} = \frac{P_{c,i}}{S_{\text{PNEUMA}}}$$

where $P_{c,i}$ represents the cumulative PNEUMA locked for contract $c$ through epoch $i$.

## 6. Valuation Growth Dynamics

### 6.1 Growth Through Utility

Token valuation grows through increased contract activity:

$$\frac{dV_{t,i}}{dt} = \text{TxnFeeInvolved}_{c,i} \times W_c$$

### 6.2 Growth Through Collateralization

Additional collateralization increases the amplification factor:
```math
\frac{dV_{t,i}}{dP_c} = \text{CumulativeScore}_{c,i} \times \frac{0.75}{S_{\text{PNEUMA}}}
```
### 6.3 Combined Growth Rate

The total growth rate combines both mechanisms:
```math
\frac{dV_{t,i}}{dt} = \text{TxnFeeInvolved}_{c,i} \times W_c + \text{CumulativeScore}_{c,i} \times \frac{0.75}{S_{\text{PNEUMA}}} \times \frac{dP_c}{dt}
```
## 7. Exchange Rate Calculations

### 7.1 Token-to-Token Exchange Rate

For trading Token A (with valuation $V_A$) for Token B (with valuation $V_B$):

$$\text{Exchange Rate}_{A \to B} = \frac{V_A}{V_B}$$

### 7.2 PNEUMA-Denominated Pricing

All token values are naturally expressed in PNEUMA terms:
```math
\text{Price}_{t,i} = \frac{V_{t,i}}{S_t} \text{ PNEUMA per token}
```
### 7.3 Cross-Token Valuation

The relative value between any two tokens:
```math
\text{Relative Value}_{A,B} = \frac{V_A}{V_B} = \frac{\text{CumulativeScore}_{A}}{\text{CumulativeScore}_{B}}
```
## 8. Economic Implications

### 8.1 Collateral Efficiency

The efficiency of collateralization depends on the contract's activity level:
```math
\text{Efficiency}_c = \frac{\text{CumulativeScore}_{c,i}}{P_c}
```
Higher efficiency indicates better return on collateral investment.

### 8.2 Ecosystem Value Distribution

The proportion of ecosystem value held by token $t$:
```math
\text{Value Share}_t = \frac{V_{t,i}}{\sum_{k=1}^{N} V_{k,i}}
```
### 8.3 Collateral Utilization

The percentage of PNEUMA supply used for collateralization:

$$\text{Utilization Rate} = \frac{\sum_{c=1}^{C} P_c}{S_{\text{PNEUMA}}} \times 100\%$$

where $C$ is the number of collateralized contracts.

## 9. Mathematical Properties

### 9.1 Monotonicity

Token valuations are monotonically increasing:
- $V_{t,i} \geq V_{t,i-1}$ for all $t$ and $i$
- Additional activity or collateralization can only increase value

### 9.2 Bounded Growth

The ecosystem valuation is bounded:
- $0 \leq V_{t,i} \leq S_{\text{PNEUMA}}$ for any individual token
- $\sum_{t=1}^{N} V_{t,i} \leq S_{\text{PNEUMA}}$ for the entire ecosystem

### 9.3 Proportional Scaling

Token values scale proportionally with their contract activity and collateralization levels, ensuring fair value distribution based on actual utility contribution.

## 10. Implementation Considerations

### 10.1 Oracle Requirements

The system requires real-time tracking of:
- Contract transaction volumes
- Gas fee consumption
- Collateralization levels
- Cumulative score calculations

### 10.2 LaunchPad Integration

The LaunchPad platform facilitates:
- Token registration and contract association
- Collateralization management
- Valuation monitoring and reporting
- Exchange rate calculations

### 10.3 Security Mechanisms

The system includes safeguards for:
- Preventing collateral withdrawal
- Validating contract associations
- Ensuring mathematical consistency
- Protecting against manipulation attempts

---

*This mathematical framework provides the foundation for token valuation within the Pneuma Protocol ecosystem, ensuring sustainable growth while maintaining ecosystem-wide value constraints.*