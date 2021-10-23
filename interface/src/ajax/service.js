import ajax from '../ajax/ajaxMain'

let ajaxService = ({ url, data, method = 'POST', showError = true, headers = {} }) => {
  return ajax(
    { url, data, method },
    showError,
    headers
  )
}

const getPairAddress = (data)=>{
  return ajaxService({url: 'http://139.196.149.112:7443/chain/getPairAddress', data})
}

export default {
  getPairAddress
}







