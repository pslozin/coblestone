const getpizzaitemsbutton = document.getElementById('getpizzaitems')
const addItemtomenu = document.getElementById('additem')

table = document.getElementById('pizzstoreitems')

getpizzaitemsbutton.addEventListener('click', getpizzaitems)
addItemtomenu.addEventListener('click',addNewitems)



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
        
        var newRow = table.insertRow(-1);

        var cell1 = newRow.insertCell(0);
        cell1.innerHTML = response.data[i].item_id;
        var cell2 = newRow.insertCell(1);
        cell2.innerHTML = response.data[i].name;
        var cell3 = newRow.insertCell(2);
        cell3.innerHTML = response.data[i].price;
        var cell4 = newRow.insertCell(3);
        cell4.id = response.data[i].item_id;

        const cell = document.getElementById(response.data[i].item_id);
        const deleteBtn = document.createElement('button')
        deleteBtn.id = response.data[i].item_id
        deleteBtn.textContent = 'X'
        cell.appendChild(deleteBtn)

        deleteBtn.addEventListener('click', deleteitem)
    }

})

}

function deleteitem()
{
    alert("BUTTON CLICLED")
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
        console.log(response.data)
        displayNames(response.data)
    })
}
