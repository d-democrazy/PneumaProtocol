# Reward Distribution System

PNEUMA tokens are distributed to participants based on their **cumulative lifetime Score**. The total supply of PNEUMA is capped at **2.1 billion** tokens, allocated over **25 epochs** of 4 years each following a deflationary schedule.

## 1. Deflationary Allocation

Let:
- $S_{\text{total}} = 2{,}100{,}000{,}000$ PNEUMA (total supply)
- $N = 25$ epochs
- $r = 0.90$ (deflation rate per epoch; 10% drop each epoch)

We solve for the initial epoch allocation $S_1$ via the geometric series:

$$
   S_1 = \frac{\text{TotalSupply} \times (1 - r)}{1 - r^{25}}
   = \frac{2.1\times10^9 \times (1 - 0.9)}{1 - 0.9^{25}}
   \approx 226{,}241{,}857
   $$

(≈ 10.77% of total supply)

Then the allocation for epoch $i$ is:

$$S_i = S_1 \times r^{i-1}$$

This yields approximate allocations such as:
## Epoch Allocation Table

| Epoch | Calculation | Allocation (PNEUMA) | Allocation (Millions) | Percentage of Total |
|-------|------------|--------------------|--------------------|-------------------|
| 1 | 226,241,857 × 0.9⁰ | 226,241,857 | 226.242 | 10.773% |
| 2 | 226,241,857 × 0.9¹ | 203,617,672 | 203.618 | 9.696% |
| 3 | 226,241,857 × 0.9² | 183,255,905 | 183.256 | 8.726% |
| 4 | 226,241,857 × 0.9³ | 164,930,314 | 164.930 | 7.854% |
| 5 | 226,241,857 × 0.9⁴ | 148,437,283 | 148.437 | 7.068% |
| 6 | 226,241,857 × 0.9⁵ | 133,593,554 | 133.594 | 6.362% |
| 7 | 226,241,857 × 0.9⁶ | 120,234,199 | 120.234 | 5.725% |
| 8 | 226,241,857 × 0.9⁷ | 108,210,779 | 108.211 | 5.153% |
| 9 | 226,241,857 × 0.9⁸ | 97,389,701 | 97.390 | 4.638% |
| 10 | 226,241,857 × 0.9⁹ | 87,650,731 | 87.651 | 4.174% |
| 11 | 226,241,857 × 0.9¹⁰ | 78,885,658 | 78.886 | 3.756% |
| 12 | 226,241,857 × 0.9¹¹ | 70,997,092 | 70.997 | 3.381% |
| 13 | 226,241,857 × 0.9¹² | 63,897,383 | 63.897 | 3.043% |
| 14 | 226,241,857 × 0.9¹³ | 57,507,645 | 57.508 | 2.738% |
| 15 | 226,241,857 × 0.9¹⁴ | 51,756,880 | 51.757 | 2.465% |
| 16 | 226,241,857 × 0.9¹⁵ | 46,581,192 | 46.581 | 2.218% |
| 17 | 226,241,857 × 0.9¹⁶ | 41,923,073 | 41.923 | 1.996% |
| 18 | 226,241,857 × 0.9¹⁷ | 37,730,766 | 37.731 | 1.797% |
| 19 | 226,241,857 × 0.9¹⁸ | 33,957,689 | 33.958 | 1.617% |
| 20 | 226,241,857 × 0.9¹⁹ | 30,561,920 | 30.562 | 1.455% |
| 21 | 226,241,857 × 0.9²⁰ | 27,505,728 | 27.506 | 1.310% |
| 22 | 226,241,857 × 0.9²¹ | 24,755,155 | 24.755 | 1.179% |
| 23 | 226,241,857 × 0.9²² | 22,279,640 | 22.280 | 1.061% |
| 24 | 226,241,857 × 0.9²³ | 20,051,676 | 20.052 | 0.955% |
| 25 | 226,241,857 × 0.9²⁴ | 18,046,508 | 18.047 | 0.859% |

**Total Allocation**: 2,100,000,000 PNEUMA (exactly)

## 2. Cumulative Lifetime Scoring System

### 2.1 Individual Score Calculation

For each wallet $j$, the score in epoch $i$ is calculated as:

$$\text{Score}_{j,i} = \text{TxnFeePaid}_{j,i} + 0.25 \times \text{TxnFeeInvolved}_{j,i}$$

where:
- $\text{TxnFeePaid}_{j,i}$ = gas fees paid by wallet $j$ for transactions it initiates in epoch $i$
- $\text{TxnFeeInvolved}_{j,i}$ = gas fees from transactions where wallet $j$ is involved but didn't initiate

### 2.2 Cumulative Lifetime Score

The **cumulative lifetime score** for wallet $j$ at the end of epoch $i$ is:

$$\text{CumulativeScore}_{j,i} = \sum_{k=1}^{i} \text{Score}_{j,k}$$

This represents the total accumulated contribution of wallet $j$ from epoch 1 through epoch $i$.

## 3. Reward Formula

Within each epoch $i$, each wallet $j$ earns:

$$\text{Reward}_{j,i} = \frac{\text{CumulativeScore}_{j,i}}{\sum_{k=1}^{P_i} \text{CumulativeScore}_{k,i}} \times S_i$$

where:
- $\text{CumulativeScore}_{j,i}$ is wallet $j$'s cumulative lifetime score through epoch $i$
- $\sum_{k=1}^{P_i} \text{CumulativeScore}_{k,i}$ is the total network cumulative score in epoch $i$
- $P_i$ is the number of active participants in epoch $i$

## 4. Parameter Summary

| Parameter | Value |
|-----------|-------|
| Total Supply | 2,100,000,000 PNEUMA |
| Epochs | 25 |
| Epoch Duration | 4 years each |
| Deflation Rate | 10% per epoch ($r = 0.90$) |
| Initial Allocation | ~226,000,000 PNEUMA (≈10.76%) |
| TxnFeePaid Weight | 1.0 (100%) |
| TxnFeeInvolved Weight | 0.25 (25%) |

## 5. Detailed Example Calculation

Consider a wallet with the following parameters:
- **Initial score**: 0 - 15 (starting range)
- **Transaction growth**: 400 - 2000 transactions in epoch 1, incrementing each epoch by 500 - 1000
- **TxnFeePaid : TxnFeeInvolved ratio** = 3:5
- **Network fee per transaction**: 0.006 - 0.3 CORE (uniform distribution)
- **Number of participants in epoch 1**: 500, incrementing each epoch by 378 - 800

### 5.1 Transaction Distribution

For our example wallet, let's use these randomized values:
- **Epoch 1 transactions**: 1,247 (random between 400-2000)
- **Epoch 2 increment**: 734 (random between 500-1000)
- **Epoch 3 increment**: 892 (random between 500-1000)

For epoch $i$, the wallet processes:
- **Epoch 1**: 1,247 transactions
- **Epoch 2**: 1,247 + 734 = 1,981 transactions  
- **Epoch 3**: 1,981 + 892 = 2,873 transactions

**Transaction Type Distribution** (3:5 ratio):
- TxnFeePaid transactions: $\frac{3}{8} \times \text{total transactions}$
- TxnFeeInvolved transactions: $\frac{5}{8} \times \text{total transactions}$

### 5.2 Score Calculation for Epochs 1-3

**Random fee per transaction values**:
- Epoch 1: 0.187 CORE (random between 0.006-0.3)
- Epoch 2: 0.094 CORE (random between 0.006-0.3)
- Epoch 3: 0.241 CORE (random between 0.006-0.3)

**Epoch 1** ($i = 1$):
- Total transactions: $1{,}247$
- TxnFeePaid transactions: $\frac{3}{8} \times 1{,}247 = 467.625 \approx 468$
- TxnFeeInvolved transactions: $\frac{5}{8} \times 1{,}247 = 779.375 \approx 779$
- Fee per transaction: $0.187$ CORE
- $\text{TxnFeePaid}_{j,1} = 468 \times 0.187 = 87.52$ CORE
- $\text{TxnFeeInvolved}_{j,1} = 779 \times 0.187 = 145.67$ CORE
- $\text{Score}_{j,1} = 87.52 + 0.25 \times 145.67 = 87.52 + 36.42 = 123.94$ CORE
- $\text{CumulativeScore}_{j,1} = 123.94$ CORE

**Epoch 2** ($i = 2$):
- Total transactions: $1{,}981$
- TxnFeePaid transactions: $\frac{3}{8} \times 1{,}981 = 742.875 \approx 743$
- TxnFeeInvolved transactions: $\frac{5}{8} \times 1{,}981 = 1{,}238.125 \approx 1{,}238$
- Fee per transaction: $0.094$ CORE
- $\text{TxnFeePaid}_{j,2} = 743 \times 0.094 = 69.84$ CORE
- $\text{TxnFeeInvolved}_{j,2} = 1{,}238 \times 0.094 = 116.37$ CORE
- $\text{Score}_{j,2} = 69.84 + 0.25 \times 116.37 = 69.84 + 29.09 = 98.93$ CORE
- $\text{CumulativeScore}_{j,2} = 123.94 + 98.93 = 222.87$ CORE

**Epoch 3** ($i = 3$):
- Total transactions: $2{,}873$
- TxnFeePaid transactions: $\frac{3}{8} \times 2{,}873 = 1{,}077.375 \approx 1{,}077$
- TxnFeeInvolved transactions: $\frac{5}{8} \times 2{,}873 = 1{,}795.625 \approx 1{,}796$
- Fee per transaction: $0.241$ CORE
- $\text{TxnFeePaid}_{j,3} = 1{,}077 \times 0.241 = 259.56$ CORE
- $\text{TxnFeeInvolved}_{j,3} = 1{,}796 \times 0.241 = 432.84$ CORE
- $\text{Score}_{j,3} = 259.56 + 0.25 \times 432.84 = 259.56 + 108.21 = 367.77$ CORE
- $\text{CumulativeScore}_{j,3} = 222.87 + 367.77 = 590.64$ CORE

### 5.3 Participant Network Growth

**Random participant values**:
- Epoch 1: 500 participants (starting value)
- Epoch 2: 500 + 612 = 1,112 participants (increment: 612, random between 378-800)
- Epoch 3: 1,112 + 445 = 1,557 participants (increment: 445, random between 378-800)

**Estimated Total Network Cumulative Scores**:
Assuming similar activity patterns across participants:
- Epoch 1: $500 \times 123.94 = 61{,}970$ CORE (baseline estimate)
- Epoch 2: $1{,}112 \times 222.87 = 247{,}831$ CORE (baseline estimate)
- Epoch 3: $1{,}557 \times 590.64 = 919{,}606$ CORE (baseline estimate)

### 5.4 Reward Calculation Examples

**Epoch 1 Reward**:
- Wallet cumulative score: $123.94$ CORE
- Total network cumulative score: $61{,}970$ CORE
- Epoch 1 allocation: $S_1 = 226{,}241{,}857$ PNEUMA

$$\text{Reward}_{j,1} = \frac{123.94}{61{,}970} \times 226{,}241{,}857 = 452{,}638 \text{ PNEUMA}$$

**Epoch 2 Reward**:
- Wallet cumulative score: $222.87$ CORE
- Total network cumulative score: $247{,}831$ CORE
- Epoch 2 allocation: $S_2 = 226{,}241{,}857 \times 0.9 = 203{,}617{,}672$ PNEUMA

$$\text{Reward}_{j,2} = \frac{222.87}{247{,}831} \times 203{,}617{,}672 = 183{,}004 \text{ PNEUMA}$$

**Epoch 3 Reward**:
- Wallet cumulative score: $590.64$ CORE
- Total network cumulative score: $919{,}606$ CORE
- Epoch 3 allocation: $S_3 = 226{,}241{,}857 \times 0.9^2 = 183{,}255{,}905 \text{ PNEUMA}$

$$\text{Reward}_{j,3} = \frac{590.64}{919{,}606} \times 183{,}255{,}905 = 117{,}742 \text{ PNEUMA}$$

### 5.5 General Formula for Wallet Activity

Let's define the general parameters for any epoch $i$:
- $T_1$ = initial transactions in epoch 1 (random between 400-2000)
- $\Delta T_i$ = transaction increment for epoch $i$ (random between 500-1000)
- $f_i$ = fee per transaction in epoch $i$ (random between 0.006-0.3)
- $P_1$ = initial participants in epoch 1 (500)
- $\Delta P_i$ = participant increment for epoch $i$ (random between 378-800)

**Total transactions for epoch $i$**:
$$T_i = T_1 + \sum_{k=2}^{i} \Delta T_k$$

**Score for epoch $i$**:
$$\text{Score}_{j,i} = f_i \times T_i \times \left(\frac{3}{8} + 0.25 \times \frac{5}{8}\right) = f_i \times T_i \times \frac{3 + 1.25}{8} = f_i \times T_i \times 0.53125$$

**Cumulative score through epoch $i$**:
$$\text{CumulativeScore}_{j,i} = \sum_{k=1}^{i} \text{Score}_{j,k} = \sum_{k=1}^{i} (f_k \times T_k \times 0.53125)$$

**Total participants in epoch $i$**:
$$P_i = P_1 + \sum_{k=2}^{i} \Delta P_k = 500 + \sum_{k=2}^{i} \Delta P_k$$

**Reward for epoch $i$**:
$$\text{Reward}_{j,i} = \frac{\text{CumulativeScore}_{j,i}}{\text{NetworkCumulativeScore}_i} \times S_i$$

where $S_i = 226{,}241{,}857 \times 0.9^{i-1}$ is the epoch allocation.

**General Network Score Estimation**:
If we assume all participants follow similar patterns:
$$\text{NetworkCumulativeScore}_i \approx P_i \times \text{CumulativeScore}_{j,i}$$

## 6. Key Properties

1. **Lifetime Accumulation**: Scores never reset, creating compound advantages for long-term participants
2. **Proportional Distribution**: Rewards are always proportional to cumulative contribution
3. **Deflationary Pressure**: Earlier epochs offer higher absolute rewards
4. **Fair Entry**: New participants can still achieve significant rewards through high activity
5. **Network Growth**: Total rewards decrease over time, but individual shares can grow through sustained participation