const getpizzaitemsbutton = document.getElementById('getpizzaitems')
const addItemtomenu = document.getElementById('additem')

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

    //==========working FOREACH ============
    // response.data.forEach((item_id,index)  => {
        
    //     console.log(response.data[index].item_id)
        
    // });
    //===================================

    for(i = 0; i < response.data.length; i++)
    { 
        console.log(table.rows[i])

        var newRow = table.insertRow(-1);
        var cell1 = newRow.insertCell(0);
        cell1.innerHTML = response.data[i].item_id;
        var cell2 = newRow.insertCell(1);
        cell2.innerHTML = response.data[i].name;
        var cell3 = newRow.insertCell(2);
        cell3.innerHTML = response.data[i].price;
        var cell4 = newRow.insertCell(3);
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
    console.log()
    document.getElementById("pizzstoreitems").deleteRow(28);
    
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

    axios.post('/addmenuitem',body)
    .then(response => {
        console.log("Rceived FROM SERVER", body)
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
        const nameSpan = document.createElement('span')
        const deleteBtn = document.createElement('button')
        
        nameSpan.textContent = response.data[index].user_id + 
        response.data[index].item_id + response.data[index].quantity
        deleteBtn.textContent = 'change status to DONE'
        //deleteBtn.id = index
        deleteBtn.id = response.data[index].user_id

        deleteBtn.addEventListener('click', (e)=>{
            
            changeOrderStatus(e.target.id)
        })

        listItem.appendChild(nameSpan)
        listItem.appendChild(deleteBtn)

        list.appendChild(listItem)
    })
        // console.log(response.data)
        // console.log(response.data[2].item_id)
        //displayNames(response.data)
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
    //document.getElementById("pizzstoreitems").deleteRow(28);
    //console.log("STATUS of - ", parseInt(orderId))
}