const functions = firebase.functions();
const db = firebase.firestore();
const storage = firebase.storage();
const auth = firebase.auth();
let quill;

auth.onAuthStateChanged( user => {
    if (user) {
        user.getIdTokenResult().then( idTokenResult => {
            if (idTokenResult.claims.admin) {
                // It'a a admin
                document.querySelectorAll(".admin").forEach(elem => { elem.style.display = "block"});
                document.querySelectorAll(".logged").forEach(elem => { elem.style.display = "none"});
                document.querySelectorAll(".guest").forEach(elem => { elem.style.display = "none"});
                initQuill();

            } else {
                // is not an admin
                document.querySelectorAll(".admin").forEach(elem => { elem.style.display = "none"});
                document.querySelectorAll(".logged").forEach(elem => { elem.style.display = "block"});
                document.querySelectorAll(".guest").forEach(elem => { elem.style.display = "none"});

            }
        });
    } else {
        // not logged
        document.querySelectorAll(".admin").forEach(elem => { elem.style.display = "none"});
        document.querySelectorAll(".logged").forEach(elem => { elem.style.display = "none"});
        document.querySelectorAll(".guest").forEach(elem => { elem.style.display = "block"});
    }
});

const loginForm = document.querySelector(".form-signin");
loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;

    auth.signInWithEmailAndPassword(email,password).then( cred => {
        console.log(cred.user);
        const loginForm = document.querySelector(".form-signin");
        loginForm['login-email'].value = '';
        loginForm['login-password'].value = '';
    });
});

$('#agg-admin-form').submit( e => {
    e.preventDefault();
    let email = $('#agg-admin-email');
    const addAdminRole = functions.httpsCallable('addAdminRole');
    addAdminRole({email: email.val()}).then( result => {
        result = result.data;
        email.val('');
        if (result.message != null) {
            // successo
            const html = `
                <div class="mt-3 alert alert-success" style="display: none" role="alert">
                    ${result.message}
                </div>
            `;
            $("#body-agg-admin").append(html).children(':last').fadeIn('slow').delay(5000).fadeOut('slow');
        } else {
            //errore
            const html = `
                <div class="mt-3 alert alert-danger" style="display: none" role="alert">
                    ${result.error}
                </div>
            `;
            $("#body-agg-admin").append(html).children(':last').fadeIn('slow').delay(5000).fadeOut('slow');
        }
    });
});

$('#log-out').click(function () {
    auth.signOut();
});

$('#article-novita-btn').click(function () {
    db.collection('novita').orderBy("data","desc").onSnapshot(snap => {
        let html = '';
        snap.docs.forEach((doc,index) => {
            const art = doc.data();
            let data = art.data.toDate();
            data = data.getDate() + '/' + data.getMonth() + '/' + data.getFullYear();
            html += `
                <tr>
                    <th scope="row">${data}</th>
                    <td>${art.titolo}</td>
                    <td>
                        <div class="d-inline" data-toggle="modal" data-target="#edit-nov-${index}">
                            <i class="fas fa-edit btn-edit mr-2" data-toggle="tooltip" data-placement="top" title="Modifica"></i>
                        </div>
                        <div class="modal fade" id="edit-nov-${index}" tabindex="-1" role="dialog" aria-labelledby="edit-nov-body-${index}" aria-hidden="true">
                                <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title" id="edit-nov-body-${index}">Modifica Articolo</h5>
                                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <div class="modal-body">
                                            <h1>IN ARRIVO</h1>
                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Chiudi</button>
                                            <button type="button" class="btn btn-primary">Salva</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                        <div class="d-inline" data-toggle="modal" data-target="#remove-nov-${index}">
                            <i class="fas fa-trash-alt btn-edit text-danger" data-toggle="tooltip" data-placement="top" title="Elimina"></i>
                        </div>
                        <div class="modal fade" id="remove-nov-${index}" tabindex="-1" role="dialog" aria-labelledby="remove-nov-body-${index}" aria-hidden="true">
                            <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="remove-nov-body-${index}">Elimina Articolo</h5>
                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div class="modal-body">
                                        <p>Sicuro di voler eliminare l'articolo: ${art.titolo}?</p>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Chiudi</button>
                                        <button type="button" class="btn btn-danger" onclick="removeArticle('novita','${doc.id}','${art.img}')">Elimina</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
            `;
        });
        html += "<script>$('[data-toggle=\"tooltip\"]').tooltip()</script>";
        $('#article-table-body').html(html);
    });
});
$('#article-offerte-btn').click(function () {
    db.collection('offerte').orderBy("data","desc").onSnapshot(snap => {
        let html = '';
        snap.docs.forEach((doc,index) => {
            const art = doc.data();
            let data = art.data.toDate();
            data = data.getDate() + '/' + data.getMonth() + '/' + data.getFullYear();
            html += `
                <tr>
                    <th scope="row">${data}</th>
                    <td>${art.titolo}</td>
                    <td>
                        <div class="d-inline" data-toggle="modal" data-target="#edit-off-${index}">
                            <i class="fas fa-edit btn-edit mr-2" data-toggle="tooltip" data-placement="top" title="Modifica"></i>
                        </div>
                        <div class="modal fade" id="edit-off-${index}" tabindex="-1" role="dialog" aria-labelledby="edit-off-body-${index}" aria-hidden="true">
                                <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title" id="edit-off-body-${index}">Modifica Articolo</h5>
                                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <div class="modal-body">
                                            <h1>IN ARRIVO</h1>
                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Chiudi</button>
                                            <button type="button" class="btn btn-primary">Salva</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                        <div class="d-inline" data-toggle="modal" data-target="#remove-off-${index}">
                            <i class="fas fa-trash-alt btn-edit text-danger" data-toggle="tooltip" data-placement="top" title="Elimina"></i>
                        </div>
                        <div class="modal fade" id="remove-off-${index}" tabindex="-1" role="dialog" aria-labelledby="remove-off-body-${index}" aria-hidden="true">
                            <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="remove-off-body-${index}">Elimina Articolo</h5>
                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div class="modal-body">
                                        <p>Sicuro di voler eliminare l'articolo: ${art.titolo}?</p>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Chiudi</button>
                                        <button type="button" class="btn btn-danger" onclick="removeArticle('offerte','${doc.id}','${art.img}')">Elimina</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
            `;
        });
        html += "<script>$('[data-toggle=\"tooltip\"]').tooltip()</script>";
        $('#article-table-body').html(html);
    });
});

$('#new-article-btn').click(function () {
    let collection = $('#new-article-type').val().toString().toLowerCase().replace('à','a');
    let progressBar = $('#new-article-progress');

    let snippet = '';
    quill.getText().split(' ').slice(0,20).forEach((elem,index,arr) => {
        snippet += elem.toString();
        snippet += arr[index+1] ? ' ' : '...';
    });

    let article = {
        titolo: $('#new-article-title').val(),
        sottotitolo: $('#new-article-subtitle').val(),
        snippet: snippet,
        testo: quill.root.innerHTML,
        data: new Date(),
        delta: JSON.stringify(quill.getContents()),
    };

    let img = $('#new-article-img').prop('files')[0];
    let storageRef = storage.ref('img/' + img.name);
    let task = storageRef.put(img);
    task.on('state_changed', snap => {
        let percentage = (snap.bytesTransferred/snap.totalBytes) * 100;
        percentage = Math.round(percentage);
        progressBar.attr('aria-valuenow',percentage);
        progressBar.css('width',percentage.toString() + '%');
        progressBar.text(percentage.toString() + '%');
    }, err => {
        progressBar.removeClass('progress-bar-striped');
        progressBar.addClass('bg-danger');
        progressBar.css('width','100%');
        progressBar.text("C'è stato un errore");
        console.log(err);
    }, () => {
        task.snapshot.ref.getDownloadURL().then( url => {
            console.log(url);
            article.img = img.name;
            article.imgsrc = url;
            db.collection(collection).add(article).then(() => {
                progressBar.removeClass('progress-bar-striped');
                progressBar.addClass('bg-success');
                progressBar.text('Caricamento Completato');
                $('#new-article-form').trigger('reset');
                quill.setContents([{ insert: '\n' }]);
            }).catch(err => {
                progressBar.removeClass('progress-bar-striped');
                progressBar.addClass('bg-danger');
                progressBar.css('width','100%');
                progressBar.text("C'è stato un errore");
                console.log(err);
            });
        })
    });
});

$('#log-out-and-re-try').click(function () {
    auth.signOut();
});

$('#home-sfondo-1-btn').click(function () {
    let img = $('#home-sfondo-1').prop('files')[0];
    let storageRef = storage.ref('home/' + img.name);
    let task = storageRef.put(img);
    let progressBar = $('#home-sfondo-1-progress'); // da implementare
    task.on('state_changed', snap => {
        let percentage = (snap.bytesTransferred/snap.totalBytes) * 100;
        percentage = Math.round(percentage);
        progressBar.attr('aria-valuenow',percentage);
        progressBar.css('width',percentage.toString() + '%');
        progressBar.text(percentage.toString() + '%');
    }, err => {
        //errori
        progressBar.removeClass('progress-bar-striped');
        progressBar.addClass('bg-danger');
        progressBar.css('width','100%');
        progressBar.text("C'è stato un errore");
        console.log(err);
    }, () => {
        //finish
        task.snapshot.ref.getDownloadURL().then( url => {
            db.collection("site_bg").doc("home").update({
                one: url
            }).then(function() {
                progressBar.removeClass('progress-bar-striped');
                progressBar.addClass('bg-success');
                progressBar.text('Caricamento Completato');
            }).catch(function(error) {
                progressBar.removeClass('progress-bar-striped');
                progressBar.addClass('bg-danger');
                progressBar.css('width','100%');
                progressBar.text("C'è stato un errore");
                console.log(error);
            });
        });
    });
});
$('#home-sfondo-2-btn').click(function () {
    let img = $('#home-sfondo-2').prop('files')[0];
    let storageRef = storage.ref('home/' + img.name);
    let task = storageRef.put(img);
    let progressBar = $('#home-sfondo-2-progress'); // da implementare
    task.on('state_changed', snap => {
        let percentage = (snap.bytesTransferred/snap.totalBytes) * 100;
        percentage = Math.round(percentage);
        progressBar.attr('aria-valuenow',percentage);
        progressBar.css('width',percentage.toString() + '%');
        progressBar.text(percentage.toString() + '%');
    }, err => {
        //errori
        progressBar.removeClass('progress-bar-striped');
        progressBar.addClass('bg-danger');
        progressBar.css('width','100%');
        progressBar.text("C'è stato un errore");
        console.log(err);
    }, () => {
        //finish
        task.snapshot.ref.getDownloadURL().then( url => {
            db.collection("site_bg").doc("home").update({
                two: url
            }).then(function() {
                progressBar.removeClass('progress-bar-striped');
                progressBar.addClass('bg-success');
                progressBar.text('Caricamento Completato');
            }).catch(function(error) {
                progressBar.removeClass('progress-bar-striped');
                progressBar.addClass('bg-danger');
                progressBar.css('width','100%');
                progressBar.text("C'è stato un errore");
                console.log(error);
            });
        });
    });

});
$('#home-sfondo-3-btn').click(function () {
    let img = $('#home-sfondo-3').prop('files')[0];
    let storageRef = storage.ref('home/' + img.name);
    let task = storageRef.put(img);
    let progressBar = $('#home-sfondo-3-progress'); // da implementare
    task.on('state_changed', snap => {
        let percentage = (snap.bytesTransferred/snap.totalBytes) * 100;
        percentage = Math.round(percentage);
        progressBar.attr('aria-valuenow',percentage);
        progressBar.css('width',percentage.toString() + '%');
        progressBar.text(percentage.toString() + '%');
    }, err => {
        //errori
        progressBar.removeClass('progress-bar-striped');
        progressBar.addClass('bg-danger');
        progressBar.css('width','100%');
        progressBar.text("C'è stato un errore");
        console.log(err);
    }, () => {
        //finish
        task.snapshot.ref.getDownloadURL().then( url => {
            db.collection("site_bg").doc("home").update({
                three: url
            }).then(function() {
                progressBar.removeClass('progress-bar-striped');
                progressBar.addClass('bg-success');
                progressBar.text('Caricamento Completato');
            }).catch(function(error) {
                progressBar.removeClass('progress-bar-striped');
                progressBar.addClass('bg-danger');
                progressBar.css('width','100%');
                progressBar.text("C'è stato un errore");
                console.log(error);
            });
        });
    });
});

function removeArticle(coll,id,img) {
    db.collection(coll).doc(id).delete().then(function() {
        const desertRef = storage.ref().child('img/' + img);
        desertRef.delete().then(function() {
            console.log("Document successfully deleted!");
        }).catch(function(error) {
            console.error("Error removing image: ", error);
        });
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });
    $('[data-dismiss=modal]').trigger('click');
    $('.modal-backdrop').hide();
}

function initQuill() {
    const toolbarOptions = [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'align': [] }],
        [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    ];

    const options = {
        placeholder: 'Inserisci il testo qui...',
        theme: 'snow',
        modules: {
            toolbar: toolbarOptions
        }
    };

    quill = new Quill('#new-article-text', options);
}

