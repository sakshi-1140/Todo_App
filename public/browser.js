//Task 4.6  to Task 4.48
//Task 4.48 check all.

//window.onload() //TAsk 4.6

//Task 4.14 check this axios for read in brrowser
//Task 4.6.1 make this function
function generateTodos(){ 
    axios("/read-item",{}) // Task 4.7 complete line with body
        .then((res=>{
           // Task 4.8 console resp 
            console.log(res) // 
            //Task 4.10
            if(res.status!==200)alert(res.data.message)

                //Taks 4.11 sote in res.dtat.data
                //todo= rs.datat.data


                //TAks 4.13
                document,gstElementbID("item_list").insertAdjacentHTML("beforeEnd",
                    todos.map((item)=>{
                        return `<li></li>

                        <buttom id = todoId`
                    }).join("")
                )
        }))
    .catch(()=>{
        //Task 4.9

    })
}

//TAsk 4.15 make event listender
document.addEventListener("click", function(event){
    //TAsk 4.29 check edit button
    //Task 4.16
    if(event.target.classList.contains("")){
        console.log("clicled edit")
//Task 4.18 event.target .get Attribut
console.log("event.target")
console.log(event.target.getAttribute("data-id"))


//Task 4.19
const todoId = event.target.getatttribut("data-id");

//Taks 4.20 
console.log(prompt("Eneter ner aRodo data"))

//ATSke 4.21

const NewData = prompt("entet new rodofo text")

  
axios//TAsk 4.22
.post("/edit-item",{newData,todoId})       
.then(()=>{
//Task 4.25
//Task 4.26 console res
//TAls 4.27 
if(res.fdata.dattus!=200){
    //alere
}
//TAsk 4.28 
event.target.parentElement.parentELemt.querySletefv(".item-text").innerHtml = newData

}) 
.catch(()=>{}) //Task 4.23

}
//TAsk 4.36 chekc it delete butotn
    // Taks 4.17
    else if(event.target.classList.contains("")){
        console.log("clicled delte")
        //Task 4.30
        const todoId

        //Task 4.31
        axios.post("/").
        then(
            //task 4.33 comoel
            //taske 4.34 alear  status
//task 4.35
//remove todo by docume.element


        ).
        cathc(//TAske 4.32    
        )


    }
    //TAks 4.47 ccheck add Button
    //TAsk 4.37 //TAsk 4.37.1 Update Dashboard page 
    else if(event.target.classList.contains("")){
        console.log("clicled add Button")
   
//Task 4.38
console.log(document.getElementById("create_filed"))
//Task 4.39 .value()
//TAsk 4.40 
//const todo =

//Task 4.41 
axios.post("/")
.then(
    //TAks 4.43 
    console.log(res)
    //TAsk 4.44
    if(res.status!=201){
        alert
    }
    //Task 4.45 blanck the input filer
    documenr.getElemtn().vlauer ="'";

    //TAsk 4.46 add
    document.getElementById("").insertAdjacentHTML("befoureend",
        `<li> </li>`

    )
    
)
.cathc(
    //task 4.42
)
    }
})

//TAks 4.12 html part