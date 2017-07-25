//グローバル
var facility; //施設
var eventData = new Array(); //イベントデータ全て格納

//施設クラス
function Facility(_name, _lat, _lng, _address, _tel, _url){
  this.name = _name;
  this.lat  = _lat;
  this.lng  = _lng;
  this.address = _address;
  this.tel = _tel;
  this.url = _url;
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
  var address = decodeURIComponent(key["address"]);
  var tel = decodeURIComponent(key["tel"]);
  var url = decodeURIComponent(key["url"]);
  var num  = decodeURIComponent(key["num"]);
  //グローバル変数のfacilityクラスのインスタンスに分解したパラメーター格納
  facility = new Facility(name, lat, lng, address, tel, url);
  //ヘッダーに施設名を表示
  var header = document.getElementById("header");
  header.innerHTML = name;
  //施設情報書き込み
  document.getElementById("address").innerHTML = address;
  document.getElementById("tel").innerHTML = tel;
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
        //ホーム画面で選んだタイプのイベントなら背景を色にする
        var j = 17 + Number(num); //17は配列の前データ＋ホーム画面で選んだ0番目からスタート
        if (data[j]=="1"){
          item.style.background = "#ffad90";
        }
        item.style.margin = "auto";
        item.style.border = "solid";
        item.style.padding = "4px";
        item.style.cursor = "pointer";
        item.textContent = data[7]+"  "+data[4];
        item.onclick = (function(num){ return function(){ clickList(num); };})(i);
        document.body.appendChild(item);
      };
    };
  };
  xhr.open("get", "data2017.csv", true);
  xhr.send(null);
}

function clickList(num){
  //window.confirm("id:"+num+"がクリックされた");
  var _id = encodeURIComponent(eventData[num].id);
  var param = "id="+_id;
  location.href = "./event.html?"+param;
}

function clickURL(){
  location.href = facility.url;
}

function clickDirection(){
  //現在地取得
  //Geolocation API対応チェック
  if (navigator.geolocation){
    //現在地取得
    navigator.geolocation.getCurrentPosition(
      //取得成功
      function(position){
        //緯度経度を変数に格納
        var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        //ルート検索の条件
        var request = {
          origin: new google.maps.LatLng(position.coords.latitude, position.coords.longitude), //出発地
          destination: new google.maps.LatLng(facility.lat, facility.lng), //目的地
          travelMode: google.maps.DirectionsTravelMode.WALKING, //交通手段：市内だから歩きでいいでしょう
        };
        //マップ生成　表示領域を動的に拡大させる
        var mapCanvas = document.getElementById("map_canvas");
        mapCanvas.style.width = "100%";
        mapCanvas.style.height = "300px";
        var map = new google.maps.Map(document.getElementById("map_canvas"), {
          center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
          zoom: 15
        });
        var d = new google.maps.DirectionsService(); //ルート検索オブジェクト
        var r = new google.maps.DirectionsRenderer({ //ルート描画オブジェクト
          map: map, //描画先のマップ
          preserveViewport: true, //描画後に中心点をずらさない
        });
        //ルート検索
        d.route(request, function(result, status){
          //OKの場合ルート描画
          if (status == google.maps.DirectionsStatus.OK) {
            r.setDirections(result);
          }
        });
        //window.confirm("現在地は："+latlng);
      },
      //取得失敗
      function(error){
        switch(error.code){
          case 1: //PERMISSION_DENIED
            alert("この端末の位置情報利用が許可されていません");
            break;
          case 2: //POSITION_UNAVAILABLE
            alert("現在地が取得できませんできした");
            break;
          case 3: //TIMEOUT
            alert("時間切れになりました");
            break;
          default:
            alert("エラーが出ました(error code:"+error.code+")");
            break;
        }
      }
    );
  } else {
    alert("この端末では位置情報が取得できません");
  }
}
