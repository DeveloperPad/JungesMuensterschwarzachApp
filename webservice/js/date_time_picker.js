$(document).ready(init);

function init() {
	$(".input-group-datetimepicker").on("click", function (event) {
		var oldDateString = $(event.currentTarget).next().val();
		var oldDate = oldDateString ? moment(oldDateString, "YYYY-MM-DD hh:mm:ss") : moment();
		var datetimepicker = $("<div/>").css({
			position: "absolute",
			top: $(event.currentTarget).offset().top,
			left: $(event.currentTarget).offset().left,
			"z-index": 1050,
		}).datetimepicker({
			baseCls: "perfect-datetimepicker",

			// 'YM'|'YMD'|'YMDHMS'|'HMS'
			viewMode: $.fn.datetimepicker.CONSTS.VIEWMODE.YMDHMS,

			startDate: null,
			date: oldDate.isValid() ? oldDate.toDate() : new Date(),
			endDate: null,
			
			language: 'de',

			// callback events
			onDateUpdate: null,
			onClear: null,
			onOk: function() {
				$(event.currentTarget).next().val(this.getText("yyyy-MM-dd HH:mm:ss"));
				$(event.currentTarget).next().trigger("change");
				onCloseDateTimePicker();
			},
			onClose: null,
			onToday: null
		});

		var datetimepickerLayer = $("<div/>").css({
			position: "fixed",
			top: "0px",
			left: "0px",
			width: "100%",
			height: "100%",
			"z-index": 1000,
			"background-color": "rgba(0,0,0,0.1)"
		}).on("click", function() {
			onCloseDateTimePicker();
		});

		var onCloseDateTimePicker = function() {
			datetimepickerLayer.remove();
			datetimepicker.remove();
		}

		$(document.body).append(datetimepickerLayer);
		$(document.body).append(datetimepicker);
	});
	$(".input-group-datepicker").on("click", function (event) {
		var oldDateString = $(event.currentTarget).next().val();
		var oldDate = oldDateString ? moment(oldDateString, "YYYY-MM-DD") : moment();
		var datepicker = $("<div/>").css({
			position: "absolute",
			top: $(event.currentTarget).offset().top,
			left: $(event.currentTarget).offset().left,
			"z-index": 1050,
		}).datetimepicker({
			baseCls: "perfect-datetimepicker",

			// 'YM'|'YMD'|'YMDHMS'|'HMS'
			viewMode: $.fn.datetimepicker.CONSTS.VIEWMODE.YMD,

			startDate: null,
			date: oldDate.isValid() ? oldDate.toDate() : new Date(),
			endDate: null,
			
			language: 'de',

			// callback events
			onDateUpdate: null,
			onClear: null,
			onOk: function() {
				$(event.currentTarget).next().val(this.getText("yyyy-MM-dd"));
				$(event.currentTarget).next().trigger("change");
				onCloseDatePicker();
			},
			onClose: null,
			onToday: null
		});

		var datepickerLayer = $("<div/>").css({
			position: "fixed",
			top: "0px",
			left: "0px",
			width: "100%",
			height: "100%",
			"z-index": 1000,
			"background-color": "rgba(0,0,0,0.1)"
		}).on("click", function() {
			onCloseDatePicker();
		});

		var onCloseDatePicker = function() {
			datepickerLayer.remove();
			datepicker.remove();
		}

		$(document.body).append(datepickerLayer);
		$(document.body).append(datepicker);
	});
}