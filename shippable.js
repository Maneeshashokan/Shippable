angular.module("apiApp",[])
	.controller("ShippApp",function ($scope,$http) {

		// Define variables;
		$scope.repoUrl="";
		$scope.count = 0;
		$scope.lastOneDayCount = 0;
		$scope.qThree = 0;
		$scope.qFour = 0;

		// This function get the result of the question
		$scope.processInput = function(){
			// This is for testing "https://github.com/Shippable/support/issues"
			var url = $scope.repoUrl; 

			// check if the input is null or not
			if(!url){
				return alert("invalid input");
			}
			
			// spliting input string 
			var input_array = url.split('/');

			// validating the input url
			if(input_array[0]!='https:' || input_array[1]!='' 
				|| input_array[2]!='github.com' || !input_array[3] || !input_array[4]){
				return alert("Input is not in proper format, please input like 'https://github.com/Shippable/support'");
			}

			// getting total number of open issues
			$scope.getOpenIssueCount('https://api.github.com/repos/'+input_array[3]+'/'+input_array[4]);
			
			//getting last 24 hour in isoString format
			var lastOneDay = new Date();
			lastOneDay = new Date(lastOneDay.setDate(lastOneDay.getDate()-1));
			lastOneDay = lastOneDay.toISOString();

			//getting last 7 days in isoString format
			var lastSevenDay = new Date();
			lastSevenDay = new Date(lastSevenDay.setDate(lastSevenDay.getDate()-1));
			lastSevenDay = lastSevenDay.toISOString();

			//get open issues since last 7 days ago
			$scope.getOpenIssueCountLastSevenDay('https://api.github.com/repos/' + input_array[3] + '/' + input_array[4] +'/issues?since=' + lastSevenDay);

			//get opne issues since one day ago
			$scope.getOpenIssueCountLastOneDay('https://api.github.com/repos/' + input_array[3] + '/' + input_array[4] +'/issues?since=' + lastOneDay);
			
		};
		$scope.getOpenIssueCount = function (url) {
			$http.get(url).then(function (result) {
				$scope.count = result.data['open_issues_count'];

			});
		};
		$scope.getOpenIssueCountLastOneDay = function (url) {
			$http.get(url).then(function (result) {
				$scope.lastOneDayCount = result.data.length;

			});
		};
		$scope.getOpenIssueCountLastSevenDay = function (url) {
			$http.get(url).then(function (result) {
				var lastSevenDayCount = result.data.length;
				// question 3 
				$scope.qThree = lastSevenDayCount - $scope.lastOneDayCount;
				//question 4 
				$scope.qFour = $scope.count - lastSevenDayCount;
				
			});
		};
	});