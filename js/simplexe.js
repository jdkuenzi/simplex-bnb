/************************************************************************************
 * Projet    : Simplexe - TP de mathématiques
 * Auteurs   : Ottavio Buonomo - Jean-Daniel Küenzi
 * Version   : 2.0
 * Date      : 17.01.2020
 ***********************************************************************************/

let cptNode = 0
let maxNodeDepth = 0
let cptDominateNode = 0
let EPS = 0.0000001

let trouverVarSortanteDual = (matrix) => {
    for (i in matrix) {
        if (i !== 'f') {
            if (matrix['b'][i] < -EPS) {
                return i
            }
        }
    }
    return undefined
}

let trouverVarEntranteDual = (matrix, varOut) => {
    let tmp = undefined
    let tmpVar = undefined
    let actual = 0
    for (i in matrix) {
        if (i !== 'b') {
            if (matrix[i][varOut] < -EPS) {
                actual = matrix[i]['f'] / matrix[i][varOut]
                if (typeof tmp === 'undefined' || actual < tmp) {
                    tmp = actual
                    tmpVar = i
                }
            }
        }
    }
    return tmpVar
}

let trouverVarEntrante = (matrix) => {
    for (i in matrix) {
        if (matrix[i]['f'] < -EPS) {
            return i
        }
    }
    return undefined
}

let trouverVarSortante = (matrix, varIn) => {
    let tmp = undefined
    let tmpVar = undefined
    let actual = 0
    for (i in matrix['b']) {
        if (i !== 'f') {
            if (matrix[varIn][i] > EPS) {
                actual = matrix['b'][i] / matrix[varIn][i]
                if (typeof tmp === 'undefined' || actual < tmp) {
                    tmp = actual
                    tmpVar = i
                }
            }
        }
    }
    return tmpVar
}

let cloneMatrix = (matrix) => {
    return JSON.parse(JSON.stringify(matrix));
}

let pivotGauss = (matrix, varEntrante, varSortante) => {
    let clone = cloneMatrix(matrix)

    // Ligne du pivot -> on divise par le pivot
    for (i in clone) {
        clone[i][varSortante] = clone[i][varSortante] / matrix[varEntrante][varSortante]
    }
    // Mettre la colonne du pivot à 0 sauf le pivot = 1
    for (i in clone[varEntrante]) {
        if (i !== varSortante) {
            clone[varEntrante][i] = 0
        }
    }


    // Calcul des autres coeffs
    for (i in clone) {
        for (j in clone[i]) {
            if (i !== varEntrante && j !== varSortante) {
                clone[i][j] = methodeCroix(matrix, varEntrante, varSortante, i, j)
            }
        }
    }
    return clone
}

let methodeCroix = (matrix, varIn, varOut, indexColonne, indexLigne) => {
    if (Math.abs(matrix[varIn][varOut]) < EPS) {
        console.log("PROKE")
    }
    let ok = (matrix[varIn][indexLigne] * matrix[indexColonne][varOut] / matrix[varIn][varOut])
    return  matrix[indexColonne][indexLigne] - ok
}

let swapVarInOut = (varIn, varOut, matrix) => {
    for (i in matrix) {
        matrix[i][varIn] = matrix[i][varOut];
        delete matrix[i][varOut]
    }
    return matrix
}

let cptItertions

let simplexe = (matrix) => {
    let breaked = false;
    cptItertions = 0
    while (true) {
        let iLine = trouverVarSortanteDual(matrix)
        let iCol = -1
        if (typeof(iLine) !== "undefined") {
            iCol = trouverVarEntranteDual(matrix, iLine)
            if (typeof(iCol) === "undefined") {
                breaked = true;
                break;
            }
            matrix = pivotGauss(matrix, iCol, iLine)
            matrix = swapVarInOut(iCol, iLine, matrix)
        } else {
            iLine = trouverVarEntrante(matrix)
            if (typeof(iLine) === "undefined") {
                break
            }
            iCol = trouverVarSortante(matrix, iLine)
            matrix = pivotGauss(matrix, iLine, iCol)
            matrix = swapVarInOut(iLine, iCol, matrix)
        }
        cptItertions += 1
    }
    if (breaked) {
        return undefined
    } else {
        return matrix
    }
}

let loadFile = () => {
    console.log('Loading file...')
    let input = document.getElementById('fileToUpload').files[0]
    read_file(input).then((fileResult) => {
        document.getElementById('fileToUpload').value = ""
        resultat = read_csv(fileResult)
        genere_chart(resultat.matrix, resultat.perf)
    })
}

let estFractionnaire = (nbr) => {
    let delta = nbr.toFixed(5) - Math.trunc(nbr)
    if (delta > EPS && delta < 1 - EPS) {
        return true;
    }
    return false;
}

let trouverVarFractionnaire = (matrixSimplexe, takeMax) => {
    let var_frac = undefined
    for (i in matrixSimplexe['b']) {
        if (i.includes("R")) {
            let frac = estFractionnaire(matrixSimplexe['b'][i])
            if (frac) {
                if (typeof(var_frac) === "undefined") {
                    var_frac = i
                }
                if(takeMax) {
                    var_frac = matrixSimplexe['b'][var_frac] < matrixSimplexe['b'][i] ? i : var_frac; 
                } else {
                    var_frac = matrixSimplexe['b'][var_frac] > matrixSimplexe['b'][i] ? i : var_frac; 
                }
            }
        }
    }
    return var_frac
}

let insererLigne = (matrix, varFractionnaire, isPLPlus) => {
    let clone = cloneMatrix(matrix)
    let isPlus = isPLPlus ? "+" : "-";
    let nouveauNom = varFractionnaire + isPlus
    while (Object.keys(matrix).includes(nouveauNom)) {
        nouveauNom += isPlus
    }
    for (i in clone) {
        clone[i][nouveauNom] = clone[i][varFractionnaire]
        if (!isPLPlus && i !== varFractionnaire && i !== "b") {
            clone[i][nouveauNom] = -clone[i][nouveauNom]
        }
    }
    clone[varFractionnaire][nouveauNom] = 0
    if (!isPLPlus) {
        clone["b"][nouveauNom] = Math.trunc(clone["b"][nouveauNom]) - matrix["b"][varFractionnaire];
    } else  {
        clone["b"][nouveauNom] = matrix["b"][varFractionnaire] - Math.ceil(clone["b"][nouveauNom]);
    }

    return clone
}

let insererColonne = (matrix, varFractionnaire, isPLPlus) => {
    let clone = cloneMatrix(matrix)
    let isPlus = isPLPlus ? "+" : "-";
    let nouveauNom = varFractionnaire + isPlus
    while (Object.keys(matrix).includes(nouveauNom)) {
        nouveauNom += isPlus
    }
    clone[nouveauNom] = {}
    for (i in clone[varFractionnaire]){
        clone[nouveauNom][i] = i === nouveauNom ? 1 : 0
    }
    return clone
}

let generePL = (matrix, varFractionnaire, isPlus) => {
    let test = cloneMatrix(matrix)
    let c = insererLigne(test, varFractionnaire, isPlus)
    let c2 = insererColonne(c, varFractionnaire,isPlus)
    return c2
}

let node = {
    matrix: {},
    profondeur: -1,
}

let noeudsPasResolus = []

let trouverNoeudSuivant = (lstNoeuds) => {
    return lstNoeuds.pop()
}

let branchBound = (matrix, takeMax = true, prioritizePLPlus = true) => {
    cptNode = 0
    maxNodeDepth = 0
    cptDominateNode = 0
    let matrixPL = simplexe(matrix)
    let premierNoeud = Object.create(node)
    premierNoeud.matrix = matrix
    premierNoeud.profondeur = 0
    noeudsPasResolus.push(premierNoeud)
    let solPLNE = -1000000
    let solTmp = undefined
    let matrixPLNE = undefined

    while (noeudsPasResolus.length > 0) {
        cptNode += 1;
        let tmpNoeud = trouverNoeudSuivant(noeudsPasResolus)
        maxNodeDepth = maxNodeDepth < tmpNoeud.profondeur ? tmpNoeud.profondeur : maxNodeDepth;
        let tmpMatrix = simplexe(tmpNoeud.matrix)
        if (typeof(tmpMatrix) !== "undefined") {
            solTmp = tmpMatrix['b']['f']
            if (solTmp > solPLNE) {
                let tmpFractionnaire = trouverVarFractionnaire(tmpMatrix, takeMax)
                if (typeof(tmpFractionnaire) !== "undefined") {
                    let noeudPLPlus = Object.create(node)
                    noeudPLPlus.matrix = generePL(tmpMatrix, tmpFractionnaire, true)
                    noeudPLPlus.profondeur = tmpNoeud.profondeur + 1
                    let noeudPLMoins = Object.create(node)
                    noeudPLMoins.matrix = generePL(tmpMatrix, tmpFractionnaire, false)
                    noeudPLMoins.profondeur = tmpNoeud.profondeur + 1
                    if (prioritizePLPlus) {
                        noeudsPasResolus.push(noeudPLMoins,noeudPLPlus)
                    } else {
                        noeudsPasResolus.push(noeudPLPlus,noeudPLMoins)
                    }
                } else {
                    solPLNE = solTmp
                    matrixPLNE = tmpMatrix
                }
            } else {
                cptDominateNode += 1
            }
        }
    }
    return matrixPLNE
}

let genere_chart = (res, perf) => {
    str = ""
    Object.keys(res['b']).filter(f => f.includes("R", 0)).filter(f => !f.includes('+')).filter(f => !f.includes('-')).forEach(r => str += "<li><strong>" + r + "</strong> : " + Math.round(res['b'][r].toFixed(5)) + "</li>")

    //Affiche les résultats finaux
    document.getElementById('BBnombresIterationsFinal').innerHTML = "Nombre de noeuds parcourus : <strong>" + cptNode + "</strong>"
    document.getElementById('BBdominateNodeFinal').innerHTML = "Nombre de noeuds dominés : <strong>" + cptDominateNode + "</strong>"
    document.getElementById('BBmaxNodeDepthFinal').innerHTML = "Profondeur max. de l'arbre : <strong>" + maxNodeDepth + "</strong>"
    document.getElementById('BBrecettesFinal').innerHTML = str
    document.getElementById('BBoptimumFinal').innerHTML = "Résultat optimal : <strong>" + Math.round(-res['b']['f'].toFixed(5)) + "</strong>"
    document.getElementById('BBdureeFinal').innerHTML = "Le Branch & Bound a pris <strong>" + (perf/1000).toFixed(3) + "</strong> [s]"
}

let str = ""
//Calcul temps en elevant contraintes
var t0 = performance.now();
var res = simplexe(data_matrix);
var v1 = 20;
var c1 = 11;
var t1 = performance.now();

var temps_1 = (t1-t0);

var iterContr = cptItertions;

Object.keys(res['b']).filter(f => f.match("R")).forEach(r => str += "<li><strong>" + r + "</strong> : " + res['b'][r] + "</li>")

//Affiche les résultats pour 20 variables et 11 contraintes
document.getElementById('nombresIterations1').innerHTML = "Nombre d'itérations effectuées : <strong>" + cptItertions + "</strong>"
document.getElementById('recettes1').innerHTML = str
document.getElementById('optimum1').innerHTML = "Résultat optimal : <strong>" + -res['b']['f'] + "</strong>"
document.getElementById('duree1').innerHTML = "Le Simplexe a pris <strong>" + temps_1 + "</strong> ms."

//Calcul temps en elevant variables
var t0 = performance.now();
var res = simplexe(data_matrix);
var v2 = 16;
var c2 = 15;
var t1 = performance.now();

var temps_2 = (t1-t0);

var iterVars = cptItertions;

str = ""
Object.keys(res['b']).filter(f => f.match("R")).forEach(r => str += "<li><strong>" + r + "</strong> : " + res['b'][r] + "</li>")

//Affiche les résultats pour 16 variables et 15 contraintes
document.getElementById('nombresIterations2').innerHTML = "Nombre d'itérations effectuées : <strong>" + cptItertions + "</strong>"
document.getElementById('recettes2').innerHTML = str
document.getElementById('optimum2').innerHTML = "Résultat optimal : <strong>" + -res['b']['f'] + "</strong>"
document.getElementById('duree2').innerHTML = "Le Simplexe a pris <strong>" + temps_2 + "</strong> ms."

//Calcul temps problème final
var t02 = performance.now();
var res = simplexe(data_matrix);
var vt = 20;
var ct = 15;
var t12 = performance.now();

var temps_avec_total_valeurs = (t12-t02);

var iterProbFinal = cptItertions;

str = ""
Object.keys(res['b']).filter(f => f.match("R")).forEach(r => str += "<li><strong>" + r + "</strong> : " + res['b'][r] + "</li>")

//Affiche les résultats finaux
document.getElementById('nombresIterationsFinal').innerHTML = "Nombre d'itérations effectuées : <strong>" + cptItertions + "</strong>"
document.getElementById('recettesFinal').innerHTML = str
document.getElementById('optimumFinal').innerHTML = "Résultat optimal : <strong>" + -res['b']['f'] + "</strong>"
document.getElementById('dureeFinal').innerHTML = "Le Simplexe a pris <strong>" + temps_avec_total_valeurs + "</strong> ms."
