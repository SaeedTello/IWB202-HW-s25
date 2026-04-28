$(function () {
  function formatNumber(num) {
    var str = num.toString();
    var result = "";
    var count = 0;
    for (var i = str.length - 1; i >= 0; i--) {
      result = str[i] + result;
      count++;
      if (count % 3 === 0 && i !== 0) {
        result = "," + result;
      }
    }
    return result;
  }

  $(".toggle-btn").click(function () {
    var id = $(this).attr("data-target");
    var row = $("#" + id);
    if (row.is(":visible")) {
      row.hide();
      $(this).text("إظهار التفاصيل");
    } else {
      row.show();
      $(this).text("إخفاء التفاصيل");
    }
  });

  $("#btnContinue").click(function () {
    var count = 0;
    $(".meal-check").each(function () {
      if ($(this).is(":checked")) {
        count = count + 1;
      }
    });
    if (count == 0) {
      alert("الرجاء اختيار وجبة واحدة على الأقل");
      return;
    }
    $("#orderFormSection").show();
    document.getElementById("orderForm").reset();
    $("html, body").scrollTop($("#orderFormSection").offset().top - 60);
  });

  function checkArabicName(name) {
    if (name.trim() == "") {
      return true;
    }
    var valid = true;
    for (var i = 0; i < name.length; i++) {
      var ch = name.charCodeAt(i);
      if (!(ch >= 0x0600 && ch <= 0x06ff) && ch != 32) {
        valid = false;
        break;
      }
    }
    return valid;
  }

  function checkNationalId(id) {
    if (id.trim() == "") {
      return false;
    }
    if (id.length != 11) {
      return false;
    }
    for (var i = 0; i < id.length; i++) {
      if (id[i] < "0" || id[i] > "9") {
        return false;
      }
    }
    var firstTwo = id.substring(0, 2);
    var governorates = [
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12",
      "13",
      "14",
    ];
    var found = false;
    for (var j = 0; j < governorates.length; j++) {
      if (firstTwo == governorates[j]) {
        found = true;
        break;
      }
    }
    return found;
  }

  function checkBirthDate(date) {
    if (date.trim() == "") {
      return true;
    }
    if (date.length != 10) {
      return false;
    }
    if (date[2] != "-" || date[5] != "-") {
      return false;
    }
    var dayStr = date.substring(0, 2);
    var monthStr = date.substring(3, 5);
    var yearStr = date.substring(6, 10);
    if (isNaN(dayStr) || isNaN(monthStr) || isNaN(yearStr)) {
      return false;
    }
    var day = parseInt(dayStr);
    var month = parseInt(monthStr);
    var year = parseInt(yearStr);
    if (year < 1900 || year > 2025) {
      return false;
    }
    if (month < 1 || month > 12) {
      return false;
    }
    if (day < 1 || day > 31) {
      return false;
    }
    if ((month == 4 || month == 6 || month == 9 || month == 11) && day > 30) {
      return false;
    }
    if (month == 2) {
      if (day > 29) {
        return false;
      }
    }
    return true;
  }

  function checkMobile(mobile) {
    if (mobile.trim() == "") {
      return true;
    }
    if (mobile.length != 10) {
      return false;
    }
    if (mobile[0] != "0" || mobile[1] != "9") {
      return false;
    }
    var thirdDigit = mobile[2];
    if (
      !(
        thirdDigit == "3" ||
        thirdDigit == "4" ||
        thirdDigit == "5" ||
        thirdDigit == "6" ||
        thirdDigit == "8" ||
        thirdDigit == "9"
      )
    ) {
      return false;
    }
    for (var i = 3; i < 10; i++) {
      if (mobile[i] < "0" || mobile[i] > "9") {
        return false;
      }
    }
    return true;
  }

  function checkEmail(email) {
    if (email.trim() == "") {
      return true;
    }
    var atPos = email.indexOf("@");
    var dotPos = email.lastIndexOf(".");
    if (atPos == -1 || dotPos == -1) {
      return false;
    }
    if (atPos > dotPos) {
      return false;
    }
    if (atPos < 1) {
      return false;
    }
    if (dotPos - atPos < 2) {
      return false;
    }
    if (dotPos >= email.length - 2) {
      return false;
    }
    return true;
  }

  $("#btnSubmit").click(function (e) {
    e.preventDefault();

    var name = $("#fullName").val();
    var id = $("#nationalId").val();
    var birth = $("#birthDate").val();
    var mobile = $("#mobileNumber").val();
    var email = $("#email").val();

    if (checkNationalId(id) == false) {
      alert("الرقم الوطني خطأ. لازم 11 رقم وأول خانتين بين 01 و 14");
      $("#nationalId").focus();
      $("#nationalId").select();
      return;
    }

    if (checkArabicName(name) == false) {
      alert("الاسم يجب أن يكون باللغة العربية فقط");
      $("#fullName").focus();
      $("#fullName").select();
      return;
    }

    if (checkBirthDate(birth) == false) {
      alert("تاريخ الولادة غير صحيح. استخدم الصيغة dd-mm-yyyy");
      $("#birthDate").focus();
      $("#birthDate").select();
      return;
    }

    if (checkMobile(mobile) == false) {
      alert(
        "رقم الموبايل غير صالح. يجب أن يكون 10 أرقام ويطابق Syriatel أو MTN",
      );
      $("#mobileNumber").focus();
      $("#mobileNumber").select();
      return;
    }

    if (checkEmail(email) == false) {
      alert("صيغة البريد الإلكتروني غير صحيحة");
      $("#email").focus();
      $("#email").select();
      return;
    }

    var selectedMeals = [];
    var total = 0;

    $(".meal-check").each(function () {
      if ($(this).is(":checked")) {
        var code = $(this).val();
        var mealName = $(this).attr("data-name");
        var price = parseInt($(this).attr("data-price"));
        var detailsRow = $(this).closest("tr").next(".details-row");
        var detailsHtml = "";
        if (detailsRow.length > 0) {
          detailsHtml = detailsRow.find(".inner-details").html();
        }
        var meal = {
          code: code,
          name: mealName,
          price: price,
          details: detailsHtml,
        };
        selectedMeals.push(meal);
        total = total + price;
      }
    });

    var discount = Math.round(total * 0.05);
    var finalTotal = total - discount;

    var html = "";
    html = html + "<h3>الوجبات المختارة:</h3>";

    for (var i = 0; i < selectedMeals.length; i++) {
      var meal = selectedMeals[i];
      html =
        html +
        "<div style='border:1px solid #ccc; margin-bottom:10px; padding:10px;'>";
      html =
        html +
        "<strong>" +
        meal.name +
        " (" +
        meal.code +
        ") - " +
        formatNumber(meal.price) +
        " ل.س</strong>";
      html = html + "<div>";
      if (meal.details != null && meal.details != "") {
        html =
          html + "<table class='inner-details'>" + meal.details + "</table>";
      }
      html = html + "</div></div>";
    }

    html = html + "<p>المجموع الكلي: " + formatNumber(total) + " ل.س</p>";
    html = html + "<p>حسم 5%: -" + formatNumber(discount) + " ل.س</p>";
    html =
      html +
      "<p style='color:#27AE60; font-size:1.2rem;'>المبلغ النهائي: " +
      formatNumber(finalTotal) +
      " ل.س</p>";

    html = html + "<hr>";
    html =
      html +
      "<p>اسم مقدم الطلب: " +
      ($("#fullName").val() || "غير محدد") +
      "</p>";
    html = html + "<p>الرقم الوطني: " + $("#nationalId").val() + "</p>";

    $("#modalBody").html(html);
    $("#resultModal").show();
  });

  $("#closeModal").click(function () {
    $("#resultModal").hide();
  });
  $("#btnCloseModal").click(function () {
    $("#resultModal").hide();
  });
  $("#resultModal").click(function (e) {
    if (e.target === this) {
      $(this).hide();
    }
  });
});
