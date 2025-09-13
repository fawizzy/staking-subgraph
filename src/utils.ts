import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import { UserInfo } from "../generated/schema";

export function loadOrCreateUserInfo(address: Bytes ): UserInfo{
    let userInfo = UserInfo.load(address);
    if (!userInfo){
        userInfo = new UserInfo(address);
        userInfo.lastStake = BigInt.fromI64(0);
        userInfo.pendingRewards = BigInt.fromI64(0);
        userInfo.stakedAmount = BigInt.fromI64(0);
        userInfo.save();      
    }

    return userInfo;
}

