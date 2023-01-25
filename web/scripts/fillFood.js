
let db = firebase.firestore();
let id = "LBJK6xGUKvcLhzzRxc8j";
let coll = "menu";

let contesto = $('#accordionFood');
//let show = "show";
let alternate_color = true;
let show_bool = false;

db.collection("menu").doc("items").get().then(function(doc) {
    if (doc.exists) {
        for (let categoria in doc.data()) {

            let categoria_nome = categoria.toString().substr(2).replace(/_/g, " ").replace(/\d/g, "/").toUpperCase();
            let color = alternate_color ? "red" : "yellow";

            contesto.append(`
                <div class="card-prs">
                    <div class="card-header-prs" id="heading_${categoria}">
                        <h1 class="btn-category" data-toggle="collapse" data-target="#collapse_${categoria}" aria-expanded="${show_bool}" aria-controls="collapse_${categoria}">
                            ${categoria_nome} <i class="fas fa-arrow-down"></i>
                        </h1>
                    </div>
                    <div id="collapse_${categoria}" class="collapse" aria-labelledby="heading_${categoria}" data-parent="">
                        <div id="body_${categoria}" class="card-body">
                        </div>
                    </div>
                </div>
            `);

            alternate_color = !alternate_color;
            //show = "";
            show_bool = false;

            let nth_foodbox = true;
            for (let key_piatto in doc.data()[categoria]) {
                let piatto = doc.data()[categoria][key_piatto];

                let allergene = piatto.piccante ? "<img src='/resources/hot.png' class='allergene' alt=\"allergene\">" : "";

                let alternative_foodbox = nth_foodbox ? "alt" : "";
                let alternative_border = nth_foodbox ? "yellow-border" : "orange-border";
                nth_foodbox = !nth_foodbox;

                if (piatto.img !== "") {
                    $(`#body_${categoria}`).append(`
                        <div class="food-box ${alternative_foodbox} ${alternative_border}">
                            <div class="meta">
                                <div class="photo" style="background-image: url(${piatto.img})"></div>
                            </div>
                            <div class="description" style="padding-left: 0">
                                <div class="d-flex">
                                    <h2 class="piatto-nome western">${piatto.nome}</h2>
                                    ${allergene}
                                </div>
                                <p class="piatto-descrizione mb-3">${piatto.descrizione}</p>     
                                <div class="text-right">
                                    <p class="prezzo">€${piatto.prezzo.toPrecision(3)}</p>
                                </div>
                            </div>
                        </div>
                    `);
                } else {
                    $(`#body_${categoria}`).append(`
                        <div class="food-box ${alternative_border}" style="min-height: auto">
                            <div class="description" style="padding-left: 0; min-width: 100%">
                                <div class="d-flex">
                                    <h2 class="piatto-nome western">${piatto.nome}</h2>
                                    ${allergene}
                                </div>
                                <p class="piatto-descrizione mb-3">${piatto.descrizione}</p>     
                                <div class="text-right">
                                    <p class="prezzo">€${piatto.prezzo.toPrecision(3)}</p>
                                </div>
                            </div>
                        </div>
                    `);
                }
            }
        }
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
}).catch(function(error) {
    console.log("Error getting document:", error);
});

function uploadFoodMenu(menu) {
    // Add a new document in collection "cities"
    db.collection("menu").doc("items").set(menu)
        .then(function() {
            console.log("Document successfully written!");
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });
}




