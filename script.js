//グローバル
var facility = new Array(); //施設
var eventData = new Array(); //イベントデータ全て格納

//施設クラス
function Facility(_name, _lat, _lng ){
  this.name = _name;
  this.lat  = _lat;
  this.lng  = _lng;
}

//イベントデータクラス
function EventData(_id, _file, _facility, _place, _name, _category, _top, _date, _time, _submit, _fee, _target, _station, _address, _tel, _question, _etc){
  this.id = _id;
  this.file = _file;
  this.facility = _facility;
  this.place = _place;
  this.name = _name;
  this.category = _category;
  this.top = _top;
  this.date = _date;
  this.time = _time;
  this.submit = _submit;
  this.fee = _fee;
  this.target = _target;
  this.station = _station;
  this.address = _address;
  this.tel = _tel;
  this.question = _question;
  this.etc = _etc;
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
  //詳細検索ボタン
  var btnSearch = document.createElement("button");
  btnSearch.type = "button";
  btnSearch.onclick = function(){ clickGotoSearch(); };
  btnSearch.innerHTML = "　詳細検索　";
  btnSearch.style.fontSize = 14 * ratio + "px";
  btnSearch.style.fontWeight = "bold";
  btnSearch.style.background = "#22e";
  btnSearch.style.color = "#fff";
  btnSearch.style.position = "absolute";
  btnSearch.style.left = "40%";
  btnSearch.style.top  = "85%";
  document.body.appendChild(btnSearch);
}

function clickButton(num){
  window.confirm(num+"がクリックされたよ");
  location.href="./index2.html";
}

function clickGotoSearch(){
  location.href="./search.html";
}

//マップ描画
function drawMap(){
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
      //読み込んだデータをfacilityクラスの配列に格納　ページ遷移時にパラメータ渡しで使います
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
  //window.confirm(facility[num].name+"がクリックされた");
  //var name = escape(facility[num].name);　非推奨
  var name = encodeURIComponent(facility[num].name);
  var lat  = encodeURIComponent(facility[num].lat);
  var lng  = encodeURIComponent(facility[num].lng);
  var param = "name="+name+"&lat="+lat+"&lng="+lng;
  location.href = "./index3.html?"+param;
}

//施設描画
function drawFacility(){
  //施設名、緯度経度のパラメーターの受け取り
  var param = location.search; // アドレスの「?」以降の引数(パラメータ)を取得
  param = param.substring(1); //先頭の?をカット
  var pair = param.split("&"); //&で引数を分割
  var temp = "";
  var key = new Array();
  for (var i=0;i<pair.length;i++){
    temp = pair[i].split("="); //配列を=で分割
    keyName = temp[0];
    keyValue = temp[1];
    //キーと値の連想配列を生成
    key[keyName] = keyValue;
  }
  var name = decodeURIComponent(key["name"]);
  var lat  = decodeURIComponent(key["lat"]);
  var lng  = decodeURIComponent(key["lng"]);
  var header = document.getElementById("header");
  header.innerHTML = name;
  //緯度経度をマップで行き方を見るに渡す
  //イベント一覧のcsvファイル読み込み
  var xhr = new XMLHttpRequest();
  xhr.onload = function(){
    //var container = document.getElementById("list"); //リスト描画タグ確保
    var tempArray = xhr.responseText.split("\n");
    var csvArray = new Array();
    for(var i=1;i<tempArray.length;i++){ //i=1はヘッダーを読み込ませないため
      csvArray[i] = tempArray[i].split(",");
      var data = csvArray[i];
      //とりあえず読み込んだすべてのデータをDataクラスの配列に格納
      eventData[i] = new EventData(data[0],data[1],data[2],data[3],data[4],data[5],data[6],data[7],data[8],data[9],data[10],data[11],data[12],data[13],data[14],data[15],data[16]);
      //該当施設のデータを表示
      if (data[2] == name){
        var item = document.createElement("div");
        item.className = "list";
        item.style.border = "solid";
        item.style.margin = "4px";
        item.style.padding = "4px";
        item.textContent = data[7]+"  "+data[4]+"  "+data[2];
        item.onclick = (function(num){ return function(){ clickList(num); };})(i);
        document.body.appendChild(item);
      };
    };
  };
  xhr.open("get", "data.csv", true);
  xhr.send(null);
}

function clickList(num){
  //window.confirm("id:"+num+"がクリックされた");
  var _id = encodeURIComponent(eventData[num].id);
  var param = "id="+_id;
  location.href = "./index4.html?"+param;
}

//イベント詳細描画
function drawEvent(){
  //イベントidのパラメーターの受け取り
  var param = location.search; // アドレスの「?」以降の引数(パラメータ)を取得
  param = param.substring(1); //先頭の?をカット
  var temp = "";
  temp = param.split("="); //id=_idを=で分割
  var id = decodeURIComponent(temp[1]);
  //イベント一覧のcsvファイル読み込み
  var xhr = new XMLHttpRequest();
  xhr.onload = function(){
    var tempArray = xhr.responseText.split("\n");
    var csvArray = new Array();
    for(var i=1;i<tempArray.length;i++){ //i=1はヘッダーを読み込ませないため
      csvArray[i] = tempArray[i].split(",");
      var data = csvArray[i];
      //とりあえず読み込んだすべてのデータをDataクラスの配列に格納
      eventData[i] = new EventData(data[0],data[1],data[2],data[3],data[4],data[5],data[6],data[7],data[8],data[9],data[10],data[11],data[12],data[13],data[14],data[15],data[16]);
      //該当idのデータを表示
      if (data[0] == id){
        var header = document.getElementById("header");
        header.innerHTML = eventData[id].name;
        var date = document.getElementById("date");
        date.innerHTML = "日時：" + eventData[id].date + "  " + eventData[id].time;
        var facility = document.getElementById("facility");
        facility.innerHTML = "場所：" + eventData[i].facility;
        //Googleカレンダー登録準備
        var text = eventData[id].name;
        //var datefrom = '2014-06-10T17:00:00';
        //var dateto = '2014-06-10T18:00:00';
        var website = 'https://osakasports.azurewebsites.net/';
        var zero = function(n) { return ('0' + n).slice(-2); };
        var formatdate = function(datestr) {
          var date = new Date(datestr + '+09:00');
          return date.getUTCFullYear() + zero(date.getUTCMonth()+1) + zero(date.getUTCDate()) + 'T' + zero(date.getUTCHours()) + zero(date.getUTCMinutes()) + zero(date.getUTCSeconds()) + 'Z';
        };
        //var url = 'http://www.google.com/calendar/event?action=TEMPLATE' + '&text=' + encodeURIComponent(text) + '&dates=' + formatdate(datefrom) + '/' + formatdate(dateto) + '&location=' + website;
        var url = 'http://www.google.com/calendar/event?action=TEMPLATE' + '&text=' + encodeURIComponent(text) + '&location=' + website;
        document.getElementById("calender").setAttribute('href', url);
      };
    };
  };
  xhr.open("get", "data.csv", true);
  xhr.send(null);
}
