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
function drawResult(){
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
  var fromMonth = decodeURIComponent(key["fromMonth"]);
  var fromDay   = decodeURIComponent(key["fromDay"]);
  var toMonth   = decodeURIComponent(key["toMonth"]);
  var toDay     = decodeURIComponent(key["toDay"]);
  var facility  = decodeURIComponent(key["facility"]);
  var category  = decodeURIComponent(key["category"]);
  var word      = decodeURIComponent(key["freeword"]);
  var header = document.getElementById("header");
  header.innerHTML = facility;
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
      eventData[i] = new EventData(data[0],data[1],data[2],data[3],data[4],data[5],data[6],data[7],data[8],data[9],data[10],data[11],data[12],data[12],data[13],data[14],data[15]);
      //該当施設のデータを表示
      if (data[2] == facility){
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
      eventData[i] = new EventData(data[0],data[1],data[2],data[3],data[4],data[5],data[6],data[7],data[8],data[9],data[10],data[11],data[12],data[12],data[13],data[14],data[15]);
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
