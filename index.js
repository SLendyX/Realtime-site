import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://realtime-database-bb336-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsementListInDB = ref(database, "endorsmentList")

const inputField = document.getElementById("input-area")
const publishBtn = document.getElementById("publish-btn")
const endorsementListEl = document.getElementById("edorsement-list")

console.log(publishBtn)

inputField.addEventListener("click", function(){
    let text = inputField.value
    if(text === "Write your endorsement here")
        inputField.value = ""
})

publishBtn.addEventListener("click", function(){
    let textValue = inputField.value;

    push(endorsementListInDB, textValue)

    clearInputField();
})

onValue(endorsementListInDB, function(snapshot) {
    clearEndorsementList()
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
    
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            
            appendItemToEndorsementListEl(currentItem)
        }    
    }
})



function clearInputField(){
    inputField.value = "Write your endorsement here";
}


function clearEndorsementList(){
    endorsementListEl.innerHTML = "";
}


function appendItemToEndorsementListEl(item){
    let itemID = item[0]
    let itemValue = item[1]

    let newEl = document.createElement("li")
    newEl.textContent = item[1];

    /* 
    creez on nou registru in care memorez idul likeului si il
    initializez cu 0
    adaug un event listner care la click incrementeaza valoarea liekului din
    registru
    dar totusi nu stiu cum sa fac sa il elimin la click
    trebuie sa il identific cumva 
    */

    
    endorsementListEl.append(newEl);
    console.log(endorsementListEl)
}

