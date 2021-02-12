$(document).ready(init);

function init() {
	$.getScript("../js/dict.js", function () {
		initEventComponentSelects();
		initEventComponentModals();
	});
}

function initEventComponentSelects() {
	initEventComponent($("select[name=eventOfferId]"), $("#eventOffersManage"));
	initEventComponent($("select[name=eventScheduleId]"), $("#eventSchedulesManage"));
	initEventComponent($("select[name=eventTargetGroupId]"), $("#eventTargetGroupsManage"));
	initEventComponent($("select[name=eventPriceId]"), $("#eventPricesManage"));
	initEventComponent($("select[name=eventPackingListId]"), $("#eventPackingListsManage"));
	initEventComponent($("select[name=eventArrivalId]"), $("#eventArrivalsManage"));
	initEventComponent($("select[name=eventLocationId]"), $("#eventLocationsManage"));
}

function initEventComponentModals() {
	$("#manageEventComponentModal").on("show.bs.modal", function (event) {
		$(this).data("component-type", $(event.relatedTarget).data("component-type"));
		$(this).find(".modal-title strong").html($(event.relatedTarget).data("component-name"));
		loadEventComponentList();
	});
	$("#manageEventComponentModal").on("hide.bs.modal", function (event) {
		var componentType = $(this).data("component-type");
		var componentTypeSingular = componentType.charAt(0).toUpperCase() + componentType.slice(1);
		var componentTypePlural = componentTypeSingular;
		if (componentTypePlural.substr(componentTypePlural.length - 1) !== "s") {
			componentTypePlural += "s";
		}

		loadEventComponent(
			$("select[name=event" + componentTypeSingular + "Id]"),
			$("#event" + componentTypePlural + "Manage")
		);
	});
	$("#deleteEventComponentModal").on("show.bs.modal", function (event) {
		var confirmButton = $(this).find(".modal-footer button:first()");
		confirmButton.off("click");
		confirmButton.click(function () {
			deleteEventComponent(event);
			// make manage modal scrollable again
			$("#manageEventComponentModal").css("overflow-y", "scroll");
		});
	});
	$("#chooseEventLocationModal").on("show.bs.modal", function(event) {
		var confirmButton = $(this).find(".modal-footer button:first()");

		$(this).data("relatedTarget", event.relatedTarget);
		confirmButton.off("click");
		confirmButton.click(function() {
			setEventLocation();
		});

		loadMap(this);
	});
}


/* event component selects */

function initEventComponent(eventComponentSelect, eventComponentManageButton) {
	eventComponentSelect.on("change", function () {
		eventComponentSelect.data("selected", eventComponentSelect.val());
	});

	loadEventComponent(eventComponentSelect, eventComponentManageButton);
}

function loadEventComponent(eventComponentSelect, eventComponentManageButton) {
	var eventComponentType = eventComponentManageButton.data("component-type");
	var eventComponentSelected = eventComponentSelect.data("selected") || -1;

	$.ajax({
		url: "./events_ajax.php",
		type: "POST",
		data: $.param({
			action: eventComponentType === "Location" ? "fetchEventLocationList" : "fetchEventComponentList",
			eventComponentType: eventComponentType
		}),
		contentType: "application/x-www-form-urlencoded",
		success: function (response) {
			try {
				eventComponentSelect.children().remove();
				JSON.parse(response).forEach(function (eventOffer) {
					var option = $("<option/>", {
						value: eventOffer["event" + eventComponentType + "Id"],
						text: eventOffer["event" + eventComponentType + "Title"]
					});
					
					if (parseInt(eventComponentSelected) === parseInt(option.attr("value"))) {
						option.attr("selected", "selected");
					}

					eventComponentSelect.append(option);
				});
			} catch (exc) {
				alert(exc);
			}
		}
	});
}


/* event component modal */

function loadEventComponentList() {
	var eventComponentType = $("#manageEventComponentModal").data("component-type");

	$.ajax({
		url: "./events_ajax.php",
		type: "POST",
		data: $.param({
			action: eventComponentType === "Location" ? "fetchEventLocationList" : "fetchEventComponentList",
			eventComponentType: eventComponentType
		}),
		contentType: "application/x-www-form-urlencoded",
		success: function (response) {
			try {
				updateEventComponentList(JSON.parse(response));
			} catch (exc) {
				alert(exc);
			}
		}
	});
}

function updateEventComponentList(eventComponentList) {
	var listGroup = $("#manageEventComponentModal").find(".modal-body").children().first();

	// removes existing component entries
	listGroup.children().slice(1).remove();

	// (re)add component entries
	eventComponentList.forEach(function (eventComponent) {
		listGroup.append(newEventComponentEntry(eventComponent));
	});

	// add empty component entry to be able to submit new components
	listGroup.append(newEventComponentEntry(null));
}

function newEventComponentEntry(eventComponent) {
	var eventComponentType = $("#manageEventComponentModal").data("component-type");
	var listItem = $("<div/>", {
		class: "row list-group-item"
	});
	var flexItem = $("<div/>", {
		class: "d-flex w-100 align-items-center"
	})

	var idColumn = $("<div/>", {
		class: "col-1 my-auto text-center"
	});
	if (eventComponent !== null) {
		idColumn.append(newEventComponentIdSpan(eventComponent["event" + eventComponentType + "Id"]));
	}

	var titleColumn = $("<div/>", {
		class: "col-4 my-auto text-center"
	});
	if (eventComponent !== null) {
		titleColumn.append(newEventComponentTitleSpan(eventComponent["event" + eventComponentType + "Title"]));
	} else {
		titleColumn.append(newEventComponentTitleInput(""));
	}

	var contentColumn = $("<div/>", {
		class: "col-6 my-auto"
	});
	if (eventComponent !== null) {
		if (eventComponentType === "Location") {
			contentColumn.append(newEventLocationContentDiv(eventComponent["eventLocationLatitude"], eventComponent["eventLocationLongitude"]));
		} else {
			contentColumn.append(newEventComponentContentSpan(eventComponent["event" + eventComponentType + "Content"]));
		}
	} else {
		if (eventComponentType === "Location") {
			contentColumn.append(newEventLocationContentInputs("", ""));
		} else {
			contentColumn.append(newEventComponentContentTextarea(""));
		}
	}

	var actionsColumn = $("<div/>", {
		class: "col-1 my-auto text-center"
	});
	if (eventComponent !== null) {
		actionsColumn.append($("<span/>").append(newEventComponentEditButton()));
		actionsColumn.append($("<span/>").append(newEventComponentDeleteButton()));
	} else {
		actionsColumn.append($("<span/>").append(newEventComponentAddButton()));
	}

	return listItem
		.append(flexItem
			.append(idColumn)
			.append(titleColumn)
			.append(contentColumn)
			.append(actionsColumn)
		);
}


/* event component modal actions */

function addEventComponent(event) {
	var componentType = $("#manageEventComponentModal").data("component-type");
	var componentTitle = $(event.target).parent().parent().prev().prev().children().first().val();
	var params;

	if (componentType === "Location") {
		var latitude = $(event.target).parent().parent().prev().children().first().children().first().children().last().val();
		var longitude = $(event.target).parent().parent().prev().children().first().children().last().children().last().val();

		params = {
			action: "createEventLocation",
			eventLocationTitle: componentTitle,
			eventLocationLatitude: latitude,
			eventLocationLongitude: longitude,
		};
	} else {
		var componentContent = $(event.target).parent().parent().prev().children().first().val();

		params = {
			action: "createEventComponent",
			eventComponentType: componentType,
			eventComponentTitle: componentTitle,
			eventComponentContent: componentContent
		};
	}

	$.ajax({
		url: "./events_ajax.php",
		type: "POST",
		data: $.param(params),
		contentType: "application/x-www-form-urlencoded",
		success: function (response) {
			if (response !== null && response.length > 0) {
				alert(response);
			} else {
				loadEventComponentList();
			}
		}
	});
}

function editEventComponent(event) {
	var componentType = $("#manageEventComponentModal").data("component-type");
	var componentTitleSpan = $(event.target).parent().parent().prev().prev().children().first();
	var componentContentSpan = $(event.target).parent().parent().prev().children().first();

	if (componentType === "Location") {
		var latitude = componentContentSpan.children().first().children().last().text();
		var longitude = componentContentSpan.children().last().children().last().text();

		componentContentSpan.replaceWith(newEventLocationContentInputs(latitude, longitude));
	} else {
		componentContentSpan.replaceWith(newEventComponentContentTextarea(componentContentSpan.text()));
	}
	componentTitleSpan.replaceWith(newEventComponentTitleInput(componentTitleSpan.text()));
	$(event.target).replaceWith(newEventComponentSaveButton());
}

function saveEventComponent(event) {
	var componentType = $("#manageEventComponentModal").data("component-type");
	var componentId = $(event.target).parent().parent().prev().prev().prev().children().first().text();
	var componentTitleInput = $(event.target).parent().parent().prev().prev().children().first();
	var componentContentTextarea = $(event.target).parent().parent().prev().children().first();
	var params;

	if (componentType === "Location") {
		var latitude = componentContentTextarea.children().first().children().last().val();
		var longitude = componentContentTextarea.children().last().children().last().val();

		params = {
			action: "updateEventLocation",
			eventLocationId: componentId,
			eventLocationTitle: componentTitleInput.val(),
			eventLocationLatitude: latitude,
			eventLocationLongitude: longitude
		}
	} else {
		params = {
			action: "updateEventComponent",
			eventComponentType: componentType,
			eventComponentId: componentId,
			eventComponentTitle: componentTitleInput.val(),
			eventComponentContent: componentContentTextarea.val()
		}
	}

	$.ajax({
		url: "./events_ajax.php",
		type: "POST",
		data: $.param(params),
		contentType: "application/x-www-form-urlencoded",
		success: function (response) {
			if (response !== null && response.length > 0) {
				alert(response);
			} else {
				if (componentType === "Location") {
					componentContentTextarea.replaceWith(newEventLocationContentDiv(latitude, longitude));
				} else {
					componentContentTextarea.replaceWith(newEventComponentContentSpan(componentContentTextarea.val()));
				}

				componentTitleInput.replaceWith(newEventComponentTitleSpan(componentTitleInput.val()));
				$(event.target).replaceWith(newEventComponentEditButton());
			}
		}
	});
}

function deleteEventComponent(event) {
	var componentType = $("#manageEventComponentModal").data("component-type");
	var componentId = $(event.relatedTarget).parent().parent().prev().prev().prev().children().first().text();
	var params;

	if (componentType === "Location") {
		params = {
			action: "deleteEventLocation",
			eventLocationId: componentId
		};
	} else {
		params = {
			action: "deleteEventComponent",
			eventComponentType: componentType,
			eventComponentId: componentId
		};
	}

	$.ajax({
		url: "./events_ajax.php",
		type: "POST",
		data: $.param(params),
		contentType: "application/x-www-form-urlencoded",
		success: function (response) {
			if (response !== null && response.length > 0) {
				alert(response);
			}
			loadEventComponentList();
		}
	});
}


/* event component modal data container */

function newEventComponentIdSpan(componentId) {
	return $("<span/>", {
		text: componentId
	});
}

function newEventComponentTitleSpan(componentTitle) {
	return $("<span/>", {
		text: componentTitle
	});
}

function newEventComponentTitleInput(componentTitle) {
	return $("<input/>", {
		type: "text",
		class: "form-control",
		maxlength: 100,
		placeholder: dict["event_component_title_placeholder"],
		value: componentTitle
	});
}

function newEventComponentContentSpan(componentContent) {
	return $("<span/>", {
		style: "white-space: pre-wrap",
		text: componentContent
	});
}

function newEventComponentContentTextarea(componentContent) {
	return $("<textarea/>", {
		class: "form-control disable-resizing",
		maxlength: 65535,
		rows: 10,
		placeholder: dict["event_component_content_placeholder"]
	}).val(componentContent);
}

function newEventLocationContentDiv(latitude, longitude) {
	return $("<div/>")
		.append($("<div/>")
			.append($("<span/>", {
				text: dict["event_eventLocationLatitude"] + dict["colon"] + " "
			}))
			.append($("<span/>", {
				text: latitude
			}))
		)
		.append($("<div/>")
			.append($("<span/>", {
				text: dict["event_eventLocationLongitude"] + dict["colon"] + " "
			}))
			.append($("<span/>", {
				text: longitude
			}))
		);
}

function newEventLocationContentInputs(latitude, longitude) {
	var latitudeInputGroup = $("<div/>", {
		class: "input-group"
	});
	var latitudeLabel = $("<button/>", {
		class: "input-group-addon btn",
		"data-toggle": "modal",
		"data-target": "#chooseEventLocationModal",
		text: dict["event_eventLocationLatitude"] + dict["colon"] + " "
	});
	var latitudeInput = $("<input/>", {
		type: "number",
		class: "form-control",
		step: 0.0000001,
		placeholder: dict["event_eventLocationLatitude_placeholder"],
		value: latitude
	});
	var longitudeInputGroup = $("<div/>", {
		class: "input-group"
	});
	var longitudeLabel = $("<button/>", {
		class: "input-group-addon btn",
		"data-toggle": "modal",
		"data-target": "#chooseEventLocationModal",
		text: dict["event_eventLocationLongitude"] + dict["colon"] + " "
	});
	var longitudeInput = $("<input/>", {
		type: "number",
		class: "form-control",
		step: 0.0000001,
		placeholder: dict["event_eventLocationLongitude_placeholder"],
		value: longitude
	});

	return $("<div/>")
		.append(latitudeInputGroup.append(latitudeLabel).append(latitudeInput))
		.append(longitudeInputGroup.append(longitudeLabel).append(longitudeInput));
}


/* event component action buttons */

function newEventComponentAddButton() {
	return $("<i/>", {
		class: "fas fa-plus-circle text-success fa-md fa-fw"
	}).on("click", addEventComponent);
}

function newEventComponentEditButton() {
	return $("<i/>", {
		class: "fas fa-pencil-alt text-dark fa-md fa-fw"
	}).on("click", editEventComponent);
}

function newEventComponentSaveButton() {
	return $("<i/>", {
		class: "fas fa-check-circle text-success fa-md fa-fw"
	}).on("click", saveEventComponent);
}

function newEventComponentDeleteButton() {
	return $("<i/>", {
		class: "fas fa-minus-circle text-danger fa-md fa-fw",
		"data-toggle": "modal",
		"data-target": "#deleteEventComponentModal"
	});
}


/* Google Maps */

function loadMap(modal) {
	mapboxgl.accessToken = $(modal).data("key");

	var map = new mapboxgl.Map({
		center: [10.232658, 49.8045],
		container: "jma-maps-container-modal",
		style: "mapbox://styles/mapbox/satellite-streets-v11",
		zoom: 16
	});
	map.on("load", function () {
		map.resize();
		const marker = $(modal).data("marker");
		if (marker) {
			map.flyTo({
				center: marker.getLngLat()
			});
		}
	});
	map.on("click", function(e) {
		const oldMarker = $(modal).data("marker");
		if (oldMarker) {
			oldMarker.remove();
		}

		const marker = new mapboxgl.Marker()
			.setLngLat(e.lngLat)
			.addTo(map);
		$(modal).data("marker", marker);
		map.flyTo({
			center: e.lngLat
		});
	});
	var relatedTarget = $($("#chooseEventLocationModal").data("relatedTarget"));

	var initialLatitude = relatedTarget.parent().parent().children().first().children().last().val();
	var initialLongitude = relatedTarget.parent().parent().children().last().children().last().val();
	if (initialLatitude && initialLongitude) {
		const marker = new mapboxgl.Marker()
			.setLngLat([initialLongitude, initialLatitude])
			.addTo(map);
		$(modal).data("marker", marker);
	}
}

function setEventLocation() {
	var relatedTarget = $($("#chooseEventLocationModal").data("relatedTarget"));
	var marker = $("#chooseEventLocationModal").data("marker");

	if (!marker) {
		return;
	}

	var lngLat = marker.getLngLat().toArray();

	relatedTarget.parent().parent().children().first().children().last().val(lngLat[1].toFixed(7));
	relatedTarget.parent().parent().children().last().children().last().val(lngLat[0].toFixed(7));
}