import { EventEmitter } from "events";
export abstract class Game {

    public name: string;
    //posible game states are defined by child classes because they are specific to each type of Game
    public emitter: EventEmitter;

    constructor({ name, emitter }: { name: string, emitter: EventEmitter }) {
        this.name = name;
        this.emitter = emitter
    }

    /*
    A game at least, always has to implement an action on start, finish, and a condition to finishing or winning the game.
    */
    public abstract checkGameFinishCondition(): boolean;
    public abstract gameFinish(): void;
    public abstract gameStart(): void;




}