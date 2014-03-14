//JQuery Controller
$(document).ready(function(){
	var pieInterval;
	var value;
	var newHeading;
	var fromDate;
	var fromTime;
	var toDate;
	var toTime;

	var todayDate;
	var currentTime;
	var incDate;
	var incTime;
	var year;
	var	hour;
	var	minutes;
	var	date;
	var	month;

	$("canvas").hide();

	//Fetching stored data
	chrome.storage.sync.get('data', function(v){
		if (v && v.data){
			var data = v.data;
			if (data[0] != "" && data[1] != "" && data[2] != "" && data[3] != "" && data[4] != "")
				$("#heading").text(data[0]);
			$("#title").val(data[0]);
			$("#from_date").val(data[1]);
			$("#from_time").val(data[2]);
			$("#to_date").val(data[3]);
			$("#to_time").val(data[4]);
			$(".myButton").click();
		}
	});

	//Transition between Pie Chart and Input Section
	$("canvas").dblclick(function(){
		clearInterval(pieInterval);
		$(this).hide();
		$("section").show();
	});

	//Done Button
	$(".myButton").click(function(){
		save();
		if (newHeading != "" && newHeading != " " && fromDate != "" && toDate != "" && fromTime != "" && toTime != ""){
			var d1 = fromDate.split("-");
			var t1 = fromTime.split(":");
			var d2 = toDate.split("-");
			var t2 = toTime.split(":");
			var first = new Date(parseInt(d1[0]), parseInt(d1[1])-1, parseInt(d1[2]), parseInt(t1[0]), parseInt(t1[1]));
			var second = new Date(parseInt(d2[0]), parseInt(d2[1])-1, parseInt(d2[2]), parseInt(t2[0]), parseInt(t2[1]));
			if (first.getTime() > second.getTime())
				return;
			pieInterval = setInterval(function(){
				current = new Date();
				if (current.getTime() < first.getTime())
					value = 0;
				else if (current.getTime() >= second.getTime())
					value = 360;
				else
					value = ((current.getTime() - first.getTime())/(second.getTime() - first.getTime())) * 100 * 3.6;
				$("#completedPercent").text(Math.floor(value/3.6) + "%");
				$("#remainingPercent").text(100-(Math.floor(value/3.6)) + "%");
				PieRendering();
			}, 1000);
			$("#heading").text(newHeading);
			$("section").hide();
			$("canvas").show();
		}
	});

	//Pie Rendering
	var PieRendering = function(){
		if (value == 360){
			$("canvas").drawArc({
				x: 150, y: 150,
				radius: 130,
				fillStyle: "#c33",
			});
		}	else if (value == 0){
			$("canvas").drawArc({
				x: 150, y: 150,
				radius: 130,
				fillStyle: "#6c6",
			});	
		} else {
			$("canvas")
			.jCanvas({
				layer: true,
				groups: ["chart", "slices"],
				x: 150, y: 150,
				radius: 130
			})
			.drawSlice({
				name: "red-slice",
				fillStyle: "#c33",
				start: 0,
				end: value
			})
			.drawSlice({
				name: "green-slice",
				fillStyle: "#6c6",
				start: value,
				end: 360
			}).jCanvas();
		}
	}
	
	//Icon Hover
	$("#bin").hover(function(){
		$(this).attr("src", "assets/bin_hover.png");
	},	function(){
		$(this).attr("src", "assets/bin.png");
	});
	$("#settings").hover(function(){
		$(this).attr("src", "assets/settings_hover.png");
	}, function(){
		$(this).attr("src", "assets/settings.png");
	});

	//Bin functionality
	$("#bin").click(function(){
		clearInterval(pieInterval);
		$("#heading").text("New");
		$("#title").val("");
		$("#from_date").val("0000-00-00");
		$("#to_date").val("0000-00-00");
		$("#from_time").val("00:00");
		$("#to_time").val("00:00");
		$("#completedPercent").text("");
		$("#remainingPercent").text("");
		save();
		$("canvas").hide();
		$("section").show();
	});

	//Saving
	var save = function(){
		newHeading = $("#title").val();
		fromDate = $("#from_date").val();
		fromTime = $("#from_time").val();
		toDate = $("#to_date").val();
		toTime = $("#to_time").val();
		var data = [newHeading, fromDate, fromTime, toDate, toTime];
		chrome.storage.sync.set({'data': data});
	}

	//Now button
	$(".DTbutton").click(function(){
		var d = new Date();
		date = d.getDate();
		month = d.getMonth()+1;
		year = d.getFullYear();
		hour = d.getHours();
		minutes = d.getMinutes();
		date = date < 10 ? "0" + date : date;
		month = month < 10 ? "0" + month : month;
		hour = hour < 10 ? "0" + hour : hour;
		minutes = minutes < 10 ? "0" + minutes : minutes;  
		todayDate = year + "-" + month + "-" + date;
		currentTime = hour + ":" + minutes;
		$("#from_date").val(todayDate);
		$("#from_time").val(currentTime);
	});


	//not completed
	$("#15min").click(function(){
		if(hour!=23){
			if(minutes<45){
				minutes+=15;
			}
		}
		incDate = year + "-" + month + "-" + date;
		incTime = hour + ":" + minutes;
		$("#to_date").val(incDate);
		$("#to_time").val(incTime);
	});

	$("#30min").click(function(){
		if(hour!=23){
			if(minutes<30){
				minutes+=30;
			}
		}
		incDate = year + "-" + month + "-" + date;
		incTime = hour + ":" + minutes;
		$("#to_date").val(incDate);
		$("#to_time").val(incTime);
	});

	$("#1hr").click(function(){
		if(hour!=23){
			hour++;
			hour = hour < 10 ? "0" + hour : hour;
		}
		incDate = year + "-" + month + "-" + date;
		incTime = hour + ":" + minutes;
		$("#to_date").val(incDate);
		$("#to_time").val(incTime);
	});
});












