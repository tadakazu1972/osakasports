//グローバル
var facility = new Array(); //施設

//施設クラス
function Facility(_name, _lat, _lng ){
  this.name = _name;
  this.lat  = _lat;
  this.lng  = _lng;
}

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
  location.href="./index2.html";
}

function loadHTML(_html,replace){
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET",_html,true);
  xmlhttp.onreadystatechange = function(){
  //とれた場合Idにそって入れ替え
  if(xmlhttp.readyState == 4 && xmlhttp.status==200){
           var data = xmlhttp.responseText;
           var elem = document.getElementById(replace);
           elem.innerHTML= data;
      return data;
    }
  }
  xmlhttp.send(null);
}

//マップ描画
function drawMap(){
  //画面クリア（body以下子要素全て削除）
  /*while (document.body.firstChild) document.body.removeChild(document.body.firstChild);
  //<div id="map_canvas">生成
  var mapCanvas = document.createElement("div");
  mapCanvas.id = "map_canvas";
  mapCanvas.style.width = "100%";
  mapCanvas.style.height = "568px";
  document.body.appendChild(mapCanvas);*/
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
    //データの数だけループ
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
      //InfoWindow内にボタン生成
			createInfoWindow(marker, data[0], i);
      //読み込んだデータをfacilityクラスの配列に格納　別ページに遷移してから使います
      facility[i] = new Facility(data[0], data[1], data[2]);
		}
  };
  xhr.open("get", "facilities.csv", true);
	xhr.send(null);
}

function createInfoWindow(getmarker, name, i){
  var buttonMarker = document.createElement("button");
  buttonMarker.type = "button";
  buttonMarker.onclick = (function(num){ return function(){　clickButtonMarker(num);　};})(i); //もはや呪文
  buttonMarker.innerHTML = name + "</br>" + "イベント情報";
  var infowindow = new google.maps.InfoWindow({ content: buttonMarker });
  google.maps.event.addListener(getmarker, "mouseover", function(){
    infowindow.open(getmarker.getMap(), getmarker);
  });
}

function clickButtonMarker(num){
  window.confirm(facility[num].name+"がクリックされた");
  //drawFacility(num);
  //var name = escape(facility[num].name);
  var name = encodeURIComponent(facility[num].name);
  var param = "name="+name;
  location.href="./index3.html?"+param;
}

//施設描画
function drawFacility(){
  //画面クリア（body以下子要素全て削除）
  /*while (document.body.firstChild) document.body.removeChild(document.body.firstChild);
  //ヘッダーを施設名で描画
  var header = document.createElement("div");
  header.id = "header";
  header.innerHTML = facility[num].name;
  document.body.appendChild(header);*/
  var param = location.search;
  param = param.substring(1);
  var pair = param.split("=");
  //var name = unescape(pair[1]);
  var name = decodeURIComponent(pair[1]);
  var header = document.getElementById("header");
  header.innerHTML = name;
  //場所について
  var venue = document.createElement("div");
  venue.className = "bar";
  venue.innerHTML = "場所について"
  document.body.appendChild(venue);
  //施設の詳細情報を見る
  var venueDetail = document.createElement("div");
  venueDetail.className = "box";
  venueDetail.innerHTML = "施設の詳細情報を見る";
  document.body.appendChild(venueDetail);
  //マップで行き方を見る
  var venueRoot = document.createElement("div");
  venueRoot.className = "box";
  venueRoot.innerHTML = "マップで行き方を見る";
  document.body.appendChild(venueRoot);
  //イベント一覧
  var events = document.createElement("div");
  events.className = "bar";
  events.innerHTML = "イベント一覧"
  document.body.appendChild(events);
}
