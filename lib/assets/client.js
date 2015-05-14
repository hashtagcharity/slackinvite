/*global io,superagent*/

var body = document.body;
var request = superagent;

// elements
var select = body.querySelector('select');
var input = body.querySelector('input');
var inviteButton = body.querySelector('button.loading');
var startButton = body.querySelector('button.start');

// remove loading state
inviteButton.className = '';

// capture submit
body.addEventListener('submit', function(ev) {
  ev.preventDefault();
  inviteButton.disabled = true;
  inviteButton.className = '';
  inviteButton.innerHTML = 'Please Wait';
  var channel = select ? select.value : null;
  invite(channel, input.value, function(err) {
    if (err) {
      inviteButton.removeAttribute('disabled');
      inviteButton.className = 'error';
      inviteButton.innerHTML = err.message;
    } else {
      inviteButton.className = 'success';
      inviteButton.innerHTML = 'WOOT. Check your email!';
    }
  });
});

startButton.addEventListener('click', function(ev) {
  window.open('//itproswhocare.slack.com/messages/general');
});


function invite(channel, email, fn) {
  request
    .post('/invite')
    .send({
      channel: channel,
      email: email
    })
    .end(function(res) {
      if (res.error) {
        var err = new Error(res.body.msg || 'Server error');
        return fn(err);
      } else {
        fn(null);
      }
    });
}

// realtime updates
var socket = io();
socket.on('data', function(users) {
  for (var i in users) update(i, users[i]);
});
socket.on('total', function(n) {
  update('total', n)
});
socket.on('active', function(n) {
  update('active', n)
});

function update(val, n, noanim) {
  var el = document.querySelector('.' + val);
  if (n != el.innerHTML) {
    el.innerHTML = n;
    anim(el, val);
  }
}

function anim(el, c) {
  if (el.anim) return;
  el.className = c + ' grow';
  el.anim = setTimeout(function() {
    el.className = c;
    el.anim = null;
  }, 150);
}
