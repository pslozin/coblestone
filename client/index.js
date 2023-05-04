//------ Buttons and Listenesr for GET Menu

getMenubtn = document.getElementById('getMenu')
getMenubtn.addEventListener('click',getpizzaitems)
//-------------------END----------------------------

//--------Buttons and Listeners for Create order
orderBtn = document.getElementById('orderBtn')
custFirstname = document.querySelector('#firstName')
custLastname = document.querySelector('#lastName')

orderBtn.addEventListener('click', collectOrderinfo)
let orderId = Math.floor(Math.random() * 8896);
let userId = orderId
//---------------------END----------------------------

//--------- Elements for creating table
table = document.getElementById('menuTable')
//tablecontent = document.querySelectorAll('qitems')
//---------------------END---------------------------

let numberOfitems = 0 // used to get number of DB items to run a loop later


function getpizzaitems()
{
    getMenubtn.disabled = true;  //Disabling menu population once its shown
    axios.get('/getpizzaitems').then(function(response) {

    numberOfitems = response.data.length // assign DB length

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
        cell2.id = 'item_name'
        var cell3 = newRow.insertCell(2);
        cell3.innerHTML = response.data[i].price;
        cell3.id = 'price'
        var cell4 = newRow.insertCell(3);
        cell4.id = response.data[i].item_id;
        cell4.innerHTML = '<input id="qitems" type="number" minlength="10"></input>'

    }

})
}

function collectOrderinfo()
{
    orderBtn.disabled = true; 

    cfname = custFirstname.value
    clname = custLastname.value

    let orderBody = [] // Array to pass to db

    itemprice = document.querySelectorAll('#price')
    tablecontent = document.querySelectorAll("#qitems");
    itemname = document.querySelectorAll('#item_name')
    
    let totalPrice = 0
    let status = 0
    orderBobyinit = 0 // Init for Array Of Obj


    for(i = 0; i < tablecontent.length; i++ )
    {
        if(tablecontent[i].value !== "")
        {
        console.log("Order for - ", orderId, "Ordered :",itemname[i].innerText,"Quantity - ",
        tablecontent[i].value, "Price per Item - ", itemprice[i].innerText )

        totalPrice = totalPrice + parseFloat(itemprice[i].innerText)*(tablecontent[i].value)
        
        orderBody[orderBobyinit] = {user_id: userId, first_name: cfname, last_name: clname, 
            order_id: orderId, item_id: null, total_price: totalPrice, status: "received" }
            orderBobyinit ++   
        }
        
    }

    console.log("Total price of the order - ",totalPrice)
    //console.log(orderBody)

    axios.post('/createorder',orderBody)   //calling Bulk_Create on Server side
}