import hbs from 'hbs';

export const registerHelpers = () => {

    hbs.registerHelper('desiPrice', (val) => {
        var val = Math.abs(val)
        if (val >= 10000000) {
            val = (val / 10000000).toFixed(2) + ' Cr';
        } else if (val >= 100000) {
            val = (val / 100000).toFixed(2) + ' Lac';
        }
        return val;
    });

    hbs.registerHelper('pickRandomColor', (val) => {
        let array = [ "lightblue", "pink" , "lavender" , "lightskyblue", "lightgoldenrodyellow" , "lightgreen", "beige" , "#f0dbeb" , "#c9eeeb" , "#f0d0a0" ];
        let randomNo = Math.floor(Math.random() * 4); 
        return array[randomNo];
    })

    hbs.registerHelper('inc', (val) => {
        return Number(val)+1;
    });

    // unformatted date and time
    hbs.registerHelper('mongoIdToDate', (objectId) => {
        return new Date(parseInt(objectId.toString().substring(0, 8), 16) * 1000);
    });

    // formatted 0718 hrs · 9 Apr 22
    hbs.registerHelper('getFormattedDateTimeMongoId', (objectId) => {
        if ( objectId == null ) return null;
        let date = new Date(parseInt(objectId.toString().substring(0, 8), 16) * 1000);
        let dtg = date.toString().split(" ");
        let obj = {
            time: dtg[4],
            date: dtg[2],
            month: dtg[1],
            yr: dtg[3]
        }
        let time = obj.time.split(":");
        obj.time = time[0]+time[1]+ " hrs";
        return `${obj.time} · ${obj.date} ${obj.month} ${obj.yr.slice(2,4)}`;
    });

    hbs.registerHelper('breaklines', (val) => {
    return val.split(/\n/g).join('<br>');
    })

    hbs.registerHelper('startWithUpperCase', (val) => {
        return val.charAt(0).toUpperCase() + val.slice(1)
    });

    hbs.registerHelper('toUpperCase', (str) => {
        return str.toUpperCase()
    });

    hbs.registerHelper('toLowerCase', (str) => {
        return str.toLowerCase()
    });

    hbs.registerHelper('checkExists', (val) => {
        return val != undefined ? 'true' : '';
    })

    hbs.registerHelper('json', function(context) {
        return JSON.stringify(context);
    });

    hbs.registerHelper('matchValues', (val1,val2) => {
        try {
            return val1.toString().toLowerCase()  == val2.toString().toLowerCase();
        } catch(e) {
            return false;
        }
    });

    hbs.registerHelper('removeSpaces', (val) => {
        return val.replace(/ /gi,'');
    });

    hbs.registerHelper('removeStartSpaces', (val) => {
        return val.replace(/ */g,'')
    });

    hbs.registerHelper('match', function(val1,val2) {
    return val1.toUpperCase() == val2.toUpperCase() ? true : false;
    })

    hbs.registerHelper('getDateForInput', function(val) {
        let date = new Date(val);
        let formatted = 
            date.getFullYear() + '-' + 
            ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '-' + 
            ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate()));
        return formatted;
    });

    hbs.registerHelper('getTimeForInput', function(val) {
        return val.match(/.{2}/g).join(":");
    });

    hbs.registerHelper('getDatePickerValue', function(val) {
        let date = new Date(val);
        let formatted = 
            date.getFullYear() + '-' + 
            ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '-' + 
            ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + 
            'T' +
            ((date.getHours() > 9) ? date.getHours() : ('0' + date.getHours())) + ":" + 
            ((date.getMinutes() > 9) ? date.getMinutes() : ('0' + date.getMinutes())) ;
        return formatted;
    });

    hbs.registerHelper('split0', (val) => {
        try {
        let output =  val.split(' ')[0] == undefined ? val : val.split(' ')[0] ;
        return output;
        } catch(e) {
            return val
        }
    });

    hbs.registerHelper('split1', (val) => {
        try {
            let output =  val.split(' ')[1] == undefined ? val : val.split(' ')[1] ;
            return output;
        } catch(e) {
            return val
        }
    });

    hbs.registerHelper('split2', (val) => {
        try {
            let output =  val.split(' ')[2] == undefined ? val : val.split(' ')[2] ;
            return output;
        } catch(e) {
            return val
        }
    });

    hbs.registerHelper('split', (val) => {
        let output = val.split(' ');
        return output;
    });

    hbs.registerHelper('splitComma', (val) => {
        let output = val.split(',').map(val => val.trim() );
        return output;
    });

    hbs.registerHelper('collectionToWord', (string) => {

        string = string.match(/-/g) ? string.split('-')[1] : string;
        return string.charAt(0).toUpperCase() + string.slice(1); 

    });

    hbs.registerHelper('camelToWord', (string) => {

        string = string.charAt(0).toUpperCase() + string.slice(1);
        return string.replace(/([a-z](?=[A-Z]))/g, '$1 ');

    });

    hbs.registerHelper('matchToCollection', function(val1,val2,val3) {
        return val1 == `${val2}-${val3}`;
    });

    hbs.registerHelper('checkHtmlString', function(val) {
        return /<\/?[a-z][\s\S]*>/i.test(val);
    });

    hbs.registerHelper('countArray', function(val) {
        let output = val == undefined ? 0 : val.length;
        return output;
    });

    hbs.registerHelper('multiply', function(one, two) {
        return Number(one) * Number(two);
    });

    hbs.registerHelper('trim', function(val) {
        return val.trim();
    });

    hbs.registerHelper('calcTotalPrice', function(cart) {
        let eachPrice = cart.map( val => Number(val.quantity) * Number(val.product.sale_price || val.product.price) );
        let totalPrice = eachPrice.reduce( (total, val, key) => total += val, 0 );
        return totalPrice;
    });

    hbs.registerHelper('getDay', function(date) {
        let input = new Date(date);

        return input.getDate();
    });
    hbs.registerHelper('getMonth', function(date) {
        let input = new Date(date);
        let months = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
        ];
        return months[input.getMonth()];
    });

    hbs.registerHelper('getYear', function(date) {
        let input = new Date(date);
        return input.getFullYear();
    });

    hbs.registerHelper('reduceStringLength', function(string, length) {
        return string.substring(0, length);
    });

};
