// const io = require('socket.io-client');
import io from 'socket.io-client';

var socket = io();

if (document.readyState !== 'loading'){
  start();
} else {
  document.addEventListener('DOMContentLoaded', start);
}

function start(){
  // socket configuration
  socket.on('user', data => {
    // sync chatroom users info
    document.getElementById('user-count').innerHTML = data.allUsers.length;
    var allUsernames = data.allUsers.map(item => item.name);
    var chatroomUsersDiv = document.getElementById('chatroom-users');
    // for each child elem in the chatroom-users div, check the dataset.username
    Array.from(chatroomUsersDiv.children).forEach((elem,ind,arr) => {
      // if elem's dataset.username is not in the socket data, remove it
      if (!allUsernames.includes(elem.dataset.username)) {
        elem.remove();
      }
    });
    var chatroomUsers = Array.from(chatroomUsersDiv.children).map(elem => elem.dataset.username);
    // for each user in the socket data, check the user data {name,avatar}
    data.allUsers.forEach(user => {
      // if user.name does not have an element in the chatroom-users div, create one
      if (!chatroomUsers.includes(user.name)) {
        var div = document.createElement('div');
        div.dataset.username = user.name;
        div.title = user.name;
        div.className = 'chatroom__info__users__avatar avatar-icon avatar-icon--md';
        div.onclick = () => {
          window.open(`/profile/${user.name}`, '_blank');
        }
        div.innerHTML = `<img src="/assets/avatars/${user.avatar}.svg">`;
        chatroomUsersDiv.append(div);
      }
    })
    // chatroom feed update
    var text = `${data.name} has ${data.connected ? 'joined' : 'left'} the room.`;
    addPost(text, 'notice');
    scrollToBottom(document.querySelector('.chatroom__feed'));
  });
  socket.on('chat message', data => {
    addPost(data, 'message');
    scrollToBottom(document.querySelector('.chatroom__feed'));
  });

  // ajax form submission
  var form = document.querySelector('#chatroom-form');
  form.onsubmit = (e)=>{
    e.preventDefault();
    var input = document.querySelector('.chatroom__form__input');
    var message = input.value;
    if (message.trim() === '') return false;
    else {
      socket.emit('chat message', message);
      input.value = '';
    }
  }
}

function addPost(data, type='message'){
  var feed = document.querySelector('.chatroom__feed');
  // additional classes if type=notice
  var noticeClass = type === 'message'
  ? ''
  : data.includes('join')
  ? ' chatroom__post--notice--joined'
  : ' chatroom__post--notice--left';
  var className = `chatroom__post chatroom__post--${type}${noticeClass}`;

  var post = document.createElement('li');
  post.className = className;

  var text = document.createElement('div');
  // additional classes if type=message
  var messageClass = type === 'notice'
  ? ''
  : data.name == document.getElementById('socket-user').innerHTML.trim()
  ? ' chatroom__post__text--self'
  : ' chatroom__post__text--other';
  text.className = `chatroom__post__text${messageClass}`;
  text.innerHTML = type === 'message' ? data.message : data;
  post.append(text);

  var avatar = document.createElement('div');
  avatar.className = "chatroom__post__avatar";
  // circle = server or user avatar
  var avatarCircle = document.createElement('div');
  avatarCircle.className = type === 'message'
  ? "chatroom__post__avatar__circle avatar-icon"
  : "chatroom__post__avatar__circle";
  var circleContent = type === 'message'
  ? `<img class='' src='${data.avatar}'></img>`
  : data.includes('join')
  ? '<i class="fas fa-sun"></i>'
  : '<i class="fas fa-moon"></i>';
  avatarCircle.innerHTML = circleContent;
  avatarCircle.title = type === 'message'
  ? data.name
  : 'Server Notice';
  avatar.append(avatarCircle);
  if (type === 'message') {
    avatarCircle.onclick = () => {
      window.open(`/profile/${data.name}`, '_blank');
    }
  }
  // append to parent elements
  post.append(avatar);
  feed.append(post);
}
function scrollToBottom(elem){
  elem.scrollTop = elem.scrollHeight;
}
