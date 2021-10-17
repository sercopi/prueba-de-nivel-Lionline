export abstract class GameBuilder {
    //this functions have to be types as any, because they can get any argument/return any type for each type of game we would like to define
    public abstract createGame({ }: any): any;
    public abstract createPlayer({ }: any): any;
}