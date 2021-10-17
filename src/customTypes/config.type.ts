import { BalanceLimits } from "./balanceLimits.type";
export type Config = {
    name: string,
    winningProbability?: number,
    betsPerSecond:number,
    playerActivity:number,
    winningMultiplier:number,
    players: number,
    balanceLimits: BalanceLimits
}