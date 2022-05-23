var data=new Array(8);
for(var i=0;i<8;i++)data[i]=new Array(8);
for(var i=0;i<8;i++)for(let j=0;j<8;j++)data[i][j]=0;

var turn=true;
var blackpoints,whitepoints;
const dydx=[[-1, 0],[-1, 1],[0, 1],[1, 1],[1, 0],[1, -1],[0, -1],[-1, -1]];
const board=document.getElementById("board");
const html_blackpoints=document.getElementById("blackpoints");
const html_whitepoints=document.getElementById("whitepoints");

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
  turn=true;
  blackpoints=2;
  whitepoints=2;
  viewupdate();
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

document.getElementById("startbutton").onclick=function(){init();}

function clicked(){
  let y=this.parentNode.rowIndex;
  let x=this.cellIndex;
  let color=1;
  if(!turn)color=-1;
  if(!canput(y,x,color))return;
  putothello(y,x,color);
  rotate();
  viewupdate();
  turn=!turn;
}