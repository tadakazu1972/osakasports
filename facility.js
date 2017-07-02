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
  var num  = decodeURIComponent(key["num"]);
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
        //ホーム画面で選んだタイプのイベントなら背景を色にする
        var j = 17 + Number(num); //17は配列の前データ＋ホーム画面で選んだ0番目からスタート
        if (data[j]=="1"){
          item.style.background = "#ffad90";
        }
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
