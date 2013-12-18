//JQuery Controller
$(document).ready(function(){
	var pieInterval;
	var value;

	$("canvas").hide();

	//Transition between Pie Chart and Input Section
	$("canvas").dblclick(function(){
		clearInterval(pieInterval);
		$(this).hide();
		$("section").show();
	});

	//Done Button
	$(".myButton").click(function(){
		var newHeading = $("#title").val();
		var fromDate = $("#from_date").val();
		var toDate = $("#to_date").val();
		var fromTime = $("#from_time").val();
		var toTime = $("#to_time").val();
		if (newHeading != "" && newHeading != " " && fromDate != "" && toDate != "" && fromTime != "" && toTime != ""){
			var d1 = fromDate.split("-");
			var t1 = fromTime.split(":");
			var d2 = toDate.split("-");
			var t2 = toTime.split(":");
			var first = new Date(parseInt(d1[0]), parseInt(d1[1])-1, parseInt(d1[2]), parseInt(t1[0]), parseInt(t1[1]));
			var second = new Date(parseInt(d2[0]), parseInt(d2[1])-1, parseInt(d2[2]), parseInt(t2[0]), parseInt(t2[1]));
			if (first.getTime() > second.getTime())
				return 0;
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
		$("canvas").hide();
		$("section").show();
	});
});

//AngularJs Controller
function MainController($scope){
		var values = ["title", "from_date", "from_time", "to_date", "to_time"];
		var i;

		for (i = 0; i < 4; i++){
			chrome.storage.sync.get(values[0], function(value){
				$scope.$apply(function() {
					$scope.load(value);
				});
			});
		}
	
		$scope.load = function(value){
			if (value && value.values[i])
				$scope.values[i] = value.values[i];
		}

		$scope.save = function(){
			chrome.storage.sync.set({'title': $scope.title});
		}
}