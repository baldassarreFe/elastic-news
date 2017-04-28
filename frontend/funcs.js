function handleClick(form) {
	if (form.query.value === "") {
      alert("Search for something...");
   }
   else {
   	var maxResults = 10;

      // TODO: Get results
      results = ["Results1", "Results2", "Results3", "Results4", "Results5", "Results6", "Results7", "Results8", "Results9", "Results10", "Results11"];
      results = results.slice(0,maxResults+1);
      
      // Show results on screen
      for(i = 0; i < results.length; i++) {
      	var id = "result_" + i.toString();
      	document.getElementById(id).innerHTML = (i+1).toString() + ". " + results[i];
      }
   }
}


function buttonReinforcment(num) {
	var id = "result_" + num.toString() + "_fb";
	if (!document.getElementById(id).innerHTML) {
		document.getElementById(id).innerHTML = num.toString();
	}
	else {
		document.getElementById(id).innerHTML = "";
	}
	
}

function submitRL() {
	alert("TODO: submitRL()");
	// TODO: Submit all document.getElementById(result_X_fb).innerHTML where 1 <= X <= 10 to ElasticSearch
}