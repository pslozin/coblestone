//----V6-----------5/10/23
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

//----------order search

searchinput = document.querySelector('#searchbylastname')
searchbutton = document.getElementById('searchorderbtn')

searchbutton.addEventListener('click',ordersearch)

//-----------------------



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
    
    cfname = custFirstname.value
    clname = custLastname.value

    // if(custFirstname.value.length === 0 ||custLastname.value.length === 0 )
    // alert("first or last name is empty ")
    // else

    

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

    if(clname === "" || cfname === "")
    alert("first and last name are needed")
    else 
    {
    orderBtn.disabled = true; 
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

    orderConfirmed(orderId,totalPrice)
}
    //testDiv()
}

function orderConfirmed(ordId,int)
{
      
        let sts = ""

        axios.get(`/orderstatus/${ordId}`)
       
        .then((response) => {
       
        //sts = response.data[0].status
        createDiv(ordId,int)
        
    })
   
        
    }

function createDiv(int,price)    //Creating DIV to display order N and Status
{
        //console.log("Create DIV",string)
    
        var div = document.createElement('div');
        div.id = "confirm_order"

        var checkstatusBtn = document.createElement('button')

        //------close window button
        var closeWindowBtn = document.createElement('button')
        closeWindowBtn.id = "closebutton"
        closeWindowBtn.innerHTML = "X"
       

        //---------end-------------

        var statusField = document.createElement("span")
        statusField.id = "orderstatus"
        statusField.innerHTML = ""
        checkstatusBtn.id = "checkstatusBtn"
        checkstatusBtn.textContent = "check status"

        
        div.innerHTML = "order N " + int
         + " is received " + "Total price $" + price

        
        document.body.appendChild(div);
        div.appendChild(checkstatusBtn)
        div.appendChild(closeWindowBtn)

       div.appendChild(statusField)

        closeWindowBtn.addEventListener('click', (e) =>
        {
            document.body.removeChild(e.target.parentNode);
            location.reload();
        })
       
        checkstatusBtn.addEventListener('click', (e)=>{
            console.log("Checking status - ", int)

            //-----------
            axios.get(`/orderstatus/${int}`)
       
            .then((response) => {
                updateDiv(response.data[0])
          
        })
         

        })


}

function updateDiv(arr)
{
    console.log("STATUS CHECK HERE AGAIN",arr)
    statusField = document.querySelector('#orderstatus')
    statusField.innerHTML = arr.status
   
    if(arr.status === "READY")
    {
    divToinsert = document.getElementById("confirm_order")
    paymentButton = document.createElement('button')
    paymentButton.id = "checkstatusBtnPay"
    paymentButton.innerHTML = "PAY"
    
    divToinsert.appendChild(paymentButton)
    }


}


//------------TERSTING DIV STYLE----------------------
function testDiv()
{
        // console.log("Create DIV",string)
        var div = document.createElement('div')
        div.id = "confirm_order"

        var checkStatusBtn = document.createElement('button')

        var statusField = document.createElement("span")

        statusField.innerHTML = "STRING"

        checkStatusBtn.textContent = "check status"

        checkStatusBtn.id = "checkstatusBtn"
        
        div.innerHTML = "your order N  " + 555
         + " is received" + ""

        
        document.body.appendChild(div);
        div.appendChild(checkStatusBtn)
        div.appendChild(statusField)

}

//-----------------------------------------


function ordersearch()
{
    lastname = searchinput.value
    if(lastname === "")
    alert("last name is needed")
    else 
    axios.get(`/searchorder/${lastname}`)
       
    .then((response) => {
        if(response.data.length === 0)
        alert("NOT FOUND")
        
        else if(response.data[0].last_name === lastname)
        {
            console.log("IF DATA EXISTS",response.data[0].last_name)
            createCardDiv(response.data)   
        }
        else
        {
        console.log(response.data.last_name)
        alert("Noting Found")
        }
        
    })


  

}
function createCardDiv(arr)
{
    console.log("ARR",arr[0].last_name)
    lastname = searchinput.value
    
    searchcardDiv = document.getElementById('searchCards')
    carddiv = document.createElement('div')

    if(arr[0].status === "received")
    {
        carddiv.className = "cards"
    }

    else
    {
        carddiv.className = "cardsready"
    }

    //carddiv.className = "cards"//arr.[0].last_name
    
    searchresultul = document.createElement('p')
    searchresultul.id = "searchp"
    searchresultul.innerHTML = "order N- " + arr[0].order_id + "<BR>for -" + arr[0].last_name + "<BR>total price -$" 
    + arr[0].total_price + "<BR> Status - " + arr[0].status 

   
    deletecardbtn = document.createElement('button')
    deletecardbtn.innerText = "close"

    searchcardDiv.appendChild(carddiv)
    carddiv.appendChild(searchresultul)
    carddiv.appendChild(deletecardbtn)

    if(arr[0].status === "received")
    {
        cardCheckStatusButton = document.createElement('button')
        cardCheckStatusButton.id = "dummy"
        cardCheckStatusButton.innerHTML = "check status"
        carddiv.appendChild(cardCheckStatusButton)

                cardCheckStatusButton.addEventListener('click', (e)=>{
                axios.get(`/orderstatus/${arr[0].order_id}`)
           
                .then((response) => {
                    if(response.data[0].status === "READY")
                    {   
                        delp = document.getElementById('searchp')
                        delp.innerHTML = searchresultul.innerHTML = "order N- " + arr[0].order_id + "<BR>for -" + arr[0].last_name + "<BR>total price -$" 
                        + arr[0].total_price + "<BR> Status - " + response.data[0].status
                        carddiv.className = "cardsready"
                        carddiv.removeChild(e.target);
    
                    }
                    
              
            })
            })

        }



        // cardCheckStatusButton.addEventListener('click', (e)=>{
        //     axios.get(`/orderstatus/${arr[0].order_id}`)
       
        //     .then((response) => {
        //         if(response.data[0].status === "READY")
        //         {   
                    // delp = document.getElementById('searchp')
                    // delp.innerHTML = searchresultul.innerHTML = "order N- " + arr[0].order_id + "<BR>for -" + arr[0].last_name + "<BR>total price -$" 
                    // + arr[0].total_price + "<BR> Status - " + arr[0].status 
                    // carddiv.removeChild(e.target);

        //         }
                
          
        // })
        // })

      

    

    deletecardbtn.addEventListener('click', (e)=>{
        
        searchcardDiv.removeChild(e.target.parentNode);
        
        
    })
}