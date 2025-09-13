import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import { UserInfo, ProtocolStatistics } from "../generated/schema";

export function loadOrCreateUserInfo(address: Bytes): UserInfo {
  let userInfo = UserInfo.load(address);

  if (!userInfo) {
    userInfo = new UserInfo(address);
    userInfo.lastStakeTimestamp = BigInt.zero();
    userInfo.pendingRewards = BigInt.zero();
    userInfo.stakedAmount = BigInt.zero();
    userInfo.save();

    let protocolStats = ProtocolStatistics.load("1");
   if (protocolStats){
    protocolStats.totalUsers = protocolStats.totalUsers.plus(BigInt.fromI32(1));
    protocolStats.save();

   } 
    
  }

  return userInfo;
}
