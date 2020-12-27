console.log('START!')
window.classList = {
    'ENG02A': ['201ENG02A01', '201ENG02A02', '201ENG02Ax0'],
    'FIN02A': ['201FIN02A01', '201FIN02A02']
}
window.regClasses = []
clearInterval(autoIntv)
var autoIntv = setInterval(() => {
    zicAuto()

    // console.clear()
}, 700)

// zicAuto()

async function zicAuto() {
    try {
        let subjectsElem1 = $(await getSubjects('KH'))
        let subjectsElem2 = $(await getSubjects('HB'))

        let subjects = Object.keys(classList)

        subjects.forEach(async subject => {
            try {
                let subjectId = ''
                let regType = ''
                subjectId = subjectsElem1.find(`td:contains(${subject})`).eq(0).parent().find('a').length ? subjectsElem1.find(`td:contains(${subject})`).parent().find('a').eq(0).attr('href').split(`('`)[1].split(`'`)[0] : ''
                regType = 'KH'

                if (!subjectId) {
                    subjectId = subjectsElem2.find(`td:contains(${subject})`).eq(0).parent().find('a').length ? subjectsElem2.find(`td:contains(${subject})`).parent().find('a').eq(0).attr('href').split(`('`)[1].split(`'`)[0] : ''
                    regType = 'HB'
                }

                if (subjectId) {
                    let classesElem = $(await getClasses(subjectId, regType))
                    let classes = classList[subject]

                    // Important for class priority
                    for (let i = 0, l = classes.length; i < l; i++) {
                        let classCode = classes[i]
                        let classId = classesElem.find(`td:contains(${classCode})`).eq(0).parent().find('.classCheckChon').eq(0).attr('id')
                        if (classId) {
                            console.log(classCode, classId, subject)
                            // await zicReg(classCode, classId + '|', subject)
                        } else {
                            console.log(classCode, 'Class Not Found!')
                        }
                    }
                } else {
                    console.log(subject, 'Subject Not Found!')
                }
            } catch (err) {
                console.log(subject, err)
            }
        })
    } catch (err) {
        console.log(err)
    }
}

async function getSubjects(regType) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'GET',
            url: AddressUrl + '/DangKyHocPhan/DanhSachHocPhan?typeId=' + regType,
            async: true,
            success: function (data) {
                resolve(data)
            }
        })
    })
}

async function getClasses(subjectId, regType) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'GET',
            url: AddressUrl + `/DangKyHocPhan/DanhSachLopHocPhan?id=${subjectId}&registType=${regType}` + regType,
            async: true,
            success: function (data) {
                // console.log(regType, subjectId)
                resolve(data)
            }
        })
    })
}

async function zicReg(classCode, classId, subject) {
    return new Promise((resolve, reject) => {
        if (!classList[subject]) {
            console.log(classCode, 'Other class is already registered!')

            resolve(false)
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
                                GetClassStudyUnitRegisted(1); // 1 - lay tren ram, nguyen nhan la da reload lai khi dang ky thanh cong tren code server
                                resolve(true)
                            } else {
                                // console.log(classId, data.Msg);
                                resolve(false)
                            }
                        } else {
                            resolve(false)
                        }
                    } else {
                        // XuLyTrungLich(data);
                        resolve(false)
                    }

                    resolve(true)
                } catch (err) {
                    console.log(err.message)
                    resolve(false)
                }
            }
        })
    })
}

// async function zicReg2(classCode, classId, subject) {
//     $.ajax({
//         type: 'GET',
//         url: AddressUrl + '/DangKyHocPhan/DangKy?Hide=' + classId + '&acceptConflict=' + 'true' + '&classStudyUnitConflictId=' + '201FIN82A29' + '&RegistType=' + 'KH',
//         async: true,
//         dataType: 'json',
//         success: function (data) {
//             if (data.State) { // khi xu ly thanh cong
//                 if (data.Msg != "-1") {
//                     //DialogAlert("Thông báo", data.Msg, 'info');
//                     if (data.Obj == true) { // danh ky thanh cong
//                         console.log('Success', classId, data.Msg);
//                         classList[subject] = [classId + ' - Success!']
//                         // ToggleDislayStudyUnit(false); // tat moi layout
//                         GetClassStudyUnitRegisted(1); // llay tren ram, nguyen nhan la da reload lai khi dang ky thanh cong tren code server
//                     } else {
//                         // console.log(classId, data.Msg);
//                     }
//                 }
//             } else {
//                 // XuLyTrungLich(data);
//             }
//         }
//     })
// }