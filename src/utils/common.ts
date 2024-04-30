

/**
 * validate request trả về
 */
export function CheckResponseSuccess(res:any) {
    // if (res.status != 200) return false;
    if (res.success != true) return false;

    return true;
}

/**
 * lấy id từ url hiện tại
 */
export function GetIdFromCurrentPage() {
    // lấy id từ url
    let arrayPath = window.location.pathname.split("/");
    let _id = arrayPath ? arrayPath[arrayPath.length - 1] : null;
    if (_id?.endsWith('#')) {
        _id = _id.replace('#','')
    }
    return _id;
}

/**
 * lấy tham số route phía trước id từ url hiện tại
 */
export function GetPreIdFromCurrentPage() {
    // lấy id từ url
    let arrayPath = window.location.pathname.split("/");
    let _id = arrayPath ? arrayPath[arrayPath.length - 2] : null;
    if (_id?.endsWith('#')) {
        _id = _id.replace('#','')
    }
    return _id;
}


export function findNotifDate(date_notified = "2021-11-05 15:00:00", isTimeExam = false) {
    /**
    * @ findNotifDate : Finds the Date Difference of a Notification
    * @ date_notified : The notification date
    **/
    const date_sent_tmp = new Date(date_notified);

    let date_sent:any;
    //Check for timestamps
    if(date_notified.indexOf('-') != -1){
          date_sent = date_sent_tmp.getTime();
    }else{
          date_sent = date_notified;
    }

    const date_now = new Date();
    //current timestamp
    var today = date_now.getTime(); 

    //Subtract the timestamps
    var calc = new Date(today - date_sent);

    //Prevent Extra 1 Hour
    calc.setHours( calc.getUTCHours() +0);

    //Make our result readable
    var calcDate = calc.getDate()+'-'+(calc.getMonth()+1)+'-'+calc.getFullYear();
    var calcTime = calc.getHours()+':'+calc.getMinutes()+':'+calc.getSeconds();

    //Get How many days, months and years that has passed
    var date_passed = calcDate.split("-");
    var time_passed = calcTime.split(":");
    let days_passed;
    let months_passed;
    let years_passed;

     if(!(calcDate.includes('1-1-1970'))) {

         days_passed = ((parseInt(date_passed[0]) - 1) != 0 ) ? 
         parseInt(date_passed[0]) - 1 : null;
         months_passed = ((parseInt(date_passed[1]) - 1) != 0 )? 
         parseInt(date_passed[1]) - 1 : null;
         years_passed =  ((parseInt(date_passed[2]) - 1970) != 0) ?
         parseInt(date_passed[2]) - 1970 : null;
         return `${date_sent_tmp.getDate()}/${date_sent_tmp.getMonth() + 1}/${date_sent_tmp.getFullYear()}`

    }else{
         days_passed = null;
         months_passed = null;
         years_passed =  null;
        //  return `${date_sent_tmp.getDate()}/${date_sent_tmp.getMonth() + 1}/${date_sent_tmp.getFullYear()}`
    }

    var hours_passed = parseInt(time_passed[0]);
    var mins_passed = parseInt(time_passed[1]);
    var secs_passed = parseInt(time_passed[2]); 

    //Set up your Custom Text output here
    let s = ["giây trước", "giây trước"]; //seconds
    let m = ["phút", "giây trước", "phút", "giây trước"]; //minutes
    let h = ["giờ", "phút trước", "giờ", "phút trước"]; //hours
    let d = ["ngày", "giờ trước", "ngày", "giờ trước"]; //days
    let M = ["tháng", "ngày trước", "tháng", "ngày trước"]; //months
    let y = ["năm", "tháng trước", "năm", "tháng trước"]; //years

    if (isTimeExam) {
        s = ["giây", "giây"]; //seconds
        m = ["phút", "giây", "phút", "giây"]; //minutes
        h = ["giờ", "phút", "giờ", "phút"]; //hours
        d = ["ngày", "giờ", "ngày", "giờ"]; //days
        M = ["tháng", "ngày", "tháng", "ngày"]; //months
        y = ["năm", "tháng", "năm", "tháng"]; //years
    }

    var ret, retA, retB;

        if (!(days_passed) && !(months_passed) && !(years_passed)
        && !(hours_passed) && !(mins_passed)) {

            ret = (secs_passed == 1) ? secs_passed +' '+ s[0] : secs_passed +' '+ s[1];

        }else if (!(days_passed) && !(months_passed) && !(years_passed)
        && !(hours_passed)) {

            retA = (mins_passed == 1) ? mins_passed +' '+ m[0] : mins_passed +' '+ m[2];
            retB = (secs_passed == 1) ?  secs_passed +' '+m[1] : secs_passed +' '+m[3];

            ret = retA+' '+retB;


        }else if (!(days_passed) && !(months_passed) && !(years_passed)){

            retA = (hours_passed == 1) ? hours_passed +' '+ h[0] : hours_passed +' '+ h[2];
            retB = (mins_passed == 1) ?  mins_passed +' '+ h[1] : mins_passed +' '+ h[3];

            ret = retA+' '+retB;    

        }else if (!(years_passed) && !(months_passed)) {
            retA = (days_passed == 1) ? days_passed +' '+ d[0] :  days_passed +' '+ d[2];
            retB = (hours_passed == 1) ? hours_passed + ' '+d[1] : hours_passed + ' '+d[3];

            ret = retA+' '+retB;

        }else if (!(years_passed)) {

            retA = (months_passed == 1) ? months_passed +' '+ M[0] : months_passed +' '+ M[2];
            retB = (days_passed == 1) ? days_passed + ' '+M[1] : days_passed + ' '+M[3];

            ret = retA+' '+retB;
        }else{
            retA = (years_passed == 1) ? years_passed +' '+ y[0] : years_passed +' '+ y[2];
            retB = (months_passed == 1) ? months_passed + ' '+y[1] : months_passed + ' '+y[3];

            ret = retA+' '+retB;
        }

    //Check if return contains a negative value
    if(ret.includes('-')){
        ret += " ( TIME ERROR )-> Invalid Date Provided!";
    }

    return(ret);
}

export const countries2 = [
    {
        key: "am-ET", 
        label: "Amharic"
    },
    {
        key: "ar-SA", 
        label: "Arabic"
    },
    {
        key: "be-BY", 
        label: "Bielarus"
    },
    {
        key: "bem-ZM", 
        label: "Bemba"
    },
    {
        key: "bi-VU", 
        label: "Bislama"
    },
    {
        key: "bjs-BB", 
        label: "Bajan"
    },
    {
        key: "bn-IN", 
        label: "Bengali"
    },
    {
        key: "bo-CN", 
        label: "Tibetan"
    },
    {
        key: "br-FR", 
        label: "Breton"
    },
    {
        key: "bs-BA", 
        label: "Bosnian"
    },
    {
        key: "ca-ES", 
        label: "Catalan"
    },
    {
        key: "cop-EG", 
        label: "Coptic"
    },
    {
        key: "cs-CZ", 
        label: "Czech"
    },
    {
        key: "cy-GB", 
        label: "Welsh"
    },
    {
        key: "da-DK", 
        label: "Danish"
    },
    {
        key: "dz-BT", 
        label: "Dzongkha"
    },
    {
        key: "de-DE", 
        label: "German"
    },
    {
        key: "dv-MV", 
        label: "Maldivian"
    },
    {
        key: "el-GR", 
        label: "Greek"
    },
    {
        key: "en-GB", 
        label: "English"
    },
    {
        key: "es-ES", 
        label: "Spanish"
    },
    {
        key: "et-EE", 
        label: "Estonian"
    },
    {
        key: "eu-ES", 
        label: "Basque"
    },
    {
        key: "fa-IR", 
        label: "Persian"
    },
    {
        key: "fi-FI", 
        label: "Finnish"
    },
    {
        key: "fn-FNG", 
        label: "Fanagalo"
    },
    {
        key: "fo-FO", 
        label: "Faroese"
    },
    {
        key: "fr-FR", 
        label: "French"
    },
    {
        key: "gl-ES", 
        label: "Galician"
    },
    {
        key: "gu-IN", 
        label: "Gujarati"
    },
    {
        key: "ha-NE", 
        label: "Hausa"
    },
    {
        key: "he-IL", 
        label: "Hebrew"
    },
    {
        key: "hi-IN", 
        label: "Hindi"
    },
    {
        key: "hr-HR", 
        label: "Croatian"
    },
    {
        key: "hu-HU", 
        label: "Hungarian"
    },
    {
        key: "id-ID", 
        label: "Indonesian"
    },
    {
        key: "is-IS", 
        label: "Icelandic"
    },
    {
        key: "it-IT", 
        label: "Italian"
    },
    {
        key: "ja-JP", 
        label: "Japanese"
    },
    {
        key: "kk-KZ", 
        label: "Kazakh"
    },
    {
        key: "km-KM", 
        label: "Khmer"
    },
    {
        key: "kn-IN", 
        label: "Kannada"
    },
    {
        key: "ko-KR", 
        label: "Korean"
    },
    {
        key: "ku-TR", 
        label: "Kurdish"
    },
    {
        key: "ky-KG", 
        label: "Kyrgyz"
    },
    {
        key: "la-VA", 
        label: "Latin"
    },
    {
        key: "lo-LA", 
        label: "Lao"
    },
    {
        key: "lv-LV", 
        label: "Latvian"
    },
    {
        key: "men-SL", 
        label: "Mende"
    },
    {
        key: "mg-MG", 
        label: "Malagasy"
    },
    {
        key: "mi-NZ", 
        label: "Maori"
    },
    {
        key: "ms-MY", 
        label: "Malay"
    },
    {
        key: "mt-MT", 
        label: "Maltese"
    },
    {
        key: "my-MM", 
        label: "Burmese"
    },
    {
        key: "ne-NP", 
        label: "Nepali"
    },
    {
        key: "niu-NU", 
        label: "Niuean"
    },
    {
        key: "nl-NL", 
        label: "Dutch"
    },
    {
        key: "no-NO", 
        label: "Norwegian"
    },
    {
        key: "ny-MW", 
        label: "Nyanja"
    },
    {
        key: "ur-PK", 
        label: "Pakistani"
    },
    {
        key: "pau-PW", 
        label: "Palauan"
    },
    {
        key: "pa-IN", 
        label: "Panjabi"
    },
    {
        key: "ps-PK", 
        label: "Pashto"
    },
    {
        key: "pis-SB", 
        label: "Pijin"
    },
    {
        key: "pl-PL", 
        label: "Polish"
    },
    {
        key: "pt-PT", 
        label: "Portuguese"
    },
    {
        key: "rn-BI", 
        label: "Kirundi"
    },
    {
        key: "ro-RO", 
        label: "Romanian"
    },
    {
        key: "ru-RU", 
        label: "Russian"
    },
    {
        key: "sg-CF", 
        label: "Sango"
    },
    {
        key: "si-LK", 
        label: "Sinhala"
    },
    {
        key: "sk-SK", 
        label: "Slovak"
    },
    {
        key: "sm-WS", 
        label: "Samoan"
    },
    {
        key: "sn-ZW", 
        label: "Shona"
    },
    {
        key: "so-SO", 
        label: "Somali"
    },
    {
        key: "sq-AL", 
        label: "Albanian"
    },
    {
        key: "sr-RS", 
        label: "Serbian"
    },
    {
        key: "sv-SE", 
        label: "Swedish"
    },
    {
        key: "sw-SZ", 
        label: "Swahili"
    },
    {
        key: "ta-LK", 
        label: "Tamil"
    },
    {
        key: "te-IN", 
        label: "Telugu"
    },
    {
        key: "tet-TL", 
        label: "Tetum"
    },
    {
        key: "tg-TJ", 
        label: "Tajik"
    },
    {
        key: "th-TH", 
        label: "Thai"
    },
    {
        key: "ti-TI", 
        label: "Tigrinya"
    },
    {
        key: "tk-TM", 
        label: "Turkmen"
    },
    {
        key: "tl-PH", 
        label: "Tagalog"
    },
    {
        key: "tn-BW", 
        label: "Tswana"
    },
    {
        key: "to-TO", 
        label: "Tongan"
    },
    {
        key: "tr-TR", 
        label: "Turkish"
    },
    {
        key: "uk-UA", 
        label: "Ukrainian"
    },
    {
        key: "uz-UZ", 
        label: "Uzbek"
    },
    {
        key: "vi-VN", 
        label: "Vietnamese"
    },
    {
        key: "wo-SN", 
        label: "Wolof"
    },
    {
        key: "xh-ZA", 
        label: "Xhosa"
    },
    {
        key: "yi-YD", 
        label: "Yiddish"
    },
    {
        key: "zu-ZA", 
        label: "Zulu"
    }
]

export const countries = {
    "am-ET": "Amharic",
    "ar-SA": "Arabic",
    "be-BY": "Bielarus",
    "bem-ZM": "Bemba",
    "bi-VU": "Bislama",
    "bjs-BB": "Bajan",
    "bn-IN": "Bengali",
    "bo-CN": "Tibetan",
    "br-FR": "Breton",
    "bs-BA": "Bosnian",
    "ca-ES": "Catalan",
    "cop-EG": "Coptic",
    "cs-CZ": "Czech",
    "cy-GB": "Welsh",
    "da-DK": "Danish",
    "dz-BT": "Dzongkha",
    "de-DE": "German",
    "dv-MV": "Maldivian",
    "el-GR": "Greek",
    "en-GB": "English",
    "es-ES": "Spanish",
    "et-EE": "Estonian",
    "eu-ES": "Basque",
    "fa-IR": "Persian",
    "fi-FI": "Finnish",
    "fn-FNG": "Fanagalo",
    "fo-FO": "Faroese",
    "fr-FR": "French",
    "gl-ES": "Galician",
    "gu-IN": "Gujarati",
    "ha-NE": "Hausa",
    "he-IL": "Hebrew",
    "hi-IN": "Hindi",
    "hr-HR": "Croatian",
    "hu-HU": "Hungarian",
    "id-ID": "Indonesian",
    "is-IS": "Icelandic",
    "it-IT": "Italian",
    "ja-JP": "Japanese",
    "kk-KZ": "Kazakh",
    "km-KM": "Khmer",
    "kn-IN": "Kannada",
    "ko-KR": "Korean",
    "ku-TR": "Kurdish",
    "ky-KG": "Kyrgyz",
    "la-VA": "Latin",
    "lo-LA": "Lao",
    "lv-LV": "Latvian",
    "men-SL": "Mende",
    "mg-MG": "Malagasy",
    "mi-NZ": "Maori",
    "ms-MY": "Malay",
    "mt-MT": "Maltese",
    "my-MM": "Burmese",
    "ne-NP": "Nepali",
    "niu-NU": "Niuean",
    "nl-NL": "Dutch",
    "no-NO": "Norwegian",
    "ny-MW": "Nyanja",
    "ur-PK": "Pakistani",
    "pau-PW": "Palauan",
    "pa-IN": "Panjabi",
    "ps-PK": "Pashto",
    "pis-SB": "Pijin",
    "pl-PL": "Polish",
    "pt-PT": "Portuguese",
    "rn-BI": "Kirundi",
    "ro-RO": "Romanian",
    "ru-RU": "Russian",
    "sg-CF": "Sango",
    "si-LK": "Sinhala",
    "sk-SK": "Slovak",
    "sm-WS": "Samoan",
    "sn-ZW": "Shona",
    "so-SO": "Somali",
    "sq-AL": "Albanian",
    "sr-RS": "Serbian",
    "sv-SE": "Swedish",
    "sw-SZ": "Swahili",
    "ta-LK": "Tamil",
    "te-IN": "Telugu",
    "tet-TL": "Tetum",
    "tg-TJ": "Tajik",
    "th-TH": "Thai",
    "ti-TI": "Tigrinya",
    "tk-TM": "Turkmen",
    "tl-PH": "Tagalog",
    "tn-BW": "Tswana",
    "to-TO": "Tongan",
    "tr-TR": "Turkish",
    "uk-UA": "Ukrainian",
    "uz-UZ": "Uzbek",
    "vi-VN": "Vietnamese",
    "wo-SN": "Wolof",
    "xh-ZA": "Xhosa",
    "yi-YD": "Yiddish",
    "zu-ZA": "Zulu"
}