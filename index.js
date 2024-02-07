import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, set } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://realtime-database-bb336-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsementListInDB = ref(database, "endorsmentList")


const inputField = document.getElementById("input-area")
const publishBtn = document.getElementById("publish-btn")
const endorsementListEl = document.getElementById("edorsement-list")
const correspondantEls = document.getElementsByClassName("name-inputs")

const heartIcon = `<svg width="20" height="17" viewBox="0 0 15 13" xmlns="http://www.w3.org/2000/svg">
<path id="1" d="M7.18182 12.1818L1.34091 6.34091C0.875 5.875 0.564394 5.33333 0.409091 4.71591C0.257576 4.09848 0.25947 3.48485 0.414773 2.875C0.570076 2.26136 0.878788 1.72727 1.34091 1.27273C1.81439 0.806818 2.35417 0.498106 2.96023 0.346591C3.57008 0.191288 4.17803 0.191288 4.78409 0.346591C5.39394 0.501894 5.93561 0.810606 6.40909 1.27273L7.18182 2.02273L7.95455 1.27273C8.43182 0.810606 8.97349 0.501894 9.57955 0.346591C10.1856 0.191288 10.7917 0.191288 11.3977 0.346591C12.0076 0.498106 12.5492 0.806818 13.0227 1.27273C13.4848 1.72727 13.7936 2.26136 13.9489 2.875C14.1042 3.48485 14.1042 4.09848 13.9489 4.71591C13.7973 5.33333 13.4886 5.875 13.0227 6.34091L7.18182 12.1818Z"/>
</svg>
`

publishBtn.addEventListener("click", function(){
    let textValue = inputField.value;
    let correspondantsArray = []
    correspondantsArray.push(correspondantEls[0].value)
    correspondantsArray.push(correspondantEls[1].value)

    let textInDB = `<p id="liheader"><b>From ${correspondantsArray[0]}</b></p>${textValue}<p id="lifooter"><b>To ${correspondantsArray[1]}</b><span id="0">${heartIcon}</span></p>` 

    push(endorsementListInDB, textInDB)
    push(endorsementListInDB, '0')

    clearInputField();
})

onValue(endorsementListInDB, function(snapshot) {
    clearEndorsementList()
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
        console.log("Change")

        for (let i = 0; i < itemsArray.length-1; i+=2) {
            let currentItem = itemsArray[i]
            let currentLike = itemsArray[i+1];
        
            appendItemToEndorsementListEl(currentItem, currentLike)
            
        }   
    }
})



function clearInputField(){
    inputField.value = "";
    correspondantEls[0].value = "";
    correspondantEls[1].value = ""
}


function clearEndorsementList(){
    endorsementListEl.innerHTML = "";
}


function appendItemToEndorsementListEl(item, like){
    const itemID = item[0]
    const itemValue = item[1]

    const likeID = like[0]
    const likeValue = like[1];

    const newEl = document.createElement("li")
    newEl.innerHTML = itemValue;

    
    endorsementListEl.append(newEl);
    const heart = document.getElementById("0")
    const heartSvg = document.getElementById("1")

    heart.id = itemID;
    heartSvg.id = likeID;

    heart.style.cursor="pointer"
   
    if(JSON.parse(localStorage.getItem(likeID)))
        heartSvg.style.fill="red"
    else
        heartSvg.style.fill="black"

    if(likeValue!='0')
        heart.innerHTML+=likeValue;


   heart.addEventListener("click", function(){
        const exactLikeLocationinDB = ref(database, `endorsmentList/${likeID}`)

        if(JSON.parse(localStorage.getItem(likeID))){
            localStorage.setItem(likeID, "false")
            set(exactLikeLocationinDB, String(Number(likeValue)-1))
            
        }else{
            localStorage.setItem(likeID, "true")
            set(exactLikeLocationinDB, String(Number(likeValue)+1))            
        }
    })
    
}