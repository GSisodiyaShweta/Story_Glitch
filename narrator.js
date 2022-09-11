/* global jsyaml, engine */

let story;
let inventory;
let counter1 = 0;
let counter2 = 0;
let counter3 = 0;
const arrayOfPlayersChoices = [];

fetch("story.yaml")
    .then(res => res.text())
    .then(start);

function start(storyText) {
    story = jsyaml.load(storyText);

    engine.setTitle(story["metadata"]["title"]);
    inventory = new Set(story["initially"]["inventory"]);

    arrive(story["initially"]["location"], story["initially"]["description"]);
   /* downloadPlayersChoices();*/
}

function arrive(target, initialDescription) {

    engine.clearDescriptions();

    engine.addDescription(initialDescription);

  
    let currentTarget = story['locations'][target];
    updateInventory(currentTarget);
    engine.setBackground(currentTarget['bg_tag']);
    engine.setFontColor(currentTarget['color_tag']);
    let currentTargetDescription = currentTarget['descriptions'];

    currentTargetDescription.forEach(description => {
        if (conditionsHold(description)) {
            engine.addDescription(description.text, description.tags);

        }
    });
  
    arrayOfPlayersChoices.push(currentTarget['choices']);
    let currentTargetChoices = currentTarget['choices'];
    engine.clearChoices();
    currentTargetChoices.forEach(choiceText => {
        if (conditionsHold(choiceText)) {

            engine.addChoice(choiceText.text, () => {
                arrive(choiceText.target, choiceText.narration);
            }, [choiceText.tags] /*tags*/ );

        }
    })

}

function all(arrR, setT) {
    let arrSet = new Set(arrR);
    for (let a of arrSet) {
        if (!setT.has(a)) {
            return false;
        }

    };
    return true;
}


function conditionsHold(obj) {

    let withArray = obj['with'];
    let withoutArray = obj['without'];
    let results = true;

    inventory.forEach(inventoryElement => {
        if (typeof withArray !== 'undefined') {
            if (!all(withArray, inventory)) {
                results = false;
            }
        }
        if (typeof withoutArray !== 'undefined') {
            if (all(withoutArray, inventory)) {
                results = false;
            }
        }
    });
    return results;
}

function updateInventory(modify) {
    let modifyProvides = modify['provides'];
    let modifyConsume = modify['consumes'];
    if (typeof modifyProvides !== 'undefined') {
        modifyProvides.forEach(inventory.add, inventory)
    }
    if (typeof modifyConsume !== 'undefined') {
        modifyConsume.forEach(inventory.delete, inventory)
    }
}

function downloadPlayersChoices(){
  let csvContent = "data:text/csv;charset=utf-8,";

  arrayOfPlayersChoices.forEach(function(rowArray) {
      let row = rowArray.join(",");
      csvContent += row + "\r\n";
  });
  var encodedUri = encodeURI(csvContent);
  window.open(encodedUri);
  
}

function mongoC(){

 var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://ShwetaIITR:Shweta@1995@cluster0.ntvhkrd.mongodb.net/?retryWrites=true&w=majority";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("db");
  var myobj = { name: "Company Inc", address: "Highway 37" };
  dbo.collection("shweta").insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });
});
}


  