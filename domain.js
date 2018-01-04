var busTables = [];

// 時:分:秒のフォーマトに変換
function  hms(tim) {
    if (tim == '')  return ' ';
    return ('00' + Math.floor(tim / (60 * 60))).slice(-2) + ':' + ('0' + Math.floor((tim % (60 * 60)) / 60)).slice(-2) + ':' + ('0' + (tim % 60)).slice(-2);
};

// 時:分のフォーマットに変換
function  hm(tim) {
    if (tim == '') return ' ';
    return  ('0' + Math.floor(tim / (60 * 60))).slice(-2) + ':' + ('0' + Math.floor((tim % (60 * 60)) / 60)).slice(-2);
};

function hm2Time(hm) {
    return (Math.floor((hm / 100)) * (60 * 60) + (hm % 100) * 60);
}

function tableSet() {
  for (i = 0; i < tblData.length; i++){
    var bTable = tblData[i];
    for (j = 0; j < bTable.length; j++){
      if (bTable[j].charAt(0) == "#") {
        var tbleEl = [bTable[j].substring(2)]; // バス停名を先頭要素にセット
      } else {
        var lineData = bTable[j].split(":");
        var hh = lineData[0];
        if (isFinite(hh)) {   // ：の前が数値だったら
          var minData = lineData[1].split(" ");
          for (k = 0; k < minData.length; k++){
            var mm = (minData[k]).replace(/\D/g,"");
            var hhmm = hh * 100 + parseInt(mm, 10);
            if (isFinite(hhmm)) {
              tbleEl.push(hhmm);
            }
          }
        }
      }
    }
    busTables.push(tbleEl);
  }
}

function clock() {
    document.getElementById("bus_stop").innerHTML = busTables[tableNo][0];
    var now = new Date();
    var nowTime = (now.getHours() * 60 * 60) + (now.getMinutes() * 60) + now.getSeconds();
//  var tbl = busTables[tableNo];
    var bTime, nbTime, nnbTime;
    bTime = nbTime = nnbTime = '';
    for (var i = 1; i < busTables[tableNo].length; i++) {
        var bt = busTables[tableNo][i];
        if (bt > (now.getHours() * 100 + now.getMinutes())) {
            bTime = hm2Time(bt);
            if ((i + 1) < busTables[tableNo].length) {
                nbTime = hm2Time(busTables[tableNo][i + 1]);
                if ((i + 2) < busTables[tableNo].length) {
                    nnbTime = hm2Time(busTables[tableNo][i + 2]);
                };
            };
            break;
        }
    };
    // 現在時刻
    document.getElementById("clock_time").innerHTML = hms(nowTime);
    // 次に来るバス
    document.getElementById("bus").innerHTML = hm(bTime);
    // 次の次に来るバス
    document.getElementById("nbus").innerHTML = hm(nbTime);
    // 次の次の次に来るバス
    document.getElementById("nnbus").innerHTML = hm(nnbTime);
    // 次に来るバスのの出発までの時間
    document.getElementById("timeLeft").innerHTML = hms(bTime -nowTime);
};

function startClock() {
  tableSet();
    // 時刻表を切り替えるボタンをHTMLに追加する
    var div_button = document.createElement("div");
    var btn_element ="";
    tableNo = 0;
    for (i = 0; i < busTables.length; i++) {
        btn_element = btn_element + ' <input type="button" value="' + busTables[i][0] + '" onclick="';
        btn_element = btn_element + 'tableNo = ' + i + ';"/>';
        div_button.innerHTML = btn_element;
    };
    document.getElementById("btn").appendChild(div_button);

    // 上記のclock関数を1000ミリ秒ごと(毎秒)に実行する
    setInterval(clock, 1000);
};