/*global io*/
// connexion avec le serveur
var socket = io.connect("http://localhost:8080/"), //socket = io.connect("http://localhost:8080/") : pour executer au localhost
    send = document.getElementById('send'),
    disconnect = document.getElementById('disconnect'),
    msgBox = document.getElementById('message'),
    connect = document.getElementById('connect'),
    username = document.getElementById('username'),
    sendingSound = new Audio('sound.wav'),
    reveivingSound = new Audio('received.wav'),
    friendName = document.getElementById('friendName'),
    timeoutID,
    privateC;

var peers = document.querySelectorAll('.connected');
var callback = function () {
    'use strict';
    var ul = document.createElement('ul'),
        el = document.getElementById(this.id + 'Window'),
        anyoneElse = document.querySelectorAll('.shown');
    ul.id = this.id + 'Window';
    [].forEach.call(anyoneElse, function (p) {
        p.className = "newList hidden";
    });
    if (document.body.contains(el) === false) {
        document.getElementById('listsContainer').appendChild(ul);
        ul.className = 'newList shown';
    } else {
        el.className = 'newList shown';
    }
    privateC = this.id;
    document.getElementById(this.id + 'Window').addEventListener('click', function () {
        document.querySelector('.emojis').className = 'emojis';
    });
    friendName.innerHTML = this.id;
    document.getElementById('state').innerHTML = 'Online';
    document.getElementById('state').style.color = 'lime';
};

function trigger(usr, cnct, disc, msg, snd) {
    'use strict';
    username.disabled = usr;
    connect.disabled = cnct;
    disconnect.disabled = disc;
    msgBox.disabled = msg;
    send.disabled = snd;
}

trigger(false, false, true, true, true, true, true);

//affichage des clients déjà connectés
socket.on('connectedList', function (sock) {
    'use strict';
    var i = sock.length,
        clients,
        item2,
        itemVal;
    while (i > 1) {
        clients = document.getElementById('clients');
        item2 = document.createElement('li');
        item2.id = sock[i - 1];
        itemVal = document.createElement('p');
        //alert(item2.id);
        item2.className = 'connected';
        itemVal.appendChild(document.createTextNode(sock[i - 1]));
        item2.appendChild(itemVal);
        clients.appendChild(item2);
        i = i - 1;
        peers = document.querySelectorAll('.connected');
    }
    peers = document.querySelectorAll('.connected');
    [].forEach.call(peers, function (c) {
        //'use strict';
        c.addEventListener('click', callback);
    });
});

//notification au moment de connexion d'un utilisateur
socket.on('connected', function (sock) {
    'use strict';
    var list = document.getElementById('list'),
        item = document.createElement('li'),
        item2 = document.createElement('li'),
        p = document.createElement('p'),
        clients = document.getElementById('clients');
    //item.className = 'connected';
    item2.className = 'connected';
    item2.id = sock[sock.length - 1];
    p.appendChild(document.createTextNode(sock[sock.length - 1]));
    item.appendChild(document.createTextNode(sock[sock.length - 1] + ' joined the conversation !'));
    item2.appendChild(p);
    list.appendChild(item);
    clients.appendChild(item2);
    list.scrollTop = list.scrollHeight;
    //friendName.innerHTML = sock[sock.length - 1];
    peers = document.querySelectorAll('.connected');
    [].forEach.call(peers, function (c) {
        //'use strict';
        c.addEventListener('click', callback);
    });
    if (friendName.innerHTML === sock[sock.length - 1]) {
        document.getElementById('state').innerHTML = 'Online';
        document.getElementById('state').style.color = 'lime';
    }
});

// connexion avec un username
connect.addEventListener('click', function () {
    'use strict';
    var user = username;
    if (user.value !== '') {
        socket.emit('connected', user.value);
        trigger(true, true, false, false, false, false, false);
    }
});

// envoi de messages au serveur  
send.addEventListener('click', function () {
    'use strict';
    if (document.body.contains(document.getElementById(friendName.innerHTML + 'Window'))) {
        socket.emit('private', {usern : username.value, txt : document.getElementById('message').value, userTo : friendName.innerHTML});
        sendingSound.play();
        document.getElementById('message').value = '';
    } else {
        if (msgBox.value !== '' && msgBox.disabled === false) {
            socket.emit('message', {usern : username.value, txt : document.getElementById('message').value});
            sendingSound.play();
            document.getElementById('message').value = '';
        }
    }
    //alert(privateC);
});

// réception de messages (broadcast)
socket.on('message', function (sock) {
    'use strict';
    var list = document.getElementById('list'),
        li = document.createElement('li'),
        //user = document.createElement('p'),
        msg = document.createElement('p'),
        usern = username.value;
    msg.className = "withEmoji";
    msg.appendChild(document.createTextNode(sock.txt));
    li.appendChild(msg);
    list.appendChild(li);
    var k = document.querySelectorAll('p');
    [].forEach.call(k, function (variab) {
        variab.innerHTML = variab.innerHTML.replace(/:bigsmile:/g, document.getElementById('bigsmile').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:cheese:/g, document.getElementById('cheese').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:confusedlaugh:/g, document.getElementById('confusedlaugh').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:crying:/g, document.getElementById('crying').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:excited:/g, document.getElementById('excited').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:foolish:/g, document.getElementById('foolish').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:furious:/g, document.getElementById('furious').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:good:/g, document.getElementById('good').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:ill:/g, document.getElementById('ill').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:lmao:/g, document.getElementById('lmao').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:lol:/g, document.getElementById('lol').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:love:/g, document.getElementById('love').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:satan:/g, document.getElementById('satan').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:shy:/g, document.getElementById('shy').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:smile:/g, document.getElementById('smile').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:thinking:/g, document.getElementById('thinking').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:thumbup:/g, document.getElementById('thumbup').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:tired:/g, document.getElementById('tired').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:tongue:/g, document.getElementById('tongue').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:wink:/g, document.getElementById('wink').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:xD:/g, document.getElementById('xD').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:nerd:/g, document.getElementById('nerd').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:achoumi:/g, document.getElementById('achoumi').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:sleeping:/g, document.getElementById('sleeping').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:swag:/g, document.getElementById('swag').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:shywhistle:/g, document.getElementById('shywhistle').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:lying:/g, document.getElementById('lying').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:bebe:/g, document.getElementById('bebe').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:fille:/g, document.getElementById('fille').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:pizza:/g, document.getElementById('pizza').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:3adhma:/g, document.getElementById('3adhma').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:chocolat:/g, document.getElementById('chocolat').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:heart:/g, document.getElementById('heart').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:exclamation:/g, document.getElementById('exclamation').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:interrogation:/g, document.getElementById('interrogation').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:smilingcat:/g, document.getElementById('smilingcat').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:excitedcat:/g, document.getElementById('excitedcat').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:lmaoingcat:/g, document.getElementById('lmaoingcat').outerHTML);
        //variab.innerHTML = variab.innerHTML.replace(':lovingcat:', document.getElementById('lovingcat').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:lovingcat:/g, document.getElementById('lovingcat').outerHTML);
    });
    if (sock.usern === usern) { li.className = 'sendMessage'; } else { li.className = 'receiveMessage'; reveivingSound.play(); }
    list.scrollTop = list.scrollHeight;
    if (document.getElementById('Typing') !== null) { document.getElementById('Typing').remove(); }
    //document.getElementById('Typing').remove(); // TEST !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
});

//Déconnexion
disconnect.addEventListener('click', function () {
    'use strict';
    var user = username.value;
    socket.emit('disconnected', user);
    trigger(false, false, true, true, true, true, true);
});

window.addEventListener("beforeunload", function () {
    'use strict';
    if (username.disabled === true) {
        socket.emit('disconnected', username.value);
    }
});

socket.on('disconnected', function (sock) {
    'use strict';
    var list = document.getElementById('list'),
        item = document.createElement('li'),
        clients = document.getElementById('clients'),
        child = document.getElementById(sock);
    item.className = 'disconnected';
    item.appendChild(document.createTextNode(sock + ' left the conversation !'));
    list.appendChild(item);
    //alert(sock.value);
    clients.removeChild(child);
    list.scrollTop = list.scrollHeight;
    if (friendName.innerHTML === sock) {
        document.getElementById('state').innerHTML = 'Offline';
        document.getElementById('state').style.color = 'red';
    }
});

var list = document.getElementById('list'),
    li = document.createElement('li'),
    //user = document.createElement('p'),
    msg = document.createElement('p'),
    usern = username.value;
msg.appendChild(document.createTextNode('typing...'));

msgBox.addEventListener('keypress', function () {
    'use strict';
    socket.emit('isTyping', msgBox.value);
});

socket.on('isTyping', function (sock) {
    'use strict';
    window.clearTimeout(timeoutID);
    li.appendChild(msg);
    function rmv() {
        msg.remove();
    }
    //list.appendChild(li);
    if (document.body.contains(document.getElementById(friendName.innerHTML + 'Window'))) {
        document.getElementById(friendName.innerHTML + 'Window').appendChild(li);
        if (sock.usern === usern) { li.className = 'sendMessage'; } else { li.className = 'receiveMessage'; li.id = 'Typing'; }
        list.scrollTop = list.scrollHeight;
        timeoutID = window.setTimeout(rmv, 1200);
    }
});


//Pour fermer le div contenant la liste des Emojis
document.getElementById('icon').addEventListener('click', function () {
    'use strict';
    document.querySelector('.emojis').className += ' emojisTranslation';
});

document.getElementById('list').addEventListener('click', function () {
    'use strict';
    document.querySelector('.emojis').className = 'emojis';
});

document.querySelector('.connectedClients').addEventListener('click', function () {
    'use strict';
    document.querySelector('.emojis').className = 'emojis';
});

document.querySelector('.userData').addEventListener('click', function () {
    'use strict';
    document.querySelector('.emojis').className = 'emojis';
});

//Ajouter le nom d'Emoji choisi au textBox
var k = document.querySelectorAll('.emo');
[].forEach.call(k, function (variab) {
    'use strict';
    variab.addEventListener('click', function () {
        msgBox.value += ':' + variab.id + ':';
    });
});

// réception des messages privés
socket.on('private', function (sock) {
    'use strict';
    var a = document.getElementById(sock.usern + 'Window'),
        b = document.getElementById(sock.userTo + 'Window'),
        ul = document.createElement('ul'),
        li = document.createElement('li'),
        msg = document.createElement('p'),
        anyoneElse = document.querySelectorAll('.shown'),
        listsContainer = document.getElementById('listsContainer');
    ul.className = "newList shown";
    if (document.body.contains(a) === false && document.body.contains(b) === false) {
        [].forEach.call(anyoneElse, function (p) {
            p.className = "newList hidden";
        });
        if (sock.usern === username.value) { ul.id = sock.userTo + 'Window'; } else { ul.id = sock.usern + 'Window'; friendName.innerHTML = sock.usern; }
        ul.appendChild(li);
        listsContainer.appendChild(ul);
    }
    
    var pvmsgSend = document.getElementById(sock.userTo + 'Window'),
        pvmsgRec = document.getElementById(sock.usern + 'Window');
    //if (sock.usern === username.value) { pvmsg.id = sock.userTo + 'Window'; } else { pvmsg.id = sock.usern + 'Window'; }
    msg.className = "withEmoji";
    msg.appendChild(document.createTextNode(sock.txt));
    li.appendChild(msg);
    if (document.body.contains(pvmsgSend)) { pvmsgSend.appendChild(li); }
    if (document.body.contains(pvmsgRec)) { pvmsgRec.appendChild(li); }
    var k = document.querySelectorAll('p');
    [].forEach.call(k, function (variab) {
        variab.innerHTML = variab.innerHTML.replace(/:bigsmile:/g, document.getElementById('bigsmile').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:cheese:/g, document.getElementById('cheese').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:confusedlaugh:/g, document.getElementById('confusedlaugh').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:crying:/g, document.getElementById('crying').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:excited:/g, document.getElementById('excited').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:foolish:/g, document.getElementById('foolish').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:furious:/g, document.getElementById('furious').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:good:/g, document.getElementById('good').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:ill:/g, document.getElementById('ill').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:lmao:/g, document.getElementById('lmao').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:lol:/g, document.getElementById('lol').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:love:/g, document.getElementById('love').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:satan:/g, document.getElementById('satan').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:shy:/g, document.getElementById('shy').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:smile:/g, document.getElementById('smile').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:thinking:/g, document.getElementById('thinking').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:thumbup:/g, document.getElementById('thumbup').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:tired:/g, document.getElementById('tired').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:tongue:/g, document.getElementById('tongue').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:wink:/g, document.getElementById('wink').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:xD:/g, document.getElementById('xD').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:nerd:/g, document.getElementById('nerd').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:achoumi:/g, document.getElementById('achoumi').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:sleeping:/g, document.getElementById('sleeping').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:swag:/g, document.getElementById('swag').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:shywhistle:/g, document.getElementById('shywhistle').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:lying:/g, document.getElementById('lying').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:bebe:/g, document.getElementById('bebe').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:fille:/g, document.getElementById('fille').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:pizza:/g, document.getElementById('pizza').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:3adhma:/g, document.getElementById('3adhma').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:chocolat:/g, document.getElementById('chocolat').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:heart:/g, document.getElementById('heart').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:exclamation:/g, document.getElementById('exclamation').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:interrogation:/g, document.getElementById('interrogation').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:smilingcat:/g, document.getElementById('smilingcat').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:excitedcat:/g, document.getElementById('excitedcat').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:lmaoingcat:/g, document.getElementById('lmaoingcat').outerHTML);
        //variab.innerHTML = variab.innerHTML.replace(':lovingcat:', document.getElementById('lovingcat').outerHTML);
        variab.innerHTML = variab.innerHTML.replace(/:lovingcat:/g, document.getElementById('lovingcat').outerHTML);
    });
    if (sock.usern === username.value) { li.className = 'sendMessage'; } else { li.className = 'receiveMessage'; reveivingSound.play(); }
    if (document.getElementById('Typing') !== null) { document.getElementById('Typing').remove(); }
    privateC = sock.usern; //pour repondre à celui qui nous a envoyé un message sans cliquer sur son nom sur la liste
    document.getElementById(friendName.innerHTML + 'Window').addEventListener('click', function () {
        document.querySelector('.emojis').className = 'emojis';
    });
    document.getElementById('state').innerHTML = 'Online';
    if (document.body.contains(pvmsgSend)) { pvmsgSend.scrollTop = pvmsgSend.scrollHeight; }
    if (document.body.contains(pvmsgRec)) { pvmsgRec.scrollTop = pvmsgRec.scrollHeight; }
});

document.querySelector('header p').addEventListener('click', function () {
    'use strict';
    window.close();
});