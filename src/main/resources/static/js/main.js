'use strict'; // bật cơ chế kiểm tra độ tin cậy của code


var messageForm = document.querySelector('#messageForm'); // thẻ form
var messageInput = document.querySelector('#message');  // ô input
var messageArea = document.querySelector('#messageArea'); // nơi hiển thị tin nhắn
var connectingElement = document.querySelector('#connecting'); // loader

var stompClient = null; // biến đại diện kết nối
var username = null; // tên ngươi dùng



// hàm tạo kết nối tới websoket
function connect() {
    username = document.querySelector('#username').innerText.trim(); // lấy ra username ở ô input

    var socket = new SockJS('/ws'); // tao đối tượng SockJS
    stompClient = Stomp.over(socket); // tạo giao thức gửi tin nhắn

    stompClient.connect({}, onConnected, onError); // mở kết nối tới websocket
}

// Connect to WebSocket Server.
connect();

// khi đã kết nối
function onConnected() {
    // Subscribe to the Public Topic
    stompClient.subscribe('/topic/public-chat-room', onMessageReceived); // đăng kí topic tên là public-chat-room

    // gửi tới server socket bạn đang join box chat
     stompClient.send("/app/chat/add-user",
        {},
        JSON.stringify({sender: username, type: 'JOIN'})
    )

    connectingElement.classList.add('hidden'); //ẩn đi loader
}


// xử lí lỗi kết nối
function onError(error) {
    connectingElement.textContent = 'Could not connect to WebSocket server. Please refresh this page to try again!';
    connectingElement.style.color = 'red';
}

// hàm gửi tin nhắn
function sendMessage(event) {
    var messageContent = messageInput.value.trim(); // lấy ra tin nhắn người dùng nhập
    if(messageContent && stompClient) {
        var chatMessage = {
            sender: username,
            message: messageInput.value,
            type: 'CHAT'
        };
        stompClient.send("/app/chat/send-message", {}, JSON.stringify(chatMessage));
        messageInput.value = '';
    }
    event.preventDefault();
}


function onMessageReceived(payload) {
    var message = JSON.parse(payload.body);

    var messageElement = document.createElement('li');

    console.log("vào messs => " ,message)
    if(message.type === 'JOIN') {
        messageElement.classList.add('event-message');
        message.message = message.sender + ' joined!';
    } else if (message.type === 'LEAVE') {
        messageElement.classList.add('event-message');
        message.message = message.sender + ' left!';
    } else {
        messageElement.classList.add('chat-message');
        var usernameElement = document.createElement('strong');
        usernameElement.classList.add('nickname');
        var usernameText = document.createTextNode(message.sender);
        usernameElement.appendChild(usernameText);
        messageElement.appendChild(usernameElement);
    }

    var textElement = document.createElement('span');
    var messageText = document.createTextNode(message.message);
    textElement.appendChild(messageText);

    messageElement.appendChild(textElement);

    messageArea.appendChild(messageElement);
    messageArea.scrollTop = messageArea.scrollHeight;
}


messageForm.addEventListener('submit', sendMessage,true);  // tìm hiểu tham  số thứ 3