var busTables = [];

// 時:分:秒のフォーマトに変換
function hms(time) {
    if (time == '') return '終了';
    return ('00' + Math.floor(time / (60 * 60))).slice(-2) + ':' + ('00' + Math.floor((time % (60 * 60)) / 60)).slice(-2) + ':' + ('00' + (time % 60)).slice(-2);
};

// 時:分のフォーマットに変換
function hm(time) {
    if (time == '') return '終了';
    return ('00' + Math.floor(time / (60 * 60))).slice(-2) + ':' + ('00' + Math.floor((time % (60 * 60)) / 60)).slice(-2);
};

function convTime(hm) {
    return (Math.floor((hm / 100)) * (60 * 60) + (hm % 100) * 60);
}

function busTableSet() {
    var cycle_num = inputCycleValue();

    if (cycle_num == 0) {
        busData = rightData;
    } else {
        busData = leftData;
    }

    for (i = 0; i < busData.length; i++) {
        var busTable = busData[i];
        for (n = 0; n < busTable.length; n++) {
            if (busTable[n].charAt(0) == "#") {
                var tbleEl = [busTable[n].substring(2)];
            } else {
                var lineData = busTable[n].split(":");
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

function busClock() {
    document.getElementById("bus_stop").innerHTML = busTables[busTableNo][0];
    var now = new Date();
    var nowTime = (now.getHours() * 60 * 60) + (now.getMinutes() * 60) + now.getSeconds();
    var bTime, nbTime, nnbTime;
    bTime = '';
    for (var i = 1; i < busTables[busTableNo].length; i++) {
        var bt = busTables[busTableNo][i];
        if (bt > (now.getHours() * 100 + now.getMinutes())) {
            bTime = convTime(bt);
            if ((i + 1) < busTables[busTableNo].length) {
                nbTime = convTime(busTables[busTableNo][i + 1]);
                if ((i + 2) < busTables[busTableNo].length) {
                    nnbTime = convTime(busTables[busTableNo][i + 2]);
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
    busTableSet();
    // バス停をセレクトに追加
    var select = "";
    //初期値0(金沢駅東口)
    busTableNo = 0;
    for (i = 0; i < busTables.length; i++) {
        select = select + '<option value="' + i + '">' + busTables[i][0];
        document.getElementById("bus_stop_select").innerHTML = select;
    }
    setInterval(busClock, 1000);
};

function inputValue() {
    busTableSet();

    var index = document.bus_form.bus_stop_select.selectedIndex;
    var value = document.bus_form.bus_stop_select.options[index].value;
    busTableNo = value;

    setInterval(busClock, 1000);
}

function inputCycleValue() {
    var num = document.cycle_form.bus_cycle_select.selectedIndex;
    var val = document.cycle_form.bus_cycle_select.options[num].value;

    return val;
}
