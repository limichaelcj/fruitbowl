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
    document.getElementById('user-count').innerHTMl = data.userCount;
    var text = `${data.name} has ${data.connected ? 'joined' : 'left'} the room.`;
    addPost(text, 'notice');
  });

  socket.on('chat message', data => {
    addPost(data.message, 'message');
  });

  // ajax form submission
  var form = document.querySelector('#chatroom-form');
  console.log(form);

}

function addPost(text, type='message'){
  var feed = document.querySelector('.chatroom__feed');
  var className = `chatroom__post chatroom__post--${type}`;
  var elem = document.createElement('li');
  elem.class = className;
  elem.innerHTML = text;
  feed.append(elem);
  feed.scrollTop = elem.scrollHeight;
}
