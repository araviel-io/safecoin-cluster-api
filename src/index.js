// parcel-bundler
import _ from "lodash";
// _ = _.noConflict();

var api_url = "https://api.mainnet-beta.safecoin.org";
var realtime = true;

if (realtime === true) {
  setInterval(function () {
    fgetEpochInfo(api_url);
    fgetSamples(api_url);
  }, 2500);
} else { 
  // only init
  fgetEpochInfo(api_url);
  fgetSamples(api_url);
}

async function fgetEpochInfo(url) {
  // Storing response
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: "1", method: "getEpochInfo" })
    // see all the cluster avaiable methods here
  });

  // if true store and parse the datas
  if (response) {
    var data = await response.json();

    var currentEpoch = _.get(data, "result.epoch");
    var slotInEpochs = _.get(data, "result.slotsInEpoch");
    var slotIndex = _.get(data, "result.slotIndex");
    var actualSlot = _.get(data, "result.absoluteSlot");
    var epochprogress = (slotIndex * 100) / slotInEpochs;

    var truncEpoch = Math.trunc(epochprogress.toString());

    document.getElementById("araio-curslot").innerHTML = actualSlot;

    /*	if (_curslotcheck != actualSlot){ 
			$("#blcurrentslot").animateNumbers(actualSlot);
		}*/

    if (truncEpoch < 1) {
    } else {
      /*
			var el = document.querySelector('.progress-done');
			el.setAttribute('data-done', truncEpoch); 
			const progress = document.querySelector('.progress-done');

			progress.style.width = progress.getAttribute('data-done') + '%';
			progress.style.opacity = 1;
			const final = parseInt(progress.getAttribute('data-done'));
			if (truncEpoch > 5)
				{
					$(".progress-done").html(truncEpoch + " %");
				}*/
    }
  }
}
async function fgetSamples(url) {
  // Storing response
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "1",
      method: "getRecentPerformanceSamples",
      params: [1]
    })
  });

  if (response) {
    // returns > 0: {numSlots: 119, numTransactions: 53213, samplePeriodSecs: 60, slot: 75155782}
    var data = await response.json();
    // get transaction count on a 60s range
    var slotLoader = _.get(data, "result");
    var _numtransac = _.get(slotLoader[0], "numTransactions");
    var _numSlots = _.get(slotLoader[0], "numSlots");
    var _period = _.get(slotLoader[0], "samplePeriodSecs");
    //console.log("---> ARRAY | getRecentPerformanceSamples : ", slotLoader);
    // console.log("-------> numTransactions : ", _numtransac);
    var _tps = _numtransac / _period;
    var _tpstrunc = Math.trunc(_tps);
    //  console.log("-----------> TPS FINAL (based on last 60s) : ", _numtransac);
    var _blocktime = _period / _numSlots;
    var _blocktimeTrunc = _blocktime.toFixed(3) * 1000;

    document.getElementById("araio-blocktime").innerHTML = _blocktimeTrunc;
    document.getElementById("araio-tps").innerHTML = _tpstrunc;
  }
}
