function drawSearch(){
  //本日の日付をtodayにセット
  var loop;
  var this_month;
  var this_date;
  var today;
  today = new Date();
  this_month = today.getMonth() + 1; //0からはじまるため+1
  this_date   = today.getDate();
  //月のselect optionはめんどうなのでループ処理でセットする
  setOption = function(from, to, id, this_date){
    var option;
    option = null;
    for (var i = from; i<= to; i++){
      if (i === this_date){
        option += "<option value='" + i + "月' selected>" + i + "月</option>";
      } else {
        option += "<option value='" + i + "月'>" + i + "月</option>";
      }
    }
    return document.getElementById(id).innerHTML = option;
  };
  //日のselect optionはめんどうなのでループ処理でセットする
  setOption2 = function(from, to, id, this_date){
    var option;
    option = null;
    for (var i = from; i<= to; i++){
      if (i === this_date){
        option += "<option value='" + i + "日' selected>" + i + "日</option>";
      } else {
        option += "<option value='" + i + "日'>" + i + "日</option>";
      }
    }
    return document.getElementById(id).innerHTML = option;
  };
  setOption(1, 12, 'datefromMonth', this_month);
  setOption2(1, 31, 'datefromDate', this_date);
  setOption(1, 12, 'datetoMonth', 12);
  setOption2(1, 31, 'datetoDate', 31);
  //場所のselect optionをセット
  var facilityLabel = ["すべて","アゼリア大正","もと平野青少年会館付設体育館","ヤンマースタジアム長居(長居第1陸上競技場)","阿倍野スポーツセンター","阿倍野屋内プール","旭スポーツセンター","旭屋内プール","下福島プール","港スポーツセンター","此花スポーツセンター","此花屋内プール","桜橋ボウル","山之内西庭球場","住吉スポーツセンター","住吉屋内プール","住之江スポーツセンター","住之江屋内プール","城東スポーツセンター","城東屋内プール","城東区民センター","真田山プール","生野スポーツセンター","生野屋内プール","西スポーツセンター","西屋内プール","西成スポーツセンター","西成屋内プール","西淀川スポーツセンター","西淀川屋内プール","千島体育館","扇町プール","大空小学校","大阪プール","大阪城弓道場","大阪城公園太陽の広場","大正スポーツセンター","大正屋内プール","巽小学校","中央スポーツセンター","中央屋内プール","中央体育館","長居プール","長居障がい者スポーツセンター","長居庭球場","鶴見スポーツセンター","鶴見緑地プール","鶴見緑地球技場","鶴見緑地庭球場","天王寺スポーツセンター","都島スポーツセンター","東住吉スポーツセンター","東成スポーツセンター","東淀川スポーツセンター","東淀川屋内プール","東淀川体育館","湯里小学校","府民共済SUPERアリーナ","舞洲障がい者スポーツセンター","福島スポーツセンター","福島区民センター","平野スポーツセンター","平野屋内プール","北スポーツセンター","淀川スポーツセンター","淀川屋内プール","浪速スケートリンク","浪速スポーツセンター","浪速屋内プール"];
  var facility;
  for (var i in facilityLabel){
    facility += "<option value='" + facilityLabel[i] + "'>" + facilityLabel[i] + "</option>";
  }
  document.getElementById("listFacility").innerHTML = facility;
  //競技のselect optionをセット
  var categoryLabel = ["すべて","テニス","バドミントン","卓球","サッカー・フットサル","水泳","水中エクササイズ","ヨガ","エアロビクス","エクササイズ","体操","体力・身体測定","ニュースポーツ","その他"];
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
  fromMonth = encodeURIComponent((document.getElementById("datefromMonth").value).slice(0,-1));
  fromDate  = encodeURIComponent((document.getElementById("datefromDate").value).slice(0,-1));
  toMonth   = encodeURIComponent((document.getElementById("datetoMonth").value).slice(0,-1));
  toDate    = encodeURIComponent((document.getElementById("datetoDate").value).slice(0,-1));
  facility  = encodeURIComponent(document.getElementById("listFacility").value);
  category  = encodeURIComponent(document.getElementById("listCategory").value);
  word      = encodeURIComponent(document.getElementById("freeword").value);
  var param = "fromMonth="+fromMonth+"&fromDate="+fromDate+"&toMonth="+toMonth+"&toDate="+toDate+"&facility="+facility+ "&category="+category+"&freeword="+word;
  location.href="./result.html?"+param;
}
