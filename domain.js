var busTables = [];

// 時:分:秒のフォーマトに変換
function hms(tim) {
    if (tim == '') return ' ';
    return ('00' + Math.floor(tim / (60 * 60))).slice(-2) + ':' + ('00' + Math.floor((tim % (60 * 60)) / 60)).slice(-2) + ':' + ('00' + (tim % 60)).slice(-2);
};

// 時:分のフォーマットに変換
function hm(tim) {
    if (tim == '') return ' ';
    return ('00' + Math.floor(tim / (60 * 60))).slice(-2) + ':' + ('00' + Math.floor((tim % (60 * 60)) / 60)).slice(-2);
};

function hm2Time(hm) {
    return (Math.floor((hm / 100)) * (60 * 60) + (hm % 100) * 60);
}

function tableSet() {
    var cycle_num = inputCycleValue();

    if (cycle_num == 0) {
        tblData = rightData;
    } else {
        tblData = leftData;
    }

    for (i = 0; i < tblData.length; i++) {
        var bTable = tblData[i];
        for (j = 0; j < bTable.length; j++) {
            if (bTable[j].charAt(0) == "#") {
                // バス停名を先頭要素にセット
                var tbleEl = [bTable[j].substring(2)];
            } else {
                var lineData = bTable[j].split(":");
                var hh = lineData[0];
                // ：の前が数字の場合
                if (isFinite(hh)) {
                    var minData = lineData[1].split(" ");
                    for (k = 0; k < minData.length; k++) {
                        // 正規表現を用いて半角数字の文字列を全て""にする
                        var mm = (minData[k]).replace(/\D/g, "");
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
    var bTime, nbTime, nnbTime;
    bTime = '';
    for (var i = 1; i < busTables[tableNo].length; i++) {
        var bt = busTables[tableNo][i];
        if (bt > (now.getHours() * 100 + now.getMinutes())) {
            bTime = hm2Time(bt);
            if ((i + 1) < busTables[tableNo].length) {
                nbTime = hm2Time(busTables[tableNo][i + 1]);
                if ((i + 2) < busTables[tableNo].length) {
                    nnbTime = hm2Time(busTables[tableNo][i + 2]);
                }
            }
            break;
        }
    }
    // 次に来るバス
    document.getElementById("bus").innerHTML = hm(bTime);
    // 次に来るバスのの出発までの時間
    document.getElementById("timeLeft").innerHTML = "<span class='time-text'>残り</span>" + hms(bTime - nowTime) + "<span class='time-text'>後</span>";
};

function startClock() {
    tableSet();
    // バス停をセレクトに追加
    var btn_element = "";
    tableNo = 0;
    for (i = 0; i < busTables.length; i++) {
        btn_element = btn_element + '<option value="' + i + '">' + busTables[i][0];
        document.getElementById("bus_stop_select").innerHTML = btn_element;
    }
    setInterval(clock, 1000);
};

function inputValue() {
    tableSet();

    var index = document.bus_form.bus_stop_select.selectedIndex;
    var value = document.bus_form.bus_stop_select.options[index].value;
    tableNo = value;

    setInterval(clock, 1000);
}

function inputCycleValue() {
    var num = document.cycle_form.bus_cycle_select.selectedIndex;
    var val = document.cycle_form.bus_cycle_select.options[num].value;

    return val;
}