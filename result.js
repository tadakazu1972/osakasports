//グローバル
var eventData = new Array(); //イベントデータ全て格納

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
  var fromDate  = decodeURIComponent(key["fromDate"]);
  var toMonth   = decodeURIComponent(key["toMonth"]);
  var toDate    = decodeURIComponent(key["toDate"]);
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
    //とりあえず全データを日付昇順でバブルソート
    csvArray2 = new Array();
    csvArray3 = new Array();
    tempArray2 = new Array();
    var u,v;
    for(u=0;u<tempArray.length-1;u++){
      for(v=tempArray.length-1; v>u; v--){
        //現時点のデータ取得
        csvArray2 = tempArray[v].split(",");
        var tempDate1Str = csvArray2[7].slice(0,-3); //開催日の文字列『１０/９（祝）」から「（祝）」を捨てる
        var tempDate1Pair = tempDate1Str.split("/"); //"/"の文字で分割して配列にする
        var tempDate1 = new Date(2017, tempDate1Pair[0]-1, tempDate1Pair[1]);
        //１つ前のデータ取得
        csvArray3 = tempArray[v-1].split(",");
        var tempDate2Str = csvArray3[7].slice(0,-3); //開催日の文字列『１０/９（祝）」から「（祝）」を捨てる
        var tempDate2Pair = tempDate2Str.split("/"); //"/"の文字で分割して配列にする
        var tempDate2 = new Date(2017, tempDate2Pair[0]-1, tempDate2Pair[1]);
        if ( tempDate2 > tempDate1 ) {
          tempArray2 = tempArray[v];
          tempArray[v] = tempArray[v-1];
          tempArray[v-1] = tempArray2;
        }
      }
    }
    //ソート完了後
    var csvArray = new Array();
    for(var i=1;i<tempArray.length;i++){ //i=1はヘッダーを読み込ませないため
      csvArray[i] = tempArray[i].split(",");
      var data = csvArray[i];
      //とりあえず読み込んだすべてのデータをDataクラスの配列に格納
      eventData[i] = new EventData(data[0],data[1],data[2],data[3],data[4],data[5],data[6],data[7],data[8],data[9],data[10],data[11],data[12],data[13],data[14],data[15],data[16]);
      //日付処理:引き継いだパラメータから検索開始日と検索終了日をDate型でつくり、csvから開催日をDate型をつくり、比較させる
      var date1 = new Date(2017, fromMonth-1, fromDate); //月は-1を忘れずに!!
      var date2 = new Date(2017, toMonth-1, toDate);
      var tempDateStr = data[7].slice(0,-3); //開催日の文字列『１０/９（祝）」から「（祝）」を捨てる
      var tempDatePair = tempDateStr.split("/"); //"/"の文字で分割して配列にする
      var date3 = new Date(2017, tempDatePair[0]-1, tempDatePair[1]); //これで開催日作成
      //３つのDateを比較し、はさまれた開催日のみ表示
      if (date1 <= date3){
        if (date3 <= date2){
          if (facility == "すべて"){
            if (category == "すべて"){
              if (word == ""){
                var item = document.createElement("div");
                item.className = "list";
                item.style.border = "solid";
                if (window.innerWidth >= 640){
                  item.style.width = "630px";
                }
                item.style.margin = "auto";
                item.style.padding = "4px";
                item.style.cursor = "pointer";
                item.innerHTML = "<b>"+data[7]+"  "+data[4]+"</b><br>"+eventData[i].top;
                item.onclick = (function(num){ return function(){ clickList(num); };})(i);
                document.body.appendChild(item);
              } else if (tempArray[i].match(word)){
                var item = document.createElement("div");
                item.className = "list";
                item.style.border = "solid";
                if (window.innerWidth >= 640){
                  item.style.width = "630px";
                }
                item.style.margin = "auto";
                item.style.padding = "4px";
                item.style.cursor = "pointer";
                item.innerHTML = "<b>"+data[7]+"  "+data[4]+"</b><br>"+eventData[i].top;
                item.onclick = (function(num){ return function(){ clickList(num); };})(i);
                document.body.appendChild(item);
              };
            } else if (category == data[5]){
              if (word == ""){
                var item = document.createElement("div");
                item.className = "list";
                item.style.border = "solid";
                if (window.innerWidth >= 640){
                  item.style.width = "630px";
                }
                item.style.margin = "auto";
                item.style.padding = "4px";
                item.style.cursor = "pointer";
                item.innerHTML = "<b>"+data[7]+"  "+data[4]+"</b><br>"+eventData[i].top;
                item.onclick = (function(num){ return function(){ clickList(num); };})(i);
                document.body.appendChild(item);
              } else if (tempArray[i].match(word)){
                var item = document.createElement("div");
                item.className = "list";
                item.style.border = "solid";
                if (window.innerWidth >= 640){
                  item.style.width = "630px";
                }
                item.style.margin = "auto";
                item.style.padding = "4px";
                item.style.cursor = "pointer";
                item.innerHTML = "<b>"+data[7]+"  "+data[4]+"</b><br>"+eventData[i].top;
                item.onclick = (function(num){ return function(){ clickList(num); };})(i);
                document.body.appendChild(item);
              };
            };
          } else if (facility == data[2]){
            if (category == "すべて"){
              if (word == ""){
                var item = document.createElement("div");
                item.className = "list";
                item.style.border = "solid";
                if (window.innerWidth >= 640){
                  item.style.width = "630px";
                }
                item.style.margin = "auto";
                item.style.padding = "4px";
                item.style.cursor = "pointer";
                item.innerHTML = "<b>"+data[7]+"  "+data[4]+"</b><br>"+eventData[i].top;
                item.onclick = (function(num){ return function(){ clickList(num); };})(i);
                document.body.appendChild(item);
              } else if (tempArray[i].match(word)){
                var item = document.createElement("div");
                item.className = "list";
                item.style.border = "solid";
                if (window.innerWidth >= 640){
                  item.style.width = "630px";
                }
                item.style.margin = "auto";
                item.style.padding = "4px";
                item.style.cursor = "pointer";
                item.innerHTML = "<b>"+data[7]+"  "+data[4]+"</b><br>"+eventData[i].top;
                item.onclick = (function(num){ return function(){ clickList(num); };})(i);
                document.body.appendChild(item);
              };
            } else if (category == data[5]){
              if (word == ""){
                var item = document.createElement("div");
                item.className = "list";
                item.style.border = "solid";
                if (window.innerWidth >= 640){
                  item.style.width = "630px";
                }
                item.style.margin = "auto";
                item.style.padding = "4px";
                item.style.cursor = "pointer";
                item.innerHTML = "<b>"+data[7]+"  "+data[4]+"</b><br>"+eventData[i].top;
                item.onclick = (function(num){ return function(){ clickList(num); };})(i);
                document.body.appendChild(item);
              } else if (tempArray[i].match(word)){
                var item = document.createElement("div");
                item.className = "list";
                item.style.border = "solid";
                if (window.innerWidth >= 640){
                  item.style.width = "630px";
                }
                item.style.margin = "auto";
                item.style.padding = "4px";
                item.style.cursor = "pointer";
                item.innerHTML = "<b>"+data[7]+"  "+data[4]+"</b><br>"+eventData[i].top;
                item.onclick = (function(num){ return function(){ clickList(num); };})(i);
                document.body.appendChild(item);
              };
            };
          };
        };
      };
    };
  };
  xhr.open("get", "data2017c.csv", true);
  xhr.send(null);
}

function clickList(num){
  //window.confirm("id:"+num+"がクリックされた");
  var _id = encodeURIComponent(eventData[num].id);
  var param = "id="+_id;
  location.href = "./event.html?"+param;
}
