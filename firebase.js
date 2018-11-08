var current_user = null; // firebaseConfig will handle checking login
var database = null; // firebase will config this
var customDictionary = [];
var allPuzzles = [];


function save() {
    console.log('save...');

    var userId = current_user.uid;

    // for custom dictionary
    var dict = document.getElementById("custom-dictionary").value;
    console.log('dict', dict);
    var split = dict.split('\n');
    console.log('split', split);

    // clean empties and convert to lowercase
    var savelist = [];
    for (var i = 0; i < split.length; i++) {
        if (split[i] != "") savelist.push(split[i].toLowerCase());
    }

    // save dictionary
    firebase.database().ref('users/' + userId + '/dictionary').set(savelist);
    console.log('saved dictionary...');



    // save puzzle
    if (xw._firebaseId) {
        xw._lastSaved = Date.now();
        console.log('updating...', xw._firebaseId);
        // update current
        firebase.database().ref('users/' + userId + '/puzzles/' + xw._firebaseId).set(xw);
    }
    else {
        console.log('saving new...');

        xw._firstSaved = Date.now();
        xw._lastSaved = xw._firstSaved;

        firebase.database().ref('users/' + userId + '/puzzles').push(xw).then(resp => {
            console.log('saved');
            console.log(resp.key)
            xw._firebaseId = resp.key;
        }
        );
    }

}

function fetch() {
    var userId = current_user.uid;

    // get dictionary
    firebase.database().ref('users/' + userId + '/dictionary').once("value",
        function (resp) {
            var list = resp.val();
            console.log('dictionary', list);
            customDictionary = list;

            if (customDictionary && customDictionary.length > 0) {
                // add to dictionary list
                addToWordlist(customDictionary);
                sortWordlist();

                // restore custom dictionary to textarea
                var inputVal = '';
                for (var i = 0; i < list.length; i++) {
                    inputVal += list[i] + '\n';
                }
                document.getElementById("custom-dictionary").value = inputVal;
            }
        });

    allPuzzles = [];
    var puzzlesSelect = document.getElementById('puzzles-select');

    // get puzzle (first for now)
    firebase.database().ref('users/' + userId + '/puzzles').once("value",
        function (resp) {

            var puzzles = resp.val();

            if (puzzles) {

                var keys = Object.keys(puzzles);
                var puzzlesArray = [];
                console.log('puzzles', puzzles)

                for (var i = 0; i < keys.length; i++) {
                    var key = keys[i];
                    var puz = puzzles[key];

                    console.log(puz.title + ' ' + puz._lastSaved, puz);
                    puzzlesArray.push(puz);

                    var opt = document.createElement("OPTION");
                    opt.value = i; // index of puzzle is the value
                    var timestamp = new Date(puz._lastSaved);
                    var timestring = timestamp.toDateString('MM/dd/yyyy');
                    opt.innerText = puz.title + ' - ' + timestring;
                    puzzlesSelect.appendChild(opt);
                }

                allPuzzles = puzzlesArray;

                // load a puzzle
                xw = puzzles[keys[0]]; // model
                current = new Interface(xw.rows, xw.cols); // view-controller
                current.update();
                updateUI();
            }
        }
    );

    console.log('allPuzzles', allPuzzles);
}

function loadFromList() {
    var puzzlesSelect = document.getElementById('puzzles-select');
    xw = allPuzzles[puzzlesSelect.value]; // model
    current = new Interface(xw.rows, xw.cols); // view-controller
    current.update();
    updateUI();
}