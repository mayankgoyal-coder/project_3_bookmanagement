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

console.log(new Date("2020-02-30"))