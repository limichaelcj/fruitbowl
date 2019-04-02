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
    document.getElementById('user-count').innerHTML = data.userCount;
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
  var className = `chatroom__post chatroom__post--${type}`;

  var post = document.createElement('li');
  post.className = className;

  var text = document.createElement('div');
  text.className = "chatroom__post__text";
  text.innerHTML = type === 'message' ? data.message : data;
  post.append(text);

  var avatar = document.createElement('div');
  avatar.className = "chatroom__post__avatar";
  // circle = server or user avatar
  var avatarCircle = document.createElement('div');
  avatarCircle.className = type === 'notice'
    ? "chatroom__post__avatar__circle"
    : "chatroom__post__avatar__circle avatar-icon";
  var circleContent = type === 'notice'
    ? '<i class="fas fa-robot"></i>'
    : `<img class='' src='${data.avatar}'></img>`;
  avatarCircle.innerHTML = circleContent;
  avatarCircle.title = type === 'notice'
    ? 'Server Notice'
    : data.name;
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
