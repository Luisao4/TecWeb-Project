/*          STYLE            */

//       log in animations of goin up 


let fields = document.querySelectorAll('.field');

// basicly what it does is adds the class "top" to the label so we can 
//push it up a bit

for (let i = 0; i < fields.length; i++) {
    fields[i].firstElementChild.addEventListener('focus', () => {
        fields[i].querySelector('label').classList.add('top');
        // add a litle colored bar
        fields[i].querySelector('.border').style.transform = 'scale(1)';
    });

    //need a fuction so whenever it doesnt focus it comes back to place

    fields[i].firstElementChild.addEventListener('blur', () => {

        //IF there is an input the word should remain on top

        if (fields[i].firstElementChild.value.length <= 0) {
            // remove the litle border
            fields[i].querySelector('label').classList.remove('top');
            fields[i].querySelector('.border').style.transform = 'scale(0)';
        }
    });
}
// clear fields when page refreshed
document.getElementById("formezinho").reset();

/* ---------------------------------------------- */

var user = new User(null, null, "19");

function User(username, password, group) {
    this.username = username;
    this.password = password;
    this.group = group;
}

const host = 'twserver.alunos.dcc.fc.up.pt';
const port = '8008';
const url = 'http://' + host + ':' + port;
//const url = 'http://localhost:8019'; -> Componente Projeto 3 --- descomentar / comentar anterior de forma a poder utilizar node index.js, e seguidamente abrir index.html para utilizar o localhost como servidor

function register() {  
    document.getElementById("log").style.display = "none";
    document.getElementById("ACC").style.display = "none";
    //console.log("works");
    const butao = document.getElementById("reg");
    butao.addEventListener('click', () => {
        const usr = document.getElementById("name").value;
        const pwd = document.getElementById("pass").value;
        //console.log(usr);
        x = {
            "nick": usr,
            "password": pwd
        };
        // console.log(x);
        // console.log("fresh created");
        fetch(url + '/register', {
            method: 'POST',
            body: JSON.stringify(x),
        })
            .then(_login);
        // .then(response => console.log(response))
        // .catch(console.log);
    });
}


function _login(response) {
    if (response.status >= 200 && response.status < 300) {
        document.getElementById("error").style.display = "none";
        newuser = new User(document.getElementById("name").value, document.getElementById("pass").value);
        document.getElementById("suc").style.display = "block";
        document.getElementById("log").style.display = "block";
        // console.log(newuser);
        // console.log("this is the new user created");
        Alogin(newuser);
    } else {
        document.getElementById("name").value = "";
        document.getElementById("pass").value = "";
        document.getElementById("error").style.display = "block";
        document.getElementById("suc").style.display = "none";
        return;
    }
}

function Alogin(_user) {
    const Lbut = document.getElementById("log");
    //console.log("before if");
    Lbut.addEventListener('click', () => {
        if (_user.username == document.getElementById("name").value && _user.password == document.getElementById("pass").value) {
            document.getElementById("logsec").style.display = "none";
            document.getElementById("after").style.display = "block";
            user.username = _user.username;
            user.password = _user.password;
            // console.log(_user);            
            // console.log("above is after the login is done");
        }
        else
            document.getElementById("error").style.display = "block";
    });

}