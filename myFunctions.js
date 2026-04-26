$(function () {

    // 1. إظهار / إخفاء التفاصيل
    $(".toggle-btn").click(function () {
        var id = $(this).attr("data-target");
        $("#" + id).toggle();
        if ($("#" + id).is(":visible")) {
            $(this).text("إخفاء التفاصيل");
        } else {
            $(this).text("إظهار التفاصيل");
        }
    });

    // 2. زر متابعة
    $("#btnContinue").click(function () {
        if ($(".meal-check:checked").length == 0) {
            alert("اختر وجبة واحدة على الأقل");
            return;
        }
        $("#orderFormSection").show();
        document.getElementById("orderForm").reset();
        $("html, body").scrollTop($("#orderFormSection").offset().top - 60);
    });

    // 3. دوال التحقق
    function isArabicName(n) { if (n.trim() === "") return true; return /^[\u0600-\u06FF\s]+$/.test(n); }
    function isNationalId(id) { if (id.trim() === "") return false; return /^(0[1-9]|1[0-4])\d{9}$/.test(id); }
    function isDate(d) { if (d.trim() === "") return true; var r = /^(0[1-9]|[12]\d|3[01])-(0[1-9]|1[0-2])-\d{4}$/; if (!r.test(d)) return false; var p = d.split("-"); var dt = new Date(p[2], p[1] - 1, p[0]); return dt.getFullYear() == p[2] && dt.getMonth() == p[1] - 1 && dt.getDate() == p[0]; }
    function isMobile(m) { if (m.trim() === "") return true; return /^09[345689]\d{7}$/.test(m); }
    function isEmail(e) { if (e.trim() === "") return true; return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }

    // 4. زر الإرسال
    $("#btnSubmit").click(function (e) {
        e.preventDefault();
        var n = $("#fullName").val(), id = $("#nationalId").val(), b = $("#birthDate").val();
        var m = $("#mobileNumber").val(), em = $("#email").val();

        if (!isNationalId(id)) { alert("الرقم الوطني خطأ"); $("#nationalId").focus().select(); return; }
        if (!isArabicName(n)) { alert("الاسم عربي فقط"); $("#fullName").focus().select(); return; }
        if (!isDate(b)) { alert("تاريخ الولادة خطأ"); $("#birthDate").focus().select(); return; }
        if (!isMobile(m)) { alert("رقم الموبايل خطأ"); $("#mobileNumber").focus().select(); return; }
        if (!isEmail(em)) { alert("الإيميل خطأ"); $("#email").focus().select(); return; }

        // عرض الملخص
        var meals = [], total = 0;
        $(".meal-check:checked").each(function () {
            var $cb = $(this);
            var code = $cb.val(), name = $cb.attr("data-name"), price = parseInt($cb.attr("data-price"));
            var detHtml = $cb.closest("tr").next(".details-row").find(".inner-details").html() || "";
            meals.push({ code, name, price, detHtml });
            total += price;
        });

        var discount = Math.round(total * 0.05);
        var final = total - discount;

        var html = "<h3>الوجبات:</h3>";
        meals.forEach(function (m) {
            html += "<div style='border:1px solid #ccc; margin-bottom:10px; padding:10px;'>";
            html += "<strong>" + m.name + " (" + m.code + ") - " + m.price.toLocaleString() + " ل.س</strong>";
            html += "<div>" + (m.detHtml ? "<table class='inner-details'>" + m.detHtml + "</table>" : "") + "</div>";
            html += "</div>";
        });
        html += "<p>المجموع: " + total.toLocaleString() + " ل.س | الحسم 5%: -" + discount.toLocaleString() + " ل.س</p>";
        html += "<p style='color:#27AE60; font-size:1.2rem;'>النهائي: " + final.toLocaleString() + " ل.س</p>";
        html += "<hr><p>الاسم: " + ($("#fullName").val() || "غير محدد") + " | الرقم الوطني: " + $("#nationalId").val() + "</p>";

        $("#modalBody").html(html);
        $("#resultModal").show();
    });

    // 5. إغلاق المودال
    $("#closeModal, #btnCloseModal").click(function () { $("#resultModal").hide(); });
    $("#resultModal").click(function (e) { if (e.target === this) $(this).hide(); });
});