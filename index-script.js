// da kiem tra
function GetClassStudyUnit(id, name, registType) {
    $("#cnDanhSachLHP").html('Đang tải dử liệu ...');
    $.ajax({
        type: 'GET',
        url: AddressUrl + '/DangKyHocPhan/DanhSachLopHocPhan?id=' + id + '&registType=' + registType,
        async: true,
        dataType: 'html',
        success: function (html) {
            jQuery("#cnDanhSachLHP").html(html);
            ToggleDislayStudyUnit(true);
        },
    }).fail(function (jqXHR, textStatus, err) {
        $('#cnDanhSachLHP').text(err);
    });
}

// da kiem tra
GetClassStudyUnitRegisted(0);
// isReload<int>: 0 lay tren ram
// isReload<int>: 1 lay o db
function GetClassStudyUnitRegisted(isReload) {
    $("#cnDanhSachLHPDaDangKy").html('Đang tải dử liệu ...');

    $.ajax({
        type: 'GET',
        url: AddressUrl + '/DangKyHocPhan/KetQuaDangKy/' + isReload,
        async: true,
        dataType: 'html',
        success: function (html) {
            jQuery("#cnDanhSachLHPDaDangKy").html(html);
        },
    }).fail(function (jqXHR, textStatus, err) {
        $('#cnDanhSachLHPDaDangKy').text(err);
    });
}

// da kiem tra
function ToggleDislayStudyUnit(flag) {
    if (flag) {
        $('#cnDanhSachHP').css('display', 'none');
        $('#cnDanhSachLHP').css('display', 'block');
    } else {
        $('#cnDanhSachHP').css('display', 'block');
        $('#cnDanhSachLHP').css('display', 'none');
    }
}

// da kiem tra
function btnRegistType_Click(typeId) {

    $("#cnDanhSachHP").html('Đang tải dử liệu ...');

    $.ajax({
        type: 'GET',
        url: AddressUrl + '/DangKyHocPhan/DanhSachHocPhan?typeId=' + typeId,
        async: true,
        dataType: 'html',
        success: function (html) {
            jQuery("#cnDanhSachHP").html(html);
            ToggleDislayStudyUnit(false);
        },
    }).fail(function (jqXHR, textStatus, err) {
        $('#cnDanhSachHP').text(err);
    });
}

//
function GetDanhSachHP() {
    var typeId = $('input[name=registType]:checked').val();
    var studyProgramId = $('#ddlStudyPrograms').val();

    $("#cnDanhSachHP").html('Đang tải dử liệu ...');

    $.ajax({
        type: 'GET',
        url: AddressUrl + '/DangKyHocPhan/GetDanhSachHP?typeId=' + typeId + "&studyProgramId=" + studyProgramId,
        async: true,
        dataType: 'html',
        success: function (html) {
            jQuery("#cnDanhSachHP").html(html);
            ToggleDislayStudyUnit(false);
        },
    }).fail(function (jqXHR, textStatus, err) {
        $('#cnDanhSachHP').text(err);
    });
}

btnRegistType_Click('KH');

// da kiem tra
function doSubmit() {
    document.forms.Frm.hdID.value = "";
    for (var i = 0; i < document.forms.Frm.elements.length; i++) {
        if (document.forms.Frm.elements[i].type == "radio") {
            if (document.forms.Frm.elements[i].checked == true) {
                document.forms.Frm.hdID.value += document.forms.Frm.elements[i].id + "|";
            }
        }
    }
}

// da kiem tra
// acceptConflict<bool> cho phep dang ky trung lich
// classStudyUnitConflictId<string> LHP dang trung lich
// registType<string> hinh thuc dang ky
function btnRegist_Click(acceptConflict, classStudyUnitConflictId, registType) {
    $.ajax({
        type: 'GET',
        url: AddressUrl + '/DangKyHocPhan/DangKy?Hide=' + $('#chk_hidden').val() + '&acceptConflict=' + acceptConflict + '&classStudyUnitConflictId=' + classStudyUnitConflictId + '&RegistType=' + registType,
        async: true,
        dataType: 'json',
        success: function (data) {
            if (data.State) { // khi xu ly thanh cong
                if (data.Msg != "-1") {
                    //DialogAlert("Thông báo", data.Msg, 'info');
                    if (data.Obj == true) { // danh ky thanh cong
                        alert(data.Msg);
                        ToggleDislayStudyUnit(false); // tat moi layout
                        GetClassStudyUnitRegisted(0); // llay tren ram, nguyen nhan la da reload lai khi dang ky thanh cong tren code server
                    } else {
                        alert(data.Msg);
                    }
                }
            } else {
                XuLyTrungLich(data);
            }
        }
    })
}

// da kiem tra
function XuLyTrungLich(data) {
    if (data.Obj == 1) {
        $.messager.confirm(
            "Thông báo",
            data.Msg,
            function (r) {
                if (r) { // chon ok
                    if (data.Obj == 1) { // cho phep dk trung lich
                        btnRegist_Click(true, data.Obj1) // thuc hien lai lenh dang ky
                    } else {
                        btnRegist_Click(false, data.Obj1) // thuc hien lenh dang ky
                    }
                } else { // chon cancel
                    btnRegist_Click(false, data.Obj1)
                }
            }
        );
    } else {
        DialogAlert("Thông báo", data.Msg, "info");
    }
}

// da kiem tra
function btnBack() {
    ToggleDislayStudyUnit(false);
    $('#cnDanhSachLHP').html("");
}

function btnGetChildOfThis(id) {
    if ($('#tr-of-' + id).css('display') == 'none') {
        $('#tr-of-' + id).css('display', '');
    } else {
        $('#tr-of-' + id).css('display', 'none');
    }
}

// da kiem tra
function ConfirmDelete(MaHocPhan) {
    $.messager.confirm("Chú ý:", "Bạn có muốn xóa học phần này không ?", function (r) {
        if (r) {
            $.ajax({
                type: 'GET',
                url: AddressUrl + '/DangKyHocPhan/HuyDangKy?id=' + MaHocPhan + "&t=" + Math.random(),
                async: true,
                dataType: 'json',
                success: function (data) {
                    DialogAlert("Thông báo", data.Msg, "warning");
                    GetClassStudyUnitRegisted(0);
                },
            }).fail(function (jqXHR, textStatus, err) {
                DialogAlert("Thông báo" + err, "error");
            });
        }
    });
}

// da kiem tra
//$('.td-schedule').slimScroll({
//    height: '100px',
//    allowPageScroll: true
//});