export function abbreviateString(value, maxLength) {
    if (value.length <= maxLength) {
        return value
    } else {
        return value.substring(0, maxLength) + " .."
    }
}

export function boundWidth(widthVal){
    if (widthVal < 0){
        return 0;
    }else if (widthVal >1){
        return 1;
    }else {
        return widthVal;
    }
}

function intlFormat(num){
  return new Intl.NumberFormat().format(Math.round(num*10)/10);
}
export function makeFriendly(num){
  if(num < 1 && num > 0){
      return num
  }
  if( Math.abs( num) >= 1000000)
    return intlFormat(num/1000000)+'M';
  if(Math.abs(num) >= 1000)
    return intlFormat(num/1000)+'k';
  return intlFormat(num);
}

export function loadJSONData(url) {
     return fetch(url)
        .then(
            function (response) {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' + response.status);
                    return;
                } 
                // Examine the text in the response
            //    response.text().then(function(data){
            //        console.log(data)
            //    })
                return response.json().then(function (data) { 
                    return data
                });
            }
        )
        .catch(function (err) {
            console.log('Fetch Error :-S', err);
        });
}
