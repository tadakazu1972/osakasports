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
        var submit = document.getElementById("submit");
        submit.innerHTML = "申し込み方法：" + eventData[i].submit;
        var fee = document.getElementById("fee");
        fee.innerHTML = "参加費：" + eventData[i].fee;
        var target = document.getElementById("target");
        target.innerHTML = "参加対象：" + eventData[i].target;
        var station = document.getElementById("station");
        station.innerHTML = "最寄駅：" + eventData[i].station;
        var address = document.getElementById("address");
        address.innerHTML = "所在地：" + eventData[i].address;
        //Googleカレンダー登録準備
        var text = eventData[id].name;
        //var datefrom = '2014-06-10T17:00:00';
        //var dateto = '2014-06-10T18:00:00';
        //開催日作成
        var tempDateStr = data[7].substr(0,5); //開催日の文字列『１０月１０日（祝）」から「１０月１０」だけ切り出し
        var tempDatePair = tempDateStr.split("月"); //月の文字で分割して配列にする
        var date = new Date(2017, tempDatePair[0]-1, tempDatePair[1]); //これで開催日作成
        var zero = function(n) { return ('0' + n).slice(-2); };
        var startDate = date.getUTCFullYear() + zero(date.getUTCMonth()+1) + zero(date.getUTCDate());
        var startTime = "0900";
        var endDate   = date.getUTCFullYear() + zero(date.getUTCMonth()+1) + zero(date.getUTCDate());
        var endTime   = "1000";
        var dates = startDate + 'T' + startTime + 'Z' + '/' + endDate + 'T' + endTime + '30';
        //場所->住所
        var location = eventData[i].address;

        var formatdate = function(datestr) {
          var date = new Date(datestr + '+09:00');
          return date.getUTCFullYear() + zero(date.getUTCMonth()+1) + zero(date.getUTCDate()) + 'T' + zero(date.getUTCHours()) + zero(date.getUTCMinutes()) + zero(date.getUTCSeconds()) + 'Z';
        };
        //var url = 'http://www.google.com/calendar/event?action=TEMPLATE' + '&text=' + encodeURIComponent(text) + '&dates=' + formatdate(datefrom) + '/' + formatdate(dateto) + '&location=' + website;
        var url = 'http://www.google.com/calendar/event?action=TEMPLATE' + '&text=' + encodeURIComponent(text) + '&dates=' + dates + '&location=' + location;
        document.getElementById("calender").setAttribute('href', url);
      };
    };
  };
  xhr.open("get", "data.csv", true);
  xhr.send(null);
}
