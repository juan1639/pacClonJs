import {
    estado, 
    canvas, 
    ctx, 
    colores, 
    resolucion, 
    estadoFantasmas,
    marcadores, 
    objeto, 
    constante
} from './constants.js';

// ----------------------------------------------------------------------------
//  Funciones varias
// ----------------------------------------------------------------------------
function dibujarFantasmas() {
    for (let i = 0; i < constante.nro_fantasmas; i ++) {
        let corr = 9;

        if (checkColision(objeto.fantasma[i], objeto.pacman, corr) && estado.actual == 1) {

            if (!estadoFantasmas.azules) {
                estado.actual = 2;  // Secuencia PacMan Dies...
                estadoFantasmas.azules = false;
                estadoFantasmas.ptosComeFantasmas = 100;
                marcadores.vidas --;

                if (marcadores.vidas >= 0) {
                    setTimeout(() => {
                        estado.actual = 1;
                        objeto.pacman.revivirPacMan();

                        objeto.fantasma[0].revivirFantasmas(3, 8, 0, 0);
                        objeto.fantasma[1].revivirFantasmas(5, 8, 1, 0);
                        objeto.fantasma[2].revivirFantasmas(9, 8, 2, 1);
                        objeto.fantasma[3].revivirFantasmas(11, 8, 3, 1);
                    }, 3000);

                } else {
                    estado.actual = 4;  // Game Over
                    estado.gameover = true;
                }

            } else {
                //console.log('azules');
                if (!objeto.fantasma[i].comido) {
                    objeto.fantasma[i].comido = true;
                    objeto.fantasma[i].showPtos = true;
                    objeto.fantasma[i].showX = objeto.fantasma[i].x 
                    objeto.fantasma[i].showY = objeto.fantasma[i].y

                    estadoFantasmas.ptosComeFantasmas *= 2;
                    marcadores.puntos += estadoFantasmas.ptosComeFantasmas;
                    objeto.fantasma[i].showx2 = estadoFantasmas.ptosComeFantasmas;

                    setTimeout(() => {
                        objeto.fantasma[i].showPtos = false;
                    }, 2000);

                }
            }
        }

        objeto.fantasma[i].dibuja();
    }
}

// --------------------------------------------------------------------------
function dibujaTodosPuntitos() {
    for (let i = 0; i < objeto.array_puntitos.length; i ++) {
        let corr = 0;

        if (objeto.puntito[i].visible && estado.actual != 3) {
            if (checkColision(objeto.puntito[i], objeto.pacman, corr)) {
                objeto.puntito[i].visible = false;
                objeto.contPuntitosComidos ++;
                marcadores.puntos += objeto.puntito[i].sumaPtos
            }

            objeto.puntito[i].dibuja();
        }

        if (i < 4) {
            if (objeto.ptoGordo[i].visible && estado.actual != 3) {

                if (checkColision(objeto.ptoGordo[i], objeto.pacman, corr)) {
                    objeto.ptoGordo[i].visible = false;
                    objeto.contPuntitosComidos ++;
                    marcadores.puntos += objeto.ptoGordo[i].sumaPtos
                    estadoFantasmas.azules = true;

                    setTimeout(() => {
                        estadoFantasmas.azules = false;
                        estadoFantasmas.ptosComeFantasmas = 100;

                        objeto.fantasma.forEach(fant => {
                            fant.comido = false;
                        });

                    }, estadoFantasmas.duracionAzules);
                }

                objeto.ptoGordo[i].dibuja();
            }
        }
    }
}

// --------------------------------------------------------------------------
function checkComerFruta() {
    let corr = 5;

    if (checkColision(objeto.fruta, objeto.pacman, corr) && estado.actual == 1 && !objeto.fruta.comido) {
        objeto.fruta.comido = true;
        objeto.fruta.showPtos = true;
        objeto.fruta.showX = objeto.fruta.x 
        objeto.fruta.showY = objeto.fruta.y

        marcadores.puntos += estadoFantasmas.ptosComeFruta;

        setTimeout(() => {
            objeto.fruta.showPtos = false;
        }, 3000);
    }
}

// --------------------------------------------------------------------------
function checkColision(obj1, obj2, corr) {
    return obj1.x + corr < obj2.x + obj2.ancho - corr && 
            obj1.x + obj1.ancho - corr > obj2.x + corr &&
            obj1.y + corr < obj2.y + obj2.alto - corr && 
            obj1.y + obj1.alto - corr > obj2.y + corr;
}

// --------------------------------------------------------------------------
function comprobarNivelSuperado() {
    let puntitosMasGordos = objeto.array_puntitos.length + objeto.array_ptosGordos.length;

    if (objeto.contPuntitosComidos >= puntitosMasGordos) {
        return true;
    } else {
        return false;
    }
}

// --------------------------------------------------------------------------
function elNivelSuperado() {
    if (!estado.nivel_superado) return;

    marcadores.nivel ++;
    estadoFantasmas.ptosComeFruta *= 2;
    objeto.fruta.comido = false;
    estadoFantasmas.duracionAzules -= marcadores.nivel * 1000;
    estado.nivel_superado = false;
    objeto.contPuntitosComidos = 0;
    estado.actual = 3;

    if (estadoFantasmas.duracionAzules < 2000) estadoFantasmas.duracionAzules = 2000;

    objeto.puntito.forEach(punto => {
        punto.visible = true;
    });

    objeto.ptoGordo.forEach(gordo => {
        gordo.visible = true;
    });

    setTimeout(() => {
        estado.actual = 1;
        objeto.pacman.revivirPacMan();

        objeto.fantasma[0].revivirFantasmas(3, 8, 0, 0);
        objeto.fantasma[1].revivirFantasmas(5, 8, 1, 0);
        objeto.fantasma[2].revivirFantasmas(9, 8, 2, 1);
        objeto.fantasma[3].revivirFantasmas(11, 8, 3, 1);
    }, 5000);
}

// -------------------------------------------------------------------------
function nuevaPartida() {
    if (estado.gameover || estado.actual == 0) location.reload();
}

// -------------------------------------------------------------------------
function elGameOver() {
    if (!estado.gameover) return;

    ctx.font = '100px seriff';
    ctx.fillStyle = 'yellow';
    ctx.fillText('Game Over', parseInt(resolucion[0] / 5) + 5, 
        parseInt(resolucion[1] / 2));

    ctx.font = '40px seriff';
    ctx.fillStyle = 'orangered';
    ctx.fillText('Recargue el navegador para jugar otra vez...', 40, resolucion[1] - 50);
}

// ------------------------------------------------------------------------
function mostrarMarcadores() {
    ctx.font = '30px seriff';
    ctx.fillStyle = 'yellow';
    ctx.fillText('Puntos: ' + marcadores.puntos.toString(), 42, 24);

    ctx.fillStyle = 'yellow';
    ctx.fillText('Nivel: ' + marcadores.nivel.toString(), 242, 24);

    ctx.fillStyle = 'yellow';
    let mv = marcadores.vidas;

    if (mv < 0) mv = 0;
    ctx.fillText('Vidas: ' + mv.toString(), 402, 24);

    if (estado.actual == 0) {
        // ctx.fillStyle = sueloColor;
        // ctx.fillRect(20, resolucion[1] / 2 - 40, resolucion[0] - 40, 55);

        ctx.font = '100px seriff';
        ctx.fillStyle = 'yellow';
        ctx.fillText('Preparado!', parseInt(resolucion[0] / 5) + 5, 
            parseInt(resolucion[1] / 2));
    }

    if (estado.actual == 3) {
        ctx.font = '100px seriff';
        ctx.fillStyle = 'yellow';
        ctx.fillText('Nivel Superado!', parseInt(resolucion[0] / 8) + 5, 
            parseInt(resolucion[1] / 2));
    }

    objeto.fantasma.forEach(fant => {
        if (fant.showPtos) {
            ctx.font = '30px seriff';
            ctx.fillStyle = 'white';
            ctx.fillText(fant.showx2, fant.showX, fant.showY);
        }
    });

    if (objeto.fruta.showPtos) {
        ctx.font = '32px seriff';
        ctx.fillStyle = 'lightgreen';
        ctx.fillText(estadoFantasmas.ptosComeFruta, objeto.fruta.showX, objeto.fruta.showY);
    }
}

// ------------------------------------------------------------------------
function reescalaCanvas() {
    return;
}

// ------------------------------------------------------------------------
function borraCanvas() {
    // canvas.width = canvas.width;
    // canvas.height = canvas.height;
    ctx.fillStyle = colores.sueloColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

//========================================================================
// Presentacion / Menu Principal
//------------------------------------------------------------------------
function laPresentacion(animaPacMan) {
    ctx.font = '120px seriff';
    ctx.fillStyle = 'orangered';
    ctx.fillText('Pac Clon', parseInt(resolucion[0] / 5) + 5, 
        parseInt(resolucion[1] / 2));

    ctx.font = '30px seriff';
    ctx.fillStyle = 'white';
    ctx.fillText('Pulse INTRO para comenzar...', parseInt(resolucion[0] / 4) + 5, 
        resolucion[1] - 50);

    objeto.pacman.secuenciaPresentacion(animaPacMan);
    objeto.fantasma[1].secuenciaPresentacion();
}

export {
	dibujarFantasmas, dibujaTodosPuntitos, 
	checkComerFruta, checkColision,
	comprobarNivelSuperado, elNivelSuperado,
	nuevaPartida, elGameOver, mostrarMarcadores,
	reescalaCanvas, borraCanvas, laPresentacion
};

