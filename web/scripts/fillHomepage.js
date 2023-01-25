
var db = firebase.firestore();

db.collection("site_bg").doc("home").get().then(function (elem) {
    let doc = elem.data();
    $('#home-bg-image-1').css("background-image", `url(${doc.one})`);
    $('#home-bg-image-2').css("background-image", `url(${doc.two})`);
    $('#home-bg-image-3').css("background-image", `url(${doc.three})`);
});

db.collection("novita").orderBy("data","desc").limit(1).get().then(function (list) {
    var doc = list.docs[0].data();
    var data = doc.data.toDate();
    $('#novTitle').append(doc.titolo);
    $('#novText').append(doc.snippet);
    $('#novSubtitle').append(doc.sottotitolo);
    $('#novDate').append(data.getDate() + '/' + data.getMonth() + '/' + data.getFullYear());
    $('#novImg').css("background-image", "url(" + doc.imgsrc + ")");
    $('#novLink').attr("href","/articolo.html?id=" + list.docs[0].id + "&coll=novita");
});

db.collection("offerte").orderBy("data","desc").limit(1).get().then(function (list) {
    var doc = list.docs[0].data();
    var data = doc.data.toDate();
    $('#offTitle').append(doc.titolo);
    $('#offText').append(doc.snippet);
    $('#offSubtitle').append(doc.sottotitolo);
    $('#offDate').append(data.getDate() + '/' + data.getMonth() + '/' + data.getFullYear());
    $('#offImg').css("background-image", "url(" + doc.imgsrc + ")");
    $('#offLink').attr("href","/articolo.html?id=" + list.docs[0].id + "&coll=offerte");
});


