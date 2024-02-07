import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, set } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://realtime-database-bb336-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsementListInDB = ref(database, "endorsmentList")

const likesInDB = ref(database, "likeList");



const inputField = document.getElementById("input-area")
const publishBtn = document.getElementById("publish-btn")
const endorsementListEl = document.getElementById("edorsement-list")
const correspondantEls = document.getElementsByClassName("name-inputs")

const heartIcon = `<svg width="20" height="17" viewBox="0 0 15 13" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.18182 12.1818L1.34091 6.34091C0.875 5.875 0.564394 5.33333 0.409091 4.71591C0.257576 4.09848 0.25947 3.48485 0.414773 2.875C0.570076 2.26136 0.878788 1.72727 1.34091 1.27273C1.81439 0.806818 2.35417 0.498106 2.96023 0.346591C3.57008 0.191288 4.17803 0.191288 4.78409 0.346591C5.39394 0.501894 5.93561 0.810606 6.40909 1.27273L7.18182 2.02273L7.95455 1.27273C8.43182 0.810606 8.97349 0.501894 9.57955 0.346591C10.1856 0.191288 10.7917 0.191288 11.3977 0.346591C12.0076 0.498106 12.5492 0.806818 13.0227 1.27273C13.4848 1.72727 13.7936 2.26136 13.9489 2.875C14.1042 3.48485 14.1042 4.09848 13.9489 4.71591C13.7973 5.33333 13.4886 5.875 13.0227 6.34091L7.18182 12.1818Z" fill="black"/>
</svg>
`

correspondantEls[0].value = "From";
correspondantEls[1].value = "To"

inputField.addEventListener("click", function(){
    let text = inputField.value
    if(text === "Write your endorsement here")
        inputField.value = ""
})

for(let i=0; i< correspondantEls.length; i++)
    correspondantEls[i].addEventListener("click", function(){
        let text = correspondantEls[i].value;
        if(text === "From" || text === "To")
            correspondantEls[i].value = "";

    })

publishBtn.addEventListener("click", function(){
    let textValue = inputField.value;
    let correspondantsArray = []
    correspondantsArray.push(correspondantEls[0].value)
    correspondantsArray.push(correspondantEls[1].value)

    let textInDB = `<p id="liheader"><b>${correspondantsArray[0]}</b></p>${textValue}<p id="lifooter"><b>${correspondantsArray[1]}</b><span id="0">${heartIcon}</span></p>` 

    push(endorsementListInDB, textInDB)
    push(endorsementListInDB, '0')

    clearInputField();
})

onValue(endorsementListInDB, function(snapshot) {
    clearEndorsementList()
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())

        for (let i = 0; i < itemsArray.length-1; i+=2) {
            let currentItem = itemsArray[i]
            let currentLike = itemsArray[i+1];
        
            appendItemToEndorsementListEl(currentItem, currentLike)
        }    
    }
})



function clearInputField(){
    inputField.value = "Write your endorsement here";
    correspondantEls[0].value = "From";
    correspondantEls[1].value = "To"
}


function clearEndorsementList(){
    endorsementListEl.innerHTML = "";
}


function appendItemToEndorsementListEl(item, like){
    let itemID = item[0]
    let itemValue = item[1]

    let likeID = like[0]
    let likeValue = like[1];

    let newEl = document.createElement("li")
    newEl.innerHTML = itemValue;

   
    /* 
    creez on nou registru in care memorez idul likeului si il
    initializez cu 0
    adaug un event listner care la click incrementeaza valoarea liekului din
    registru
    dar totusi nu stiu cum sa fac sa il elimin la click
    trebuie sa il identific cumva 
    */

    
    endorsementListEl.append(newEl);
    let heart = document.getElementById("0")

    heart.id = likeID;
    heart.style.cursor="pointer"


    if(likeValue!='0')
        heart.innerHTML+=likeValue;


   heart.addEventListener("click", function(){
        const exactLocationinDB = ref(database, `endorsmentList/${likeID}`)

        if(JSON.parse(localStorage.getItem(likeID))){
            set(exactLocationinDB, String(Number(likeValue)-1))
            localStorage.setItem(likeID, "false")
        }else{
            set(exactLocationinDB, String(Number(likeValue)+1))
            localStorage.setItem(likeID, "true")
        }
    })
}


function updateLikeCount(){

}
