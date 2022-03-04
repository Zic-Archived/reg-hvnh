// ==UserScript==
// @name         Kim Anh
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://regist.hvnh.edu.vn*
// @grant        none
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

    var classes = ['201ECO08A18',

                  ]
    clearInterval(autoIntv)
    var autoIntv = setInterval(() => {
        zicAuto()

        console.clear()
    }, 700)

    // zicAuto()

    function zicAuto() {
        classes = classes.map(val => {
            return val.trim().toLowerCase()
        })
        let classTds = $('input.classCheckChon') // #reload_ketquadangki td.hidden-xs && input.classCheckChon
        console.log(classTds.length)

        for (let i = 0, l = classTds.length; i < l; i++) {
            let classTd = classTds.eq(i)
            classes.forEach(className => {
                if (classTd.parent().parent().text().trim().toLowerCase().includes(className)) {
                    let classId = classTd.attr('id')
                    console.log(className, classId)
                    zicReg(classId)
                    zicReg(classId + '|')
                }
            })
        }
    }

    function zicReg(classId) {
        $.ajax({
            type: 'GET',
            url: AddressUrl + '/DangKyHocPhan/DangKy?Hide=' + classId + '&acceptConflict=' + 'false' + '&classStudyUnitConflictId=' + '' + '&RegistType=' + 'KH',
            async: true,
            dataType: 'json',
            success: function (data) {
                if (data.State) { // khi xu ly thanh cong
                    if (data.Msg != "-1") {
                        //DialogAlert("Thông báo", data.Msg, 'info');
                        if (data.Obj == true) { // danh ky thanh cong
                            console.log('Success', classId, data.Msg);
                            // ToggleDislayStudyUnit(false); // tat moi layout
                            GetClassStudyUnitRegisted(1); // llay tren ram, nguyen nhan la da reload lai khi dang ky thanh cong tren code server
                        } else {
                            console.log(classId, data.Msg);
                        }
                    }
                } else {
                    // XuLyTrungLich(data);
                }
            }
        })
    }

})();