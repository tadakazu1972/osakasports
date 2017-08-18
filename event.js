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
        document.getElementById("header").innerHTML = eventData[id].name;
        document.getElementById("date").innerHTML = eventData[id].date;
        document.getElementById("time").innerHTML = eventData[id].time;
        document.getElementById("place").innerHTML = eventData[i].facility;
        document.getElementById("content").innerHTML = eventData[i].top;
        document.getElementById("submit").innerHTML = eventData[i].submit;
        document.getElementById("fee").innerHTML = eventData[i].fee;
        document.getElementById("target").innerHTML = eventData[i].target;
        document.getElementById("station").innerHTML = eventData[i].station;
        document.getElementById("address").innerHTML = eventData[i].address;
        document.getElementById("question").innerHTML = eventData[i].question;

        //Googleカレンダー登録準備
        var text = eventData[id].name;
        //var datefrom = '2014-06-10T17:00:00';
        //var dateto = '2014-06-10T18:00:00';
        //開催日作成
        var tempDateStr = data[7].slice(0,-3); //開催日の文字列『１０/９（祝）」から「（祝）」を捨てる
        var tempDatePair = tempDateStr.split("/"); //""/""の文字で分割して配列にする
        var date = new Date(2017, tempDatePair[0]-1, tempDatePair[1]); //これで開催日作成
        var zero = function(n) { return ('0' + n).slice(-2); };
        var startDate = date.getFullYear() + zero(date.getMonth()+1) + zero(date.getDate());
        var endDate   = date.getFullYear() + zero(date.getMonth()+1) + zero(date.getDate());
        //時間のパース。ただし、複数時間が同一カラムに記載されている場合は想定どおりうごかない。結果、終日で登録されることになる
        var tempTimeStr = data[8].replace( /:/g, ""); //正規表現。9:00~13:00の:をg(グローバルマッチ)ですべて滅ぼす準備
        var tempTimePair = tempTimeStr.split("~"); // 900と1300に分割
        var zero4 = function(n) { return ('0' + n).slice(-4); }; //900を0900に前0埋め 1300のときは1300のまま（後ろ４文字）
        var startTime = zero4(tempTimePair[0]) + "00";
        var endTime   = zero4(tempTimePair[1]) + "00";
        //さあ、すべてを終わりにしよう
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
  location.href = "https://twitter.com/share?url=https://civictechosaka.wixsite.com/undobusoku&text=【大阪市オータムチャレンジスポーツ2017】" + eventData[id].name + "/" + eventData[id].date + "/" + eventData[id].time + "/" + eventData[id].facility + "/" + eventData[id].top;
}

function postLine(){
  //LINE
  location.href = "http://line.me/R/msg/text/?【イベント名】" + eventData[id].name + "%0A【開催日】" + eventData[id].date + "%0A【時間】" + eventData[id].time + "%0A【場所】" + eventData[id].facility + "(最寄り駅:"+ eventData[id].station + ")%0A【内容】" + eventData[id].top + "%0A【参加費】" + eventData[id].fee + "%0A【参加対象】" + eventData[id].target + "%0A【申込方法】" + eventData[id].submit + "%0A【問い合わせ先】" + eventData[id].question + "%0A★★オータム・チャレンジ・スポーツ2017ーこの秋から始めようスポーツライフ！ー★★%0A9月から11月の3ヶ月間、大阪市内各所で様々なスポーツを楽しめる参加型イベントを開催します！%0Aアプリのダウンロードはこちらから。%0Ahttps://civictechosaka.wixsite.com/undobusoku";
}

function postFacebook(){
  //Facebook
  var url = "https://civictechosaka.wixsite.com/undobusoku";
  location.href= "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(url);
}

function clickTop(){
  location.href = "./index.html";
}
