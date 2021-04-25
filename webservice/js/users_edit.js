$(document).ready(init);

function init() {
	initUserUpdate();
}

function initUserUpdate() {
	setOnChange("accessLevel", "select");
	setOnChange("firstName");
	setOnChange("lastName");
	setOnChange("displayName");
	setOnChange("eMailAddress");
	setOnChange("streetName");
	setOnChange("houseNumber");
	setOnChange("supplementaryAddress");
	setOnChange("zipCode");
	setOnChange("city");
	setOnChange("country");
	setOnChange("phoneNumber");
	setOnChange("birthdate");
	setOnChange("eatingHabits", "textarea");
	setOnChange("allowPost");
	setOnChange("allowNewsletter");
}

function setOnChange(inputField, inputType) {
	inputType = inputType || "input";
	var action = "update" + inputField.charAt(0).toUpperCase() + inputField.slice(1);
	var inputElement = $(inputType+"[name='"+inputField+"']");
	
	inputElement.change(function() {
		var value;

		if (inputType === "select") {
			value = inputElement.find("option:selected").val();
		} else if (inputElement.attr("type") === "checkbox") {
			value = inputElement.is(":checked") ? 1 : 0;
		} else {
			value = inputElement.val();
		}

		updateUser(action, inputField, value);
	});
}

function updateUser(action, key, value) {
	var params = {
		"action": action,
		"userId": $('input[name="userId"]').val()
	};
	params[key] = value;

	$.ajax({
		url: "./users_ajax.php",
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