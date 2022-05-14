// function isValidDate(dateString) {
//     var regEx = /^(\d{4})(\/|-)(\d{1,2})(\/|-)(\d{1,2})$/;                     ///^\d{4}-\d{2}-\d{2}$/;
//     if(!dateString.match(regEx)) return false;  // Invalid format
//     var d = new Date(dateString);          // giving date
//     console.log("d:"+d)          
//     var dNum = d.getTime();                // converting to timestamp
//     console.log("dNum:"+dNum)
//     if(!dNum && dNum !== 0) return false; // NaN value, Invalid date
//     console.log("date:---",d.toISOString())   //.slice(0,10))
//     return d.toISOString().slice(0,10) === dateString;
//   }
//   let a = "2016-11-26"
//   console.log(new Date(a))

// const { validate } = require("./src/models/bookModel");


/* Example Uses */
//   console.log(isValidDate("0000-00-00"));  // false
//   console.log(isValidDate("2015-01-40"));  // false
//   console.log(isValidDate("2016-11-25"));  // true
//   console.log(isValidDate("1970-01-01"));  // true = epoch
//   console.log(isValidDate("2016-02-29"));  // true = leap day
//   console.log(isValidDate("2013-02-29"));  // false = not leap day


// const validate = function (a) {
//     var regEx = /^(\d{4})(\/|-)(\d{1,2})(\/|-)(\d{1,2})$/;                     ///^\d{4}-\d{2}-\d{2}$/;
//     if (!a.match(regEx)) return "invalid format";  
//     let date = new Date(a)
//     if (date != "Invalid Date") { return date.toISOString().slice(0, 10) }
//     else { return "Invalid Date" }
// }

// let a = "2016-11-32"
// console.log(validate(a))

// console.log(new Date("2020-02-30"))

// console.log(Math.abs("vhfhg"))

function isValidDate(s) {
    // Assumes s is "mm/dd/yyyy"
    if ( ! /^\d\d\d\d\-\d\d\-\d\d$/.test(s) ) {
        return false;
    }
    const parts = s.split('-').map((p) => parseInt(p, 10));
    parts[1] -= 1;
    const d = new Date(parts[0], parts[1], parts[2]);
    return d.getMonth() === parts[1] && d.getDate() === parts[2] && d.getFullYear() === parts[0];
}

function testValidDate(s) {
    console.log(s, isValidDate(s));
}



// const isValidDate = (date) => {    //2022-03-30
//     // if (! /^(\d{4})(\/|-)(\d{1,2})(\/|-)(\d{1,2})$/.test(s)) {
//     //             return false;
//     //         }
//     const  d = new Date(date.slice(0,4),(date.slice(5,7)-1),date.slice(8,10));
//     if (d.getFullYear() == date.slice(0,4) && d.getMonth() == (date.slice(5,7)-1) && d.getDate() == date.slice(8,10)) {
//         return true;
//     }
//     return false;
// }
testValidDate('2022-03-31'); // true
// testValidDate('02/30/2020'); // true
// testValidDate('02/29/2000'); // true
// testValidDate('02/29/1900'); // false
// testValidDate('02/29/2019'); // false
// testValidDate('01/32/1970'); // false
// testValidDate('13/01/1970'); // false
// testValidDate('14/29/2018'); // false
// testValidDate('1a/2b/3ccc'); // false
// testValidDate('1234567890'); // false
// testValidDate('aa/bb/cccc'); // false
// testValidDate(null);         // false
// testValidDate('');           // false

