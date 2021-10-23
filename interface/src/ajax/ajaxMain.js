import { Message } from 'element-react';

function ajax(params, showError = true, headers = {}) {
    let responseObj = null;
    const isGet = params.method && params.method.toLowerCase() === 'get'
    if (isGet) {
        let str = '';
        Object.entries(params.data || []).map((item, index) => {
            str += `${index === 0 ? '?' : '&'}${item[0]}=${item[1]}`
        })
        params.url += str;
    }
    return fetch(params.url, {
        method: params.method || 'POST',
        body: isGet ? null : JSON.stringify(params.data),
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-Access-Token': sessionStorage['X-Access-Token'] ? sessionStorage['X-Access-Token'] : '',
            ...headers
        },
        mode: "cors",
        //withCredentials:true
    }).then(response => {
        response.headers.forEach((key,val)=>{ 
            //更新 X-Access-Token
            if(key === 'X-Access-Token' && val && val.accessToken){
                sessionStorage['X-Access-Token'] = val.accessToken;
            }
        });
        return response.json()
    }).then(response => {
        //X-Access-Token
        if(response.data?.token?.accessToken){
            sessionStorage['X-Access-Token'] = response.data.token.accessToken;
        }
        console.log(JSON.stringify(response.header));
        responseObj = response;
        const returnCode = response.returnCode;
        const requestResult = response.data;
        
        if (returnCode % 1000 === 0) {
            return Promise.resolve(requestResult);
        } else {
            // return ajaxBizError(response, showError);
        }
    }).catch(error => {
        /* 超时  500 404等 服务端没有返回的情况*/
        if (error && error.response && error.response.status !== 200) {
            console.log('reqeust error = ' + JSON.stringify(error));
            Message.error(`服务异常，稍后再试。`);
        }
        return Promise.reject(error);
    })
}

export default ajax;