const getpizzaitemsbutton = document.getElementById('getpizzaitems')
const addItemtomenu = document.getElementById('additem')
let lengthofmenuitems = 0 // need this for adding items later
let cellIdforAdd = 0 // need this for adding items later
let buttonIdforAdd = 0 // need this for adding items later

const seeOrdersbtn = document.getElementById('seeOrdersbtn')

table = document.getElementById('pizzstoreitems')

getpizzaitemsbutton.addEventListener('click', getpizzaitems)
addItemtomenu.addEventListener('click',addNewitems)

seeOrdersbtn.addEventListener('click',seeOrders)


//---------------FUNCTIONS------------------------

function getpizzaitems()
{

    getpizzaitemsbutton.disabled = true;
    axios.get('/getpizzaitems').then(function(response) {


    lengthofmenuitems = response.data.length
    cellIdforAdd = response.data[lengthofmenuitems-1].item_id

    for(i = 0; i < response.data.length; i++)
    { 
        console.log(table.rows[i])

        var newRow = table.insertRow();
        var cell1 = newRow.insertCell(0);
        cell1.innerHTML = response.data[i].item_id;
        var cell2 = newRow.insertCell(1);
        cell2.innerHTML = response.data[i].name;
        var cell3 = newRow.insertCell(2);
        cell3.innerHTML = response.data[i].price;
        cell4 = newRow.insertCell(3);
        cell4.id = response.data[i].item_id 

        const cell = document.getElementById(response.data[i].item_id);
        const deleteBtn = document.createElement('button')
        deleteBtn.id = response.data[i].item_id
    
        deleteBtn.textContent = 'Delete ?'
        cell.appendChild(deleteBtn)

        deleteBtn.addEventListener("click", e => {
            deleteBtn.disabled = true
            deleteitem(e.target.id)
            
          })
    }

})

}

function deleteitem(int)
{
   

    console.log("Before sent",int)
    axios.delete(`/deletefrommenu/${int}`)
    .then((response) => {
        console.log("GOT BACK FROM SRVR",response.data)
        
        
    })
    // console.log()
    
    
}

function addNewitems()
{
    const nuprce = document.querySelector('#newitemprice')
    const niname = document.querySelector('#newItemname')
    
    if(nuprce.value.length === 0 || niname.value.length === 0)
    alert("EMPTY")
    else
    {
    let body = {

        newItemname: niname.value,
        newItemprice: nuprce.value
    }
    console.log(body)

//------------------------------------------------------------
    // tableadd = document.getElementById('pizzstoreitems')
    // console.log(tableadd)
    // console.log("Lenght - ",lengthofmenuitems, "ID -", cellIdforAdd)

    // var newRow = tableadd.insertRow(lengthofmenuitems + 1);
    // var cell1 = newRow.insertCell(0);

    // var cell2 = newRow.insertCell(1);
    // cell2.innerHTML = niname.value;

    // var cell3 = newRow.insertCell(2);
    // cell3.innerHTML = nuprce.value;

    // var cell4 = newRow.insertCell(3);
    
    // const deleteBtn = document.createElement('button')
    // deleteBtn.id = 77
    
    // deleteBtn.textContent = 'Delete ?'
    // cell4.appendChild(deleteBtn)
    
//-----------------------------------------------------
    axios.post('/addmenuitem',body)
    .then(response => {
        console.log("Rceived FROM SERVER", body)
})

axios.get('/getpizzaitems').then(function(response) {
    addItemtoPizzaMenu(response.data)
    
})


    }
}

function seeOrders()
{
    axios.get('/seeorders')
    .then((response) => {
        const list = document.querySelector('ul')
        list.innerHTML = ''

        response.data.forEach((item_id,index) => {
        console.log("Content",response.data[index].item_id)

        const listItem = document.createElement('li')

        listItem.id = response.data[index].user_id
        
        if(response.data[index].status === "READY")
        {
      
        listItem.className = 'ordready'

        }
        else
        listItem.className = 'orders'

        const nameSpan = document.createElement('span')
        const deleteBtn = document.createElement('button')
        const removeOrder = document.createElement('button')
        
        listItem.textContent = "Order N - " + response.data[index].user_id + "-- Item - " +
        response.data[index].item_id + "Quantity - " + response.data[index].quantity + "--"
        deleteBtn.textContent = response.data[index].status
        //deleteBtn.id = index
        removeOrder.textContent = 'X'
        removeOrder.id = response.data[index].user_id

        deleteBtn.id = response.data[index].user_id

        removeOrder.addEventListener('click', (e)=>{

            removeLi = document.getElementById(e.target.id)
            removeLi.remove()

        axios.delete(`/deletefromorders/${e.target.id}`)
        .then((response) => {
        console.log("GOT BACK FROM SRVR",response.data)
      
    })

            
        })

        deleteBtn.addEventListener('click', (e)=>{
            
            let idForcapture = response.data[index].user_id
            allLists = document.querySelectorAll(`li[id="${idForcapture}"]`)
            


            console.log("ODR",allLists.length)

            for(i = 0; i < allLists.length; i++)
            {
                allLists[i].className = 'ordready'
                console.log(allLists[i])
                deleteBtn.textContent = "READY"
            }


            deleteBtn.textContent = "READY"

            changeOrderStatus(e.target.id)
            changeli = document.getElementById(e.target.id)
            changeli.className = 'ordready'
            
           

        })

       
        listItem.appendChild(deleteBtn)
        listItem.appendChild(removeOrder)

        list.appendChild(listItem)
    })
        
    })
}

function changeOrderStatus(orderId)
{
    console.log("Changing status of ",orderId)
    axios.put(`/orderstatus/${orderId}`)
    .then((response) => {
        console.log("SATUS OF - ",orderId, "-", response)
    
    })
    console.log()
    
}


function addItemtoPizzaMenu(arr)
{
    
    console.log("DLinna Pered",arr.length)
    let placeholder = arr.length
    i = placeholder - 1
    console.log("ELEMENT", arr[i].item_id)
//-----------------

    tableadd = document.getElementById('pizzstoreitems')
    console.log(tableadd)
    console.log("Lenght - ",lengthofmenuitems, "ID -", cellIdforAdd)

    var newRow = tableadd.insertRow(lengthofmenuitems + 1);
    var cell1 = newRow.insertCell(0);
    cell1.innerHTML = arr[i].item_id;
    var cell2 = newRow.insertCell(1);
    cell2.innerHTML = arr[i].name;

    var cell3 = newRow.insertCell(2);
    cell3.innerHTML = arr[i].price;

    var cell4 = newRow.insertCell(3);
    
    const deleteBtn = document.createElement('button')
    deleteBtn.id = arr[i].item_id
    
    deleteBtn.textContent = 'Delete ?'
    cell4.appendChild(deleteBtn)

    deleteBtn.addEventListener("click", e => {
        deleteBtn.disabled = true
        deleteitem(e.target.id)
        
      })

//---------------




}