$(document).ready(function() {
  loadDeadlines('lista.txt');
});

function loadDeadlines(url) {
  $.get(url, function(data) {
    var lines = data.substring(0, data.length - 1).split('\n');
    for(var i = 0; i < lines.length; i++) {
      lines[i] = lines[i].split(';');
      if(new Date(lines[i][1]) < new Date()) { lines.splice(i--, 1); }
    }
    lines.sort(function(a, b) { return new Date(a[1]) - new Date(b[1])})

    var clocks = $("#list");
    clocks.html('');

    for(var i = 0; i < lines.length; i++) {
      var color = Math.floor((i/lines.length) * 255);
      var rgb = "rgb(" + (255-color) + ", " + color + ", 80)";
      clocks.append("<tr style='color:" + rgb + "; text-shadow: 0 0 5px " + rgb + "'><td style='text-align: right;'>" + lines[i][0] + "</td><td>" + lines[i][2] + "</td><td id='clock_" + i + "' style='text-align: right; width: 200px;'>" + 
lines[i][1] + "</td></tr>");
    }

    updateClocks(lines)
  });
}

function updateClocks(lines) {
  for(var i = 0; i < lines.length; i++) {
    if(new Date(lines[i][1]) < new Date()) {
      loadDeadlines('lista.txt');
      return;
    }
    countdown(new Date(lines[i][1]), $("#clock_" + i));
  }
  var t = setTimeout(function() { updateClocks(lines); }, 500);
}

function countdown(then, container) {
  var now = new Date();
  var days = Math.round((then - now) / (1000*60*60*24));
  var hours = then.getHours() - now.getHours();
  var minutes = then.getMinutes() - now.getMinutes();
  var seconds = then.getSeconds() - now.getSeconds();

  if(seconds < 0) { minutes--; seconds = 60 + seconds; }
  if(minutes < 0) { hours--; minutes = 60 + minutes; }
  if(hours < 0) { days--; hours = 24 + hours; }

  if(seconds < 10) { seconds = "0" + seconds; }
  if(minutes < 10) { minutes = "0" + minutes; }
  if(hours < 10) { hours = "0" + hours; }
  if(days < 10) { days = "0" + days; }

  container.html("<span>" + days + "d " + hours + "h " + minutes + "m " + seconds + "s </span>");
}
