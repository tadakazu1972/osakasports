//グローバル
var facility = new Array(); //施設

//施設クラス
function Facility(_name, _lat, _lng, _address, _tel, _url, _num ){
  this.name = _name;
  this.lat  = _lat;
  this.lng  = _lng;
  this.address = _address;
  this.tel = _tel;
  this.url = _url;
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
      google.maps.event.addListener(marker, 'click', (function(num){ return function(){ clickMarker(num); };})(i));
      //InfoWindow内にボタン生成
			createInfoWindow(marker, data[0]);
      //読み込んだデータをfacilityクラスの配列に格納　ページ遷移時にパラメータ渡しで使います
      facility[i] = new Facility(data[0], data[1], data[2], data[15], data[16], data[17], num);
		}
  };
  xhr.open("get", "facilities2017.csv", true);
	xhr.send(null);
}

function createInfoWindow(getmarker, name){
  var infowindow = new google.maps.InfoWindow({ content: name });
  google.maps.event.addListener(getmarker, "mouseover", function(){
    infowindow.open(getmarker.getMap(), getmarker);
  });
}

function clickMarker(num){
  //window.confirm(facility[num].name+"がクリックされた");
  //var name = escape(facility[num].name);　非推奨
  var name = encodeURIComponent(facility[num].name);
  var lat  = encodeURIComponent(facility[num].lat);
  var lng  = encodeURIComponent(facility[num].lng);
  var address = encodeURIComponent(facility[num].address);
  var tel = encodeURIComponent(facility[num].tel);
  var url = encodeURIComponent(facility[num].url);
  var top  = encodeURIComponent(facility[num].num);
  var param = "name="+name+"&lat="+lat+"&lng="+lng+"&address="+address+"&tel="+tel+"&url="+url+"&num="+top;
  location.href = "./facility.html?"+param;
}
