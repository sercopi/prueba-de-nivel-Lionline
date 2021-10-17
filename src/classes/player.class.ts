import EventEmitter from "events";
export abstract class Player {
    public balance: number;
    public initialBalance: number;
    public emitter: EventEmitter;
    public name: string;
    constructor({ balance = 0, emitter, name }: { balance: number, emitter: EventEmitter, name: string }) {
        this.balance = balance;
        this.initialBalance = balance;
        this.emitter = emitter;
        this.name = name;
    }

    /*
    Players always have an action relative to the game they are being implemented in and a game start/finish action
    */
    public abstract gameAction(): void;
    public abstract gameStartAction(): void;
    public abstract gameFinishAction(): void;

}