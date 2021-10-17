import { BettingGameBuilder } from "./classes/bettingGameBuilder.class";
import { env } from "./config/env";
const gameBuilder: BettingGameBuilder = new BettingGameBuilder({verbose:true});
gameBuilder.createGame(env).gameStart();
