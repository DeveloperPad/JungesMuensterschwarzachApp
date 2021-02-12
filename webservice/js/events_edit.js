$(document).ready(init);

function init() {
	setOnChange("eventTitle");
	setOnChange("eventTopic");
	setOnChange("eventDetails", "textarea");
	setOnChange("eventStart");
	setOnChange("eventEnd");
	setOnChange("eventEnrollmentStart");
	setOnChange("eventEnrollmentEnd");
	setOnChange("eventOfferId", "select");
	setOnChange("eventScheduleId", "select");
	setOnChange("eventTargetGroupId", "select");
	setOnChange("eventPriceId", "select");
	setOnChange("eventPackingListId", "select");
	setOnChange("eventArrivalId", "select");
	setOnChange("eventLocationId", "select");
	setOnChange("requiredAccessLevel", "select");
}

function setOnChange(inputField, inputType) {
	inputType = inputType || "input";
	var action = "update" + inputField.charAt(0).toUpperCase() + inputField.slice(1);
	var inputElement = $(inputType+"[name='"+inputField+"']");
	
	inputElement.change(function() {
		var value = inputType === "select" ? inputElement.find("option:selected").val() : inputElement.val();
		updateEvent(action, inputField, value);
	});
}

function updateEvent(action, key, value) {
	var params = {
		"action": action,
		"eventId": $('input[name="eventId"]').val()
	};
	params[key] = value;

	$.ajax({
		url: "./events_ajax.php",
		type: "POST",
		data: $.param(params),
		contentType: 'application/x-www-form-urlencoded',
		success: function() {
			window.location.reload(true);
			window.scrollTo(0, 0,);
		},
		error: function() {
			window.scrollTo(0, 0);
		}
	});
}