export function getValueLocalStorage(key:string){
    try{
        if(localStorage.getItem(key)){
            return JSON.parse(String(localStorage.getItem(key)));
        }
        return null;
    }catch(err){
        // Xóa giá trị không hợp lệ ra khỏi localStorage
        console.error(err)
        localStorage.removeItem(key);
        return null
    }
}

export function setValueToLocalStorage(key:string,value:any){
    try{
        // const valueConvert = JSON.stringify(value);
        const valueConvert = (value);
        if(valueConvert){
            localStorage.setItem(key,valueConvert);
            return true
        }
        return false;
    }catch(err){
        console.error(err)
        return false;
    }
}

export function removeAllKeyAuthentication(){
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_data");
    localStorage.removeItem("token_type");
    return true
}