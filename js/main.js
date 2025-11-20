// update
const btnSub = document.querySelector('.btnSub');
let tmp;
let mood = 'create';

// التاريخ
// const date = new Date();
// const date_year = date.getFullYear()
// const date_month = date.getMonth();
// const date_day = date.getDate();

// const full_date = `${date_day} / ${date_month + 1} / ${date_year}`; 


// تكوين البرنامج 
const form = document.getElementById('myForm');
const amount_of_money = document.getElementById('amount-of-money');
const treatment = document.getElementById('treatment');
const date = document.getElementById('date');
const textarea = document.getElementById('textarea');
const inputVerification = document.querySelector('.input-verification');
const updata = "تعديل";
const deleteV = "مسح"

// انشاء
let manage_money = [];

if(localStorage.manage != null) {
    manage_money = JSON.parse(localStorage.manage)
}else {
    manage_money = [];
}
form.addEventListener('submit', (event) => {
    event.preventDefault();

    let newData = {
        id: Date.now(),
        money: amount_of_money.value,
        treatment: treatment.value,
        textarea: textarea.value,
        date: date.value,
    }

    // التحقق من المدخلات 
    if(textarea.value != "" && treatment.value != "نوع المعاملة" && date.value != '' && amount_of_money.value != '') {
        if(mood === "create") {
            manage_money.push(newData);
        }else {
            manage_money[tmp] = newData;
            btnSub.textContent = "اضافة";
            mood = "create";
        }
        clearData();
    }else {
        inputVerification.style.display = "block";
    }

    localStorage.setItem('manage', JSON.stringify(manage_money));
    showData();
});

// تنظيف
function clearData() {
    amount_of_money.value = '';
    textarea.value = '';
    date.value = '';
    treatment.value = 'نوع المعاملة'
}

// قراءة
function showData() {
    let table = '';
    for(let i = 0; i < manage_money.length; i++) {
        table += `<tr>
            <td>${manage_money[i].treatment}</td>
            <td>${manage_money[i].textarea}</td>
            <td>${manage_money[i].money}</td>
            <td>${manage_money[i].date}</td>
            <td><button id="btn" onclick = "updataData(${i})">${updata}</button></td>
            <td><button id="btn" onclick = "deleteOneValue(${manage_money[i].id})">${deleteV}</button></td>
        </tr>
        `
    }
    document.getElementById('tbody').innerHTML = table;

    const delete_all = document.getElementById('delete_all');
    const deleteText = 'حذف الجميع';
    
    if(manage_money.length > 0) {
        delete_all.style.display = "block";
        delete_all.textContent = `${deleteText} ( ${manage_money.length} )`;
    }else {
        delete_all.style.display = "none";
    }
}
showData();

// حذف
function deleteOneValue(id) {
    manage_money = manage_money.filter((item) => id != item.id);
    localStorage.manage = JSON.stringify(manage_money);
    showData();
}

// حذف الكل
const root = document.querySelector('.root');
const mydialog = document.getElementById('mydialog')


root.style.display = "none";
function deleteAll() {
    openDialog();
}
function openDialog() {
    root.style.display = "block";
    mydialog.show();
}
function closeDialog() {
    root.style.display = "none";
    mydialog.close();
}
function clearAllData() {
    manage_money.splice(0);
    localStorage.clear();
    showData();
    closeDialog();
}
window.onclick = (event) => {
    if (event.target === root) {
        closeDialog();
    }
    if(event.target === inputVerification) {
        inputVerification.style.display = "none";
    }
}

// تعديل
function updataData(id) {
    amount_of_money.value = manage_money[id].money;
    treatment.value = manage_money[id].treatment;
    date.value = manage_money[id].date;
    textarea.value = manage_money[id].textarea;

    btnSub.textContent = "تعديل";
    mood = 'update';
    tmp = id;
    scroll({
        top: 0,
        behavior: "smooth",
    })
}

// التحقق من المدخلات 
function close_error_message() {
    inputVerification.style.display = "none";
}

// حساب الفلوس 
const btn_total = document.querySelector('.btn-total');

let took = document.querySelector('.took');
let exchange = document.querySelector('.exchange');
let total_money = document.querySelector('.total-money');


let tooked = 'اخذ';
let exchanged = 'صرف'  

function btn_took() {
    let num_took = 0;
    
    for(let i = 0; i < manage_money.length; i++) {
        if(manage_money[i].treatment === tooked) {
            num_took += +manage_money[i].money;
        }
    }
    took.textContent = num_took;
}

function btn_exchange() {   
    let num1_exchange = 0;
    
    for(let i = 0; i < manage_money.length; i++) {
        if(manage_money[i].treatment === exchanged) {
            num1_exchange += +manage_money[i].money;
        }
    }
    exchange.textContent = num1_exchange;
}

btn_total.onclick = () => {
    let num_total = 0;
    
    for(let i = 0; i < manage_money.length; i++) {
        if(manage_money[i].treatment === tooked) {
            num_total += +manage_money[i].money;
        }else if(manage_money[i].treatment === exchanged) {
            num_total -= +manage_money[i].money;
        }
    }
    total_money.textContent = num_total;
}

// تحميل شيت اكسل
let exportExcelBtn = document.querySelector(".exportExcelBtn");
exportExcelBtn.onclick = function () {

    // بنجيب البيانات من localstorage
    let data = JSON.parse(localStorage.getItem("manage") || "[]");
    // تحويل البيانات الي ورقه اكسل
    let workSheet = XLSX.utils.json_to_sheet(data);
    // نعمل ملف اكسيل جديد
    let wrokBook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wrokBook,workSheet, "products");
    // نحفظ الملف
    XLSX.writeFile(wrokBook, "products_data.xlsx");
};