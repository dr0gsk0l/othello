var data=new Array(8);
for(var i=0;i<8;i++)data[i]=new Array(8);
for(var i=0;i<8;i++)for(let j=0;j<8;j++)data[i][j]=0;

var computer=false;
var turn=1;
var gray=false;
const dydx=[[-1, 0],[-1, 1],[0, 1],[1, 1],[1, 0],[1, -1],[0, -1],[-1, -1]];
const board=document.getElementById("board");
const points=document.getElementById("points");
const result=document.getElementById("result");

for(let i=0;i<8;i++){
  const column=document.createElement("tr");
  for(let j=0;j<8;j++){
    const square=document.createElement("td");
    square.onclick=clicked;
    square.height=30;
    square.width=30;
    column.appendChild(square);
  }
  board.appendChild(column);
}
viewupdate();

function viewupdate(){
  for(let i=0;i<8;i++)
    for(let j=0;j<8;j++)
      if(data[i][j]==0)
        board.rows[i].cells[j].style.backgroundColor="green";
      else
        if(gray)
          board.rows[i].cells[j].style.backgroundColor="gray";
        else if(data[i][j]==1)
          board.rows[i].cells[j].style.backgroundColor="black";
        else 
          board.rows[i].cells[j].style.backgroundColor="white";
}

function init(){
  for(let i=0;i<8;i++)
    for(let j=0;j<8;j++)
      data[i][j]=0;
  data[3][3]=data[4][4]=1;
  data[3][4]=data[4][3]=-1;
  turn=1;
  viewupdate();
  result.innerText="";
  points.innerText="";
}

function isin(y,x){
  return y>=0 && y<8 && x>=0 && x<8;
}

function canput(y,x,color){
  if(data[y][x]!=0)return false;
  for(var d=0;d<8;d++){
    let dy=dydx[d][0],dx=dydx[d][1];
    let othercolor=false;
    let Y=y;
    let X=x;
    while(true){
      Y+=dy;X+=dx;
      if(!isin(Y,X)||data[Y][X]==0)break;
      if(data[Y][X]==-color)othercolor=true;
      if(data[Y][X]==color){
        if(othercolor)return true;
        break;
      }
    }
  }
  return false;
}

function canputanywhere(color){
  for(let i=0;i<8;i++)for(let j=0;j<8;j++)if(canput(i,j,color))return true;
  return false;
}

function putothello(y,x,color){
  for(var d=0;d<8;d++){
    let dy=dydx[d][0],dx=dydx[d][1];
    let Y=y,X=x,canchange=false;
    while(true){
      Y+=dy;X+=dx;
      if(!isin(Y,X)||data[Y][X]==0)break;
      if(data[Y][X]==color)canchange=true;
    }
    if(canchange){
      Y=y+dy,X=x+dx;
      while(data[Y][X]!=color){
        data[Y][X]=color;
        Y+=dy,X+=dx;
      }
    }
  }
  data[y][x]=color;
}

function rotate(){
  var cpy=new Array(8);
  for(let i=0;i<8;i++)cpy[i]=new Array(8);
  for(let i=0;i<8;i++)for(let j=0;j<8;j++)cpy[i][j]=data[i][j];

  for(let i=0;i<8;i++)
    for(let j=0;j<8;j++)
      data[j][7-i]=cpy[i][j];
}

document.getElementById("startbutton1").onclick=function(){
  computer=false;
  gray=false;
  init();
}
document.getElementById("startbutton2").onclick=function(){
  computer=false;
  gray=true;
  init();
}
document.getElementById("startbutton3").onclick=function(){
  computer=true;
  gray=false;
  init();
}
document.getElementById("startbutton4").onclick=function(){
  computer=true;
  gray=true;
  init();
}

function finish(){
  if(gray){
    gray=false;
    viewupdate();
  }
  let blackpoints=0,whitepoints=0;
  for(let i=0;i<8;i++)for(let j=0;j<8;j++){
    if(data[i][j]==1)blackpoints++;
    if(data[i][j]==-1)whitepoints++;
  }
  points.innerText="黒:"+blackpoints.toString()+" 白:"+whitepoints.toString();
  if(computer){
    if(blackpoints>whitepoints)result.innerText="You Win!";
    if(blackpoints<whitepoints)result.innerText="You Lose!";
    if(blackpoints==whitepoints)result.innerText="Draw!";
  }
  else{
    if(blackpoints>whitepoints)result.innerText="Black Win!";
    if(blackpoints<whitepoints)result.innerText="White Win!";
    if(blackpoints==whitepoints)result.innerText="Draw";
  }
}

function clicked(){
  let y=this.parentNode.rowIndex;
  let x=this.cellIndex;
  if(!canput(y,x,turn)){
    document.getElementById("cant").innerText="そこは置けないの分かる？"
    return;
  }
  document.getElementById("cant").innerText="";
  putothello(y,x,turn);
  rotate();
  viewupdate();
  turn=-turn;

  if(!canputanywhere(turn)){
    turn=-turn;
    if(!canputanywhere(turn))finish();
  }

  while(computer && turn==-1){
    let mx=-1,y,x;
    for(let i=0;i<8;i++)
      for(let j=0;j<8;j++)
        if(canput(i,j,-1))
          if(mx<pointscore(i,j)){
            mx=pointscore(i,j);
            y=i,x=j;
          }
    putothello(y,x,-1);
    viewupdate();
    turn=-turn;
    if(!canputanywhere(turn)){
      turn=-turn;
      if(!canputanywhere(turn))finish();
    }
  }
}

function pointscore(y,x){
  return (y-3)*(y-4)+(x-3)*(x-4);
}