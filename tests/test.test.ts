import { EventEmitter } from "events";
import { BettingGameBuilder } from "../src/classes/bettingGameBuilder.class";
import { BettingGame } from "../src/classes/bettingGame.class";
import { env } from "./../src/config/env";
import { BettingGamePlayer } from "../src/classes/bettingGamePlayer.class";
/***************************
 * 
 * BUILDER TESTS
 * 
 ***************************/
describe('bettingGameBuilder', function () {
    describe('bettingGameBuilder.getRandomBalance', function () {
        it('returns a value between the given params', function () {
            const bettingGameBuilder = new BettingGameBuilder({ verbose: false });
            //testing that it works properly (even though its a random number generator and can't be tested properly)
            expect(bettingGameBuilder.getRandomBalance({ top: 10, bottom: 2 })).toBeLessThanOrEqual(10);
            expect(bettingGameBuilder.getRandomBalance({ top: 10, bottom: 2 })).toBeGreaterThanOrEqual(2);
        });
        it('returns a value between the given params if the params are inputed wrong in reverse', function () {
            const bettingGameBuilder = new BettingGameBuilder({ verbose: false });
            //testing that it works properly (even though its a random number generator and can't be tested properly)
            expect(bettingGameBuilder.getRandomBalance({ top: 2, bottom: 10 })).toBeLessThanOrEqual(10);
            expect(bettingGameBuilder.getRandomBalance({ top: 2, bottom: 10 })).toBeGreaterThanOrEqual(2);
        });
    });
    describe('bettingGameBuilder.createPlayer', function () {
        it('testing it returns a player with the specified values correctly set up', function () {
            const emitter = new EventEmitter;
            const bettingGameBuilder = new BettingGameBuilder({ verbose: false });
            const bettingPlayer = bettingGameBuilder.createPlayer({ balanceLimits: { top: 10, bottom: 1 }, emitter: emitter, name: "mock name", winningProbability: 50, betsPerSecond: 1, playerActivity: 50 });
            expect(bettingPlayer.balance).toBeLessThanOrEqual(10);
            expect(bettingPlayer.balance).toBeGreaterThanOrEqual(1);
            expect(bettingPlayer.name).toBe("mock name");
            expect(bettingPlayer.winningProbability).toBe(50);
            expect(bettingPlayer.betsPerSecond).toBe(1);
            expect(bettingPlayer.playerActivity).toBe(50);
        });
        it('testing it returns a player with the specified values correctly set up without providing optional values', function () {
            const emitter = new EventEmitter;
            const bettingGameBuilder = new BettingGameBuilder({ verbose: false });
            const bettingPlayer = bettingGameBuilder.createPlayer({ balanceLimits: { top: 10, bottom: 1 }, emitter: emitter, name: "mock name" });
            expect(bettingPlayer.balance).toBeLessThanOrEqual(10);
            expect(bettingPlayer.balance).toBeGreaterThanOrEqual(1);
            expect(bettingPlayer.name).toBe("mock name");
            expect(bettingPlayer.winningProbability).toBe(50);
            expect(bettingPlayer.playerActivity).toBe(50);
            expect(bettingPlayer.betsPerSecond).toBe(1);
        });
    });
    describe('bettingGameBuilder.createGame', function () {
        it('creates a game with the amount of players specified', function () {
            const bettingGameBuilder = new BettingGameBuilder({ verbose: false });
            const bettingGame = bettingGameBuilder.createGame(env);
            expect(bettingGame.players.length).toBe(env.players);
        });
        it('creates a game with the correct params specified', function () {
            const bettingGameBuilder = new BettingGameBuilder({ verbose: false });
            const bettingGame = bettingGameBuilder.createGame(env);
            expect(bettingGame.name).toBe(env.name);
            expect(bettingGame.winningMultiplier).toBe(env.winningMultiplier);
        });
    });
});
/***************************
 * 
 * GAME TESTS
 * 
 ***************************/
describe('bettingGame', function () {
    describe('bettingGame.constructor', function () {
        it('creates a game with the correct params specified', function () {
            const emitter = new EventEmitter();
            const bettingGame = new BettingGame({ name: 'mock name', emitter: emitter, winningMultiplier: 2, verbose: false });
            expect(bettingGame.name).toBe("mock name");
            expect(bettingGame.emitter).toEqual(emitter);
            expect(bettingGame.winningMultiplier).toBe(2);
        });
        it('creates a game with the correct params specified without the optional params', function () {
            const emitter = new EventEmitter();
            const bettingGame = new BettingGame({ name: 'mock name', emitter: emitter, verbose: false });
            expect(bettingGame.name).toBe("mock name");
            expect(bettingGame.emitter).toEqual(emitter);
            expect(bettingGame.winningMultiplier).toBe(1);
        });
        it('calls setEvents function', function () {
            const emitter = new EventEmitter();
            spyOn(BettingGame.prototype, 'setEvents');
            const bettingGame = new BettingGame({ name: 'mock name', emitter: emitter, winningMultiplier: 2, verbose: false });
            expect(bettingGame.setEvents).toHaveBeenCalled();
        });
        it('sets the handler for each event correctly', function () {
            const emitter = new EventEmitter();
            spyOn(BettingGame.prototype, 'eventHandler');
            const bettingGame = new BettingGame({ name: 'mock name', emitter: emitter, winningMultiplier: 2, verbose: false });
            emitter.emit('win', { name: 'mock name', betQuantity: 2 });
            expect(bettingGame.eventHandler).toHaveBeenCalled();
            emitter.emit('bet', { name: 'mock name', betQuantity: 2 });
            expect(bettingGame.eventHandler).toHaveBeenCalled();
            emitter.emit('lose', { name: 'mock name' });
            expect(bettingGame.eventHandler).toHaveBeenCalled();
        });
    });
    describe('bettingGame findPlayerIndexByName', function () {
        it('retrieves the player correctly', function () {
            const emitter = new EventEmitter();
            const bettingGame = new BettingGame({ name: 'mock name', emitter: emitter, winningMultiplier: 2, verbose: false });
            const player = new BettingGamePlayer({ balance: 100, emitter: emitter, winningProbability: 30, name: 'player-1', betsPerSecond: 1, verbose: false });
            bettingGame.players.push(player);
            const foundPlayer = bettingGame.getPlayerIndexByName('player-1');
            expect(foundPlayer).toBe(0);
        });
        it('retrieves -1 when the player does not exist', function () {
            const emitter = new EventEmitter();
            const bettingGame = new BettingGame({ name: 'mock name', emitter: emitter, winningMultiplier: 2, verbose: false });
            const player = new BettingGamePlayer({ balance: 100, emitter: emitter, winningProbability: 30, name: 'player-1', betsPerSecond: 1, verbose: false });
            const foundPlayer = bettingGame.getPlayerIndexByName('incorrect mock name');
            expect(foundPlayer).toBe(-1);
        })
    });
    describe('bettingGame getWinningPlayer', function () {
        it('retrieves the player correctly', function () {
            const emitter = new EventEmitter();
            const bettingGame = new BettingGame({ name: 'mock name', emitter: emitter, winningMultiplier: 2, verbose: false });
            const player1 = new BettingGamePlayer({ balance: 100, emitter: emitter, winningProbability: 30, name: 'player-1', betsPerSecond: 1, verbose: false });
            const player2 = new BettingGamePlayer({ balance: 0, emitter: emitter, winningProbability: 30, name: 'player-1', betsPerSecond: 1, verbose: false });
            const player3 = new BettingGamePlayer({ balance: 0, emitter: emitter, winningProbability: 30, name: 'player-1', betsPerSecond: 1, verbose: false });
            bettingGame.players = [player1, player2, player3];
            const foundPlayer = bettingGame.getWinningPlayer();
            expect(foundPlayer).toBe(0);
        });
    });
    describe('bettingGame checkGameFinishCondition', function () {
        it('retrieves false when more than one players balances are positive', function () {
            const emitter = new EventEmitter();
            const bettingGame = new BettingGame({ name: 'mock name', emitter: emitter, winningMultiplier: 2, verbose: false });
            const player1 = new BettingGamePlayer({ balance: 100, emitter: emitter, winningProbability: 30, name: 'player-1', betsPerSecond: 1, verbose: false });
            const player2 = new BettingGamePlayer({ balance: 100, emitter: emitter, winningProbability: 30, name: 'player-1', betsPerSecond: 1, verbose: false });
            const player3 = new BettingGamePlayer({ balance: 0, emitter: emitter, winningProbability: 30, name: 'player-1', betsPerSecond: 1, verbose: false });
            bettingGame.players = [player1, player2, player3];
            const isGameFinished = bettingGame.checkGameFinishCondition();
            expect(isGameFinished).toBe(false);
        });
        it('retrieves true when there is only one player with a positive balance', function () {
            const emitter = new EventEmitter();
            const bettingGame = new BettingGame({ name: 'mock name', emitter: emitter, winningMultiplier: 2, verbose: false });
            const player1 = new BettingGamePlayer({ balance: 100, emitter: emitter, winningProbability: 30, name: 'player-1', betsPerSecond: 1, verbose: false });
            const player2 = new BettingGamePlayer({ balance: 0, emitter: emitter, winningProbability: 30, name: 'player-1', betsPerSecond: 1, verbose: false });
            const player3 = new BettingGamePlayer({ balance: 0, emitter: emitter, winningProbability: 30, name: 'player-1', betsPerSecond: 1, verbose: false });
            bettingGame.players = [player1, player2, player3];
            const isGameFinished = bettingGame.checkGameFinishCondition();
            expect(isGameFinished).toBe(true);
        })
    })
    describe('bettingGame events', function () {
        it('event bet works on player', function () {
            const emitter = new EventEmitter();
            const bettingGame = new BettingGame({ name: 'mock name', emitter: emitter, winningMultiplier: 2, verbose: false });
            const player = new BettingGamePlayer({ balance: 100, emitter: emitter, winningProbability: 30, name: 'player-1', betsPerSecond: 1, verbose: false });
            bettingGame.players.push(player);
            emitter.emit('bet', { name: 'player-1', betQuantity: 2 });
            expect(player.balance).toBe(98);
        });
        it('event win works on player', function () {
            const emitter = new EventEmitter();
            const bettingGame = new BettingGame({ name: 'mock name', emitter: emitter, winningMultiplier: 2, verbose: false });
            const player = new BettingGamePlayer({ balance: 100, emitter: emitter, winningProbability: 30, name: 'player-1', betsPerSecond: 1, verbose: false });
            const previousBalance = player.balance;
            const mockBetQuantity = 2;
            const balanceAfterWin = previousBalance + (mockBetQuantity * bettingGame.winningMultiplier);
            bettingGame.players.push(player);
            emitter.emit('win', { name: 'player-1', betQuantity: mockBetQuantity });
            expect(player.balance).toBe(balanceAfterWin);
        });
        it('event lose calls checkGameFinishCondition', function () {
            const emitter = new EventEmitter();
            const bettingGame = new BettingGame({ name: 'mock name', emitter: emitter, winningMultiplier: 2, verbose: false });
            const player = new BettingGamePlayer({ balance: 100, emitter: emitter, winningProbability: 30, name: 'player-1', betsPerSecond: 1, verbose: false });
            spyOn(bettingGame, 'checkGameFinishCondition');
            bettingGame.players.push(player);
            emitter.emit('lose', { name: 'player-1', betQuantity: 2 });
            expect(bettingGame.checkGameFinishCondition).toHaveBeenCalled();
        });
        it('event lose calls gameFinish when the finish condition is met', function () {
            const emitter = new EventEmitter();
            const bettingGame = new BettingGame({ name: 'mock name', emitter: emitter, winningMultiplier: 2, verbose: false });
            const player1 = new BettingGamePlayer({ balance: 100, emitter: emitter, winningProbability: 30, name: 'player-1', betsPerSecond: 1, verbose: false });
            const player2 = new BettingGamePlayer({ balance: 0, emitter: emitter, winningProbability: 30, name: 'player-1', betsPerSecond: 1, verbose: false });
            const player3 = new BettingGamePlayer({ balance: 0, emitter: emitter, winningProbability: 30, name: 'player-1', betsPerSecond: 1, verbose: false });
            bettingGame.players = [player1, player2, player3];
            spyOn(bettingGame, 'gameFinish');
            emitter.emit('lose', { name: 'player-1', betQuantity: 0 });
            expect(bettingGame.gameFinish).toHaveBeenCalled();
        });
    });
    describe('bettingGame.gameFinish', function () {
        it('calls getWinningPlayer', function () {
            const emitter = new EventEmitter();
            const bettingGame = new BettingGame({ name: 'mock name', emitter: emitter, winningMultiplier: 2, verbose: false });
            spyOn(bettingGame, 'getWinningPlayer');
            bettingGame.gameFinish();
            expect(bettingGame.getWinningPlayer).toHaveBeenCalled();
        });
        it('emits game_finish', function () {
            const emitter = new EventEmitter();
            const bettingGame = new BettingGame({ name: 'mock name', emitter: emitter, winningMultiplier: 2, verbose: false });
            spyOn(emitter, 'emit');
            bettingGame.gameFinish();
            expect(emitter.emit).toHaveBeenCalledWith("game_finish");
        })
    });
    describe('bettingGame.gameStart', function () {
        it('emits game_start', function () {
            const emitter = new EventEmitter();
            const bettingGame = new BettingGame({ name: 'mock name', emitter: emitter, winningMultiplier: 2, verbose: false });
            spyOn(emitter, 'emit');
            bettingGame.gameStart();
            expect(emitter.emit).toHaveBeenCalledWith("game_start");
        })
    });
});
/***************************
 * 
 * PLAYER TESTS
 * 
 ***************************/
describe('bettingGamePlayer', function () {
    describe('bettingGamePlayer constructor', function () {
        it('creates a BettingGamePlayer object with all the params correctly set', function () {
            const emitter = new EventEmitter();
            const player = new BettingGamePlayer({ balance: 100, emitter: emitter, winningProbability: 30, name: 'player-1', betsPerSecond: 1,playerActivity:50, verbose: false });
            expect(player.name).toBe('player-1');
            expect(player.balance).toBe(100);
            expect(player.emitter).toEqual(emitter);
            expect(player.winningProbability).toBe(30);
            expect(player.betsPerSecond).toBe(1);
            expect(player.playerActivity).toBe(50);
        });
        it('creates a BettingGamePlayer object with all the params correctly set without optional parameters', function () {
            const emitter = new EventEmitter();
            const player = new BettingGamePlayer({ emitter: emitter, winningProbability: 30, name: 'player-1', betsPerSecond: 1, verbose: false });
            expect(player.balance).toBe(0);
            expect(player.playerActivity).toBe(50);
        });
        it('sets up game_finish and game_start correctly', function () {
            const emitter = new EventEmitter();
            const player = new BettingGamePlayer({ balance: 100, emitter: emitter, winningProbability: 30, name: 'player-1', betsPerSecond: 1, verbose: false });
            spyOn(player, 'gameStartAction');
            spyOn(player, 'gameFinishAction');
            emitter.emit("game_start");
            emitter.emit("game_finish");
            expect(player.gameStartAction).toHaveBeenCalled();
            expect(player.gameFinishAction).toHaveBeenCalled();
        });
    });
    describe('bettingGamePlayer gameAction', function () {
        it('retrieves true when the bet is not won but the player still has positive balance', function () {
            const emitter = new EventEmitter();
            const player = new BettingGamePlayer({ balance: 100, emitter: emitter, winningProbability: 0, name: 'player-1', betsPerSecond: 1, verbose: false });
            spyOn(Math, 'random').and.callFake(() => 0.2);
            expect(player.gameAction()).toBe(true);
        });
        it('retrieves false when the bet is not won and the player has 0 balance', function () {
            const emitter = new EventEmitter();
            const player = new BettingGamePlayer({ balance: 0, emitter: emitter, winningProbability: 0, name: 'player-1', betsPerSecond: 1, verbose: false });
            expect(player.gameAction()).toBe(false);
        });
        it('retrieves true when the bet is won', function () {
            const emitter = new EventEmitter();
            const player = new BettingGamePlayer({ balance: 100, emitter: emitter, winningProbability: 100, name: 'player-1', betsPerSecond: 1, verbose: false });
            spyOn(Math, 'random').and.callFake(() => 0.2);
            expect(player.gameAction()).toBe(true);
        });
        it('emits bet with the correct params', function () {
            const emitter = new EventEmitter();
            const player = new BettingGamePlayer({ balance: 100, emitter: emitter, winningProbability: 0, name: 'player-1', betsPerSecond: 1, verbose: false });
            spyOn(emitter, 'emit');
            spyOn(Math, 'random').and.callFake(() => 0.2);
            player.gameAction();
            expect(emitter.emit).toHaveBeenCalledOnceWith("bet", { name: 'player-1', betQuantity: 21 })
        });
        it('emits bet AND THEN WIN with the correct params when the player won', function () {
            const emitter = new EventEmitter();
            const player = new BettingGamePlayer({ balance: 100, emitter: emitter, winningProbability: 100, name: 'player-1', betsPerSecond: 1, verbose: false });
            spyOn(emitter, 'emit');
            spyOn(Math, 'random').and.callFake(() => 0.2);
            player.gameAction();
            expect(emitter.emit).toHaveBeenCalledWith("bet", { name: 'player-1', betQuantity: 21 });
            expect(emitter.emit).toHaveBeenCalledWith("win", { name: 'player-1', betQuantity: 21 });
        });
        it('emits lose when the player bet but didnt win and there is not balance',function () {
            const emitter = new EventEmitter();
            const player = new BettingGamePlayer({ balance: 0, emitter: emitter, winningProbability: 0, name: 'player-1', betsPerSecond: 1, verbose: false });
            spyOn(emitter, 'emit');
            player.gameAction();
            expect(emitter.emit).toHaveBeenCalledWith("bet", { name: 'player-1', betQuantity: 1 });
            expect(emitter.emit).toHaveBeenCalledWith("lose", { name: 'player-1', betQuantity: 1 });
        })
    });
    describe('gameStartAction',function() {
        it('calls game action', function() {
            const emitter = new EventEmitter();
            const player = new BettingGamePlayer({ balance: 0, emitter: emitter, winningProbability: 0, name: 'player-1', betsPerSecond: 1, playerActivity:100, verbose: false });
            spyOn(player,'gameAction');
            player.gameStartAction();
            setTimeout(()=>{
                expect(player.gameAction).toHaveBeenCalled();
            },1000)
        })
    })
})