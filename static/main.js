var socks = false;

$(function() {
  query();
});

if (typeof io !== "undefined") {
  var socket = io();
  socks = true;
  print("Yes Socks")
} else {
  print("No Socks")
}
if (socks) {
  socket.on("chess move", function(str){
    finalmove(str);
  });
  socket.on("chat message", function(str){
    $("#chat > ul").append("<li>" + str + "</li>");
  });
}

function print(a) {
  console.log(a)
}

function setupboard() {
  $("#gametable").empty();
  for (i = 8; i > 0; i--) {
    $("#gametable").append("<tr class='rank"+i+"'></tr>")
    for (j = 1; j < 9; j++) {
      if ((i + j) % 2) {
        square = " light";
      } else {
        square = " dark";
      }
      $("#gametable tr.rank"+i).append("<td class='r"+i+" f"+j+square+"'><div class='empty'></div></td>")
    }
  }
  $("#gametable .r2 > div").attr("class", "whiteP");
  $("#gametable .r1.f1 > div, .r1.f8 > div").attr("class", "whiteR");
  $("#gametable .r1.f2 > div, .r1.f7 > div").attr("class", "whiteN");
  $("#gametable .r1.f3 > div, .r1.f6 > div").attr("class", "whiteB");
  $("#gametable .r1.f4 > div").attr("class", "whiteQ");
  $("#gametable .r1.f5 > div").attr("class", "whiteK");
  $("#gametable .r7 > div").attr("class", "blackP");
  $("#gametable .r8.f1 > div, .r8.f8 > div").attr("class", "blackR");
  $("#gametable .r8.f2 > div, .r8.f7 > div").attr("class", "blackN");
  $("#gametable .r8.f3 > div, .r8.f6 > div").attr("class", "blackB");
  $("#gametable .r8.f4 > div").attr("class", "blackQ");
  $("#gametable .r8.f5 > div").attr("class", "blackK");
}

function tile(pos) {
  p = $(".r"+pos[1]+".f"+pos[0]+" > div").attr("class");
  return {colour: p.slice(0, 5), piece: p.slice(5)};
}

function submitmove(str) {
  if (socks) {
    socket.emit("chess move", str);
  } else {
    finalmove(str);
  }
}

function trymove(str, test) {
  pos = str.split("")
  pos[0] = parseInt(pos[0], 36) - 9;
  pos[1] = Number(pos[1]);
  pos[2] = parseInt(pos[2], 36) - 9;
  pos[3] = Number(pos[3])
  movedpiece = $("#gametable .r"+pos[1]+".f"+pos[0]+" > div").attr("class")
  captured = $("#gametable .r"+pos[3]+".f"+pos[2]+" > div").attr("class")
  if (test) {
    if (movable(pos, movedpiece.slice(0, 5), movedpiece.slice(5))) {
      return true;
    } else {
      return false;
    }
  }
  if (movable(pos, movedpiece.slice(0, 5), movedpiece.slice(5))) {
    if (promotion.to) {
      promotion.to = false;
      promotemove(str);
    } else if (castle.to) {
      if (castle.to == "whiteKingside") {
        submitmove("e1g1")
        submitmove("a1a1")
        submitmove("h1f1")
      } else if (castle.to == "whiteQueenside") {
        submitmove("e1c1")
        submitmove("a1a1")
        submitmove("a1d1")
      }
      castle[move.turn] = false;
      castle.to = false;
    } else {
      submitmove(str)
    }
  }
}

function promotemove(str) {
  print("promoting")
}

function finalmove(str) {
  pos = str.split("")
  pos[0] = parseInt(pos[0], 36) - 9;
  pos[1] = Number(pos[1]);
  pos[2] = parseInt(pos[2], 36) - 9;
  pos[3] = Number(pos[3])
  movedpiece = $("#gametable .r"+pos[1]+".f"+pos[0]+" > div").attr("class")
  captured = $("#gametable .r"+pos[3]+".f"+pos[2]+" > div").attr("class")
  $("#gametable .r"+pos[1]+".f"+pos[0]+" > div").attr("class", "empty");
  $("#gametable .r"+pos[3]+".f"+pos[2]+" > div").attr("class", movedpiece);
  displaymove(str)
}

function displaymove(str) {
  move.order.push(str)
  if (move.turn == "white") {
    $("#moveorder > ul").append("<li>"+(move.number)+". </li>")
    move.number++;
  }
  $("#moveorder > ul > li:last-child").append("\t"+str)
  move.turn = (move.turn == "white") ? "black" : "white"
  print(move.turn + "'s turn")
}

mouse = {
  pos1: null,
  pos2: null, 
  submit: function () {
    if (this.pos1 && this.pos2) {
      trymove(this.pos1 + this.pos2)
    }
    this.pos1 = null,
    this.pos2 = null
    $("td").attr("hover", null).attr("select", null);
  }
}

move = {
  number: 1,
  order: [],
  turn: "white"
}

function chat() {
  str = $("#chatinput").val();
  if (socks) {
    socket.emit("chat message", str);
  } else {
    $("#chat > ul").append("<li>" + str + "</li>");
  }
  $("#chatinput").val("");
}

function setupall() {
  move = {
    number: 1,
    order: [],
    turn: "white"
  }
  setupboard()
}

function query() {
  setupboard()
  $("#restart").click(function() {
    $("#moveorder > ul").empty();
    $("#gametable").empty();
    query();
  })

  $("#enter").click(function() {
    chat();
  })

  $("#chatinput").keydown(function(event){ 
    keyCode = (event.keyCode ? event.keyCode : event.which);   
    if (keyCode == 13) {
      chat();
    }
  });

  $("#gametable td").mousedown(function() {
    mouse.submit();
    $(this).attr("select", "selected")
    finder = $(this).attr("class").split(" ")
    file = String.fromCharCode(96 + Number(finder[1].slice(-1)));
    rank = finder[0].slice(-1);
    mouse.pos1 = file + rank;
  })
  $("#gametable td").mouseup(function() {
    finder = $(this).attr("class").split(" ")
    file = String.fromCharCode(96 + Number(finder[1].slice(-1)));
    rank = finder[0].slice(-1)
    mouse.pos2 = file + rank;
    mouse.submit();
  })
  $("#gametable td").hover(function() {
    if (mouse.pos1) {
      finder = $(this).attr("class").split(" ")
      file = String.fromCharCode(96 + Number(finder[1].slice(-1)));
      rank = finder[0].slice(-1)
      if (trymove(mouse.pos1 + file + rank, true)) {
        $(this).attr("hover", "hovering");
      } else {
        $(this).attr("hover", "unmovable");
      }
    }
  }, function() {
    $(this).attr("hover", null);
  })
}