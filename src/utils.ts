import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import { UserInfo, ProtocolStatistics } from "../generated/schema";
import { StakingInitialized } from "../generated/StakingContract/StakingContract";

export function loadOrCreateUserInfo(address: Bytes): UserInfo {
  let userInfo = UserInfo.load(address);

  if (!userInfo) {
    userInfo = new UserInfo(address);
    userInfo.lastStakeTimestamp = BigInt.zero();
    userInfo.pendingRewards = BigInt.zero();
    userInfo.stakedAmount = BigInt.zero();
    userInfo.save();

    let protocolStats = loadOrCreateProtocolStatistics("1");
    protocolStats.totalUsers = protocolStats.totalUsers.plus(BigInt.fromI32(1));
 
    protocolStats.save();
  }

  return userInfo;
}

export function loadOrCreateProtocolStatistics(id: string) {
  let protocolStatistics = ProtocolStatistics.load(id);
  if (!protocolStatistics) {
    protocolStatistics = new ProtocolStatistics(id);
    protocolStatistics.initialApr = BigInt.zero();
    protocolStatistics.currentRewardRate = BigInt.zero();

    protocolStatistics.totalStaked = BigInt.zero();
    protocolStatistics.totalUsers = BigInt.zero();

    protocolStatistics.save();
  }

  return protocolStatistics;
}
