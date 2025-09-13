import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
  EmergencyWithdrawn as EmergencyWithdrawnEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  Paused as PausedEvent,
  RewardRateUpdated as RewardRateUpdatedEvent,
  RewardsClaimed as RewardsClaimedEvent,
  Staked as StakedEvent,
  StakingContract,
  StakingInitialized as StakingInitializedEvent,
  StakingPaused as StakingPausedEvent,
  StakingUnpaused as StakingUnpausedEvent,
  TokenRecovered as TokenRecoveredEvent,
  Unpaused as UnpausedEvent,
  Withdrawn as WithdrawnEvent,
} from "../generated/StakingContract/StakingContract";
import {
  EmergencyWithdrawn,
  RewardsClaimed,
  Staked,
  Withdrawn,
  StakingInitialized,
  ProtocolStatitics,
  UserInfo,
} from "../generated/schema";
import { loadOrCreateUserInfo } from "./utils";

export function handleEmergencyWithdrawn(event: EmergencyWithdrawnEvent): void {

  let userInfo = loadOrCreateUserInfo(event.params.user);
  userInfo.stakedAmount = BigInt.zero();

  let protocolStatistics = ProtocolStatitics.load("1");
  if (protocolStatistics) {
    protocolStatistics.totalStaked = event.params.newTotalStaked;
    protocolStatistics.save();
  }

  userInfo.save()

}

export function handleRewardsClaimed(event: RewardsClaimedEvent): void {
 
  let userInfo = loadOrCreateUserInfo(event.params.user);
  userInfo.pendingRewards = event.params.newPendingRewards;

  let protocolStatistics = ProtocolStatitics.load("1");
  if (protocolStatistics) {
    protocolStatistics.totalStaked = event.params.totalStaked;
    protocolStatistics.save();
  }

  userInfo.save();
  
}

export function handleStaked(event: StakedEvent): void {

  let userInfo = loadOrCreateUserInfo(event.params.user);
  userInfo.stakedAmount.plus(event.params.amount);
  userInfo.lastStake = event.params.timestamp;
 

  let protocolStatistics = ProtocolStatitics.load("1");
  if (protocolStatistics) {
    protocolStatistics.totalStaked = event.params.newTotalStaked;
    protocolStatistics.currentRewardRate = event.params.currentRewardRate;
    protocolStatistics.save();
  }

  userInfo.save();
}

export function handleWithdrawn(event: WithdrawnEvent): void {
 
  let userInfo = loadOrCreateUserInfo(event.params.user);

  userInfo.stakedAmount.minus(event.params.amount);
  userInfo.pendingRewards = event.params.rewardsAccrued;

  let protocolStatistics = ProtocolStatitics.load("1");
  if (protocolStatistics) {
    protocolStatistics.totalStaked = event.params.newTotalStaked;
    protocolStatistics.currentRewardRate = event.params.currentRewardRate;
    protocolStatistics.save();
  }

  userInfo.save();
}

export function handleStakingInitialized(event: StakingInitializedEvent): void {
  let protocolStatistics = new ProtocolStatitics("1");
  protocolStatistics.initialApr = event.params.initialRewardRate;
  protocolStatistics.currentRewardRate = event.params.initialRewardRate;

  protocolStatistics.aprReductionPerThousand = BigInt.zero();
  protocolStatistics.totalStaked = BigInt.zero();
  protocolStatistics.minLockDuration = BigInt.zero();

  protocolStatistics.save();
}
