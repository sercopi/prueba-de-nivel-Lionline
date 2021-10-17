import { EventEmitter } from "events";
import { Player } from "./player.class";

export class BettingGamePlayer extends Player {
    public winningProbability: number;
    public betsPerSecond: number;
    public playerActivity: number;
    private intervalReference!: ReturnType<typeof setInterval>;
    public verbose: boolean;
    constructor({ balance = 0, emitter, name, winningProbability, betsPerSecond, playerActivity = 50, verbose = true }: { balance?: number, emitter: EventEmitter, name: string, winningProbability: number, betsPerSecond: number, playerActivity?: number, verbose?: boolean }) {
        super({ balance: balance, emitter, name });
        this.winningProbability = winningProbability;
        this.betsPerSecond = betsPerSecond;
        this.playerActivity = playerActivity;
        this.emitter.on("game_start", () => this.gameStartAction());
        this.emitter.on("game_finish", () => this.gameFinishAction());
        this.verbose = verbose;
    }
    public gameStartAction(): void {
        this.intervalReference = setInterval(() => {
            Array(this.betsPerSecond).fill(null).every(() => {
                //player has a 50% chance in the simmulation to not do anything on this iteration, that way we randomize their actions
                const playerActivityThreshold = Math.floor(Math.random() * 101);
                if (playerActivityThreshold <= this.playerActivity) {
                    return this.gameAction();
                }
            });
        }, 1000);
    }
    public gameFinishAction(): void {
        clearInterval(this.intervalReference);
    }

    public gameAction(): boolean {
        const betQuantity = Math.floor(Math.random() * (this.balance)) + 1;
        this.emitter.emit("bet", { name: this.name, betQuantity: betQuantity });
        const winningResult = Math.floor(Math.random() * 101);
        if (winningResult <= this.winningProbability) {
            this.emitter.emit("win", { name: this.name, betQuantity: betQuantity });
            return true;
        }
        if (this.balance <= 0) {
            clearInterval(this.intervalReference);
            this.emitter.emit("lose", { name: this.name, betQuantity: betQuantity })
            return false;
        }
        return true;
    }
}