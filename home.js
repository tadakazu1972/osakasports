//Home画面描画
function drawHome(){
  //画面サイズ拡大調整（iphone6s, iphone6sPlus, iPhone7とか Android各種サイズなら拡大する）
  var windowWidth = window.innerWidth;
  var windowHeight = window.innerHeight;
  var ratio = windowWidth / 320;
  if (ratio > 2.0){ ratio = 2.0;}; //PCで見た場合あまりに画像が大きくなりすぎるので２倍でとどめる
  //ヘッダー
  var header = document.getElementById("header"); //index.htmlからid=headerを確保
  header.innerHTML = "オータム・チャレンジ・スポーツ";
  //ボタン描画
  var button = new Array();
  var img = new Array();
  var imageFile = ["katakori","commit","squat","kirei","kaisyagaeri","gati","bocchi","wakaimon","oyako","taiikunohi","tennis","pool_oyako"];
  var buttonX = [ 5,70,40, 5,70,40, 5,70,40, 5,70,40];
  var buttonY = [10,10,13,30,30,33,55,55,53,75,75,70];
  for (var i in imageFile){
    button[i] = document.createElement("button");
    button[i].type = "button";
    button[i].onclick = (function(num){ return function(){　clickButton(num);　};})(i); //もはや呪文
    button[i].style.position = "absolute";
    button[i].style.left = buttonX[i] + "%";
    button[i].style.top  = buttonY[i] + "%";
    button[i].style.background = "transparent";
    button[i].style.border = "none";
    button[i].style.cursor = "pointer";
    img[i] = document.createElement("img");
    img[i].src = "png/" + imageFile[i] + ".png";
    img[i].widh = 70 * ratio;
    img[i].height = 70 * ratio;
    document.body.appendChild(button[i]);
    button[i].appendChild(img[i]);
  }
  //ラベル描画
  var label = new Array();
  var labelText = ["最近身体が痛いな…","身体の状態を知りたい!","やせたい!","きれいになりたい!","新感覚!?","みんなでワイワイ!","一人で参加OK!","若者には負けないぞ!","親子でエンジョイ!","子どもに運動を!","まずは体験!","習いたい!"];
  for (var i in labelText){
    label[i] = document.createElement("div");
    label[i].textContent = labelText[i];
    label[i].style.fontSize = 12 * ratio + "px";
    label[i].style.fontWeight = "bold";
    label[i].style.position = "absolute";
    label[i].style.left = buttonX[i] + "%";
    label[i].style.top  = buttonY[i] + 14 + "%";
  　document.body.appendChild(label[i]);
  }
}

function clickButton(num){
  //window.confirm(num+"がクリックされたよ");
  var num = encodeURIComponent(num);
  var param = "num="+num;
  location.href="./map.html?"+param;
}
