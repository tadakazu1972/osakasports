//グローバル
var facility = new Array(); //施設
var eventData = new Array(); //イベントデータ全て格納
var id; //id

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
  id = decodeURIComponent(temp[1]);
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
        var content = document.getElementById("eventData");
        content.innerHTML = "<b>【開催日】</b>"+eventData[id].date+"<br><b>【時間】</b>"+eventData[id].time+"<br><b>【場所】</b>"+eventData[i].facility +"<br><b>【内容】</b>"+eventData[i].top+"<br><b>【申込方法】</b>"+eventData[i].submit+"<br><b>【参加費】</b>"+eventData[i].fee+"<br><b>【参加対象】</b>"+eventData[i].target+"<br><b>【最寄駅】</b>"+eventData[i].station+"<br><b>【所在地】</b>"+eventData[i].address+"<br><b>【お問い合わせ】</b>"+eventData[i].question;

        //Googleカレンダー登録準備
        var text = eventData[id].name;
        //var datefrom = '2014-06-10T17:00:00';
        //var dateto = '2014-06-10T18:00:00';
        //開催日作成
        var tempDateStr = data[7].slice(0,-3); //開催日の文字列『１０/９（祝）」から「（祝）」を捨てる
        var tempDatePair = tempDateStr.split("/"); //""/""の文字で分割して配列にする
        var tempTimePair = data[8].split("~");
        var date = new Date(2017, tempDatePair[0]-1, tempDatePair[1]); //これで開催日作成
        var zero = function(n) { return ('0' + n).slice(-2); };
        var startDate = date.getFullYear() + zero(date.getMonth()+1) + zero(date.getDate());
        var startTime = tempTimePair[0].replace(/~/g, "")+"00";
        var endDate   = date.getFullYear() + zero(date.getMonth()+1) + zero(date.getDate());
        var endTime   = tempTimePair[1].replace(/~/g, "")+"00";
        var dates = startDate + 'T' + startTime + '/' + endDate + 'T' + endTime;
        //場所->住所
        var location = eventData[i].address;

        var formatdate = function(datestr) {
          var date = new Date(datestr + '+09:00');
          return date.getUTCFullYear() + zero(date.getUTCMonth()+1) + zero(date.getUTCDate()) + 'T' + zero(date.getUTCHours()) + zero(date.getUTCMinutes()) + zero(date.getUTCSeconds()) + 'Z';
        };
        //var url = 'http://www.google.com/calendar/event?action=TEMPLATE' + '&text=' + encodeURIComponent(text) + '&dates=' + formatdate(datefrom) + '/' + formatdate(dateto) + '&location=' + website;
        var url = 'http://www.google.com/calendar/event?action=TEMPLATE' + '&text=' + encodeURIComponent(text) + '&dates=' + dates + '&location=' + location;
        document.getElementById("calendar").setAttribute('href', url);
      };
    };
  };
  xhr.open("get", "data2017.csv", true);
  xhr.send(null);
}

function postTwitter(){
  //Twitter
  location.href = "https://twitter.com/share?url=https://osakasports.azurewebsites.net/event.html?id="+id+"&text=【大阪市オータムチャレンジスポーツ2017】" + eventData[id].name + "/" + eventData[id].date + "/" + eventData[id].time;
}

function postLine(){
  //LINE
  location.href = "http://line.me/R/msg/text/?https://osakasports.azurewebsites.net/event.html?id="+id + "【大阪市オータムチャレンジスポーツ2017】" +eventData[id].name + "/" + eventData[id].date + "/" + eventData[id].time;
}

function postFacebook(){
  //Facebook
  var url = "https://osakasports.azurewebsites.net/event.html?id=" + id;
  location.href= "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(url);
}
