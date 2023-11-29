// ==UserScript==
// @name         KIM ANH HVNH
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://regist.hvnh.edu.vn/*
// @grant        unsafeWindow
// ==/UserScript==

// !important Quy trình đăng ký học
/** Đầu tiền là chạy vòng lặp các môn học từ classList để lấy subjectId qua 2 lần check của regType KH và HB
    Khi có được subjectId thì chạy vòng lặp các lớp học của môn học đó để lấy classId
    Nếu tìm được classId thì đăng ký qua zicReg
*/

console.log('START!')
// mã môn học (subject) : danh sách các lớp của môn đó (classCode), cả 2 được định danh bằng subjectId và classID
window.classList = {
    'FIN90A': ['222FIN90A08'],
    'FIN91A': ['222FIN91A02', '222FIN91A08'],
    'FIN85A': ['222FIN85A01', '222FIN85A03'],
     // Thứ tự ưu tiên từ trước đến sau
}
window.regClasses = []

// Chạy tool
// clearInterval(autoIntv)
var autoIntv = setInterval(() => {
    zicAuto()

    console.clear()
}, 800)

// zicAuto()

async function zicAuto() {
    try {
        // Ban đầu lấy danh sách môn học và danh sách lớp học
        let subjectsElem1 = $(await getSubjects('KH')) // Học phần bắt buộc
        let subjectsElem2 = $(await getSubjects('HB')) // Học phần tự chọn

        let subjects = Object.keys(classList)

        subjects.forEach(async subject => {
            try {
                let subjectId = ''
                let regType = ''
                // <a href="javascript:GetClassStudyUnit('yB789N2t8+NOtTH6+dhX+A==','Tiếng Anh IV','HB')"><b>[Đăng ký]</b></a>
                subjectId = subjectsElem1.find(`td:contains(${subject})`).eq(0).parent().find('a').length ? subjectsElem1.find(`td:contains(${subject})`).parent().find('a').eq(0).attr('href').split(`('`)[1].split(`'`)[0] : ''
                regType = 'KH'

                // Nếu không tìm được học ID môn học trong học phần bắt buộc thì tìm tiếp trong học phần tự chọn
                if (!subjectId) {
                    subjectId = subjectsElem2.find(`td:contains(${subject})`).eq(0).parent().find('a').length ? subjectsElem2.find(`td:contains(${subject})`).parent().find('a').eq(0).attr('href').split(`('`)[1].split(`'`)[0] : ''
                    regType = 'HB'
                }

                // Nếu tìm thấy thì tìm tiếp các lớp học của môn đó
                if (subjectId) {
                    let classesElem = $(await getClasses(subjectId, regType))
                    let classes = classList[subject]

                    // Important for class priority
                    for (let i = 0, l = classes.length; i < l; i++) {
                        let classCode = classes[i]
                        let classId = classesElem.find(`td:contains(${classCode})`).eq(0).parent().find('.classCheckChon').eq(0).attr('id')
                        if (classId) {
                            console.log(classCode, classId, subject)
                            let result = await zicReg(classCode, classId + '|', subject)
                            if (result == true) {
                                alert('Done!')
                            }

                            console.log(subject, classCode, result)
                        } else {
                            console.log(classCode, 'Class Not Found!')
                        }
                    }
                } else {
                    console.log(subject, 'Subject Not Found!')
                    location.href = 'http://regist.hvnh.edu.vn/Login/index'
                }
            } catch (err) {
                console.log(subject, err)
            }
        })
    } catch (err) {
        console.log(err)
    }
}


/**
 * Lấy tất cả danh sách các môn học (trong đó có chứa ID môn học) theo regType
 * @param {String} regType KH hoặc HB
 */
async function getSubjects(regType) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'GET',
            url: AddressUrl + `/DangKyHocPhan/GetDanhSachHP?typeId=${regType}&studyProgramId=17AKTDN`,
            async: true,
            success: function (data) {
                resolve(data)
            }
        })
    })
}

/**
 * Lấy tất cả danh sách các lớp học (trong đó có chứa Class ID và Class Code) theo ID môn học và theo regType
 * @param {String} subjectId ID môn học
 * @param {String} regType KH hoặc HB
 */
async function getClasses(subjectId, regType) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'GET',
            url: AddressUrl + `/DangKyHocPhan/DanhSachLopHocPhan?id=${subjectId}&registType=${regType}`,
            async: true,
            success: function (data) {
                // console.log(regType, subjectId)
                resolve(data)
            }
        })
    })
}

/**
 * Đăng ký môn học, chỉ cần classId là có thể đăng ký
 * @param {String} classCode Mã lớp học
 * @param {String} classId ID lớp học
 * @param {String} subject Mã môn học
 */
async function zicReg(classCode, classId, subject) {
    return new Promise((resolve, reject) => {
        if (!classList[subject]) {
            // !important Do đã được đăng ký thành công ở 1 lớp khác
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
                                // !important Tránh đăng ký lặp lại các lớp khác của môn này do lớp này đã đăng ký thành công
                                delete classList[subject]
                                regClasses.push([subject, classCode, classId])
                                // ToggleDislayStudyUnit(false); // tat moi layout
                                resolve(true)
                                GetClassStudyUnitRegisted(1); // 1 - lay tren ram, nguyen nhan la da reload lai khi dang ky thanh cong tren code server
                            } else {
                                console.log('regMsg', classCode, classId, data.Msg);
                                resolve(false)
                            }
                        } else {
                            resolve(false)
                        }
                    } else {
                        // XuLyTrungLich(data);
                        resolve(false)
                    }

                    // resolve(true)
                } catch (err) {
                    console.log(err.message)
                    resolve(false)
                }
            }
        })
    })
}