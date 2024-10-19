const socket = io()

const total_user = document.getElementById('total-user')
const msgBox = document.getElementById('msg-box')
const nameInput = document.getElementById('name-input')
const msgForm = document.getElementById('form-msg')
const msgInput = document.getElementById('msg-input')
const msgTone = new Audio('/msg-tone.mp3')

// recieve total nos. of user from the emit event from server and display 
socket.on('total-user', (data) => {
    total_user.innerText = `Total Users Online :  ${data}`
})

msgForm.addEventListener('submit', (e) => {
    e.preventDefault()
    sendMessage()
})

function sendMessage() {
    //console.log(msgInput.value)   
  if(msgInput.value ==='') return;
  
    const date = new Date();
    const shortDate = date.toLocaleDateString('en-US'); // "mm/dd/yyyy"
    const shortTime = date.toLocaleTimeString('en-US'); // "hh:mm:ss AM/PM"
    const shortDateTime = `${shortDate} ${shortTime}`;

    const data = {
        name: nameInput.value,
        message: msgInput.value,
        msgTime: shortDateTime
    }

    socket.emit('messageSend', data) // sent msg data to server with the event named messageSend
    addMessageToUI(true, data)
    msgInput.value = ''
  
}

// recieving msg from server 
socket.on('chat-msg-event', (data) => {
    //console.log(data)    
    addMessageToUI(false, data)
    msgTone.play()
})


function addMessageToUI(isOwnMsg, data) {
    clearFeedback()
    const element = `<li class=${isOwnMsg ? "right-msg" : "left-msg"} >
                     <p>${data.message}</p>
                    <span><i class="far fa-user" ></i> ${data.name} 
                    <i class="far fa-clock" ></i>${data.msgTime}</span>
                    </li>`
    
    msgBox.innerHTML += element

    AutoScrollToBottom()
}


function AutoScrollToBottom(){
    msgBox.scrollTo(0, msgBox.scrollHeight)
}

msgInput.addEventListener('focus', (e)=>{
    socket.emit('feedback_event', {
        feedback_msg : `${nameInput.value} is typing ...`
    })
})

msgInput.addEventListener('keypress', (e)=>{
    socket.emit('feedback_event', {
        feedback_msg : `${nameInput.value} is typing ...`
    })
})

msgInput.addEventListener('blur', (e)=>{
    socket.emit('feedback_event', {
        feedback_msg : ''
    })
})


// recive feedback from server
socket.on('typing-feedback', (data)=>{
    clearFeedback()
    // console.log(data)
    const element = ` <li class="feedback">
                      <p>${data.feedback_msg}</p> 
                      </li>`
    msgBox.innerHTML += element
})

// clear prev feedbacks
function clearFeedback(){
    document.querySelectorAll('li.feedback').forEach(element=>{
        element.parentNode.removeChild(element)
    })
}







// <i class="far fa-clock" ></i> ${moment(data.msgTime).fromNow()}</span>