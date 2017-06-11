//初期化
function init(){
  var mView = new View();
  mView.setStatus(0);
  drawHome();
}

//画面遷移状態保存
function View(){
  //メンバ変数
  var status = 0;
  var headerText = ["オータム・チャレンジ・スポーツ","","","","","検索結果","マイページ"];
  var header = document.getElementById("header"); //index.htmlからid=headerを確保
  //ゲッター
  this.getStatus = function(){
    return status;
  }
  //セッター兼画面遷移とともにヘッダー書き換え
  this.setStatus = function(num){
    status = num;
    header.innerText = headerText[status];
  }
}

//Home画面描画
function drawHome(){
  //画面サイズ拡大調整（iphone6s, iphone6sPlus, iPhone7とか Android各種サイズなら拡大する）
  var windowWidth = window.innerWidth;
  var windowHeight = window.innerHeight;
  var ratio = windowWidth / 320;
  if (ratio > 2.0){ ratio = 2.0;}; //PCで見た場合あまりに画像が大きくなりすぎるので２倍でとどめる
  //どんなスポーツしたい？
  var txt = document.createElement("div");
  txt.textContent = "どんなスポーツしたい？";
  txt.style.fontSize = 18 * ratio + "px";
  txt.style.fontWeight = "bold";
  txt.style.position = "absolute";
  txt.style.left = 20 * ratio + "%";
  txt.style.top  = 10 + "%";
　document.body.appendChild(txt);
  //ボタン描画
  var button = new Array();
  var img = new Array();
  var imageFile = ["commit","bocchi","kaisyagaeri","oyako","gati","wakaimon","katakori","kirei"];
  var buttonX = [ 5,70,40, 5,70, 5,70,40];
  var buttonY = [15,15,25,50,50,75,75,58];
  for (var i in imageFile){
    button[i] = document.createElement("button");
    button[i].type = "button";
    button[i].onclick = (function(num){ return function(){　clickButton(num);　};})(i); //もはや呪文
    button[i].style.position = "absolute";
    button[i].style.left = buttonX[i] + "%";
    button[i].style.top  = buttonY[i] + "%";
    button[i].style.background = "transparent";
    button[i].style.border = "none";
    img[i] = document.createElement("img");
    img[i].src = "png/" + imageFile[i] + ".png";
    img[i].widh = 90 * ratio;
    img[i].height = 90 * ratio;
    document.body.appendChild(button[i]);
    button[i].appendChild(img[i]);
  }
  //ラベル描画
  var label = new Array();
  var labelText = ["結果にコミット!!","ぼっち参加","会社帰りにサクッといける","親子でエンジョイ","ガチ!!","若い者にはまだ負けない","グッバイ肩こり腰痛","キレイなおねえさん"];
  for (var i in labelText){
    label[i] = document.createElement("div");
    label[i].textContent = labelText[i];
    label[i].style.fontSize = 14 * ratio + "px";
    label[i].style.fontWeight = "bold";
    label[i].style.position = "absolute";
    label[i].style.left = buttonX[i] + "%";
    label[i].style.top  = buttonY[i] + 16 + "%";
  　document.body.appendChild(label[i]);
  }
}

function clickButton(num){
  window.confirm(num+"がクリックされたよ");
  drawMap();
}

function drawMap(){
  //画面クリア（body以下子要素全て削除）
  while (document.body.firstChild) document.body.removeChild(document.body.firstChild);
  //<div id="map_canvas">生成
  var mapCanvas = document.createElement("div");
  mapCanvas.id = "map_canvas";
  mapCanvas.style.width = "100%";
  mapCanvas.style.height = "568px";
  document.body.appendChild(mapCanvas);
  //マップオブジェクト設定
  var mapObj;
  //大阪市役所を緯度・軽度の初期値に設定
  var posX=34.694062;
  var posY=135.502154;
  //マップ作成
	var map = document.getElementById("map_canvas");
	var options = {
		zoom: 12,
		center: new google.maps.LatLng(posX, posY),
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	mapObj = new google.maps.Map(map, options);
  //csvファイル読み込み
  var xhr = new XMLHttpRequest();
	xhr.onload = function(){
		var tempArray = xhr.responseText.split("\n");
		var csvArray = new Array();
    var buttonMarker = new Array(); //次にページ遷移する用のボタン infoWindow内に表示
		for(var i=0;i<tempArray.length;i++){
			csvArray[i] = tempArray[i].split(",");
			var data = csvArray[i];
			//マーカー作成　画像ファイルを読み込み
			var image;
			if (data[0]=="ダミー") {
			    image = 'png/icon_location.png';
			} else {
				image = 'png/icon_location.png';
			}
			var marker = new google.maps.Marker({
				position: new google.maps.LatLng( parseFloat(data[1]), parseFloat(data[2]) ),
				map: mapObj,
				icon: image,
				title: data[0]
			});
      //ボタン生成
      /*buttonMarker[i] = document.createElement("button");
      buttonMarker[i].type = "button";
      buttonMarker[i].onclick = (function(num){ return function(){　clickButton(num);　};})(i); //もはや呪文
      buttonMarker[i].title = "イベント情報"*/
      //infowindow生成、マウスオーバーで表示　csvファイル　施設名:data[0]
			createInfoWindow(marker, data[0], i);
		}
  };
  xhr.open("get", "facilities.csv", true);
	xhr.send(null);
}

function clickButtonMarker(num){
  window.confirm(num+"がクリックされたよ");
}

function createInfoWindow(getmarker, name, index){
  var infowindow = new google.maps.InfoWindow({ content:name+"</br>"+"<button onclick='clickButtonMarker()'>イベント情報</button>"});
  google.maps.event.addListener(getmarker, "mouseover", function(){
    infowindow.open(getmarker.getMap(), getmarker);
  });
}
