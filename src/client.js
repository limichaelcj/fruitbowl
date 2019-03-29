import './sass/style.scss'

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
    console.log(data.userCount);
    document.getElementById('user-count').innerHTMl = data.userCount;
    var text = `${data.name} has ${data.connected ? 'joined' : 'left'} the room.`;
    addPost(text, 'notice');
  });
  socket.on('chat message', data => {
    addPost(data, 'message');
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
      console.log('message sent')
      input.value = '';
    }
  }
}

function addPost(data, type='message'){
  var feed = document.querySelector('.chatroom__feed');
  var className = `chatroom__post chatroom__post--${type}`;
  var elem = document.createElement('li');
  elem.className = className;
  elem.innerHTML = type === 'message'
    ? `<b>${data.name}:</b> ${data.message}` : data;
  feed.append(elem);
  feed.scrollTop = elem.scrollHeight;
}
