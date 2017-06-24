function drawSearch(){
  //本日の日付をtodayにセット
  var loop;
  var this_month;
  var this_day;
  var today;
  today = new Date();
  this_month = today.getMonth() + 1; //0からはじまるため+1
  this_day   = today.getDate();
  //月、日のselect optionはめんどうなのでループ処理でセットする
  setOption = function(from, to, id, this_day){
    var option;
    option = null;
    for (var i = from; i<= to; i++){
      if (i === this_day){
        option += "<option value='" + i + "' selected>" + i + "</option>";
      } else {
        option += "<option value='" + i + "'>" + i + "</option>";
      }
    }
    return document.getElementById(id).innerHTML = option;
  };
  setOption(1, 12, 'datefromMonth', this_month);
  setOption(1, 31, 'datefromDay', this_day);
  setOption(1, 12, 'datetoMonth', this_month);
  setOption(1, 31, 'datetoDay', this_day);
  //場所のselect optionをセット
  var facilityLabel = ["すべて","アゼリア大正","もと平野青少年会館付設体育館","阿倍野スポーツセンター","阿倍野屋内プール","旭スポーツセンター","旭屋内プール","下福島屋内プール","港スポーツセンター","此花スポーツセンター","此花屋内プール","山之内西庭球場","住吉スポーツセンター","住吉屋内プール","住之江スポーツセンター","住之江屋内プール","城東スポーツセンター","城東屋内プール","真田山プール","生野スポーツセンター","生野屋内プール","西スポーツセンター","西屋内プール","西成スポーツセンター","西成屋内プール","西淀川スポーツセンター","西淀川屋内プール","扇町プール","大空小学校","大阪プール","大阪城弓道場","大正スポーツセンター","大正屋内プール","巽小学校","中央スポーツセンター","中央屋内プール","長居プール","鶴見スポーツセンター","鶴見緑地プール","鶴見緑地球技場","天王寺スポーツセンター","都島スポーツセンター","都島プール","都島屋内プール","東住吉スポーツセンター","東成スポーツセンター","東成屋内プール","東淀川スポーツセンター","東淀川屋内プール","東淀川体育館","湯里小学校","府民共済SUPERアリーナ","福島スポーツセンター","福島区民センター","平野スポーツセンター","平野屋内プール","北スポーツセンター","淀川スポーツセンター","淀川屋内プール","浪速スケートリンク","浪速スポーツセンター","浪速屋内プール"];
  var facility;
  for (var i in facilityLabel){
    facility += "<option value='" + facilityLabel[i] + "'>" + facilityLabel[i] + "</option>";
  }
  document.getElementById("listFacility").innerHTML = facility;
  //競技のselect optionをセット
  var categoryLabel = ["すべて","サッカー・フットサル","テニス","バドミントン","卓球","弓道","水泳","水中エクササイズ","水上レクリエーション","エアロビクス","エクササイズ","ヨガ","太極拳・太極舞","体操","体力・身体測定","体組成測定","その他","不明"];
  var category;
  for (var i in categoryLabel){
    category += "<option value='" + categoryLabel[i] + "'>" + categoryLabel[i] + "</option>";
  }
  document.getElementById("listCategory").innerHTML = category;
}

function clickSearch(){
  var fromMonth, fromDate, toMonth, toDate;
  var facility;
  var category;
  var word;
  fromMonth = encodeURIComponent(document.getElementById("datefromMonth").value);
  fromDay   = encodeURIComponent(document.getElementById("datefromDay").value);
  toMonth   = encodeURIComponent(document.getElementById("datetoMonth").value);
  toDay     = encodeURIComponent(document.getElementById("datetoDay").value);
  facility  = encodeURIComponent(document.getElementById("listFacility").value);
  category  = encodeURIComponent(document.getElementById("listCategory").value);
  word      = encodeURIComponent(document.getElementById("freeword").value);
  var param = "fromMonth="+fromMonth+"&fromDay="+fromDay+"&toMonth="+toMonth+"&toDay="+toDay+"&facility="+facility+ "&category="+category+"&word="+word;
  location.href="./result.html?"+param;
}
