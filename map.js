//グローバル
var facility = new Array(); //施設

//施設クラス
function Facility(_name, _lat, _lng, _num ){
  this.name = _name;
  this.lat  = _lat;
  this.lng  = _lng;
  this.num  = _num;
}

//マップ描画
function drawMap(){
  //numのパラメーターの受け取り
  var param = location.search; // アドレスの「?」以降の引数(パラメータ)を取得
  param = param.substring(1); //先頭の?をカット
  var temp = "";
  temp = param.split("="); //num=を=で分割
  var num = decodeURIComponent(temp[1]);
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
      var j = 3 + Number(num);
			if (data[j]=="1") {
			    image = 'png/icon_location.png';
			} else {
				image = 'png/icon_location2.png';
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
      facility[i] = new Facility(data[0], data[1], data[2], num);
		}
  };
  xhr.open("get", "facilities.csv", true);
	xhr.send(null);
}

function createInfoWindow(getmarker, name, i){
  var buttonMarker = document.createElement("button");
  buttonMarker.type = "button";
  buttonMarker.onclick = (function(num){ return function(){　clickButtonMarker(num);　};})(i); //もはや呪文
  buttonMarker.innerHTML = name;
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
  var top  = encodeURIComponent(facility[num].num);
  var param = "name="+name+"&lat="+lat+"&lng="+lng+"&num="+top;
  location.href = "./facility.html?"+param;
}
