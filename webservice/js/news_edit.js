$(document).ready(init);

function init() {
	initNewsUpdate();
}

function initNewsUpdate() {
	setOnChange("title");
	setOnChange("summary", "textarea");
	setOnChange("content", "textarea");
	setOnChange("authorId", "select");
	setOnChange("postingDate");
	setOnChange("requiredAccessLevel", "select");
}

function setOnChange(inputField, inputType) {
	inputType = inputType || "input";
	var action = "update" + inputField.charAt(0).toUpperCase() + inputField.slice(1);
	var inputElement = $(inputType+"[name='"+inputField+"']");
	
	inputElement.change(function() {
		var value = inputType === "select" ? inputElement.find("option:selected").val() : inputElement.val();
		updateNews(action, inputField, value);
	});
}

function updateNews(action, key, value) {
	var params = {
		"action": action,
		"newsId": $('input[name="newsId"]').val()
	};
	params[key] = value;

	$.ajax({
		url: "./news_ajax.php",
		type: 'POST',
		data: jQuery.param(params),
		contentType: 'application/x-www-form-urlencoded',
		success: function() {
			window.location.reload(true);
			window.scrollTo(0, 0);
		},
		error: function() {
			window.scrollTo(0, 0);
		}
	});
}