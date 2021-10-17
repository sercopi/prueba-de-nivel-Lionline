## Prueba de nivel 

### Cómo funciona:

He modelado las especificaciones como tres clases abstractas, que definen alguna propiedad o método que he pensado sería común en otros tipos de juego y dejan otros métodos o propiedades abstractas a que se adapten según el juego que se quiera modelar, en este caso un juego de apuestas o <i>BettingGame</i>.

Todo se ejecuta desde el archivo app.ts. Para ello usa las clases mencionadas de la siguiente manera:

Instancia la clase <b>BettingGameBuilder</b> que extiende de la clase abstracta GameBuilder,y ejecuta su función "createGame" para crear un juego de tipo BettingGame con sus jugadores de tipo BettingGamePlayer que dará a cada jugador un balance inicial aleatorio entre unos parámetros definidos por el tipo BalanceLimits en la configuración.

El builder instanciará un emisor de eventos que luego delegará al juego y a los jugadores para que se puedan comunicar a través del mismo con sus eventos propios tal y como era requisito.

el juego de tipo <b>BettingGame</b> que se obtiene de la función <i>createGame</i> del builder, dispone de la función <i>actionStartGame</i> que entre otras cosas, emite el evento "game_start". Este evento será consumido por los jugadores de tipo <b>BettingGamePlayer</b> que están suscritos al mismo desde su constructor, de manera que todos los jugadores comienzan a jugar a la vez. ejecutando su función <i>gameStartAction</i>.

Para simular que los jugadores apuesten con un límite de una apuesta por segundo, se crea un intervalo nada más comenzar a jugar, que mediante el parámetro configurable "betsPerSecond" define el número de veces que el jugador apostará por segundo.

Además, para "randomizar" el comportamiento de los jugadores, existe el parámetro "playerActivity", que definirá si el jugador quiere apostar o no en ese intervalo de segundo.

Al apostar, los jugadores usan la función <i>gameAction</i> que emitirá el evento "bet" con su nombre y una cantidad aleatoria de su balance a apostar y que es consumido por el objeto BettingGame, que se encarga de restar la cantidad al balance.

En la emisión del evento "bet", se calcula en base a un parámetro configurable "winningProbability" si el jugador ha ganado, para que se emita <b>después del evento bet</b>, como era requisito, el evento "win" con el nombre y la cantidad apostada.

En caso de "win", el BettingGame que consume el evento añade al balance del jugador la cantidad que apostó más un excedente configurable por el ratio "winningQuantity".

En caso de que el jugador no ganara la apuesta, se ejecuta una comprobación a su balance que, si es nulo, hará que pierda emitiendo el evento "lose". Este evento será consumido por el BettingGame que calculará en base a todos los jugadores, si se ha cumplido la condición para finalizar el juego usando "checkGameFinishCondition". En este caso se considera que <b> el juego se termina cuando sólo queda un jugador con balance positivo </b>.

En caso de que el juego termine, el BettingGame emitirá el evento "game_finish" que consumirán todos los jugadores y que limpiará sus intervalos de acción de cada segundo, haciendo que dejen den jugar.

### Tests

Los tests se encuentran en la carpeta <i>tests</i>, están hechos con Jasmine y se realizan a las 3 clases.

He testeado de manera general las funciones de cada clase, sus constructores y su interacción mockeando o espiando los eventos del EventEmitter del que disponen. En algunos casos he tenido que mockear la función Math.random, para obligar a seguir un camino específico al test.

### Las variables de entorno
Podrían haberse hecho con la librería dotenv de node y haberlas usado como process.env."variable", aunque en este caso he usado un json que instancio y exporto con un typo específico para darle algo de validación.

### Los errores
No he emitido ningún error debido a que la ejecución estaba controlada y simulada en todo momento por el código y una configuración tipada, de manera que como no hay input mucho más input eterno, no sabía muy bien qué errores emitir...
