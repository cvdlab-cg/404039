//Esercizio 1

function x(punto){
  return punto[0];
}

function y(punto){
  return punto[1];
}

function terrain(punto){
u = x(punto);
v = y(punto);
w = z(u,v);

return [u,v,w];
}

function z(u,v) {
	var zeta;
	if((u>2 && u<12 && v<14)||(u>50 && v<10) || (u>8 && u<25 && v>35 & v<55) ||(u>8 && u<13 && v>14 && v<36))  //pianura
		zeta = mediaHsuolo/14;
	else if((u<24 && v < 29) || (u>41 && v<19))  //lieve pendio
		zeta = Math.random()*2*mediaHsuolo/10;
	else if((u>35 && u<41 && v>44 && v<49))
		zeta = Math.random()*2*mediaHsuolo/3 -5;   //lago
	else zeta = Math.random()*2*mediaHsuolo/5;
	return zeta;
}

var mediaHsuolo = 10;

var dominio2D = DOMAIN([[0,60],[0,60]])([40,40]);

var mappa = COLOR([0.5,0.22,0.08])(MAP(terrain)(dominio2D));


/*Esercizio 2*/

var blue = COLOR([0.5,1,0.5]);
var lago = T([0,1,2])([35,44,0.5])(blue(CUBOID([6,5,0.1])));

var model = STRUCT([mappa,lago]);

/*Esercizio 3 */

var domainAlbero = DOMAIN([[0,7],[0,1]])([15,15]);

CYLINDER = function (params) {
  var R = params[0];
  var h = params[1];
  return function (dims) {
    var domain = DOMAIN([[0,2*PI], [0,R]])([dims, 1]);
    var mapping = function (v) {
      var a = v[0];
      var r = v[1];
      return [r*COS(v[0]),r*SIN(v[0])];
    };
    var circle = MAP(mapping)(domain);
    return EXTRUDE([h])(circle);
  };
};

function circl (sel) {
return function (r) {
return function (d_z) {
return function (p) {
return [ r*COS(sel(p)), r*SIN(sel(p)), d_z ];
};
};
};
}


function generaAlberorandom(rMedioTronco, hMedioTronco, rMedioCono, hMedioCono){
var hTronco = hMedioTronco*((Math.random()/2)+0.75);
var rTronco = rMedioTronco*((Math.random()/2)+0.75);
var rCono = rMedioCono*((Math.random()/2)+0.75);

var temp;

if (rTronco > rCono){  //se il raggio de cono viene piu largo di quello del tronco li switcho.
  temp = rTronco;
  rTronco = rCono;
  rCono = temp;
}

var baseCono = circl(S0)(rCono)(hTronco);
var apiceCono = [0,0,hTronco+Math.random()];

var cono = COLOR([0,0.4,0])(MAP(CONICAL_SURFACE(apiceCono)(baseCono))(domainAlbero));
var tronco = COLOR([0.5,0.22,0.08])(CYLINDER([rTronco,hTronco])(10));

var albero = STRUCT([cono,tronco]);

return albero;
}

var albero1 = generaAlberorandom(0.1,0.7,0.3,3);
var albero2 = generaAlberorandom(0.1,0.7,0.3,3);

var foresta1 = STRUCT([albero1]);
var foresta2 = STRUCT([albero2]);

var numeroAlberi = 40;


for(i=0; i<numeroAlberi;i++){
foresta1 = STRUCT([foresta1,T([0,1])([4*Math.random(),4*Math.random()])(generaAlberorandom(0.1,0.7,0.3,3))]);
foresta2 = STRUCT([foresta2,T([0,1])([4*Math.random(),4*Math.random()])(generaAlberorandom(0.1,0.7,0.3,3))]);
}

foresta1 = T([0,1,2])([12,17,1])(foresta1);
foresta2 = T([0,1,2])([45,2,1])(foresta2);




/*esercizio 4*/

function costruisciCasa(altezzaMedia,larghezzaMedia,spessoreMedio){
var larghezza = (Math.random()+0.5)*larghezzaMedia;
var spessore = (Math.random()+0.5)*spessoreMedio;
var altezza = (Math.random()+0.5)*altezzaMedia;
var apice = altezza + altezza/2*(Math.random()+0.5);

var points = [[0,0],[larghezza,0],[0,altezza],[larghezza,altezza],[larghezza/2,apice]];
var cells = [[0,1,2],[1,2,3],[2,3,4]];
var simplicialComplex = SIMPLICIAL_COMPLEX(points)(cells);


var casa = COLOR([Math.random(),Math.random(),Math.random()])(EXTRUDE([spessore])(simplicialComplex));

return casa;
}



function generaIsolato(numeroCasePerFila,numeroCasePerColonna, offset_x, offset_y) {
	var isolato = STRUCT([isolato]);

	for(var j=0;j<numeroCasePerColonna;j++){
	var rigaDiCase=STRUCT([]);
	for(i=0;i<numeroCasePerFila;i++){
	rigaDiCase = STRUCT([rigaDiCase,T([0])([offset_x*i])(costruisciCasa(0.4,0.9,1.3))]);
}
isolato = STRUCT([isolato,T([2])([offset_y*j])(rigaDiCase)]);
}
return isolato;
}

var casePerRiga_grande = 5;
var casePerColonna_grande = 6;
var casePerRiga_piccolo = 3;
var casePerColonna_piccolo = 3;
var casePerRiga_medio = 4;
var casePerColonna_medio = 4;

var isolato_grande = T([0,1,2])([12,53,1])(R([1,2])([PI/2])(generaIsolato(casePerRiga_grande,casePerColonna_grande,2.5,3)));
var isolato_piccolo1 = T([0,1,2])([3,12,1])(R([1,2])([PI/2])(generaIsolato(casePerRiga_medio,casePerColonna_medio,2.5,3)));
var isolato_piccolo2 = T([0,1,2])([52,8,1])(R([1,2])([PI/2])(generaIsolato(casePerRiga_piccolo,casePerColonna_piccolo,2.5,3)));


//Esercizio 5

/* La seguente funzione è corretta, ma è troppo parametrizzata per usarla in questo ambito "random". Poichè le case sono di dimensione random ho dovuto usare la lunghezza media,
ma spesso mi trovo case sovrapposte alla strada. Quindi per rendere piu "gradevole" alla vista il risultato non la invoco ma le poggio "manualmente"

function generaStradeOrizzontali(numerocasePerColonna,numeroCasePerFila,lunghezzaMediaCasa,larghezzaMediaCasa,offset_x,offset_y,larghezzaStrada){
var stradeOrizzontali = STRUCT([]);
var lunghezzaStrada = numeroCasePerFila*larghezzaMediaCasa+offset_x*(numeroCasePerFila-1);
for(var i=0;i<numerocasePerColonna-1;i++){

var strada = CUBOID([lunghezzaStrada,larghezzaStrada,0.1]);
stradeOrizzontali = STRUCT([stradeOrizzontali, T([1])([lunghezzaMediaCasa*i+offset_y*i+larghezzaStrada])(strada)]);
}
return stradeOrizzontali;
}

*/

var stradeOrizzontaliInsediamentoMedio = STRUCT(REPLICA(casePerColonna_medio-1)([T([0,1,2])([2,3.3,1])(CUBOID([9,0.5,0.1])),T([1])([3])]));
var stradeVerticaliInsediamentoMedio = STRUCT(REPLICA(casePerRiga_medio-1)([T([0,1,2])([4.5,1.3,1])(CUBOID([0.5,11,0.1])),T([0])([2.7])]));

var stradeOrizzontaliInsediamentoPiccolo =  STRUCT(REPLICA(casePerColonna_piccolo-1)([T([0,1,2])([52,2.5,1])(CUBOID([7,0.5,0.1])),T([1])([3])]));
var stradeVerticaliInsediamentoPiccolo =  STRUCT(REPLICA(casePerRiga_piccolo-1)([T([0,1,2])([53.2,1,1])(CUBOID([0.5,7,0.1])),T([0])([2.7])]));

var stradeOrizzontaliInsediamentoGrande = STRUCT(REPLICA(casePerColonna_grande-1)([T([0,1,2])([12,38.2,1])(CUBOID([12,0.5,0.1])),T([1])([3])]));
var stradeVerticaliInsediamentoGrande =  STRUCT(REPLICA(casePerRiga_grande-1)([T([0,1,2])([13.2,36.5,1])(CUBOID([0.5,18,0.1])),T([0])([2.7])]));

var base_ferrovia = T([0,1,2])([9,14,1])(CUBOID([2.6,40,0.3]));
var pezzo_ferrovia = STRUCT([COLOR([0,0,0])(CUBOID([0.1,0.6,0.2])),T([0])([0.6])(COLOR([0,0,0])(CUBOID([0.1,0.6,0.2]))), T([0,1])([-0.15,0.15])(COLOR([0.5,0.22,0.08])(CUBOID([1,0.3,0.1])))]);
var ferrovia = T([0,1,2])([9.9,14,1.3])(STRUCT(REPLICA(65)([pezzo_ferrovia,T([1])([0.6])])));

model = STRUCT([base_ferrovia, ferrovia, stradeVerticaliInsediamentoGrande, stradeOrizzontaliInsediamentoGrande, stradeVerticaliInsediamentoPiccolo, stradeOrizzontaliInsediamentoPiccolo, foresta1,foresta2, mappa,lago,isolato_grande,isolato_piccolo1, isolato_piccolo2,stradeOrizzontaliInsediamentoMedio,stradeVerticaliInsediamentoMedio]);

