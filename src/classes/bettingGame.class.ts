import { EventEmitter } from "events";
import { BettingGamePlayer } from "./bettingGamePlayer.class";
import { Game } from "./game.class";

export class BettingGame extends Game {
    public players: BettingGamePlayer[] = [];
    public winningMultiplier: number;
    public verbose: boolean;
    constructor({ name, emitter, winningMultiplier = 1, verbose = true }: { name: string, emitter: EventEmitter, winningMultiplier?: number, verbose?: boolean }) {
        super({ name: name, emitter: emitter });
        this.verbose = verbose;
        this.winningMultiplier = winningMultiplier;
        this.setEvents();
    }
    public setEvents() {
        this.emitter.on("bet", data => this.eventHandler({ data: data, handler: this.betHandler.bind(this) }));
        this.emitter.on("win", data => this.eventHandler({ data: data, handler: this.winHandler.bind(this) }));
        this.emitter.on("lose", data => this.eventHandler({ data: data, handler: this.loseHandler.bind(this) }));
    }
    public betHandler({ data: { name, betQuantity }, player }: { data: { name: string, betQuantity: number }, player: BettingGamePlayer }): void {
        player.balance = player.balance - betQuantity;
        if (player.balance < 0) {
            this.loseHandler({ data: { name, betQuantity }, player });
        }
        console.log(this.verbose ? `The player ${player.name} has bet ${betQuantity} euros - balance (${player.initialBalance})${player.balance} euros.` : '');
    }
    public winHandler({ data: { name, betQuantity }, player }: { data: { name: string, betQuantity: number }, player: BettingGamePlayer }) {
        const winningQuantity = (betQuantity * this.winningMultiplier);
        player.balance = player.balance + winningQuantity;
        console.log(this.verbose ? `The player ${player.name} has won ${winningQuantity} euros :D - balance (${player.initialBalance})${player.balance} euros.` : '');
    }
    public loseHandler({ data: { name, betQuantity }, player }: { data: { name: string, betQuantity: number }, player: BettingGamePlayer }) {
        console.log(this.verbose ? `The player ${player.name} has lost D: - balance 0 euros.` : '');
        if (this.checkGameFinishCondition()) {
            this.gameFinish();
        }
    }
    public eventHandler({ data: { name, betQuantity }, handler }: { data: { name: string, betQuantity?: number }, handler: Function }) {
        let playerIndex = this.getPlayerIndexByName(name);
        if (playerIndex !== -1) {
            const player = this.players[playerIndex];
            handler({ data: { name: name, betQuantity: betQuantity }, player: player })
        }
    }
    public getPlayerIndexByName(name: string): number {
        return this.players.findIndex((player) => player.name === name);
    }
    public checkGameFinishCondition(): boolean {
        return this.players.filter(({ balance }) => balance !== 0).length === 1;
    }
    public getWinningPlayer(): number {
        return this.players.findIndex(({ balance }) => balance !== 0);
    }
    public gameFinish() {
        this.emitter.emit('game_finish');
        console.log(this.verbose ? 'The game has finished!' : '');
        const winningPlayerIndex = this.getWinningPlayer();
        console.log(this.verbose ? ((winningPlayerIndex !== -1) ? `The player ${this.players[winningPlayerIndex].name} has won with a balance of ${this.players[winningPlayerIndex].balance} euros and a difference of ${this.players[winningPlayerIndex].balance - this.players[winningPlayerIndex].initialBalance} euros from his original balance!` : `Nobody won`) : '')
    }
    public gameStart() {
        this.emitter.emit('game_start');
    }
}