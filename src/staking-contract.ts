import { BigInt } from "@graphprotocol/graph-ts";
import {
  EmergencyWithdrawn as EmergencyWithdrawnEvent,
  RewardsClaimed as RewardsClaimedEvent,
  Staked as StakedEvent,
  StakingInitialized as StakingInitializedEvent,
  Withdrawn as WithdrawnEvent,
} from "../generated/StakingContract/StakingContract";
import { ProtocolStatistics } from "../generated/schema";
import { loadOrCreateUserInfo } from "./utils";

export function handleEmergencyWithdrawn(event: EmergencyWithdrawnEvent): void {
  let userInfo = loadOrCreateUserInfo(event.params.user);
  userInfo.stakedAmount = BigInt.zero();
  userInfo.pendingRewards = BigInt.zero();
  userInfo.totalWithdrawn = userInfo.totalWithdrawn.plus(event.params.amount);
  userInfo.updatedAt = event.block.timestamp;

  let protocolStatistics = ProtocolStatistics.load("1");
  if (protocolStatistics) {
    protocolStatistics.totalStaked = event.params.newTotalStaked;
    protocolStatistics.save();
  }

  userInfo.save();
}

export function handleRewardsClaimed(event: RewardsClaimedEvent): void {
  let userInfo = loadOrCreateUserInfo(event.params.user);
  userInfo.pendingRewards = event.params.newPendingRewards;
  userInfo.totalClaimed = userInfo.totalClaimed.plus(event.params.amount);
  userInfo.updatedAt = event.block.timestamp;

  let protocolStatistics = ProtocolStatistics.load("1");
  if (protocolStatistics) {
    protocolStatistics.totalStaked = event.params.totalStaked;
    protocolStatistics.save();
  }

  userInfo.save();
}

export function handleStaked(event: StakedEvent): void {
  let userInfo = loadOrCreateUserInfo(event.params.user);
  userInfo.stakedAmount = userInfo.stakedAmount.plus(event.params.amount);
  userInfo.lastStakeTimestamp = event.params.timestamp;
  if (userInfo.createdAt.equals(BigInt.zero())) {
    userInfo.createdAt = event.block.timestamp;
  }
  userInfo.updatedAt = event.block.timestamp;

  let protocolStatistics = ProtocolStatistics.load("1");
  if (protocolStatistics) {
    protocolStatistics.totalStaked = event.params.newTotalStaked;
    protocolStatistics.currentRewardRate = event.params.currentRewardRate;
    protocolStatistics.save();
  }

  userInfo.save();
}

export function handleWithdrawn(event: WithdrawnEvent): void {
  let userInfo = loadOrCreateUserInfo(event.params.user);
  userInfo.stakedAmount = userInfo.stakedAmount.minus(event.params.amount);
  userInfo.pendingRewards = event.params.rewardsAccrued;
  userInfo.totalWithdrawn = userInfo.totalWithdrawn.plus(event.params.amount);
  userInfo.updatedAt = event.block.timestamp;

  let protocolStatistics = ProtocolStatistics.load("1");
  if (protocolStatistics) {
    protocolStatistics.totalStaked = event.params.newTotalStaked;
    protocolStatistics.currentRewardRate = event.params.currentRewardRate;
    protocolStatistics.save();
  }

  userInfo.save();
}

export function handleStakingInitialized(event: StakingInitializedEvent): void {
  let protocolStatistics = new ProtocolStatistics("1");
  protocolStatistics.initialApr = event.params.initialRewardRate;
  protocolStatistics.currentRewardRate = event.params.initialRewardRate;

  protocolStatistics.totalStaked = BigInt.zero();
  protocolStatistics.totalUsers = BigInt.zero();

  protocolStatistics.save();
}
