const sendButton = document.getElementById('sendName')
const userName = document.querySelector('#firstName')
const userLastname = document.querySelector('#lastName')
const getbutton = document.getElementById('getnames')

// let body = {
//     firstName: userName.value, 
//     lastName: userLastname.value
// }

//console.log(body)

sendButton.addEventListener("click", (e)=>{
    
    let body = {
        firstName: userName.value,
        lastName: userLastname.value
    }

    if (userName.value.length === 0 || userLastname.value.length === 0 )
    alert("can`t be empty")
    else {
    console.log(body)
    console.log('Hi Philip')
    
    
    axios.post('/adduser',body)
    .then(response => {
        console.log("Received", response.data)
})
}
})

getbutton.addEventListener('click', getallusers)

function getallusers()
{
    axios.get('/getallusers').then(function (response) {
        // handle success
        console.log(response.data[0]);
      })
    
}


