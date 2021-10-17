import { BettingGamePlayer } from "./bettingGamePlayer.class";
import { BettingGame } from "./bettingGame.class";
import { BalanceLimits } from "../customTypes/balanceLimits.type";
import { Config } from "../customTypes/config.type";
import { EventEmitter } from "events";
import { GameBuilder } from "./gameBuilder.class";
export class BettingGameBuilder extends GameBuilder {
    public verbose: boolean;
    constructor({ verbose = true }: { verbose?: boolean }) {
        super();
        this.verbose = verbose
    }

    public createGame({ name, players, balanceLimits, winningProbability = 50, betsPerSecond = 1, playerActivity = 50, winningMultiplier = 1 }: Config): BettingGame {
        console.log(this.verbose ? `creating game ${name}` : '');
        const emitter = new EventEmitter();
        const game = new BettingGame({ name: name, emitter: emitter, winningMultiplier: winningMultiplier, verbose: this.verbose });
        game.players = Array(players).fill(null).map((_element, index) => this.createPlayer({ balanceLimits: balanceLimits, emitter: emitter, name: `player-${index}`, winningProbability: winningProbability, betsPerSecond: betsPerSecond, playerActivity: playerActivity }));
        return game;
    }

    public createPlayer({ balanceLimits, emitter, name, winningProbability = 50, betsPerSecond = 1, playerActivity = 50 }: { balanceLimits: BalanceLimits, emitter: EventEmitter, name: string, winningProbability?: number, betsPerSecond?: number, playerActivity?: number }): BettingGamePlayer {
        const playerBalance = this.getRandomBalance({ top: balanceLimits.top, bottom: balanceLimits.bottom });
        console.log(this.verbose ? `player ${name} joins the game with ${playerBalance} euros!` : '');
        return new BettingGamePlayer({ balance: playerBalance, emitter: emitter, name: name, winningProbability: winningProbability, betsPerSecond: betsPerSecond, playerActivity: playerActivity, verbose: this.verbose });
    }

    public getRandomBalance({ top, bottom }: BalanceLimits): number {
        if (top < bottom || bottom > top) {
            top = bottom;
            bottom = top;
        }
        return Math.floor(Math.random() * (top - bottom + 1)) + bottom;
    }
}