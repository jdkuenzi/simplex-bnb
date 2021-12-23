let read_file = (file) => {
    let reader = new FileReader()
    return new Promise((resolve, reject) => {
        reader.onerror = () => {
            reader.abort();
            reject(new DOMException("Problem parsing input file."));
        };

        reader.onload = () => {
            resolve(reader.result);
        };
        reader.readAsText(file);
    });
}

function read_csv(fileRead) {
    var args = fileRead.split("\n");
    var result = {}

    for (let i = 0; i < args.length; i++) {
        args[i] = args[i].split(",")
    }

    let indexCol = 0
    args[0].forEach(() => {
        let recettes = "R" + indexCol
        let indexIngredients = 3
        let col = {}

        let indexIngr = 0
        args[1].forEach(ingredients => {
            col[ingredients] = args[indexIngredients][indexCol]
            indexIngredients += 1
            indexIngr += 1
        });

        col['f'] = -args[2][indexCol]
        result[recettes] = col

        indexCol += 1
    });

    let contrainteCol = {}
    index = 0
    lastLine = args.length - 1
    args[1].forEach(ingredients => {
        contrainteCol[ingredients] = args[lastLine][index]
        index += 1
    });
    contrainteCol['f'] = 0
    result['b'] = contrainteCol

    for (let i = 0; i < args[1].length; i++) {
        let col = {}
        let index = 0
        args[1].forEach(ingredients => {
            col[ingredients] = (index == i ? 1 : 0)
            col['f'] = 0
            index += 1
        });
        result['z' + i] = col
    }

    var e = document.getElementById("varFracChoice");
    let takeMax = (e.options[e.selectedIndex].value == "1");
    e = document.getElementById("plOrder");
    let prioritizePLPlus = (e.options[e.selectedIndex].value == "1");
    console.log(takeMax)
    console.log(prioritizePLPlus)
    console.log("b&b readfile matrix : ")
    console.log(result)
    
    var t0 = performance.now();
    let bb = branchBound(result, takeMax, prioritizePLPlus)
    var t1 = performance.now();
    var temps_avec_total_valeurs = (t1-t0);
    
    let package = {
        matrix:bb,
        perf:temps_avec_total_valeurs
    }

    console.log("b&b result matrix : ")
    console.log(bb)
    return package
}