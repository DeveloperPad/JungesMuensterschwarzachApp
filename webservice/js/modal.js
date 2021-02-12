$(document).ready(init);

function init() {
	initDeleteNewsModal();
	initAnnounceNewsModal();
	initDeleteEventModal();
	initAnnounceEventModal();
	initDeleteImageModal();
	initActivateUserModal();
	initDeleteUserModal();
}

function initDeleteNewsModal() {
	$("#deleteNewsModal").on("show.bs.modal", function(event) {
		const confirmButton = $(this).find(".modal-footer button:first()");

		$(this).find(".modal-body p:first() strong").html($(event.relatedTarget).data("title"));
		confirmButton.off("click");
		confirmButton.click(function() {
			deleteNews($(event.relatedTarget).data("newsid"));
		});
	});
}

function initAnnounceNewsModal() {
	$("#announceNewsModal").on("show.bs.modal", function(event) {
		$(this).find(".modal-footer button:first()").click(function() {
			announceNews($(event.relatedTarget).data("newsid"));
		});
	});
}

function initDeleteEventModal() {
	$("#deleteEventModal").on("show.bs.modal", function(event) {
		const confirmButton = $(this).find(".modal-footer button:first()");

		$(this).find(".modal-body p:first() strong").html($(event.relatedTarget).data("title"));
		confirmButton.off("click");
		confirmButton.click(function() {
			deleteEvent($(event.relatedTarget).data("eventid"));
			return false;
		});
	});
}

function initAnnounceEventModal() {
	$("#announceEventModal").on("show.bs.modal", function(event) {
		$(this).find(".modal-footer button:first()").click(function() {
			announceEvent($(event.relatedTarget).data("eventid"));
		});
	});
}

function initDeleteImageModal() {
	$("#deleteImageModal").on("show.bs.modal", function(event) {
		$(this).find(".modal-footer button:first()").click(function() {
			deleteImage($(event.relatedTarget).data("imageid"));
		});
	});
}

function initActivateUserModal() {
	$("#activateUserModal").on("show.bs.modal", function(event) {
		const confirmButton = $(this).find(".modal-footer button:first()");

		$(this).find(".modal-body p:first() strong").html($(event.relatedTarget).data("displayname"));
		confirmButton.off("click");
		confirmButton.click(function() {
			activateUser(
				$(event.relatedTarget).data("userid"), 
				$(event.relatedTarget).data("isactivated")
			);
		});
	});
}

function initDeleteUserModal() {
	$("#deleteUserModal").on("show.bs.modal", function(event) {
		const confirmButton = $(this).find(".modal-footer button:first()");

		$(this).find(".modal-body p:first() strong").html($(event.relatedTarget).data("displayname"));
		confirmButton.off("click");
		confirmButton.click(function() {
			deleteUser($(event.relatedTarget).data("userid"));
		});
	});
}

function deleteNews(newsId) {
	$.ajax({
		url: "./news_ajax.php",
		type: "POST",
		data: jQuery.param({ 
			"action": "deleteNews",
			"newsId": newsId
		}),
		contentType: "application/x-www-form-urlencoded",
		success: function() {
			window.location.reload(true);
			window.scrollTo(0, 0);
		},
		error: function() {
			window.scrollTo(0, 0);
		}
	});
}

function announceNews(newsId) {
	$.ajax({
		url: "./news_ajax.php",
		type: "POST",
		data: jQuery.param({
			"action": "announceNews",
			"newsId": newsId
		}),
		contentType: "application/x-www-form-urlencoded",
		success: function() {
			window.location.reload(true);
			window.scrollTo(0, 0);
		},
		error: function() {
			window.scrollTo(0, 0);
		}
	});
}

function deleteEvent(eventId) {
	$.ajax({
		url: "./events_ajax.php",
		type: "POST",
		data: jQuery.param({
			"action": "deleteEvent",
			"eventId": eventId
		}),
		contentType: "application/x-www-form-urlencoded",
		success: function() {
			window.location.reload(true);
			window.scrollTo(0, 0);
		},
		error: function() {
			window.scrollTo(0, 0);
		}
	});
}

function announceEvent(eventId) {
	$.ajax({
		url: "./events_ajax.php",
		type: "POST",
		data: $.param({
			action: "announceEvent",
			eventId: eventId
		}),
		contentType: "application/x-www-form-urlencoded",
		success: function() {
			window.location.reload(true);
			window.scrollTo(0, 0);
		},
		error: function() {
			window.scrollTo(0, 0);
		}
	});
}

function deleteImage(imageId) {
	$.ajax({
		url: "./images_ajax.php",
		type: "POST",
		data: jQuery.param({
			"action": "deleteImage",
			"imageId": imageId
		}),
		contentType: "application/x-www-form-urlencoded",
		success: function() {
			window.location.reload(true);
			window.scrollTo(0, 0);
		},
		error: function() {
			window.scrollTo(0, 0);
		}
	});
}

function activateUser(userId, isActivated) {
	$.ajax({
		url: "./users_ajax.php",
		type: "POST",
		data: jQuery.param({ 
			"action": "updateIsActivated",
			"userId": userId,
			"isActivated": isActivated
		}),
		contentType: "application/x-www-form-urlencoded",
		success: function() {
			window.location.reload(true);
			window.scrollTo(0, 0);
		},
		error: function() {
			window.scrollTo(0, 0);
		}
	});
}

function deleteUser(userId) {
	$.ajax({
		url: "./users_ajax.php",
		type: "POST",
		data: jQuery.param({ 
			"action": "deleteUser",
			"userId": userId
		}),
		contentType: "application/x-www-form-urlencoded",
		success: function() {
			window.location.reload(true);
			window.scrollTo(0, 0);
		},
		error: function() {
			window.scrollTo(0, 0);
		}
	});
}