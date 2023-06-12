export function yieldPromiseDataModel(data: any, resolve: any, reject: any) {
    if (data && data.data) {
        console.log("hello")
        if (data.status !== 200) {
            reject({
                message: data.statusText,
                status: data.status
            });
        } else {
            resolve(data);
        }
    } else {
        console.log("err")
        reject({message: "Lỗi kết nối với máy chủ. Vui lòng truy cập lại sau", status: 400});
    }
}

export function removeAccents(str: string) {
    if (str) {
        return str.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd').replace(/Đ/g, 'D');
    }
    return str;
}

export function formatURL(str: string) {
    if (str) {
        str = removeAccents(str);
        let specialChars = ";'`~!@#$^&%*()+=[]\/\\{}|:<>?,._";
        for (let i = 0; i < specialChars.length; i++) {
            str = str.replace(new RegExp("\\" + specialChars[i], "gi"), "");
        }
        str = str.replace(/\s/g, '-');
    }
    return str;
}

export function isObjectEmpty(obj: object) {
    return Object.entries(obj).length === 0;
}
