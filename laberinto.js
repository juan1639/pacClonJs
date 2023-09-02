import {constante, ctx, colores} from './constants.js';

// ============================================================================
//  Clases:  Laberinto(Level), puntitos, ptosGordos
// ----------------------------------------------------------------------------
export class Level {   
    constructor(array) {
        this.array = array;
        
        //DIMENSIONES MATRIZ
        this.altoM  = this.array.length;
        this.anchoM = this.array[0].length;
        
        //TAMAÑO DE LOS TILES
        this.anchoT = constante.bsx;
        this.altoT = constante.bsy;
    }
    
    colision(x, y) {
        if (this.array[y][x] == 9) {
            return true;
        } else {
            return false;
        }     
    }
    
    tile(x, y) {
        let casillaX = parseInt(x / this.anchoT);       
        let casillaY = parseInt(y / this.altoT);

        return(this.array[casillaY][casillaX]);
    }
    
    dibuja() {
        for (let y = 0; y < this.altoM; y ++){
            for (let x = 0; x < this.anchoM; x ++){
                
                if (this.array[y][x] == 9) {
                    var bx = x * this.anchoT + 1;
                    var by = y * this.altoT + 1;

                    ctx.fillStyle = colores.paredColor;
                    ctx.fillRect(bx, by, this.anchoT - 1, this.altoT - 1);
                    ctx.fillStyle = colores.paredColorOscuro;
                    ctx.fillRect(bx + 2, by + 2, this.anchoT - 4, this.altoT - 4);
                    // ctx.drawImage(this.img, 0, 0, this.img.width - 1, this.img.height - 1, 
                    //     x * this.anchoT, y * this.altoT, this.anchoT, this.altoT);
                }         
            }
        }
    }
}

// ============================================================================
export class Puntitos {   
    constructor(x, y) {
        this.x = x * constante.bsx + parseInt(constante.bsx / 2);
        this.y = y * constante.bsy + parseInt(constante.bsy / 2);

        this.radio = 4;
        this.ancho = this.radio * 2;
        this.alto = this.radio * 2;

        this.color = 'white';
        this.visible = true;
        this.sumaPtos = 10;

        this.dibuja();
    }

    dibuja() {
        ctx.beginPath();
        ctx.arc(this.x , this.y , this.radio, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}

// ============================================================================
export class PtosGordos {   
    constructor(x, y) {
        this.x = x * constante.bsx + parseInt(constante.bsx / 2);
        this.y = y * constante.bsy + parseInt(constante.bsy / 2);

        this.radio = 8;
        this.ancho = this.radio * 2;
        this.alto = this.radio * 2;

        this.color = 'white';
        this.visible = true;
        this.sumaPtos = 50;

        this.dibuja();
    }

    dibuja() {
        ctx.beginPath();
        ctx.arc(this.x , this.y , this.radio, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}

