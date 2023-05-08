//----V5-----------
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

//--- TEST-------
// orderCo = document.getElementById('orderConfirm')
// orderCo.addEventListener('click',e => {
//     orderConfirmed(e,orderId)
// })

//----END TEST---

let numberOfitems = 0 // used to get number of DB items to run a loop later


function getpizzaitems()
{
    getMenubtn.disabled = true;  //Disabling menu population once its shown
    axios.get('/getpizzaitems').then(function(response) {

    numberOfitems = response.data.length // assign DB length


    for(i = 0; i < response.data.length; i++)
    {
   
        var newRow = table.insertRow(-1);

        var cell1 = newRow.insertCell(0);
        cell1.innerHTML = response.data[i].item_id;
        cell1.id = 'item_id'
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

function collectOrderinfo() // Collecting order details to be sent to Orders DB
{
    orderBtn.disabled = true; 

    cfname = custFirstname.value
    clname = custLastname.value

    let orderBody = [] // Array to pass to db

    itemprice = document.querySelectorAll('#price')
    tablecontent = document.querySelectorAll("#qitems");
    itemname = document.querySelectorAll('#item_name')
    itemId = document.querySelectorAll('#item_id')
    
    let totalPrice = 0
    let totalPriceperorder = 0
    let status = 0
    orderBobyinit = 0 // Init for Array Of Obj

    console.log(itemId[1].innerHTML)

    for(i = 0; i < tablecontent.length; i++ )
    {
        if(tablecontent[i].value !== "")
        {
        console.log("Order for - ", orderId, "Ordered :",itemname[i].innerText, "ID: - ", itemId[i].innerHTML, "Quantity - ",
        tablecontent[i].value, "Price per Item - ", itemprice[i].innerText )

        item_id = itemname[i].innerHTML // item Name
        quantity = tablecontent[i].value // Quantity

        totalPrice = totalPrice + parseFloat(itemprice[i].innerText)*quantity

        totalPriceperorder = totalPriceperorder + parseFloat(itemprice[i].innerText)*(tablecontent[i].value)
        orderBody[orderBobyinit] = {user_id: userId, first_name: cfname, last_name: clname, 
            order_id: orderId, item_id: item_id, total_price: totalPriceperorder, 
            quantity: quantity, status: "received" }
            orderBobyinit ++
            totalPriceperorder = 0
            
        }
    }

    console.log("Total price of the order - ",totalPrice)

    axios.post('/createorder',orderBody)   //calling Bulk_Create on Server side

    orderConfirmed(orderId)
}

function orderConfirmed(ordId)
{
        //console.log(ordId)
       // ordId = 565
        let sts = ""

        axios.get(`/orderstatus/${ordId}`)
       
        .then((response) => {
        console.log("STATUS CHECK",response.data[0])
        sts = response.data[0].status
        createDiv(sts,ordId)
        //console.log("LOOK",sts)
    })
   
        
    }

function createDiv(string,int)    //Creating DIV to display order N and Status
{
        console.log("Create DIV",string)
        var div = document.createElement('div');
        var checkStatusBtn = document.createElement('button')
        var statusField = document.createElement("span")
        statusField.innerHTML = string
        checkStatusBtn.textContent = "check status"

        div.id = "confirm_order"
        div.innerHTML = "<BR><BR>Your Order N is <BR><BR>" + int
         + "<BR><BR>Staus..." + string + "<BR></BR>"

        
        document.body.appendChild(div);
        div.appendChild(checkStatusBtn)

       div.appendChild(statusField)

        checkStatusBtn.addEventListener('click', (e)=>{
            console.log("Checking status - ", int)

            //-----------
            axios.get(`/orderstatus/${int}`)
       
            .then((response) => {
                updateDiv(response.data[0])
          
            //console.log("STATUS CHECK HERE AGAIN",response.data[0])
           
            //statusField.innerHTML = "OK"
        })
         

        })


}

function updateDiv(arr)
{
    console.log("STATUS CHECK HERE AGAIN",arr)
    statusField = document.querySelector('span')
    statusField.innerHTML = arr.status
   //console.log("yu",arr.status)

}
