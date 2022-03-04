// ==UserScript==
// @name         Kim Anh
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://regist.hvnh.edu.vn*
// @grant        unsafeWindow
// ==/UserScript==

(function () {
    console.log('START!')
    // var classes = ['201ECO08A18',
    //                '201ECO06A08', '201ECO06A05 ',
    //                '201FIN82A29', '201FIN82A11',

    //                '201ACT11A07',
    //                '201LAW02A09', '201LAW02A04',
    //                '201PLT10A24', '201PLT10A31',

    //                '201SPT02A10', '201SPT02A12',
    //                '201SPT06A07',
    //               ]

    unsafeWindow.classList = {
        'FIN82A': ['201FIN82A29', '201FIN82A27', '201FIN82A02']
    }
    unsafeWindow.regClasses = []
    clearInterval(autoIntv)
    var autoIntv = setInterval(() => {
        zicAuto()

        // console.clear()
    }, 700)

    // zicAuto()

    function zicAuto() {
        let subjects = Object.keys(classList)
        let classTds = $('input.classCheckChon') // #reload_ketquadangki td.hidden-xs && input.classCheckChon
        console.log(classTds.length)

        for (let i = 0, l = classTds.length; i < l; i++) {
            let classTd = classTds.eq(i)
            subjects.forEach(async subject => {
                let classes = classList[subject]

                // Important for class priority
                for (let i = 0, l = classes.length; i < l; i++) {
                    let classCode = classes[i]
                    if (classTd.parent().parent().text().trim().toLowerCase().includes(classCode.trim().toLowerCase())) {
                        let classId = classTd.attr('id')
                        console.log(classCode, classId, subject)
                        await zicReg(classCode, classId + '|', subject)
                        // zicReg2(classId + '|', subject)
                    }
                }
            })
        }
    }

    async function zicReg(classCode, classId, subject) {
        return new Promise((resolve, reject) => {
            if (!classList[subject]) {
                resolve('Other class is already registered!')

                return
            }
            $.ajax({
                type: 'GET',
                url: AddressUrl + '/DangKyHocPhan/DangKy?Hide=' + classId + '&acceptConflict=' + 'false' + '&classStudyUnitConflictId=' + '' + '&RegistType=' + 'KH',
                async: true,
                dataType: 'json',
                success: function (data) {
                    try {
                        if (data.State) { // khi xu ly thanh cong
                            if (data.Msg != "-1") {
                                //DialogAlert("Thông báo", data.Msg, 'info');
                                if (data.Obj == true) { // danh ky thanh cong
                                    console.log('Success', classId, data.Msg);
                                    delete classList[subject]
                                    regClasses.push([subject, classCode, classId])
                                    // ToggleDislayStudyUnit(false); // tat moi layout
                                    GetClassStudyUnitRegisted(1); // llay tren ram, nguyen nhan la da reload lai khi dang ky thanh cong tren code server
                                } else {
                                    // console.log(classId, data.Msg);
                                }
                            }
                        } else {
                            // XuLyTrungLich(data);
                        }

                        resolve(true)
                    } catch (err) {
                        resolve(err.message)
                    }
                }
            })
        })
    }

    async function zicReg2(classCode, classId, subject) {
        $.ajax({
            type: 'GET',
            url: AddressUrl + '/DangKyHocPhan/DangKy?Hide=' + classId + '&acceptConflict=' + 'true' + '&classStudyUnitConflictId=' + '201FIN82A29' + '&RegistType=' + 'KH',
            async: true,
            dataType: 'json',
            success: function (data) {
                if (data.State) { // khi xu ly thanh cong
                    if (data.Msg != "-1") {
                        //DialogAlert("Thông báo", data.Msg, 'info');
                        if (data.Obj == true) { // danh ky thanh cong
                            console.log('Success', classId, data.Msg);
                            classList[subject] = [classId + ' - Success!']
                            // ToggleDislayStudyUnit(false); // tat moi layout
                            GetClassStudyUnitRegisted(1); // llay tren ram, nguyen nhan la da reload lai khi dang ky thanh cong tren code server
                        } else {
                            // console.log(classId, data.Msg);
                        }
                    }
                } else {
                    // XuLyTrungLich(data);
                }
            }
        })
    }

})();

// http://regist.hvnh.edu.vn/DangKyHocPhan/HuyDangKy/zz?t=0.2951030452398591

///
var zhtml = `


<fieldset>
    <legend><b style="color:blue;font-size:14px"></b></legend>
    <div id="DanhSachLop">
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th class="hidden-xs">STT</th>
                        <th class="hidden-xs">Mã học phần</th>
                        <th>Tên học phần</th>
                        <th>STC</th>
                        <th class="hidden-xs">Số lượng LHP</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                            <tr>
                                <td colspan="6">Chưa đến thời hạn đăng k&#253; m&#244;n học</td>
                            </tr>

                </tbody>
            </table>

    </div>
</fieldset>`

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
    $.messager.confirm("Chú ý:", "Bạn có muốn xóa học phần '" + MaHocPhan + "' không ?", function (r) {
        if (r) {
            $.ajax({
                type: 'GET',
                url: AddressUrl + '/DangKyHocPhan/HuyDangKy/' + MaHocPhan + "?t=" + Math.random(),
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


//**************************************************Cau hinh *************************************//
var AddressUrl = document.location.protocol + '//' + document.location.host; //Lay ten domain 
//*********************************************** End cau hinh **************************************//
//***************************************************Xoa hoc phan***********************//
function DeleteHocPhanDangKi(MaHocPhan, intLoai) {
    ProgressShow();
    var mypath = AddressUrl;
    try {
        var kt = confirm('Xác nhận xóa học phần vừa chọn ?')
        if (kt) {
            $.ajax({
                    type: 'GET',
                    url: mypath + '/Home/DeleteHocPhanDangKi/' + MaHocPhan + "?t=" + Math.random(),
                    async: true,
                    dataType: 'html',
                    success: function (html) {
                        DanhSachHocPhanDaDangKi(intLoai);
                        ProgressHide();
                        DialogAlert("Thông báo", html, "info");
                    },
                })
                .fail(
                    function (jqXHR, textStatus, err) {
                        ProgressHide();
                        DialogAlert("Lỗi kết nối", "Vui lòng đăng nhập lại !", "error");
                    });
        } else {
            ProgressHide();
        }
    } catch (err_) {
        ProgressHide();
    }
}

// function XoaHocPhan(MaHocPhan) {
//     ProgressShow();
//     var mypath = AddressUrl;
//     try {
//         $.ajax({
//                 type: 'GET',
//                 url: mypath + '/DangKiThanhCong/DeleteHocPhan/' + MaHocPhan + "?t=" + Math.random(),
//                 async: true,
//                 dataType: 'html',
//                 success: function (html) {
//                     DanhSachHocPhanDaDangKi();
//                     ProgressHide();
//                     DialogAlert("Thông báo", html, "info");
//                 },
//             })
//             .fail(
//                 function (jqXHR, textStatus, err) {
//                     ProgressHide();
//                     DialogAlert("Lỗi kết nối", "Kết nối không thành công :" + err, "error");
//                 });
//     } catch (err_) {
//         ProgressHide();
//     }

// }
//**********************************************     Danh sach hoc phan da dang ki ********************************//
// function DanhSachHocPhanDaDangKi() {
//     var mypath = AddressUrl;
//     $("#DanhSachHocPhanDaDangKi").html('Đang tải dử liệu ....');
//     var url_ = '/dangkithanhcong'; //KiemTraLoaiDangKi(loai);
//     try {
//         $.ajax({
//                 type: 'GET',
//                 url: mypath + url_ + "?t=" + Math.random(),
//                 async: true,
//                 dataType: 'html',
//                 success: function (html) {
//                     jQuery("#DanhSachHocPhanDaDangKi").html(html);
//                 },
//             })
//             .fail(
//                 function (jqXHR, textStatus, err) {
//                     $('#DanhSachHocPhanDaDangKi').text('Thời gian chờ quá lâu vui lòng đăng nhập lại ! ');
//                     DialogAlert("Thông báo", "Thời gian chờ quá lâu vui lòng đăng nhập lại ! ", "error");
//                 });
//     } catch (err_) {
//         $('#DanhSachHocPhanDaDangKi').text('Lỗi xảy ra : ' + err_);
//     }
// }

//************************************************** AjaxChonMonHocNhanVien.cshtml **********************************************************//
function GetdanhsachmonNhanVien(StudyUnitID) {
    ProgressShow();
    $('#DanhSachChon').show('1000');
    var mypath = AddressUrl;
    jQuery("#DanhSachChon").html("Đang tải dử liệu .....");
    $.ajax({
            type: 'GET',
            url: mypath + '/NhanVien/AjaxChonMonHocNhanVien?StudyUnitID=' + StudyUnitID + '&StudentID=' + '&t=' + Math.random(),
            async: true,
            dataType: 'html',
            success: function (html) {
                jQuery("#DanhSachChon").html(html);
                $("#DanhSachLop").hide("1000")
                ProgressHide();
            }
        })
        .fail(
            function (jqXHR, textStatus, err) {
                $('#DanhSachChon').text('Error: ' + err);
                ProgressHide();
                DialogAlert("Lỗi kết nối", "Thời gian chờ quá lâu .Vui lòng đăng nhập lại !", "error");
            });
}

function ShowHide_NV() {
    $('#DanhSachLop').show('1000');
    $('#DanhSachChon').hide('1000');
}

function GetdanhsachhocphanNhanVien() {
    ProgressShow();
    jQuery("#DanhSachLop").html("Đang tải dử liệu....");
    var Loai = $('input[name=radioDK]:checked').val();
    var StudyProgramID = $("#dllStudyProgrameID").val();
    var mypath = AddressUrl;
    $.ajax({
            type: 'GET',
            url: mypath + '/NhanVien/AjaxDanhSachHocPhan/' + StudyProgramID + '?LoaiDK=' + Loai + '&t=' + Math.random(),
            async: true,
            dataType: 'html',
            success: function (html) {
                jQuery("#DanhSachLop").html(html);
                ShowHide_NV();
                ProgressHide();
            }
        })
        .fail(
            function (jqXHR, textStatus, err) {
                $('#DanhSachLop').text('Error: ' + err);
                ProgressHide();
                DialogAlert("Lỗi kết nối", "Thời gian chờ quá lâu .Vui lòng đăng nhập lại !", "error");
            });
}
//************************************************** AjaxChonMonHocNhanVien.cshtml **********************************************************//

//************************************************** AjaxChonMonHoc.cshtml **********************************************************//
function AjaxDangKiHocPhan() {
    ProgressShow();
    var mypath = AddressUrl;
    var hideval = $('#chk_hidden').val();
    var StudyUnitID = $('#StudyUnitID').val();
    var CurriculumID = $('#CurriculumID').val();
    $.ajax({
            type: 'GET',
            url: mypath + '/DangKiHocPhan?StudyUnitID=' + StudyUnitID + '&CurriculumID=' + CurriculumID + '&Hide=' + hideval + '&t=' + Math.random(),
            async: true,
            dataType: 'html',
            success: function (html) {
                DanhSachHocPhanDaDangKi();
                ProgressHide();
                DialogAlert("Thông báo", html, "info");

            }
        })
        .fail(
            function (jqXHR, textStatus, err) {
                ProgressHide();
                DialogAlert("Lỗi kết nối", "Vui lòng đăng nhập lại !" + err, "error");

            });
}

// function doSubmit() {
//     document.forms.Frm.hdID.value = "";
//     for (var i = 0; i < document.forms.Frm.elements.length; i++) {
//         if (document.forms.Frm.elements[i].type == "radio") {
//             if (document.forms.Frm.elements[i].checked == true) {
//                 document.forms.Frm.hdID.value += document.forms.Frm.elements[i].id + "|";
//             }
//         }
//     }
// }

// function doSubmit_2() {
//     document.forms.frmform.hdID.value = "";
//     for (var i = 0; i < document.forms.frmform.elements.length; i++) {
//         if (document.forms.frmform.elements[i].type == "radio") {
//             if (document.forms.frmform.elements[i].checked == true) {
//                 document.forms.frmform.hdID.value += document.forms.frmform.elements[i].id + "|";
//             }
//         }
//     }
// }

// function doSubmit_check() {
//     document.forms.Frm.chk_hidden.value = "";
//     for (var i = 0; i < document.forms.Frm.elements.length; i++) {
//         if (document.forms.Frm.elements[i].type == "checkbox") {
//             if (document.forms.Frm.elements[i].checked == true) {
//                 document.forms.Frm.chk_hidden.value += document.forms.Frm.elements[i].id + "|";
//             }
//         }
//     }
// }

function Close() {
    window.close();
}
//Submit ajax
function ShowHide() {
    $('#DanhSachLop').show('200');
    $('#DanhSachChon').hide('200');
    $('#lblthongbao').hide();
}

//************************************************** END AjaxChonMonHoc.cshtml **********************************************************//
//************************************************** AjaxChonMonHocCaiThien.cshtml **********************************************************//
function AjaxDangKiHocPhanCaiThien_() {
    ProgressShow();
    var mypath = AddressUrl;
    var hideval = $('#hdID').val();
    var StudyUnitID = $('#StudyUnitID').val();
    $.ajax({
            type: 'GET',
            url: mypath + '/Home/AjaxDangKiHocPhanCaiThien?StudyUnitID=' + StudyUnitID + '&Hide=' + hideval + '&t=' + Math.random(),
            async: true,
            dataType: 'html',
            success: function (html) {
                DanhSachHocPhanDaDangKi(3);
                ProgressHide();
                DialogAlert("Thông báo", html, "info");
            },
        })
        .fail(
            function (jqXHR, textStatus, err) {
                ProgressHide();
                DialogAlert("Lỗi kết nối ", "Thời gian chờ quá lâu .Vui lòng đăng nhập lại !", "error");
            });
}

//************************************************** END AjaxChonMonHocCaiThien.cshtml **********************************************************//
//************************************************** AjaxChonMonHocHocLai.cshtml **********************************************************//
function AjaxDangKiHocPhanHocLai() {
    ProgressShow();
    var mypath = AddressUrl;
    var hideval = $('#hdID').val();
    var StudyUnitID = $('#StudyUnitID').val();
    $.ajax({
            type: 'GET',
            url: mypath + '/Home/AjaxDangKiHocPhanHocLai?StudyUnitID=' + StudyUnitID + '&Hide=' + hideval + '&t=' + Math.random(),
            async: true,
            dataType: 'html',
            success: function (html) {
                DanhSachHocPhanDaDangKi('');
                ProgressHide();
                DialogAlert("Thông báo", html, "info");
            },
        })
        .fail(
            function (jqXHR, textStatus, err) {
                DialogAlert("Lỗi kết nối ", "Thời gian chờ quá lâu .Vui lòng đăng nhập lại !", "error");
                document.getElementById('id_div_loading_admin').style.display = 'none';
            });
}
//************************************************** ENd AjaxChonMonHocHocLai.cshtml **********************************************************//

//************************************************** Begin DangKiHocCaiThien.cshtml **********************************************************//
function GetdanhsachmonCaiThien(StudyUnitID) {
    ProgressShow();
    $('#DanhSachChon').show('1000');
    var mypath = AddressUrl;
    jQuery("#DanhSachChon").html("Đang tải dử liệu .....");
    $.ajax({
            type: 'GET',
            url: mypath + '/Home/AjaxChonMonHocCaiThien?StudyUnitID=' + StudyUnitID + '&StudentID=' + '&t=' + Math.random(),
            async: true,
            dataType: 'html',
            success: function (html) {
                jQuery("#DanhSachChon").html(html);
                $("#DanhSachLop").hide("1000")
                ProgressHide();
            },
        })
        .fail(
            function (jqXHR, textStatus, err) {
                ProgressHide();
                DialogAlert("Lỗi kết nối", "Thời gian chờ quá lâu .Vui lòng đăng nhập lại !", "error");
            });
}
//************************************************** End DangKiHocCaiThien.cshtml **********************************************************//
//************************************************** Begin DangKiHocLai.cshtml **********************************************************//
function Getdanhsachmonhoclai(StudyUnitID) {
    ProgressShow();
    $('#DanhSachChon').show('1000');
    var mypath = AddressUrl;
    jQuery("#DanhSachChon").html("Đang tải dử liệu .....");
    $.ajax({
            type: 'GET',
            url: mypath + '/Home/AjaxChonMonHocHocLai?StudyUnitID=' + StudyUnitID + '&StudentID=' + '&t=' + Math.random(),
            async: true,
            dataType: 'html',
            success: function (html) {
                jQuery("#DanhSachChon").html(html);
                $("#DanhSachLop").hide("1000")
                ProgressHide();
            },
        })
        .fail(
            function (jqXHR, textStatus, err) {
                ProgressHide();
                DialogAlert("Lỗi kêt nối", "Thời gian chờ quá lâu .Vui lòng đăng nhập lại !", "error");
            });
}
//************************************************** End DangKiHocLai.cshtml **********************************************************//
//************************************************** End DangKiTheoKeHoach.cshtml**********************************************************//
function Getdanhsachmon(StudyUnitID) {
    ProgressShow();
    $('#DanhSachChon').show('1000');
    var mypath = AddressUrl;
    jQuery("#DanhSachChon").html("Đang tải dử liệu .....");
    $.ajax({
            type: 'GET',
            url: mypath + '/Home/AjaxChonMonHoc?StudyUnitID=' + StudyUnitID + '&StudentID=' + '&t=' + Math.random(),
            async: true,
            dataType: 'html',
            success: function (html) {
                jQuery("#DanhSachChon").html(html);
                $("#DanhSachLop").hide("1000")
                ProgressHide();
            }
        })
        .fail(
            function (jqXHR, textStatus, err) {
                $('#DanhSachChon').text("Thời gian chờ quá lâu .Vui lòng refesh lại website");
                ProgressHide();
                DialogAlert("Lỗi kết nối", "Thời gian chờ quá lâu .Vui lòng đăng nhập lại !", "error");
            });
}
//************************************************** End DangKiTheoKeHoach.cshtml **********************************************************//
//************************************************** AjaxDanhSachHocPhanDangKiLai.cshtml **********************************************************//
function AjaxChonHocPhanDangKiLai(StudyUnitID, ScheduleStudyUnit) {
    ProgressShow();
    $('#DanhSachChon').show('1000');
    var mypath = AddressUrl;
    $.ajax({
            type: 'GET',
            url: mypath + '/Home/AjaxDanhSachHocPhanDangKiLai?StudyUnitID=' + StudyUnitID + '&ScheduleStudyUnit=' + ScheduleStudyUnit + '&t=' + Math.random(),
            async: true,
            dataType: 'html',
            success: function (html) {
                jQuery("#DanhSachChon").html(html);
                $("#DanhSachLop").hide("1000")
                ProgressHide();
            },
        })
        .fail(
            function (jqXHR, textStatus, err) {
                ProgressHide();
                DialogAlert("Lỗi kết nối ", err, "error");
            });
}

function AjaxDangKiHocPhanTre() {
    ProgressShow();
    var mypath = AddressUrl;
    var hideval = $('#chk_hidden').val();
    var StudyUnitID = $('#StudyUnitID').val();
    var OldScheduleStudyUnit = $('#ScheduleStudyUnitOld').val();
    $.ajax({
            type: 'GET',
            url: mypath + '/DangKiTre/AjaxLuuHocPhanDangKiTre?StudyUnitID=' + StudyUnitID + '&Hide=' + hideval + '&OldScheduleStudyUnit=' + OldScheduleStudyUnit + '&t=' + Math.random(),
            async: true,
            dataType: 'html',
            success: function (html) {
                DanhSachHocPhanDaDangKi(1);
                ProgressHide();
                DialogAlert("Thông báo", html, "info");

            }
        })
        .fail(
            function (jqXHR, textStatus, err) {
                ProgressHide();
                DialogAlert("Lỗi kết nối", err, "error");

            });
}
//************************************************** END AjaxDanhSachHocPhanDangKiLai.cshtml **********************************************************//

//************************************************** Dialog Jquery ui ***********************************************//
function DialogAlert(Title, Messages, type) { //type : '',error,info,question,warning
    $.messager.alert(Title, Messages, type);
}
//confirm delete dialog :
// function ConfirmDelete(MaHocPhan) {
//     $.messager.confirm("Lưu ý ", "Bạn có muốn xóa học phần '" + MaHocPhan + "' không ?", function (r) {
//         if (r) {
//             XoaHocPhan(MaHocPhan);
//         } else {
//             //false
//         }
//     });
// }

function ConfirmAlert(thongbao) {
    $.messager.confirm("Lưu ý ", thongbao, function (r) {
        if (r) {
            return true;
        } else {
            return false
        }
    });
}
//Show progresss , show screen right-botton

function Slide(Title_, Messages, time) { //Hien thị goc phai bên duoi man minh trong time giay .
    $.messager.show({
        title: Title_,
        msg: Messages,
        timeout: time,
        showType: 'slide'
    });
}

function Fade(Title_, Messages) { //Hien thi như slide nhưng ko tự động close
    $.messager.show({
        title: Title_,
        msg: Messages,
        timeout: 0,
        showType: 'fade'
    });
}

function ProgressShow() {
    var win = $.messager.progress({
        title: 'Please waiting...',
        msg: 'Đang xử lý . vui lòng đợi ...',
        interval: 4000
    });
}

function ProgressHide() {
    $.messager.progress('close');
}
//************************************************** End Dialog Jquery ui ***********************************************//
//************************************************** Ajax load hoc ky ***********************************************//

// function GetThongTinCTDT() {
//     var mypath = AddressUrl;
//     ProgressShow();
//     $("#content_CTDT").html('');
//     var MaHK = $("#ddlHocKy").val();
//     var TenHK = $("#ddlHocKy :selected").text();
//     var url_ = '/ChuongTrinhDaoTao/AjaxIndex'; //KiemTraLoaiDangKi(loai);
//     try {
//         $.ajax({
//                 type: 'GET',
//                 url: mypath + url_ + '?MaHK=' + MaHK + '&TenHK=' + TenHK + '&t=' + Math.random(),
//                 async: true,
//                 dataType: 'html',
//                 success: function (html) {
//                     jQuery("#content_CTDT").html(html);
//                     ProgressHide();
//                 },
//             })
//             .fail(
//                 function (jqXHR, textStatus, err) {
//                     $('#content_CTDT').text("Thời gian chờ quá lâu vui lòng đăng nhập lại !");
//                     ProgressHide();
//                 });
//     } catch (err_) {
//         $('#content_CTDT').text('Lỗi xảy ra : ' + err_);
//         ProgressHide();
//     }
// }
//************************************************** END Ajax load hoc ky ***********************************************//
/*************************************************** PHẦN NÀY CHO UTE ****************************************************/
// function PopupDanhSachLop(StudyUnitID, CurriculumID) {
//     window.open(AddressUrl + '/' + 'DangKiNgoaiKeHoach/DanhSachLopHocPhan/' + StudyUnitID + "?CurriculumID=" + CurriculumID + "&t=" + Math.random(), '_blank', 'scrollbars=1,status=1,width=800,height=600,');
// }

// function PopupDanhSachLopTheoNhom(StudyUnitID, CurriculumID) {
//     window.open(AddressUrl + '/' + 'DangKiNgoaiKeHoachPhanNhom/DanhSachLopHocPhanTheoNhom/' + StudyUnitID + "?CurriculumID=" + CurriculumID + "&t=" + Math.random(), '_blank', 'scrollbars=1,status=1,width=800,height=600,');
// }

// function PopupDanhSachLopDKT(StudyUnitID, ScheduleStudyUnit) { //Đang ký trể
//     window.open(AddressUrl + '/' + 'DangKiTre/index/?StudyUnitID=' + StudyUnitID + "&ScheduleStudyUnit=" + ScheduleStudyUnit + "&t=" + Math.random(), '_blank', 'scrollbars=1,status=1,width=900,height=600,');
// }

// function PopupThongbaoKhan() {
//     window.open(AddressUrl + '/' + 'Home/Thongbao?t=' + Math.random(), '_blank', 'scrollbars=1,status=1,width=900,height=600,');
// }

// function PupupWindow() {}
/*************************************************** Lấy kết quả học tập *****************************************************/
// function Getketquahoctap() {
//     var StudyProgram = $('#StudyProgram').val();
//     var YearStudy = $('#YearStudy').val();
//     var TermID = $('#TermID').val();
//     var Mark = $('#Mark').val();
//     var mypath = AddressUrl;
//     jQuery("#divHienthiKQHT").html("<b style='color:red'>Đang tải dử liệu .....</b>");
//     $.ajax({
//             type: 'GET',
//             url: mypath + '/KetQuaHocTap/HienThiKetQua?StudyProgram=' + StudyProgram + '&YearStudy=' + YearStudy + '&TermID=' + TermID + '&Mark=' + Mark + '&t=' + Math.random(),
//             async: true,
//             dataType: 'html',
//             success: function (html) {
//                 jQuery("#divHienthiKQHT").html(html);
//             },
//         })
//         .fail(
//             function (jqXHR, textStatus, err) {
//                 ProgressHide();
//                 DialogAlert("Lỗi kết nối", "Vui lòng đăng nhập lại !", "error");
//             });
// }

// function GetChuongTrinhDTChuaTichLuy() {
//     var StudyProgram = $('#StudyProgram').val();
//     var YearStudy = $('#YearStudy').val();
//     var TermID = $('#TermID').val();
//     var Mark = $('#Mark').val();
//     var mypath = AddressUrl;
//     jQuery("#divHienChuongTrinhDaoTaoChuaTichLuy").html("<b style='color:red'>Đang tải dử liệu .....</b>");
//     $.ajax({
//             type: 'GET',
//             url: mypath + '/KetQuaHocTap/GetChuongTrinhDTChuaTichLuy?StudyProgram=' + StudyProgram + '&YearStudy=' + YearStudy + '&TermID=' + TermID + '&Mark=' + Mark + '&t=' + Math.random(),
//             async: true,
//             dataType: 'html',
//             success: function (html) {
//                 jQuery("#divHienChuongTrinhDaoTaoChuaTichLuy").html(html);
//             },
//         })
//         .fail(
//             function (jqXHR, textStatus, err) {
//                 ProgressHide();
//                 DialogAlert("Lỗi kết nối", "Vui lòng đăng nhập lại !", "error");
//             });
// }


//Xem CTDT
// function XemDiemTheoChuongTrinhDaoTao() {
//     var StudyProgram = $('#StudyProgram').val();
//     var mypath = AddressUrl;
//     jQuery("#divHienThiDiemTheoChuongTrinh").html("<b style='color:red'>Đang tải dử liệu .....</b>");
//     $.ajax({
//             type: 'GET',
//             url: mypath + '/KetQuaHocTap/XemDiemTheoChuongTrinhDaoTao?StudyProgram=' + StudyProgram + '&t=' + Math.random(),
//             async: true,
//             dataType: 'html',
//             success: function (html) {
//                 jQuery("#divHienThiDiemTheoChuongTrinh").html(html);

//             },
//         })
//         .fail(
//             function (jqXHR, textStatus, err) {
//                 ProgressHide();
//                 DialogAlert("Lỗi kết nối", "Vui lòng đăng nhập lại !", "error");
//             });
// }

// function KiemtrachontatcaNamHoc() {
//     var YearStudy = $('#YearStudy').val();
//     if (YearStudy == "0") {
//         document.getElementById("TermID").value = "0";
//         document.getElementById("TermID").disabled = true;
//     } else {
//         document.getElementById("TermID").disabled = false;
//     }
// }

// function PopupChiTietDiem(StudyUnitID) { //Đang ký trể
//     window.open(AddressUrl + '/' + 'KetQuaHocTap/DiemChiTiet/' + StudyUnitID + "?t=" + Math.random(), '_blank', 'scrollbars=1,status=1,width=700,height=500,');
// }
/*************************************************** End Lấy kết quả học tập *****************************************************/
/*************************************************** Lay Thoi Khoa Bieu *****************************************************/
// function GetThoiKhoaBieu() {
//     ProgressShow();
//     var mypath = AddressUrl;
//     var YearStudy = $('#YearStudy').val();
//     var TermID = $('#TermID').val();
//     var Week = $('#Week').val();
//     var typeID = $('#TypeID').val();
//     var adr = mypath + '/ThoiKhoaBieu/HienthiTKB?YearStudy=' + YearStudy + '&TermID=' + TermID + '&Week=' + Week + '&t=' + Math.random();
//     if (typeID == "1")
//         adr = mypath + '/ThoiKhoaBieu/HienthiTKBTheoMon?YearStudy=' + YearStudy + '&TermID=' + TermID + '&Week=' + Week + '&t=' + Math.random();
//     jQuery("#divThoiKhoiBieu").html("<b style='color:red'>Đang tải dử liệu .....</b>");
//     $.ajax({
//             type: 'GET',
//             url: adr,
//             async: true,
//             dataType: 'html',
//             success: function (html) {
//                 jQuery("#divThoiKhoiBieu").html(html);
//                 ProgressHide();
//             },
//         })
//         .fail(
//             function (jqXHR, textStatus, err) {
//                 ProgressHide();
//                 DialogAlert("Lỗi kết nối", "Vui lòng refesh lại website !", "error");
//             });
// }
/*************************************************** End Lay Thoi Khoa Bieu *****************************************************/
/*************************************************** Lay Lich thi *****************************************************/
// function GetLichThi() {
//     ProgressShow();
//     var mypath = AddressUrl;
//     var YearStudy = $('#ddlYearStudy').val();
//     var TermID = $('#dllTermID').val();
//     var adr = mypath + '/LichThi/HienThiKetQua?YearStudy=' + YearStudy + '&TermID=' + TermID + '&t=' + Math.random();
//     jQuery("#divHienthilichthi").html("<b style='color:red'>Đang tải dử liệu .....</b>");
//     $.ajax({
//             type: 'GET',
//             url: adr,
//             async: true,
//             dataType: 'html',
//             success: function (html) {
//                 jQuery("#divHienthilichthi").html(html);
//                 ProgressHide();
//             },
//         })
//         .fail(
//             function (jqXHR, textStatus, err) {
//                 ProgressHide();
//                 DialogAlert("Lỗi kết nối", "Vui lòng refesh lại website !", "error");
//             });
// }
/*************************************************** End Lay Lich Thi *****************************************************/
/*************************************************** Lay tai khoan sinh vien *****************************************************/
// function GetTaiKhoanSinhVien() {
//     ProgressShow();
//     var mypath = AddressUrl;
//     var YearStudy = $('#ddlYearStudy').val();
//     var TermID = $('#dllTermID').val();
//     var adr = mypath + '/TaiKhoanSinhVien/HienThiTaiKhoan?YearStudy=' + YearStudy + '&TermID=' + TermID + '&t=' + Math.random();
//     jQuery("#divHienThiTK").html("<b style='color:red'>Đang tải dử liệu .....</b>");
//     $.ajax({
//             type: 'GET',
//             url: adr,
//             async: true,
//             dataType: 'html',
//             success: function (html) {
//                 jQuery("#divHienThiTK").html(html);
//                 ProgressHide();
//             },
//         })
//         .fail(
//             function (jqXHR, textStatus, err) {
//                 ProgressHide();
//                 DialogAlert("Lỗi kết nối", "Vui lòng refesh lại website !", "error");
//             });
// }
/*************************************************** End tai khoan sinh vien *****************************************************/


/*************************************************** END PHẦN NÀY CHO UTE ****************************************************/
/**********************************/
// function AnhiendsChon(machon) {
//     if (machon == 0 || machon == 1) {
//         $('#ddldsChon').hide();
//         $('#txtFilter').show();
//     } else {
//         $('#ddldsChon').show();
//         $('#txtFilter').hide();
//         Getketselectoption(machon);
//     }
// }
/*********************************/
// function Getketselectoption(id) {
//     ProgressShow();
//     //var id = $('#dsLoai').val();
//     var mypath = AddressUrl;
//     $.ajax({
//             type: 'GET',
//             url: mypath + '/DangKiTheokeHoach/AjaxDschon?id=' + id + '&t=' + Math.random(),
//             async: true,
//             dataType: 'html',
//             success: function (html) {
//                 jQuery("#ddldsChon").html(html);
//                 ProgressHide();
//             },
//         })
//         .fail(
//             function (jqXHR, textStatus, err) {
//                 ProgressHide();
//                 DialogAlert("Lỗi kết nối", "Thời gian chờ quá lâu .Vui lòng đăng nhập lại !", "error");
//             });
// }

// function Checklichmacdinh() {
//     var Ischeck = $('#chkcheck').attr('checked') ? "True" : "False";
//     if (Ischeck == "True") {
//         $('#btnFilter').hide();
//     } else {
//         $('#btnFilter').show();
//     }
// }

function AjaxDanhSachLopTheoKeHoach() {
    ProgressShow();
    var Type = $('#dsLoai').val();
    var ddldsChon = $('#ddldsChon').val();
    var txtFilter = $('#txtFilter').val();
    var mypath = AddressUrl;
    jQuery("#divHienthiKQHT").html("<b style='color:red'>Đang tải dử liệu .....</b>");
    $.ajax({
            type: 'GET',
            url: mypath + '/DangKiTheoKeHoach/AjaxDanhSachLop?type=' + Type + '&class=' + ddldsChon + '&search=' + txtFilter + '&t=' + Math.random(),
            async: true,
            dataType: 'html',
            success: function (html) {
                jQuery("#divHienthiKQHT").html(html);
                ProgressHide();
            },
        })
        .fail(
            function (jqXHR, textStatus, err) {
                ProgressHide();
                DialogAlert("Lỗi kết nối", "Thời gian chờ quá lâu .Vui lòng đăng nhập lại !", "error");
            });
}

// function GetIDButton_Click(val) {
//     document.getElementById("buttonID").value = val;
// }

/************************************************** API **********************************************************/
// var apiUrl = AddressUrl + '/ThoiKhoaBieu/GetTuanTheoNamHocHocKy';

// function LoadWeek() {
//     var NamHoc = $('#YearStudy').val();
//     var HocKy = $('#TermID').val();
//     var i = 0;
//     // Send an AJAX request
//     $.getJSON(apiUrl + "/" + NamHoc + "$" + HocKy)
//         .done(function (data) {
//             $("#Week").empty();
//             // On success, 'data' contains a list of products.
//             $.each(data, function (key, item) {
//                 // Add a list item for the product.
//                 $("<option value=" + item.Week + ">" + item.DisPlayWeek + " </option>").appendTo($('#Week'));
//             });
//             GetThoiKhoaBieu();
//         });
// }

// function GetHistoryLog() {
//     ProgressShow();
//     var mypath = AddressUrl;
//     //var YearStudy = $('#YearStudy').val();
//     //var TermID = $('#TermID').val();
//     var adr = mypath + '/GetLog/GetHistory';

//     jQuery("#divHistoryLog").html("<b style='color:red'>Đang tải dử liệu .....</b>");
//     $.ajax({
//             type: 'GET',
//             url: adr,
//             async: true,
//             dataType: 'html',
//             success: function (html) {
//                 jQuery("#divHistoryLog").html(html);
//                 ProgressHide();
//             },
//         })
//         .fail(
//             function (jqXHR, textStatus, err) {
//                 ProgressHide();
//                 DialogAlert("Lỗi kết nối", "Vui lòng refesh lại website !", "error");
//             });
// }

/******TKB*****/


// function DrawingStudentSchedules() { //, weekId) {
//     var yearId = $('#YearStudy').val();
//     var termId = $('#TermID').val();
//     var sort = $('#cboSort').val();

//     var adr = '/ThoiKhoaBieu/NewDrawingStudentSchedule?YearId=' + yearId + '&TermId=' + termId + '&Sort=' + sort + '&t=' + Math.random(); //+ '&WeekId=' + weekId        
//     $.ajax({
//             type: 'GET',
//             url: adr,
//             async: true,
//             dataType: 'html',
//             success: function (html) {
//                 $("#divThoiKhoiBieu").html(html);
//             },
//         })
//         .fail(
//             function (jqXHR, textStatus, err) {
//                 //ShowAlert("Lỗi kết nối", err);
//                 alert('Lỗi kết nối');
//             });
// }

// function printContent(el) {
//     var restorepage = document.body.innerHTML;
//     var printcontent = document.getElementById(el).innerHTML;
//     document.body.innerHTML = printcontent;
//     window.print();
//     document.body.innerHTML = restorepage;
// }

// function GhiDanhTheoTienDo() {
//     $("#divTheoTienDo").html("Đang tải dữ liệu ...");
//     var ID = $('#ddlStudyProgram').val();

//     $.ajax({
//             type: 'GET',
//             url: AddressUrl + '/DangKyGhiDanh/GhiDanhTheoTienDo/' + ID,
//             async: true,
//             dataType: 'html',
//             success: function (html) {
//                 jQuery("#divTheoTienDo").html(html);
//             },
//         })
//         .fail(
//             function (jqXHR, textStatus, err) {
//                 $('#divTheoTienDo').text(err);
//             });
// }

// function StudentStudyProgram_GhiDanh() {
//     $("#divStudyProgram").html("Đang tải dữ liệu ...");
//     var ID = $('#ddlStudyProgram').val();

//     $.ajax({
//             type: 'GET',
//             url: AddressUrl + '/DangKyGhiDanh/StudentStudyProgram/' + ID,
//             async: true,
//             dataType: 'html',
//             success: function (html) {
//                 jQuery("#divStudyProgram").html(html);
//             },
//         })
//         .fail(
//             function (jqXHR, textStatus, err) {
//                 $('#divStudyProgram').text(err);
//             });
// }

// function StudentStudyProgram() {
//     $("#divStudyProgams").html("Loading ...");
//     var ID = $('#ddlStudyProgams').val();
//     $.ajax({
//             type: 'GET',
//             url: '/ChuongTrinhDaoTao/StudentStudyPgrograms/' + ID + "?t=" + Math.random(),
//             async: true,
//             dataType: 'html',
//             success: function (html) {
//                 $("#divStudyProgams").html(html);
//             },
//         })
//         .fail(
//             function (jqXHR, textStatus, err) {
//                 ShowAlert("Thông báo", err);
//             });
// }

// function GhiDanhNgoaiCTDT() {
//     $("#divNgoaiCTDT").html("Đang tải dữ liệu ...");

//     $.ajax({
//             type: 'GET',
//             url: AddressUrl + '/DangKyGhiDanh/GhiDanhNgoaiCTDT/',
//             async: true,
//             dataType: 'html',
//             success: function (html) {
//                 jQuery("#divNgoaiCTDT").html(html);
//             },
//         })
//         .fail(
//             function (jqXHR, textStatus, err) {
//                 $('#divNgoaiCTDT').text(err);
//             });
// }

// function KetQuaGhiDanh() {
//     $("#divKetQuaGhiDanh").html("Đang tải dữ liệu ...");

//     $.ajax({
//             type: 'GET',
//             url: AddressUrl + '/DangKyGhiDanh/KetQuaGhiDanh/',
//             async: true,
//             dataType: 'html',
//             success: function (html) {
//                 jQuery("#divKetQuaGhiDanh").html(html);
//             },
//         })
//         .fail(
//             function (jqXHR, textStatus, err) {
//                 $('#divKetQuaGhiDanh').text(err);
//             });
// }

// function XacNhanDangKyGhiDanh(CurriculumID, Type) {
//     $.messager.confirm(
//         "Thông báo",
//         "Xác nhận ghi danh học phần?",
//         function (r) {
//             if (r) { // chon ok
//                 DangKyGhiDanh(CurriculumID, Type);
//             } else { // chon cancel
//                 return false;
//             }
//         }
//     );
// }

// function DangKyGhiDanh(CurriculumID, Type) {
//     $.ajax({
//         type: 'GET',
//         url: AddressUrl + '/DangKyGhiDanh/DangKyGhiDanh?id=' + CurriculumID,
//         async: true,
//         dataType: 'json',
//         success: function (data) {
//             if (data.Obj == true) { // danh ky thanh cong
//                 alert(data.Msg);
//                 if (Type == "1") {
//                     StudentStudyProgram_GhiDanh();
//                 } else if (Type == "2") {
//                     TimKiemMonGhiDanh();
//                 } else {
//                     KetQuaGhiDanh();
//                 }
//             } else {
//                 alert(data.Msg);
//             }
//         },
//     })
// }

// function XacNhanXoaGhiDanh(CurriculumID, Type) {
//     $.messager.confirm(
//         "Thông báo",
//         "Xác nhận hủy ghi danh học phần?",
//         function (r) {
//             if (r) { // chon ok
//                 XoaGhiDanh(CurriculumID, Type);
//             } else { // chon cancel
//                 return false;
//             }
//         }
//     );
// }

// function XoaGhiDanh(CurriculumID, Type) {
//     $.ajax({
//         type: 'GET',
//         url: AddressUrl + '/DangKyGhiDanh/XoaGhiDanh?id=' + CurriculumID,
//         async: true,
//         dataType: 'json',
//         success: function (data) {
//             if (data.Obj == true) { // danh ky thanh cong
//                 alert(data.Msg);
//                 if (Type == "1") {
//                     StudentStudyProgram_GhiDanh();
//                 } else if (Type == "2") {
//                     TimKiemMonGhiDanh();
//                 } else {
//                     KetQuaGhiDanh();
//                 }
//             } else {
//                 alert(data.Msg);
//             }
//         },
//     })
// }